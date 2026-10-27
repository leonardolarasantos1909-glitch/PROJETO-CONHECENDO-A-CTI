import leaflet from './data/family-leaflet.json';
import { familyReferences, familySections } from './family-welcome';

/** Files are generated from the same editorial source used by the HTML preview. */
export const familyLeafletPdfs = leaflet.pdfs.map(item => ({
  ...item,
  filename: item.href.split('/').at(-1)!,
  description: item.layout === 'booklet-a4'
    ? 'Folheto para familiares: duas faces A4 em paisagem, com quatro páginas A5 organizadas para dobra central.'
    : 'Folheto para familiares: quatro páginas A5 em ordem de leitura, com o mesmo conteúdo da versão para imprimir.',
}));

export const familySectionHref = (id: string) => `#acolher-familia/${id}`;
export const familyCaseHref = (id: string) => `#acolher-familia/simulador?caso=${id}`;

export function familyContentReferences(ids: readonly string[]) {
  const missing = [...new Set(ids)].filter(id => !familyReferences.some(reference => reference.id === id));
  if (missing.length) throw new Error(`Referência familiar não cadastrada: ${missing.join(', ')}`);
  return familyReferences.filter(reference => ids.includes(reference.id)).map(reference => ({ label: reference.title, href: reference.href }));
}

export function isFamilySection(id: string | undefined): boolean {
  return familySections.some(section => section.id === id);
}
