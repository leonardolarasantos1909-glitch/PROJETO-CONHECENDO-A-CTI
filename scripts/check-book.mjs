import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const manifest = JSON.parse(await readFile('public/caderno/paginas.json', 'utf8'));
if (manifest.version !== 1 || manifest.source !== '/materiais/caderno-cti-adulto-digital.pdf') {
  throw new Error('Manifesto do caderno inválido. Execute scripts/preparar-caderno.py.');
}
const source = await readFile(`public${manifest.source}`);
const sha = createHash('sha256').update(source).digest('hex');
if (sha !== manifest.sourceSha256) throw new Error('O PDF foi alterado. Regenere o livro com scripts/preparar-caderno.py antes do build.');
if (!Number.isInteger(manifest.pageCount) || manifest.pageCount < 1 || manifest.pages.length !== manifest.pageCount) throw new Error('Quantidade de páginas inválida no livro.');
for (const [index, page] of manifest.pages.entries()) {
  if (page.number !== index + 1 || !/^\/caderno\/pagina-\d{3}\.webp$/.test(page.src) || page.width <= 0 || page.height <= 0 || typeof page.text !== 'string') throw new Error(`Página ${index + 1} inválida.`);
  const data = await readFile(`public${page.src}`);
  if (data.toString('ascii', 0, 4) !== 'RIFF' || data.toString('ascii', 8, 12) !== 'WEBP') throw new Error(`Imagem inválida: ${page.src}`);
  for (const link of page.links) {
    if (link.kind === 'page' && (!Number.isInteger(link.page) || link.page < 1 || link.page > manifest.pageCount)) throw new Error('Destino de página inválido.');
    if (link.kind === 'external' && !/^https?:\/\//.test(link.href)) throw new Error('URL de referência inválida.');
    if (!['page', 'external'].includes(link.kind) || !Object.values(link.bounds).every(v => Number.isFinite(v) && v >= 0 && v <= 1)) throw new Error('Link inválido no caderno.');
  }
}
console.log(`Livro conferido: ${manifest.pageCount} páginas e PDF de origem correspondente.`);
