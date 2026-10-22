/** Fixed fictional exercises. Nothing entered in the lab is saved or sent. */
export type AnnotationSourceRef = { label: string; href: string; page?: number };
export type AnnotationFact = { id: string; text: string };
export type AnnotationScenario = {
  id: string;
  title: string;
  goal: string;
  facts: AnnotationFact[];
  missingData: string[];
  example: string;
  exampleComment: string;
  problematicExample: string;
  problematicComment: string;
  sourceRefs: AnnotationSourceRef[];
  relatedHref: string;
};

const caderno = (page: number, subject: string): AnnotationSourceRef => ({
  label: `Caderno CTI Adulto — ${subject}, página ${page}`,
  href: `/materiais/caderno-cti-adulto-digital.pdf#page=${page}`,
  page,
});

// The example is assembled from the supplied facts to prevent extra observations,
// invented times, measurements, care or outcomes from entering a model answer.
function scenario(data: Omit<AnnotationScenario, 'example'>): AnnotationScenario {
  return { ...data, example: data.facts.map(fact => fact.text).join(' ') };
}

export const annotationScenarios: AnnotationScenario[] = [
  scenario({
    id: 'higiene-supervisionada',
    title: 'Higiene supervisionada',
    goal: 'Descrever o desconforto, a comunicação e o cuidado executado, sem presumir a resposta ao cuidado.',
    facts: [
      { id: 'desconforto', text: 'Durante uma higiene supervisionada, houve desconforto.' },
      { id: 'comunicacao', text: 'A equipe foi informada.' },
      { id: 'posicao', text: 'A posição foi ajustada conforme orientação da equipe.' },
    ],
    missingData: [
      'O horário e os sinais específicos do desconforto não foram fornecidos.',
      'Não foi informado qual profissional recebeu a comunicação.',
      'A resposta após o ajuste de posição não foi informada.',
    ],
    exampleComment: 'O exemplo conserva os três fatos e a sequência fornecida. Não afirma que o desconforto melhorou. A comunicação permanece genérica porque o cenário não identifica quem foi informado; essa lacuna deve ser reconhecida, sem inventar um profissional.',
    problematicExample: 'Higiene realizada, tudo normal e pessoa confortável.',
    problematicComment: '“Tudo normal” é vago e omite o desconforto e a comunicação. “Confortável” acrescenta uma resposta que não foi fornecida.',
    sourceRefs: [
      { label: 'Caso fictício existente — Uma anotação que conta o que aconteceu', href: '#quiz/registro-do-cuidado' },
      caderno(38, 'anotação de enfermagem'),
    ],
    relatedHref: '#registros',
  }),
  scenario({
    id: 'volume-nao-medido',
    title: 'Eliminação sem volume medido',
    goal: 'Registrar uma ocorrência sem transformar uma estimativa ou um dado ausente em medida.',
    facts: [
      { id: 'ocorrencia', text: 'Ocorreu uma eliminação durante o cuidado simulado.' },
      { id: 'nao-medido', text: 'O volume não pôde ser medido.' },
    ],
    missingData: [
      'O tipo de eliminação, o horário e suas características não foram fornecidos.',
      'Não há volume medido nem informação de uma comunicação já realizada.',
    ],
    exampleComment: 'O exemplo informa a ocorrência e a limitação da medida. Não chama a eliminação de diurese, não copia um volume anterior e não afirma que alguém foi avisado, pois esses dados não constam do cenário.',
    problematicExample: 'Diurese boa; volume igual ao do turno anterior.',
    problematicComment: 'O cenário não informa que se tratava de diurese nem fornece um volume anterior. “Boa” não descreve um achado objetivo. Nenhum valor pode ser preenchido por suposição.',
    sourceRefs: [
      { label: 'Caso fictício existente — Uma anotação que conta o que aconteceu', href: '#quiz/registro-do-cuidado' },
      caderno(24, 'balanço e função renal'),
      caderno(38, 'anotação de enfermagem'),
    ],
    relatedHref: '#registros',
  }),
  scenario({
    id: 'dieta-nao-iniciada',
    title: 'Dieta não iniciada',
    goal: 'Distinguir uma ação não realizada de uma ação concluída e documentar a orientação efetivamente recebida.',
    facts: [
      { id: 'duvida', text: 'Antes de administrar a dieta prescrita, não foi possível confirmar a liberação da sonda nasoenteral.' },
      { id: 'nao-iniciada', text: 'A administração da dieta não foi iniciada.' },
      { id: 'orientacao', text: 'O enfermeiro orientou aguardar a avaliação antes de iniciar a dieta.' },
    ],
    missingData: [
      'O horário e a identificação do enfermeiro não foram fornecidos.',
      'Não há resultado da avaliação nem confirmação posterior de liberação para uso.',
    ],
    exampleComment: 'O exemplo registra a dúvida, a administração não iniciada e a orientação recebida. Não declara a sonda liberada e não acrescenta uma avaliação ou conduta posterior.',
    problematicExample: 'Dieta administrada, sonda funcionando normalmente.',
    problematicComment: 'A frase contradiz a administração não iniciada e afirma um funcionamento que não foi avaliado no cenário. O registro deve refletir somente os fatos apresentados.',
    sourceRefs: [
      { label: 'Caso fictício existente — A sonda está liberada para uso?', href: '#quiz/duvida-sobre-sonda' },
      caderno(25, 'sondas e dieta enteral'),
      caderno(38, 'anotação de enfermagem'),
    ],
    relatedHref: '#registros',
  }),
];

/** These are prompts for manual self-review, not an automatic clinical score. */
export const rubricCriteria = [
  {
    id: 'fidelidade',
    label: 'Conservei os fatos fornecidos.',
    explanation: 'Compare sua anotação com cada fato do cenário. Mantenha inclusive o que não foi realizado ou não pôde ser medido.',
  },
  {
    id: 'clareza',
    label: 'Usei linguagem clara e objetiva.',
    explanation: 'Prefira descrições dos acontecimentos e evite julgamentos ou expressões vagas, como “tudo normal”.',
  },
  {
    id: 'sequencia',
    label: 'Respeitei a sequência que foi informada.',
    explanation: 'Use a ordem dos fatos quando ela estiver indicada. Nenhum destes cenários fornece horário: reconheça a lacuna, sem inventar uma hora.',
  },
  {
    id: 'cuidado-comunicacao',
    label: 'Descrevi cuidados e comunicação apenas quando fornecidos.',
    explanation: 'Inclua as ações realizadas e as orientações recebidas que constam do cenário. Não afirme que houve uma comunicação ou uma resposta ao cuidado quando isso não foi informado.',
  },
  {
    id: 'sem-inferencias',
    label: 'Não acrescentei dados ou conclusões por suposição.',
    explanation: 'Não complete horários, medidas, respostas ao cuidado ou identificação profissional ausentes. Este exercício não deve receber dados de pessoas reais.',
  },
] as const;

export const annotationSearchText = annotationScenarios.map(item => [
  item.title, item.goal, ...item.facts.map(fact => fact.text), ...item.missingData,
].join(' ')).join(' ');
