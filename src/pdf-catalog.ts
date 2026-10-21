import { learningMaterials } from './materials';
import { apostilas } from './apostilas';

export type AppPdf = { id: string; title: string; href: string; pages: number; filename: string };

export const appPdfs: AppPdf[] = [
  ...learningMaterials.map(item => ({ id: item.id, title: item.title, href: item.href, pages: item.pages, filename: item.originalFilename })),
  ...apostilas.map(item => ({ id: item.id, title: item.title, href: item.href, pages: item.pages, filename: item.downloadFilename })),
];

export function findAppPdf(id: string | undefined): AppPdf | undefined {
  return appPdfs.find(item => item.id === id);
}

export function validPdfPage(value: unknown, total: number): number {
  const page = Number(value);
  return Number.isSafeInteger(page) && page >= 1 && page <= total ? page : 1;
}

/** Open the original file in another tab while preserving the application. */
export function pdfReaderLink(href: string): { href: string; target?: '_blank'; rel?: string } {
  const [path, fragment] = href.split('#');
  const document = appPdfs.find(item => item.href === path);
  if (!document) return { href, target: '_blank', rel: 'noopener noreferrer' };
  const page = validPdfPage(new URLSearchParams(fragment).get('page'), document.pages);
  return { href: `${document.href}#page=${page}`, target: '_blank', rel: 'noopener noreferrer' };
}
