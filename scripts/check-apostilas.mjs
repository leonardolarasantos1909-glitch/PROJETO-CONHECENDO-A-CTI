import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const report = JSON.parse(await readFile('public/materiais/apostilas/integridade.json', 'utf8'));
if (report.version !== 1 || !Array.isArray(report.materials) || report.materials.length < 1) throw new Error('Inventário das apostilas inválido.');
const ids = new Set();
for (const item of report.materials) {
  if (typeof item.id !== 'string' || ids.has(item.id)
    || !/^\/materiais\/apostilas\/[a-z0-9-]+\.pdf$/.test(item.href)
    || !/^[a-f0-9]{64}$/.test(item.sha256)
    || !Number.isInteger(item.pages) || item.pages < 1) throw new Error('Registro inválido no inventário das apostilas.');
  ids.add(item.id);
  const data = await readFile(`public${item.href}`);
  if (data.byteLength !== item.bytes || data.byteLength >= 25 * 1024 * 1024
    || data.toString('ascii', 0, 5) !== '%PDF-'
    || createHash('sha256').update(data).digest('hex') !== item.sha256) throw new Error(`Apostila divergente ou acima do limite de hospedagem: ${item.id}`);
}
console.log(`Apostilas conferidas: ${ids.size} PDFs com tamanho e integridade correspondentes ao inventário.`);
