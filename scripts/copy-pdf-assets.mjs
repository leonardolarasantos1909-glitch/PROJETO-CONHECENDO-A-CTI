import { cp, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const root = process.argv[2] === 'public' ? 'public' : 'dist';
const destination = join(root, 'pdfjs');
await mkdir(destination, { recursive: true });
for (const directory of ['cmaps', 'standard_fonts', 'wasm']) {
  await cp(join('node_modules/pdfjs-dist', directory), join(destination, directory), { recursive: true });
}
await cp('node_modules/pdfjs-dist/LICENSE', join(destination, 'LICENSE.txt'));
console.log('PDF.js: fontes, mapas, WASM e licença copiados para leitura local e offline.');
