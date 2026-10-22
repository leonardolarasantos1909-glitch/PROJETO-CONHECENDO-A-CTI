/** Stable identifiers captured from the existing public routes; titles may evolve independently. */
export const topicIdentifiers: Readonly<Record<string, Readonly<Record<string, string>>>> = {
  acolhimento: {
    'O que é uma CTI?': 'o-que-e-uma-cti',
    'Equipe multiprofissional': 'equipe-multiprofissional',
    'Ética, sigilo e humanização': 'etica-sigilo-e-humanizacao',
    'Segurança e primeiro dia': 'seguranca-e-primeiro-dia',
  },
  rotinas: {
    'Recebimento e passagem de plantão': 'recebimento-e-passagem-de-plantao',
    'Sinais vitais e glicemia capilar': 'sinais-vitais-e-glicemia-capilar',
    'Higiene, conforto e mobilização': 'higiene-conforto-e-mobilizacao',
    'Administração segura de medicamentos': 'administracao-segura-de-medicamentos',
    'Balanço hídrico e dispositivos': 'balanco-hidrico-e-dispositivos',
    'Alterações clínicas e registros': 'alteracoes-clinicas-e-registros',
    'Bundle de prevenção da PAV': 'bundle-de-prevencao-da-pav',
  },
  equipamentos: {
    'Monitor multiparamétrico': 'monitor-multiparametrico',
    'Ventilador mecânico': 'ventilador-mecanico',
    'Bomba de infusão': 'bomba-de-infusao',
    'Bomba de seringa': 'bomba-de-seringa',
    'Aspirador': 'aspirador',
    'Oxigenoterapia': 'oxigenoterapia',
    'Cânula nasal de alto fluxo': 'canula-nasal-de-alto-fluxo',
    'Terapia renal substitutiva': 'terapia-renal-substitutiva',
  },
  escalas: {
    'EVA — Escala Visual Analógica': 'eva-escala-visual-analogica',
    'BPS — Behavioral Pain Scale': 'bps-behavioral-pain-scale',
    'PAINAD': 'painad',
    'RASS': 'rass',
    'Escala de Coma de Glasgow': 'escala-de-coma-de-glasgow',
  },
  dispositivos: {
    'Cateter venoso central (CVC)': 'cateter-venoso-central-cvc',
    'PICC': 'picc',
    'Sonda vesical de demora': 'sonda-vesical-de-demora',
    'Sonda nasoenteral': 'sonda-nasoenteral',
    'Tubo orotraqueal': 'tubo-orotraqueal',
    'Traqueostomia': 'traqueostomia',
    'Cateteres de oxigenoterapia': 'cateteres-de-oxigenoterapia',
  },
  registros: {
    'Sinais vitais e glicemia': 'sinais-vitais-e-glicemia',
    'Medicamentos': 'medicamentos',
    'Higiene, conforto e mobilização': 'higiene-conforto-e-mobilizacao',
    'Eliminações e balanço': 'eliminacoes-e-balanco',
    'Intercorrências e comunicação': 'intercorrencias-e-comunicacao',
  },
};

const scaleTopics: Readonly<Record<string, string>> = {
  eva: 'EVA — Escala Visual Analógica',
  bps: 'BPS — Behavioral Pain Scale',
  painad: 'PAINAD',
  rass: 'RASS',
};

export const topicSlug = (title: string) => title.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export function topicRouteId(moduleId: string, title: string): string {
  const map = topicIdentifiers[moduleId];
  return map && Object.hasOwn(map, title) ? map[title] : topicSlug(title);
}

export function scaleTopicTitle(scaleId: string): string | undefined {
  return Object.hasOwn(scaleTopics, scaleId) ? scaleTopics[scaleId] : undefined;
}

export function scaleIdForTopic(title: string): string | undefined {
  return Object.keys(scaleTopics).find(id => scaleTopics[id] === title);
}

/** Accept both the short scale route and the stable topic identifier. */
export function scaleIdForRoute(target?: string): string | undefined {
  return Object.keys(scaleTopics).find(id => target === id || target === topicRouteId('escalas', scaleTopics[id]));
}

export function topicMatchesRoute(moduleId: string, title: string, target?: string): boolean {
  if (!target) return false;
  return target === topicRouteId(moduleId, title) || (moduleId === 'escalas' && target === scaleIdForTopic(title));
}
