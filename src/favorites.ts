import { modules } from './content';
import { scales } from './scales';
import { glossaryTerms } from './starter-data';

export type FavoriteEntry = { id: string; title: string; href: string; kind: string };

export const topicSlug = (title: string) => title.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export function topicHref(moduleId: string, title: string): string {
  const module = modules.find(item => item.id === moduleId);
  const index = module?.topics.findIndex(item => item.title === title) ?? -1;
  if (moduleId === 'escalas' && index >= 0 && index < scales.length) return `#escalas/${scales[index].id}`;
  return `#${moduleId}/${topicSlug(title)}`;
}

export function topicFavoriteId(moduleId: string, title: string): string {
  return `topic.${moduleId}.${topicSlug(title)}`;
}

export const favoriteCatalog: FavoriteEntry[] = [
  ...modules.map(module => ({ id: `module.${module.id}`, title: module.title, href: `#${module.id}`, kind: 'Módulo' })),
  ...modules.flatMap(module => module.topics.map(topic => ({ id: topicFavoriteId(module.id, topic.title), title: topic.title, href: topicHref(module.id, topic.title), kind: module.title }))),
  ...glossaryTerms.map(term => ({ id: `term.${term.id}`, title: term.term, href: `#glossario/${term.id}`, kind: 'Glossário' })),
  { id: 'tool.primeiro-dia', title: 'Checklist do primeiro dia', href: '#primeiro-dia', kind: 'Roteiro' },
  { id: 'tool.caderno', title: 'Caderno CTI Adulto', href: '#caderno', kind: 'Leitura' },
];

export function findFavorites(ids: readonly string[]): FavoriteEntry[] {
  return ids.flatMap(id => {
    const entry = favoriteCatalog.find(item => item.id === id);
    return entry ? [entry] : [];
  });
}
