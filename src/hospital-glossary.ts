import transcription from './data/glossario-hospital.txt?raw';

export type GlossaryTerm = {
  id: string;
  term: string;
  aliases: string[];
  definition: string;
  href?: string;
  sourceLabel: string;
  sourcePage?: number;
  reviewNote?: string;
  group: string;
};

export const glossarySource = {
  label: 'Transcrição fornecida para o projeto; fonte indicada: glossário no Google Looker Studio',
  href: 'https://datastudio.google.com/u/0/reporting/43feb19a-9a1e-41e5-b86a-2dd1914020ea/page/p_tx8e7de5fd',
};

const reviewNotes: Record<string, string> = {
  'TG EXT': 'A sigla e “Tangente externa” vieram separadas na transcrição. Esta associação precisa ser conferida com a fonte.',
  MSSA: 'A redação enviada traz “resistant” e “sensível” na mesma definição. Confirmar com o responsável pelo material antes de utilizar.',
  SIRS: 'Confirmar com o responsável a correspondência entre esta sigla e a expansão enviada.',
  NPT: 'Conferir a grafia “potal” na transcrição. O texto enviado foi preservado.',
  PPlato: 'Conferir a expressão “Pressão de Plantô” na transcrição. O texto enviado foi preservado.',
  VEF1: 'Conferir a expressão de tempo “minuto 1” com a fonte. O texto enviado foi preservado.',
  ECOG: 'Conferir a repetição “Cooperative Cooperative” na transcrição.',
  KeV: 'Conferir a correspondência entre a sigla e a unidade informada na fonte.',
  MeV: 'Conferir a correspondência entre a sigla e a unidade informada na fonte.',
  'AC + D': 'Conferir a grafia dos nomes e a composição informada com o responsável pelo material; não usar como orientação de tratamento.',
  FOLFIRI: 'Conferir a grafia dos nomes e a composição informada com o responsável pelo material; não usar como orientação de tratamento.',
  'R-CHOP': 'Conferir a composição informada com o responsável pelo material. Nenhum componente foi acrescentado ao texto enviado.',
  'R-CVP': 'Conferir a composição informada com o responsável pelo material. Nenhum componente foi acrescentado ao texto enviado.',
};

// Related learning screens only; these links do not validate the transcription.
const related: Record<string, string> = {
  AVP: '#dispositivos', BH: '#rotinas', BHP: '#rotinas', BHT: '#rotinas', BI: '#equipamentos',
  BIPAP: '#equipamentos', CNAF: '#equipamentos', CPAP: '#equipamentos', CTI: '#acolhimento', CTIA: '#acolhimento',
  CVA: '#dispositivos', CVC: '#dispositivos', CVD: '#dispositivos', EPI: '#acolhimento', EVA: '#escalas',
  FC: '#equipamentos', FiO2: '#equipamentos', FR: '#equipamentos', GCS: '#escalas', PA: '#equipamentos',
  PAM: '#equipamentos', PEEP: '#equipamentos', PICC: '#dispositivos', RASS: '#escalas',
  SNE: '#dispositivos', SNG: '#dispositivos', SVA: '#dispositivos', SVD: '#dispositivos',
  SpO2: '#equipamentos', TET: '#dispositivos', TOT: '#dispositivos', TQT: '#dispositivos', VM: '#equipamentos',
};

const lines = transcription.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
const pairs: { term: string; definition: string }[] = [];
const displacedDefinition = 'Tangente externa';
for (let i = 0; i < lines.length;) {
  if (lines[i] === 'TG EXT' && lines[i + 1] === 'TS') {
    if (lines.filter(line => line === displacedDefinition).length !== 1) throw new Error('Conferir o trecho deslocado de TG EXT na transcrição.');
    pairs.push({ term: lines[i], definition: displacedDefinition });
    i += 1;
  } else if (lines[i] === displacedDefinition && lines[i - 1] === 'Volume corpuscular médio') {
    i += 1;
  } else {
    if (!lines[i + 1]) throw new Error(`Definição ausente na transcrição: ${lines[i]}`);
    pairs.push({ term: lines[i], definition: lines[i + 1] });
    i += 2;
  }
}

const ids = new Map<string, number>();
export const glossaryTerms: GlossaryTerm[] = pairs.map(({ term, definition }) => {
  const base = term.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'termo';
  const count = (ids.get(base) ?? 0) + 1;
  ids.set(base, count);
  const initial = term.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().charAt(0);
  return {
    id: count === 1 ? base : `${base}-${count}`,
    term, definition, aliases: [],
    href: Object.hasOwn(related, term) ? related[term] : undefined,
    sourceLabel: glossarySource.label,
    reviewNote: Object.hasOwn(reviewNotes, term) ? reviewNotes[term] : undefined,
    group: term === 'ºC' ? 'C' : /[0-9]/.test(initial) ? '0–9' : /[A-Z]/.test(initial) ? initial : 'O',
  };
});

const normalize = (value: string) => value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
  .replace(/\s*([+/*.-])\s*/g, '$1').replace(/\s+/g, ' ').trim();

/** Search the supplied text locally, preserving meaningful punctuation and case. */
export function filterGlossary(query: string): GlossaryTerm[] {
  const normalized = normalize(query);
  if (!normalized) return glossaryTerms;
  const words = normalized.split(' ');
  return glossaryTerms.filter(item => {
    const text = normalize([item.term, ...item.aliases, item.definition].join(' '));
    return words.every(word => text.includes(word));
  }).sort((a, b) => {
    const rank = (item: GlossaryTerm) => item.term === query.trim() ? 4 : normalize(item.term) === normalized ? 3 : normalize(item.term).startsWith(normalized) ? 2 : 0;
    return rank(b) - rank(a);
  });
}

/** Migrate only known old bookmarks, never infer equivalence from similar siglas. */
export const legacyGlossaryFavorites: Record<string, string> = {
  'term.glasgow': 'term.gcs',
  'term.bps': 'tool.glossario', 'term.diurese': 'tool.glossario', 'term.pai': 'tool.glossario',
  'term.painad': 'tool.glossario', 'term.perfusao': 'tool.glossario', 'term.pni': 'tool.glossario',
  'term.pop': 'tool.glossario', 'term.sbar': 'tool.glossario',
};
