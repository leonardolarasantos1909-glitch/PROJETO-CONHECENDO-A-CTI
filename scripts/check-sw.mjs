import assert from 'node:assert/strict';
import vm from 'node:vm';
import { renderServiceWorker } from './build-sw.mjs';

const ORIGIN = 'https://cti.example';
const PDF_PATH = '/materiais/apostilas/material-teste.pdf';
const PDF_BYTES = new TextEncoder().encode('%PDF-1.7\nConteudo do material de teste.\n%%EOF');
const pdfResponse = () => new Response(PDF_BYTES, { headers: { 'content-type': 'application/pdf', etag: '"pdf-1"', 'last-modified': 'Thu, 01 Oct 2026 12:00:00 GMT' } });

function worker({ network = async () => pdfResponse(), failPut = false, failOpen = false } = {}) {
  const handlers = new Map();
  const stores = new Map();
  const calls = [];
  const cache = name => {
    if (!stores.has(name)) stores.set(name, new Map());
    const entries = stores.get(name);
    return {
      match: async key => entries.get(typeof key === 'string' ? key : key.url)?.clone(),
      put: async (key, response) => {
        if (failPut) throw new DOMException('Quota exceeded', 'QuotaExceededError');
        const value = await response.arrayBuffer();
        entries.set(key, new Response(value, { status: response.status, headers: response.headers }));
      },
      addAll: async files => calls.push({ precache: files }),
    };
  };
  const context = vm.createContext({
    Request, Response, Headers, URL, console,
    self: { location: { origin: ORIGIN }, clients: { claim: async () => {} }, addEventListener: (name, handler) => handlers.set(name, handler) },
    caches: {
      open: async name => { if (failOpen) throw new Error('Storage unavailable'); return cache(name); },
      keys: async () => [...stores.keys()],
      delete: async name => stores.delete(name),
    },
    fetch: async request => { calls.push({ request }); return network(request); },
  });
  vm.runInContext(renderServiceWorker({ version: 'test', files: ['/index.html'], apostilas: [PDF_PATH] }), context);
  return {
    calls, stores,
    async install() {
      const pending = [];
      handlers.get('install')({ waitUntil: promise => pending.push(promise) });
      await Promise.all(pending);
    },
    async get({ path = PDF_PATH, headers = {} } = {}) {
      const pending = [];
      let response;
      handlers.get('fetch')({
        request: new Request(ORIGIN + path, { headers }),
        respondWith: promise => { response = promise; },
        waitUntil: promise => pending.push(promise),
      });
      const result = await response;
      const bytes = new Uint8Array(await result.arrayBuffer());
      await Promise.all(pending);
      return { response: result, bytes };
    },
    range: async (range, ifRange) => {
      context.testResponse = pdfResponse();
      context.testRange = range;
      context.testIfRange = ifRange;
      const response = await vm.runInContext('rangeResponse(testResponse, testRange, testIfRange)', context);
      return { response, bytes: new Uint8Array(await response.arrayBuffer()) };
    },
  };
}

const sample = worker();
await sample.install();
assert.deepEqual(Array.from(sample.calls[0].precache), ['/index.html'], 'A instalação não deve baixar apostilas.');
const rangeCases = [
  ['bytes=0-4', 206, 0, 4],
  ['bytes=6-', 206, 6, PDF_BYTES.length - 1],
  ['bytes=-4', 206, PDF_BYTES.length - 4, PDF_BYTES.length - 1],
  ['bytes=-999999999999999999999999999999999999999999999999', 206, 0, PDF_BYTES.length - 1],
  ['bytes=0-999999999999999999999999999999999999999999999999', 206, 0, PDF_BYTES.length - 1],
  ['bytes=999-', 416],
  ['bytes=20-10', 416],
  ['bytes=-0', 416],
  ['bytes=0-1,3-4', 200],
  ['bad-range', 200],
  ['bytes=-', 200],
];
for (const [range, status, start, end] of rangeCases) {
  const result = await sample.range(range);
  assert.equal(result.response.status, status, range);
  if (status === 206) {
    assert.deepEqual(result.bytes, PDF_BYTES.slice(start, end + 1), range);
    assert.equal(result.response.headers.get('content-range'), `bytes ${start}-${end}/${PDF_BYTES.length}`);
    assert.equal(Number(result.response.headers.get('content-length')), result.bytes.length);
  } else if (status === 416) {
    assert.equal(result.bytes.length, 0);
    assert.equal(result.response.headers.get('content-range'), `bytes */${PDF_BYTES.length}`);
  } else assert.deepEqual(result.bytes, PDF_BYTES);
}
assert.equal((await sample.range('bytes=0-4', '"pdf-1"')).response.status, 206);
assert.equal((await sample.range('bytes=0-4', '"old-pdf"')).response.status, 200);
assert.equal((await sample.range('bytes=0-4', 'W/"pdf-1"')).response.status, 200);
assert.equal((await sample.range('bytes=0-4', 'Thu, 01 Oct 2026 12:00:00 GMT')).response.status, 206);
assert.equal((await sample.range('bytes=0-4', 'Wed, 30 Sep 2026 12:00:00 GMT')).response.status, 200);

let online = true;
const runtime = worker({ network: async request => {
  if (!online) throw new TypeError('Offline');
  assert.equal(request.headers.has('range'), false, 'A rede deve receber pedido do PDF completo.');
  assert.equal(request.headers.has('if-range'), false);
  assert.equal(request.headers.has('if-none-match'), false);
  return pdfResponse();
} });
const first = await runtime.get({ headers: { Range: 'bytes=0-4', 'If-Range': '"pdf-1"', 'If-None-Match': '"pdf-1"' } });
assert.equal(first.response.status, 206);
assert.deepEqual(first.bytes, PDF_BYTES.slice(0, 5));
const saved = runtime.stores.get('cti-test-apostilas').get(ORIGIN + PDF_PATH);
assert.equal(saved.status, 200, 'O cache deve guardar o PDF completo, nunca a resposta 206.');
assert.deepEqual(new Uint8Array(await saved.clone().arrayBuffer()), PDF_BYTES);
online = false;
const offline = await runtime.get({ path: PDF_PATH + '?download=1', headers: { Range: 'bytes=-6' } });
assert.equal(offline.response.status, 206);
assert.deepEqual(offline.bytes, PDF_BYTES.slice(-6));
assert.equal(runtime.calls.filter(call => call.request).length, 1, 'Leitura offline deve usar o cache, inclusive com query string.');
assert.deepEqual((await runtime.get()).bytes, PDF_BYTES);

for (const unavailable of [{ failPut: true }, { failOpen: true }]) {
  const result = await worker(unavailable).get();
  assert.equal(result.response.status, 200, 'Falha de armazenamento não deve impedir a leitura online.');
  assert.deepEqual(result.bytes, PDF_BYTES);
}
for (const response of [
  new Response('<html>Erro</html>', { headers: { 'content-type': 'text/html' } }),
  new Response('parcial', { status: 206, headers: { 'content-type': 'application/pdf', 'content-range': 'bytes 0-6/99' } }),
  new Response('Falha', { status: 500, headers: { 'content-type': 'application/pdf' } }),
]) {
  const invalid = worker({ network: async () => response });
  await invalid.get();
  assert.equal(invalid.stores.get('cti-test-apostilas').size, 0, 'Não guardar HTML, erro ou PDF parcial.');
}
const missing = await worker({ network: async () => { throw new TypeError('Offline'); } }).get();
assert.equal(missing.response.status, 503);
assert.match(new TextDecoder().decode(missing.bytes), /Conecte-se/);
const unlisted = worker();
await unlisted.get({ path: '/materiais/apostilas/fora-da-lista.pdf' });
assert.equal(unlisted.stores.has('cti-test-apostilas'), false, 'O cache sob demanda deve respeitar a allowlist.');
console.log('Service worker OK: Range/If-Range, cache completo sob demanda, leitura offline, allowlist e falhas de armazenamento.');
