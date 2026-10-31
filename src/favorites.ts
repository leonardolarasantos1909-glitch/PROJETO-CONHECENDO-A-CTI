import { modules } from './content';
import { glossaryTerms } from './starter-data';
import { legacyGlossaryFavorites } from './hospital-glossary';
import { scaleIdForTopic, topicRouteId } from './topic-identifiers';
import { newTools } from './new-tools';
import { communicationCases, familySections } from './family-welcome';
import { familyCaseHref, familySectionHref } from './family-catalog';
import { clinicalConditions, clinicalFavoriteId, clinicalHref, clinicalModule } from './clinical-dictionary';
import { medications, medicationFavoriteId, medicationHref, medicationModule, medicationCases, medicationCaseHref } from './medication-guide';
export { topicSlug } from './topic-identifiers';

export type FavoriteEntry = { id: string; title: string; href: string; kind: string };

export function topicHref(moduleId: string, title: string): string {
  const scaleId = moduleId === 'escalas' ? scaleIdForTopic(title) : undefined;
  return `#${moduleId}/${scaleId ?? topicRouteId(moduleId, title)}`;
}

export function topicFavoriteId(moduleId: string, title: string): string {
  return `topic.${moduleId}.${topicRouteId(moduleId, title)}`;
}

export const favoriteCatalog: FavoriteEntry[] = [
  { ...medicationModule, kind: 'Módulo' },
  ...medications.map(item => ({ id: medicationFavoriteId(item.id), title: item.genericName, href: medicationHref(item.id), kind: 'Medicamento' })),
  ...medicationCases.map(item => ({ id: `medication-case.${item.id}`, title: item.title, href: medicationCaseHref(item.id), kind: 'Caso de medicamento' })),
  { ...clinicalModule, kind: 'Módulo' },
  ...clinicalConditions.map(item => ({ id: clinicalFavoriteId(item.id), title: item.name, href: clinicalHref(item.id), kind: 'Dicionário Clínico' })),
  ...modules.map(module => ({ id: `module.${module.id}`, title: module.title, href: `#${module.id}`, kind: 'Módulo' })),
  ...modules.flatMap(module => module.topics.map(topic => ({ id: topicFavoriteId(module.id, topic.title), title: topic.title, href: topicHref(module.id, topic.title), kind: module.title }))),
  ...glossaryTerms.map(term => ({ id: `term.${term.id}`, title: `${term.term} — ${term.definition}`, href: `#glossario/${term.id}`, kind: 'Siglário' })),
  { id: 'tool.glossario', title: 'Siglário', href: '#glossario', kind: 'Siglário' },
  { id: 'tool.primeiro-dia', title: 'Checklist do primeiro dia', href: '#primeiro-dia', kind: 'Roteiro' },
  { id: 'tool.caderno', title: 'Caderno CTI Adulto', href: '#caderno', kind: 'Leitura' },
  ...newTools.map(tool => ({ id: tool.id, title: tool.title, href: tool.href, kind: 'Ferramenta' })),
  ...familySections.map(section => ({ id: `family.section.${section.id}`, title: section.title, href: familySectionHref(section.id), kind: 'Acolhimento familiar' })),
  ...communicationCases.map(item => ({ id: `family.case.${item.id}`, title: item.title, href: familyCaseHref(item.id), kind: 'Simulação de comunicação' })),
];

export const readableFavoriteIds = [...favoriteCatalog.map(item => item.id), ...Object.keys(legacyGlossaryFavorites)];

export function normalizeFavoriteIds(ids: readonly string[]): string[] {
  return [...new Set(ids.map(id => Object.hasOwn(legacyGlossaryFavorites, id) ? legacyGlossaryFavorites[id] : id)
    .filter(id => favoriteCatalog.some(item => item.id === id)))];
}

export function findFavorites(ids: readonly string[]): FavoriteEntry[] {
  return normalizeFavoriteIds(ids).flatMap(id => {
    const entry = favoriteCatalog.find(item => item.id === id);
    return entry ? [entry] : [];
  });
}
