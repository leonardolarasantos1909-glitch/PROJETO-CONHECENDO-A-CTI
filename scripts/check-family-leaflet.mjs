import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const source = await readFile('src/data/family-leaflet.json');
const content = JSON.parse(source);
const manifest = JSON.parse(await readFile('public/materiais/acolher-familia/manifest.json', 'utf8'));
const sha = data => createHash('sha256').update(data).digest('hex');
if (manifest.version !== 1 || manifest.sourceSha256 !== sha(source) || manifest.contentVersion !== content.version
  || manifest.updatedAt !== content.updatedAt || manifest.lastClinicalReview !== content.lastClinicalReview
  || manifest.validationStatus !== content.validationStatus) throw new Error('Folheto divergente da fonte. Execute scripts/generate-family-leaflet.py.');
if (content.pages.length !== 4 || content.pages.some((page, index) => page.number !== index + 1)
  || JSON.stringify(content.print.sheets) !== '[[4,1],[2,3]]'
  || JSON.stringify(manifest.printOrder) !== '[[4,1],[2,3]]') throw new Error('Ordem do folheto inválida.');
if (manifest.materials.length !== 2 || manifest.fit.length !== 4 || manifest.fit.some(page => !page.bodyFits || page.bodyFontPt < 13 || page.lastBodyBaseline < page.footerTop + 14)) throw new Error('Diagramação do folheto inválida.');
for (const item of manifest.materials) {
  const definition = content.pdfs.find(pdf => pdf.id === item.id);
  if (!definition || definition.href !== item.href || definition.pages !== item.pages
    || !/^\/materiais\/acolher-familia\/folheto-familia-a[45]\.pdf$/.test(item.href)) throw new Error('Arquivo do folheto inválido.');
  const data = await readFile(`public${item.href}`);
  if (data.toString('ascii', 0, 5) !== '%PDF-' || data.length !== item.bytes
    || data.length >= 25 * 1024 * 1024 || sha(data) !== item.sha256) throw new Error(`Integridade inválida: ${item.href}`);
  const pageCount = [...data.toString('latin1').matchAll(/\/Type\s*\/Page\b/g)].length;
  if (pageCount !== item.pages) throw new Error(`Quantidade de páginas inválida: ${item.href}`);
  const expected = item.layout === 'booklet-a4' ? [841.8898, 595.2756] : [419.5276, 595.2756];
  if (item.mediaBox.some((size, index) => Math.abs(size - expected[index]) > .1)) throw new Error(`Formato físico inválido: ${item.href}`);
}
console.log('Folheto conferido: 4 páginas A5, impressão em 2 lados A4 (4|1 e 2|3), fonte e arquivos correspondentes. Validação institucional pendente.');
