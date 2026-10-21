import { readdir, writeFile, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const APOSTILAS_DIRECTORY = '/materiais/apostilas/';
const APOSTILAS_MANIFEST = `${APOSTILAS_DIRECTORY}integridade.json`;

async function listFiles(directory) {
  let entries;
  try {
    entries = await readdir(`dist${directory}`, { withFileTypes: true });
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
  const nested = await Promise.all(entries.map(entry => {
    const href = `${directory}${entry.name}`;
    return entry.isDirectory() ? listFiles(`${href}/`) : [href];
  }));
  return nested.flat().sort();
}

async function readApostilas() {
  const pdfs = (await listFiles(APOSTILAS_DIRECTORY)).filter(href => href.endsWith('.pdf'));
  let manifest;
  try {
    manifest = JSON.parse(await readFile(`dist${APOSTILAS_MANIFEST}`, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT' && pdfs.length === 0) return { hrefs: [], manifest: [] };
    throw new Error(`Não foi possível ler ${APOSTILAS_MANIFEST}.`, { cause: error });
  }
  if (!Array.isArray(manifest.materials)) throw new Error('A lista de apostilas do manifesto é inválida.');
  const hrefs = new Set();
  for (const material of manifest.materials) {
    if (typeof material.href !== 'string' || !/^\/materiais\/apostilas\/[a-z0-9][a-z0-9/-]*\.pdf$/.test(material.href)
      || material.href.includes('..') || hrefs.has(material.href) || !/^[a-f0-9]{64}$/i.test(material.sha256 ?? '')) {
      throw new Error('O manifesto contém uma apostila inválida ou repetida.');
    }
    const bytes = await readFile(`dist${material.href}`);
    if (createHash('sha256').update(bytes).digest('hex') !== material.sha256.toLowerCase()) {
      throw new Error(`O conteúdo de ${material.href} não corresponde ao manifesto de integridade.`);
    }
    hrefs.add(material.href);
  }
  if (pdfs.some(href => !hrefs.has(href)) || pdfs.length !== hrefs.size) {
    throw new Error('Todos os PDFs de apostilas devem constar no manifesto de integridade.');
  }
  return { hrefs: [...hrefs].sort(), manifest: [APOSTILAS_MANIFEST] };
}

// Exported so the offline/Range behavior can be checked without rebuilding the app.
export function renderServiceWorker({ version, files, apostilas }) {
  return `const CACHE = 'cti-${version}';
const PDF_CACHE = CACHE + '-apostilas';
const FILES = ${JSON.stringify(files)};
const APOSTILAS = new Set(${JSON.stringify(apostilas)});

self.addEventListener('install', event => {
  // Large apostilas are saved only when opened; the caderno remains precached.
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith('cti-') && key !== CACHE && key !== PDF_CACHE)
      .map(key => caches.delete(key))
  )).then(() => self.clients.claim()));
});

function completePdf(response) {
  return response && response.status === 200 && !response.headers.has('content-range')
    && response.headers.get('content-type')?.split(';')[0].trim().toLowerCase() === 'application/pdf';
}

function ifRangeMatches(response, ifRange) {
  if (!ifRange) return true;
  const value = ifRange.trim();
  if (value.startsWith('"') || value.startsWith('W/')) {
    return !value.startsWith('W/') && response.headers.get('etag') === value;
  }
  const limit = Date.parse(value);
  const modified = Date.parse(response.headers.get('last-modified') || '');
  return Number.isFinite(limit) && Number.isFinite(modified) && modified <= limit;
}

async function rangeResponse(response, range, ifRange) {
  // Unsupported/multiple ranges may legally receive the entire representation.
  const match = range?.trim().match(/^bytes=(\\d*)-(\\d*)$/i);
  if (!match || (!match[1] && !match[2]) || !ifRangeMatches(response, ifRange)) return response;
  const bytes = await response.arrayBuffer();
  const size = bytes.byteLength;
  let start;
  let end;
  if (!match[1]) {
    const suffix = Number(match[2]);
    start = Math.max(0, size - suffix);
    end = size - 1;
  } else {
    start = Number(match[1]);
    end = match[2] ? Math.min(Number(match[2]), size - 1) : size - 1;
  }
  const headers = new Headers(response.headers);
  headers.delete('content-encoding');
  headers.set('accept-ranges', 'bytes');
  if (size === 0 || start > end || start >= size) {
    headers.set('content-range', 'bytes */' + size);
    headers.set('content-length', '0');
    return new Response(null, { status: 416, statusText: 'Range Not Satisfiable', headers });
  }
  const body = bytes.slice(start, end + 1);
  headers.set('content-range', 'bytes ' + start + '-' + end + '/' + size);
  headers.set('content-length', String(body.byteLength));
  return new Response(body, { status: 206, statusText: 'Partial Content', headers });
}

async function apostilaResponse(request, pathname, background) {
  // Ignore URL query strings in the cache key: only the curated pathname is saved.
  const key = new URL(pathname, self.location.origin).href;
  const cache = await caches.open(PDF_CACHE).catch(() => null);
  const cached = await cache?.match(key, { ignoreVary: true }).catch(() => undefined);
  if (completePdf(cached)) {
    return rangeResponse(cached, request.headers.get('range'), request.headers.get('if-range'));
  }
  // A native PDF viewer may request just a small range. Fetch one complete PDF
  // so that later ranges and offline reads never depend on a partial cache entry.
  const headers = new Headers(request.headers);
  for (const header of ['range', 'if-range', 'if-none-match', 'if-modified-since']) headers.delete(header);
  const response = await fetch(new Request(request, { headers, cache: 'no-store' }));
  if (!completePdf(response)) return response;
  if (cache) {
    // Storage/quota errors must not prevent reading the online response.
    background.push(cache.put(key, response.clone()).catch(() => undefined));
  }
  return rangeResponse(response, request.headers.get('range'), request.headers.get('if-range'));
}

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;
  if (APOSTILAS.has(url.pathname)) {
    const background = [];
    const response = apostilaResponse(request, url.pathname, background).catch(() => new Response(
      'Esta apostila ainda não está disponível sem internet. Conecte-se e abra o PDF completo para tentar novamente.',
      { status: 503, headers: { 'content-type': 'text/plain; charset=utf-8' } }
    ));
    event.respondWith(response);
    event.waitUntil(response.then(() => Promise.all(background)).catch(() => undefined));
    return;
  }
  event.respondWith(caches.open(CACHE).then(async cache => {
    if (request.mode === 'navigate' && !url.pathname.toLowerCase().endsWith('.pdf')) {
      try { return await fetch(request); }
      catch { return await cache.match('/index.html', { ignoreVary: true }); }
    }
    return await cache.match(request, { ignoreVary: true }) || fetch(request);
  }));
});
`;
}

export async function buildServiceWorker() {
  const assets = await listFiles('/assets/');
  const pdfAssets = await listFiles('/pdfjs/');
  const materials = (await readdir('dist/materiais')).filter(name => name.endsWith('.pdf')).sort().map(name => `/materiais/${name}`);
  const book = (await readdir('dist/caderno')).filter(name => name.endsWith('.webp') || name === 'paginas.json').sort().map(name => `/caderno/${name}`);
  const apostilas = await readApostilas();
  const files = ['/', '/index.html', '/icon.svg', '/icon-192.png', '/icon-512.png', '/manifest.webmanifest', ...assets, ...pdfAssets, ...materials, ...book, ...apostilas.manifest];
  const hash = createHash('sha256');
  // Changes to a PDF also invalidate its on-demand cache, without precaching it.
  for (const file of [...files.filter(href => href !== '/'), ...apostilas.hrefs].sort()) {
    hash.update(file).update('\0').update(await readFile(`dist${file}`));
  }
  const version = hash.digest('hex').slice(0, 12);
  await writeFile('dist/sw.js', renderServiceWorker({ version, files, apostilas: apostilas.hrefs }));
  console.log(`Service worker generated: ${version}; ${apostilas.hrefs.length} apostilas available on demand.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  await buildServiceWorker();
}
