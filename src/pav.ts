export type PavMeasure = {
  id: string;
  title: string;
  detail: string;
  scope: string;
};

export const pavTopic = {
  title: 'Bundle de prevenção da PAV',
  purpose: 'PAV significa pneumonia associada à ventilação mecânica. O bundle reúne medidas aplicadas de forma articulada para reduzir esse risco. Sua composição, frequência de conferência e exceções seguem o protocolo do serviço.',
  care: 'Conheça o conjunto de medidas com o preceptor e o enfermeiro: higiene das mãos e da boca, posição da cabeceira, integridade do circuito, cuidado com o cuff e observação da via aérea. Registre o cuidado efetivamente realizado no sistema autorizado.',
  risk: 'A aplicação exige avaliação individual, treinamento e respeito às atribuições profissionais. Não altere parâmetros ventilatórios, pressão do cuff ou sedação por iniciativa própria. O tópico não é um protocolo institucional validado nem um formulário de avaliação de paciente.',
};

/** Educational summary of the supplied caderno and existing app materials. */
export const pavMeasures: PavMeasure[] = [
  {
    id: 'higiene-das-maos',
    title: 'Higiene das mãos',
    detail: 'Realize a higiene das mãos nos momentos e com a técnica orientados pelo serviço, incluindo os cuidados com a pessoa e seus dispositivos. Conheça também as precauções e os EPIs indicados com o preceptor.',
    scope: 'Cuidados acompanhados pelo preceptor, conforme as orientações do serviço.',
  },
  {
    id: 'cabeceira',
    title: 'Cabeceira quando indicada',
    detail: 'O caderno descreve cabeceira de 30 a 45° quando indicada e sem contraindicação. Confira a indicação, a posição e a tolerância com a equipe, inclusive após higiene ou mobilização, respeitando o plano individual.',
    scope: 'A posição depende da avaliação individual e das contraindicações.',
  },
  {
    id: 'higiene-oral',
    title: 'Higiene oral conforme o POP',
    detail: 'Observe a cavidade oral e realize a higiene conforme o Procedimento Operacional Padrão (POP), o plano de cuidados e a supervisão recebida. Técnica, frequência e produtos dependem da avaliação e da orientação do serviço; esta tela não define um antisséptico obrigatório.',
    scope: 'Execução conforme competência, treinamento e supervisão aplicáveis.',
  },
  {
    id: 'circuito-e-condensado',
    title: 'Circuito íntegro e atenção ao condensado',
    detail: 'Observe a integridade do circuito e das conexões. Evite manipulações e desconexões desnecessárias e que o condensado alcance a pessoa. O manejo do condensado e as trocas de componentes seguem o protocolo e a orientação da equipe.',
    scope: 'Observe e comunique falhas; não improvise montagem ou troca de componentes.',
  },
  {
    id: 'cuff',
    title: 'Cuff (balonete) e segurança da via aérea',
    detail: 'O caderno orienta conferir o cuff pelo método, atribuição e faixa adotados no setor. Confirme com o enfermeiro quem realiza a verificação e como ela é registrada. Esta tela não estabelece uma faixa de pressão nem ensina a ajustar o balonete.',
    scope: 'Verificação e ajuste dependem de atribuição, capacitação e protocolo.',
  },
  {
    id: 'secrecoes-e-aspiracao',
    title: 'Secreções e necessidade de aspiração',
    detail: 'Secreções, sinais de obstrução e piora ventilatória precisam de avaliação. Comunique prontamente o enfermeiro e auxilie no preparo do material e da monitorização conforme orientação. Segundo o resumo do caderno e a resolução nele citada, na equipe de enfermagem a aspiração de pacientes graves com TOT/TQT é privativa do enfermeiro. No estágio, acompanhe e auxilie sob orientação.',
    scope: 'O estudante não executa aspiração de paciente grave com base nesta tela.',
  },
  {
    id: 'necessidade-de-ventilacao',
    title: 'Reavaliação diária da necessidade de ventilação',
    detail: 'A apostila descreve a avaliação diária da necessidade de ventilação pela equipe. Compartilhe com o enfermeiro as mudanças observadas e acompanhe o plano de cuidado. Decisões sobre desmame, extubação e sedação cabem à equipe habilitada; não altere parâmetros nem suspenda sedação por iniciativa própria.',
    scope: 'Avaliação e decisões da equipe responsável, com metas individualizadas.',
  },
  {
    id: 'conferencia-e-registro',
    title: 'Conferência conjunta, registro e comunicação',
    detail: 'Conheça o checklist do bundle adotado pelo serviço e confira as medidas com a equipe. Registre os cuidados realmente realizados, os achados e a comunicação no sistema autorizado, conforme o padrão local. Comunique quando uma medida indicada não puder ser cumprida e esclareça a orientação para aquela situação.',
    scope: 'Registro assistencial somente no sistema autorizado; não informe dados de pacientes no app.',
  },
];

export const pavReferences = [
  { id: 'caderno-pav', label: 'Caderno CTI Adulto — PAV e secreções, página 9.', href: '/materiais/caderno-cti-adulto-digital.pdf#page=9' },
  { id: 'apostila-pav', label: 'Apostila Cuidados com o Paciente Crítico — prevenção de pneumonia associada à VM, página 4.', href: '/materiais/apostilas/cuidados-paciente-critico.pdf#page=4' },
  { id: 'caderno-registro', label: 'Caderno CTI Adulto — anotação de enfermagem, página 38.', href: '/materiais/caderno-cti-adulto-digital.pdf#page=38' },
  { id: 'caderno-referencias-pav', label: 'Caderno CTI Adulto — referências [14] e [17], página 43.', href: '/materiais/caderno-cti-adulto-digital.pdf#page=43' },
  { id: 'anvisa-pav', label: 'Anvisa — Protocolo de prevenção de PAV. Link da referência [14] do caderno.', href: 'https://www.gov.br/anvisa/pt-br/assuntos/servicosdesaude/prevencao-e-controle-de-infeccao-e-resistencia-microbiana/prevencao-das-principais-iras/pneumonia-associada-a-ventilacao-mecanica/protocolo-4-prevencoo-de-pav-final.pdf' },
  { id: 'cofen-aspiracao', label: 'Cofen — Resolução 557/2017, aspiração de vias aéreas. Link da referência [17] do caderno.', href: 'https://www.cofen.gov.br/resolucao-cofen-no-05572017/' },
];

export const pavSearchText = [
  'PAV bundle de PAV bundle PAV pacote conjunto medidas pneumonia associada ventilação mecânica prevenção',
  pavTopic.title, pavTopic.purpose, pavTopic.care, pavTopic.risk,
  ...pavMeasures.flatMap(measure => [measure.title, measure.detail, measure.scope]),
].join(' ');
