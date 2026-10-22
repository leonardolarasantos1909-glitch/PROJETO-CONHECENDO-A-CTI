import { modules } from './content';
import { topicFavoriteId, topicHref } from './favorites';
import { scales } from './scales';
import { firstDayItems, glossaryTerms } from './starter-data';
import { learningMaterials } from './materials';
import { apostilas } from './apostilas';
import { caseStudies } from './cases';
import { pavTopic, pavSearchText } from './pav';
import { newTools } from './new-tools';
import { annotationScenarios, annotationSearchText } from './annotation-lab';
import { integrationItems } from './integration-checklist';
import { virtualStations } from './virtual-cti';

export type SearchResult = {
  id: string;
  title: string;
  kind: 'Módulo' | 'Assunto' | 'Escala' | 'Siglário' | 'Ferramenta' | 'PDF' | 'Caso simulado';
  description: string;
  href: string;
  external?: boolean;
};

type SearchEntry = SearchResult & { aliases: string[]; body: string };
export const searchCategories: readonly SearchResult['kind'][] = ['Módulo', 'Assunto', 'Escala', 'Siglário', 'Ferramenta', 'PDF', 'Caso simulado'];

/** Preserve letter order, while accepting accents, punctuation and subscripts. */
export function normalizeSearch(value: string): string {
  return value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ').trim().replace(/\s+/g, ' ');
}

const moduleAliases: Record<string, string[]> = {
  acolhimento: ['acolhimento', 'integração', 'primeiro dia'],
  rotinas: ['rotina', 'plantão'],
  equipamentos: ['equipamentos', 'aparelhos'],
  escalas: ['escalas', 'escalas de dor', 'sedação'],
  dispositivos: ['dispositivos', 'cateteres', 'sondas'],
  registros: ['registros', 'anotação', 'anotações'],
  quiz: ['quiz', 'questões', 'perguntas', 'teste de conhecimentos'],
  biblioteca: ['biblioteca', 'materiais', 'apostilas', 'PDF'],
};

const entries: SearchEntry[] = [
  ...modules.map(module => ({
    id: `module.${module.id}`,
    title: module.title,
    kind: 'Módulo' as const,
    description: module.description,
    href: `#${module.id}`,
    aliases: moduleAliases[module.id] ?? [],
    body: module.label,
  })),
  ...modules.flatMap(module => module.topics.map(topic => {
    const href = topicHref(module.id, topic.title);
    const scale = module.id === 'escalas' ? scales.find(item => href === `#escalas/${item.id}`) : undefined;
    const isPav = module.id === 'rotinas' && topic.title === pavTopic.title;
    return {
      id: topicFavoriteId(module.id, topic.title),
      title: topic.title,
      kind: scale || module.id === 'escalas' ? 'Escala' as const : 'Assunto' as const,
      description: topic.purpose,
      href,
      aliases: [
        ...(scale ? [scale.label, scale.name] : []),
        ...(isPav ? ['PAV', 'bundle de PAV', 'bundle PAV', 'pneumonia associada à ventilação mecânica'] : []),
      ],
      body: [
        module.title, topic.care, topic.risk,
        ...(isPav ? [pavSearchText] : []),
        ...(scale ? [
          scale.category, scale.purpose, ...scale.when, ...scale.howToRead, ...scale.care,
          ...scale.measures.flatMap(item => [item.title, item.detail]),
          scale.criteria.intro, scale.criteria.method, scale.criteria.example ?? '',
          ...(scale.criteria.steps?.flatMap(item => [item.title, item.detail]) ?? []),
          ...(scale.criteria.domains?.flatMap(domain => [domain.title, ...domain.levels.map(level => level.criterion)]) ?? []),
          ...(scale.levelGuide?.flatMap(level => [level.label, level.description]) ?? []),
        ] : []),
      ].join(' '),
    };
  })),
  ...glossaryTerms.map(term => ({
    id: `term.${term.id}`,
    title: term.term,
    kind: 'Siglário' as const,
    description: term.definition,
    href: `#glossario/${term.id}`,
    aliases: [term.id, ...term.aliases],
    body: [term.sourceLabel, term.supplement ?? ''].join(' '),
  })),
  {
    id: 'tool.primeiro-dia', title: 'Checklist do primeiro dia', kind: 'Ferramenta',
    description: 'Um roteiro marcável para conhecer o setor com seu preceptor.',
    href: '#primeiro-dia', aliases: ['checklist', 'meu primeiro dia', 'roteiro de integração'],
    body: firstDayItems.flatMap(item => [item.title, item.detail]).join(' '),
  },
  {
    id: 'tool.glossario', title: 'Siglário', kind: 'Ferramenta',
    description: 'Consulte as 746 siglas e definições da transcrição enviada para o projeto, dentro do aplicativo.',
    href: '#glossario', aliases: ['siglas', 'siglário', 'glossário', 'glossário de siglas', 'termos'], body: '',
  },
  {
    id: 'tool.favoritos', title: 'Meus favoritos', kind: 'Ferramenta',
    description: 'Consulte os conteúdos que você marcou para rever neste navegador.',
    href: '#favoritos', aliases: ['favoritos', 'favorito', 'conteúdos salvos'], body: '',
  },
  {
    id: 'tool.caderno', title: 'Caderno digital', kind: 'Ferramenta',
    description: 'Leia o Caderno CTI Adulto no aplicativo, uma página por vez.',
    href: '#caderno', aliases: ['livro', 'caderno CTI Adulto', 'ler caderno', 'continuar leitura'], body: learningMaterials[0].description,
  },
  ...newTools.map(tool => ({ ...tool, kind: 'Ferramenta' as const, aliases: [...tool.aliases], body:
    tool.id === 'tool.laboratorio' ? annotationSearchText : tool.id === 'tool.integracao' ? integrationItems.flatMap(item => [item.title, item.detail]).join(' ') : tool.id === 'tool.cti-virtual' ? virtualStations.flatMap(item => [item.title, item.description]).join(' ') : '',
  })),
  ...annotationScenarios.map(item => ({ id: `annotation.${item.id}`, title: item.title, kind: 'Ferramenta' as const, description: item.goal,
    href: `#laboratorio/${item.id}`, aliases: ['exercício de anotação', 'anotação simulada', 'laboratório de anotações'],
    body: [...item.facts.map(fact => fact.text), ...item.missingData].join(' '),
  })),
  ...virtualStations.map(item => ({ id: `virtual.${item.id}`, title: `CTI virtual — ${item.title}`, kind: 'Ferramenta' as const, description: item.description,
    href: '#cti-virtual', aliases: ['box fictício', 'desenho educativo', 'equipamento ilustrado'], body: item.title,
  })),
  ...learningMaterials.map(material => ({
    id: `material.${material.id}`,
    title: material.title,
    kind: 'PDF' as const,
    description: material.description,
    href: `#biblioteca/${material.id}`,
    aliases: material.use === 'print' ? ['PDF para imprimir', 'caderno de bolso', 'quatro páginas por A4'] : ['caderno PDF', 'PDF digital'],
    body: [material.originalFilename, `${material.pages} páginas`, 'PDF Biblioteca'].join(' '),
  })),
  ...apostilas.map(material => ({
    id: `material.${material.id}`,
    title: material.title,
    kind: 'PDF' as const,
    description: material.description,
    href: `#biblioteca/${material.id}`,
    aliases: [`Apostila ${material.title}`],
    body: [material.downloadFilename, `${material.pages} páginas`, 'apostila PDF Biblioteca'].join(' '),
  })),
  ...caseStudies.map(studyCase => ({
    id: `case.${studyCase.id}`,
    title: studyCase.title,
    kind: 'Caso simulado' as const,
    description: studyCase.summary,
    href: `#quiz/${studyCase.id}`,
    aliases: ['caso simulado', `caso ${studyCase.subject}`],
    body: [
      studyCase.subject, studyCase.goal, studyCase.discussion,
      ...studyCase.steps.flatMap(step => [step.situation, step.question, ...step.options.flatMap(option => [option.text, option.feedback])]),
    ].join(' '),
  })),
];

/** Static catalog only: queries and locally saved progress never enter this index. */
export const searchIndex: readonly SearchResult[] = entries.map(({ aliases: _aliases, body: _body, ...result }) => result);

const normalizedIndex = entries.map((entry, index) => {
  const title = normalizeSearch(entry.title);
  const aliases = entry.aliases.map(normalizeSearch);
  const description = normalizeSearch(entry.description);
  const text = [title, ...aliases, description, normalizeSearch(entry.body)].join(' ');
  // A broad tool alias, such as “monitor”, should also lead to the specifically named equipment.
  const exactAliasScore = newTools.some(tool => tool.id === entry.id) ? 750 : 950;
  return { result: searchIndex[index], index, title, aliases, description, text, tokens: text.split(' '), exactAliasScore };
});

const kindOrder: Record<SearchResult['kind'], number> = {
  Escala: 0, Assunto: 1, Siglário: 2, Ferramenta: 3, PDF: 4, 'Caso simulado': 5, Módulo: 6,
};

/** All query words must match one entry; return every match in a stable order. */
export function searchContent(query: string, category: SearchResult['kind'] | '' = ''): SearchResult[] {
  const normalized = normalizeSearch(query);
  if (!normalized) return [];
  const words = [...new Set(normalized.split(' '))];
  return normalizedIndex.flatMap(entry => {
    if (category && entry.result.kind !== category) return [];
    if (!words.every(word => entry.text.includes(word))) return [];
    let score = 0;
    if (entry.title === normalized) score = 1000;
    else if (entry.aliases.includes(normalized)) score = entry.exactAliasScore;
    else if (entry.title.startsWith(normalized)) score = 800;
    else if (entry.title.includes(normalized)) score = 700;
    else if (words.every(word => entry.title.includes(word))) score = 650;
    else if (entry.aliases.some(alias => alias.includes(normalized))) score = 600;
    else if (words.every(word => [entry.title, ...entry.aliases].join(' ').includes(word))) score = 550;
    else if (entry.description.includes(normalized)) score = 250;
    // Whole words outrank accidental substrings: ‘dor’ must not prioritize ‘ventilador’.
    if (words.every(word => entry.tokens.includes(word))) score += 10000;
    else if (words.every(word => entry.tokens.some(token => token.startsWith(word)))) score += 5000;
    // Preserve the distinction between codes such as C/C., CA/Ca and D+/D-.
    if (entry.result.title === query.trim()) score += 20000;
    score += words.reduce((sum, word) => sum + (entry.title.includes(word) ? 8 : entry.aliases.some(alias => alias.includes(word)) ? 5 : entry.description.includes(word) ? 2 : 0), 0);
    return [{ ...entry, score }];
  }).sort((a, b) => b.score - a.score || kindOrder[a.result.kind] - kindOrder[b.result.kind] || a.index - b.index)
    .map(entry => entry.result);
}
