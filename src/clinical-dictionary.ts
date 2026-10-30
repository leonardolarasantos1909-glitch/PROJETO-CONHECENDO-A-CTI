import { clinicalCategories, type ClinicalCondition } from './clinical-types';
import { clinicalCardiovascular } from './data/clinical-cardiovascular';
import { clinicalRespiratory } from './data/clinical-respiratory';
import { clinicalNeurologic } from './data/clinical-neurologic';
import { clinicalRenal } from './data/clinical-renal';
import { clinicalInfections } from './data/clinical-infections';
import { clinicalGastroHematology } from './data/clinical-gastro-hematology';
import { modules } from './content';
import { topicRouteId } from './topic-identifiers';
import { glossaryTerms } from './hospital-glossary';

export { clinicalCategories } from './clinical-types';
export type { ClinicalCondition } from './clinical-types';
export const clinicalModule = {
  id: 'module.dicionario-clinico', title: 'Dicionário Clínico', href: '#dicionario-clinico',
  description: 'Patologias e condições críticas para compreender o cuidado, reconhecer riscos e conversar com a equipe.',
};
export const clinicalHref = (id: string) => `#dicionario-clinico/${id}`;
export const clinicalFavoriteId = (id: string) => `clinical.${id}`;
export const clinicalConditions: ClinicalCondition[] = [...clinicalCardiovascular, ...clinicalRespiratory, ...clinicalNeurologic, ...clinicalRenal, ...clinicalInfections, ...clinicalGastroHematology]
  .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));

export type ClinicalResource = { label: string; href: string; kind: string };
const topic = (moduleId: string, title: string, label = title): ClinicalResource => ({ label, href: `#${moduleId}/${topicRouteId(moduleId, title)}`, kind: 'Assunto' });
/** Every destination below is an existing public resource, not an invented clinical protocol. */
export const clinicalResources: Record<string, ClinicalResource> = {
  monitor: topic('equipamentos', 'Monitor multiparamétrico'),
  vm: topic('equipamentos', 'Ventilador mecânico'),
  vni: { label: 'VNI — definição no Siglário', href: '#glossario/vni', kind: 'Siglário' },
  cnaf: topic('equipamentos', 'Cânula nasal de alto fluxo', 'CNAF — Cânula nasal de alto fluxo'),
  oxigenio: topic('equipamentos', 'Oxigenoterapia'),
  bomba: topic('equipamentos', 'Bomba de infusão'),
  cvc: topic('dispositivos', 'Cateter venoso central (CVC)'),
  svd: topic('dispositivos', 'Sonda vesical de demora'),
  trs: topic('equipamentos', 'Terapia renal substitutiva'),
  tot: topic('dispositivos', 'Tubo orotraqueal'),
  glasgow: topic('escalas', 'Escala de Coma de Glasgow'),
  rass: { label: 'RASS — Agitação e sedação', href: '#escalas/rass', kind: 'Escala' },
  bps: { label: 'BPS — Dor no adulto crítico intubado', href: '#escalas/bps', kind: 'Escala' },
  eva: { label: 'EVA — Dor por autorrelato', href: '#escalas/eva', kind: 'Escala' },
  painad: { label: 'PAINAD — Dor na demência avançada', href: '#escalas/painad', kind: 'Escala' },
  balanco: topic('rotinas', 'Balanço hídrico e dispositivos'),
  sinais: topic('rotinas', 'Sinais vitais e glicemia capilar'),
  comunicacao: topic('rotinas', 'Recebimento e passagem de plantão'),
  registros: { label: 'Anotações de enfermagem', href: '#registros', kind: 'Módulo' },
  pav: topic('rotinas', 'Bundle de prevenção da PAV'),
  casos: { label: 'Casos simulados e quiz', href: '#quiz', kind: 'Caso simulado' },
  laboratorio: { label: 'Laboratório de anotações', href: '#laboratorio', kind: 'Ferramenta' },
  siglario: { label: 'Siglário — Siglas e significados', href: '#glossario', kind: 'Siglário' },
};

const normalize = (value: string) => value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().replace(/\s+/g, ' ');
export function getClinicalCondition(id: string) { return clinicalConditions.find(item => item.id === id); }
export function searchClinicalConditions(query: string, category = ''): ClinicalCondition[] {
  const normalized = normalize(query);
  const words = [...new Set(normalized.split(' ').filter(Boolean))];
  return clinicalConditions.map((item, index) => {
    const title = normalize(item.name), aliases = normalize([item.acronym, ...item.synonyms].join(' '));
    // Symptoms are educational text, never a patient input for differential diagnosis.
    const text = [title, aliases, normalize(item.category), normalize(item.keywords.join(' '))].join(' ');
    const score = !normalized ? 0 : title === normalized ? 100 : normalize(item.acronym) === normalized ? 90 : title.startsWith(normalized) ? 80 : 0;
    return { item, index, text, score };
  }).filter(({ item, text }) => (!category || item.category === category) && words.every(word => text.includes(word)))
    .sort((a, b) => b.score - a.score || a.index - b.index).map(({ item }) => item);
}
export function clinicalResourceLinks(item: ClinicalCondition): ClinicalResource[] {
  return [...new Set([...item.relatedDevices, ...item.relatedScales, ...item.relatedContentIds])].map(key => {
    if (!Object.hasOwn(clinicalResources, key)) throw new Error(`Recurso clínico ausente: ${key}`);
    return clinicalResources[key];
  });
}
export function relatedClinicalConditions(item: ClinicalCondition): ClinicalCondition[] {
  return item.relatedConditionIds.flatMap(id => { const condition = getClinicalCondition(id); return condition ? [condition] : []; });
}
/** Reciprocal links are derived from the same data as each condition's outgoing links. */
export function conditionsForContent(href: string): ClinicalCondition[] {
  const canonical = (value: string) => value.split('?')[0];
  const destination = canonical(href);
  return clinicalConditions.filter(item => clinicalResourceLinks(item).some(link => {
    const target = canonical(link.href);
    return target === destination || (!destination.includes('/') && target.startsWith(`${destination}/`));
  }));
}

/** Technical/editorial validation; this cannot grant clinical approval. */
export function assertClinicalConditions(entries: readonly ClinicalCondition[] = clinicalConditions): void {
  const ids = new Set<string>(), slugs = new Set<string>();
  const requiredText = ['id', 'slug', 'name', 'quickSummary', 'definition', 'pathophysiology', 'version'] as const;
  const requiredLists = ['synonyms', 'keywords', 'causes', 'manifestations', 'diagnosis', 'treatmentOverview', 'nursingTechnicianCare', 'warningSigns', 'relatedContentIds', 'relatedConditionIds'] as const;
  for (const item of entries) {
    if (requiredText.some(key => !item[key]?.trim()) || requiredLists.some(key => !Array.isArray(item[key]) || !item[key].length || item[key].some(value => !value.trim()))) throw new Error(`Ficha clínica incompleta: ${item.id}`);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.id) || item.slug !== item.id || ids.has(item.id) || slugs.has(item.slug)) throw new Error(`Identificador clínico inválido ou duplicado: ${item.id}`);
    ids.add(item.id); slugs.add(item.slug);
    if (!clinicalCategories.includes(item.category)) throw new Error(`Categoria clínica inválida: ${item.id}`);
    if (item.quickSummary.trim().split(/\s+/).length > 80) throw new Error(`Resumo clínico excede 80 palavras: ${item.id}`);
    if (item.clinicalReviewStatus !== 'pending' || item.reviewedAt !== null) throw new Error(`Aprovação clínica exige responsável e evidência ainda não cadastrados: ${item.id}`);
    if (!item.clinicalCase || Array.isArray(item.clinicalCase) || Object.keys(item.clinicalCase).length !== 3 || (['scenario', 'question', 'answer'] as const).some(key => typeof item.clinicalCase[key] !== 'string' || !item.clinicalCase[key].trim())) throw new Error(`Caso educativo incompleto: ${item.id}`);
    if (!item.references.length) throw new Error(`Referência clínica ausente: ${item.id}`);
    for (const reference of item.references) {
      if (!reference.title.trim() || !reference.organization.trim() || !reference.note.trim() || !['verified', 'pending'].includes(reference.verification)) throw new Error(`Referência clínica incompleta: ${item.id}`);
      const url = new URL(reference.url);
      if (url.protocol !== 'https:' || url.username || url.password) throw new Error(`URL clínica inválida: ${item.id}`);
      if (reference.verification === 'pending' && reference.accessedAt) throw new Error(`Conferência não comprovada: ${item.id}`);
      if (reference.verification === 'verified' && !reference.accessedAt) throw new Error(`Data de consulta ausente: ${item.id}`);
      for (const date of [reference.accessedAt]) if (date && (!/^\d{4}-\d{2}-\d{2}$/.test(date) || new Date(date).toISOString().slice(0, 10) !== date)) throw new Error(`Data de consulta inválida: ${item.id}`);
    }
    for (const key of [...item.relatedDevices, ...item.relatedScales, ...item.relatedContentIds]) if (!Object.hasOwn(clinicalResources, key)) throw new Error(`Recurso clínico ausente: ${key}`);
  }
  for (const item of entries) for (const id of item.relatedConditionIds) if (id === item.id || !ids.has(id)) throw new Error(`Patologia relacionada inválida em ${item.id}: ${id}`);
  for (const link of Object.values(clinicalResources)) {
    const [route, target] = link.href.slice(1).split('/');
    const module = modules.find(item => item.id === route);
    if (target && module && !module.topics.some(item => topicRouteId(route, item.title) === target) && !(route === 'escalas' && ['eva', 'bps', 'painad', 'rass'].includes(target))) throw new Error(`Assunto clínico relacionado inexistente: ${link.href}`);
    if (route === 'glossario' && target && !glossaryTerms.some(item => item.id === target)) throw new Error(`Sigla relacionada inexistente: ${link.href}`);
    if (!module && !['laboratorio', 'glossario'].includes(route)) throw new Error(`Destino clínico relacionado inexistente: ${link.href}`);
  }
}
