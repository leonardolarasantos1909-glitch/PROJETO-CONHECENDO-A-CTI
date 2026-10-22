import { extraQuestionSources } from './extra-questions';

export type QuestionReference = { label: string; href: string; page?: number };

const moduleRef = (id: string, label: string): QuestionReference => ({ label, href: `#${id}` });
const bookRef = (page: number, subject: string): QuestionReference => ({
  label: `Caderno CTI Adulto — ${subject}, página ${page}`,
  href: `/materiais/caderno-cti-adulto-digital.pdf#page=${page}`,
  page,
});

// Page-level links verified against the local caderno text. These record the
// supplied educational basis; they do not establish independent clinical review.
const originalQuestionSources: { text: string; refs: QuestionReference[] }[] = [
  {
    text: 'Durante o cuidado, um monitor dispara um alarme. Qual é a atitude mais adequada ao estagiário?',
    refs: [moduleRef('equipamentos', 'Equipamentos — monitor multiparamétrico'), bookRef(4, 'referências e metas: resultados inesperados')],
  },
  {
    text: 'Qual anotação oferece melhor rastreabilidade?',
    refs: [moduleRef('registros', 'Anotações de enfermagem'), bookRef(38, 'anotação de enfermagem')],
  },
  {
    text: 'Um colega pede uma foto do prontuário para estudar em casa. Como agir?',
    refs: [moduleRef('acolhimento', 'Bem-vindo à CTI — ética, sigilo e humanização')],
  },
  {
    text: 'Caso simulado: uma pessoa compreende instruções e consegue comunicar sua dor. Qual princípio orienta a avaliação?',
    refs: [moduleRef('escalas', 'Escalas clínicas — avaliação da dor'), bookRef(10, 'escolha da escala de dor')],
  },
  {
    text: 'Caso simulado: a resposta verbal não pode ser testada por uma limitação. O que fazer ao avaliar Glasgow?',
    refs: [moduleRef('escalas', 'Escalas clínicas — Glasgow'), bookRef(20, 'Glasgow: componentes não testáveis')],
  },
  {
    text: 'Há dúvida sobre a liberação de uma sonda para administrar dieta. Qual a conduta?',
    refs: [moduleRef('dispositivos', 'Dispositivos — sonda nasoenteral'), bookRef(25, 'sondas e dieta enteral')],
  },
  {
    text: 'Um ventilador apresenta um alarme durante a mobilização. Qual ação é apropriada?',
    refs: [moduleRef('equipamentos', 'Equipamentos — ventilador mecânico'), bookRef(8, 'via aérea e alarmes')],
  },
  {
    text: 'Um volume de eliminação não pôde ser medido. Como registrar?',
    refs: [moduleRef('registros', 'Anotações de enfermagem — eliminações e balanço'), bookRef(24, 'balanço e função renal'), bookRef(38, 'anotação de enfermagem')],
  },
];

const refsByQuestion = new Map<string, QuestionReference[]>([
  ...originalQuestionSources.map(source => [source.text, source.refs] as const),
  ...extraQuestionSources.map((source): [string, QuestionReference[]] => [source.text, [
    moduleRef(source.moduleId, source.label.replaceAll('Glossário', 'Siglário')),
    ...(source.page ? [bookRef(source.page, 'material de apoio à questão')] : []),
  ]]),
]);

/** Unknown question texts deliberately receive no invented reference. */
export function getQuestionReferences(questionText: string): QuestionReference[] {
  return refsByQuestion.get(questionText) ?? [];
}
