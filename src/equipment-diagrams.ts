export type DiagramKind = 'monitor' | 'ventilator' | 'infusion' | 'syringe' | 'suction' | 'oxygen' | 'high-flow' | 'renal' | 'venous' | 'urinary' | 'enteral' | 'tube' | 'tracheostomy' | 'interfaces';

export type EquipmentDiagram = {
  moduleId: 'equipamentos' | 'dispositivos';
  topicTitle: string;
  kind: DiagramKind;
  description: string;
  parts: { name: string; detail: string }[];
  attention: string;
  source: { label: string; href: string };
};

const caderno = (page: number) => ({ label: `Caderno CTI Adulto · página ${page}`, href: `/materiais/caderno-cti-adulto-digital.pdf#page=${page}` });
const monitorizacao = (page: number) => ({ label: `Apostila Monitorização e equipamentos · página ${page}`, href: `/materiais/apostilas/monitorizacao-equipamentos.pdf#page=${page}` });

/** Original schematics adapted from the existing module introductions, with supplied-PDF reading links. */
export const equipmentDiagrams: EquipmentDiagram[] = [
  {
    moduleId: 'equipamentos', topicTitle: 'Monitor multiparamétrico', kind: 'monitor',
    description: 'Tela e três acessórios ilustrativos de monitorização. Os acessórios disponíveis variam conforme o equipamento.',
    parts: [
      { name: 'Tela do monitor', detail: 'Apresenta sinais, curvas e alarmes; a ilustração não contém medições.' },
      { name: 'Eletrodos e cabos', detail: 'Permitem captar o sinal elétrico para a monitorização cardíaca.' },
      { name: 'Sensor de oximetria', detail: 'Sensor óptico relacionado à leitura da SpO₂.' },
      { name: 'Manguito', detail: 'Acessório utilizado na medida não invasiva da pressão arterial.' },
    ],
    attention: 'Observe o paciente e a qualidade do sinal. Movimento e acessórios mal posicionados podem alterar a leitura; comunique alarmes e mudanças ao enfermeiro.',
    source: monitorizacao(4),
  },
  {
    moduleId: 'equipamentos', topicTitle: 'Ventilador mecânico', kind: 'ventilator',
    description: 'Unidade de controle, circuito e umidificação apresentados de forma simplificada, sem representar uma montagem.',
    parts: [
      { name: 'Unidade de controle e tela', detail: 'Reúne a apresentação de informações e dos alarmes do equipamento.' },
      { name: 'Circuito ventilatório', detail: 'Conjunto de tubos do sistema de suporte ventilatório.' },
      { name: 'Sistema de umidificação', detail: 'Pode integrar o suporte, conforme o equipamento e o plano de cuidado.' },
    ],
    attention: 'Observe paciente, fixações e conexões com a equipe. Alarmes, desconexão e desconforto exigem avaliação; parâmetros não devem ser alterados por iniciativa do estudante.',
    source: monitorizacao(11),
  },
  {
    moduleId: 'equipamentos', topicTitle: 'Bomba de infusão', kind: 'infusion',
    description: 'Bomba, recipiente de solução e equipo ilustrados como componentes para reconhecimento, sem indicar preparo ou conexão.',
    parts: [
      { name: 'Recipiente da solução', detail: 'A identificação deve corresponder à prescrição e à terapia administrada.' },
      { name: 'Bomba e tela', detail: 'Sistema programável que controla a administração.' },
      { name: 'Equipo e linha', detail: 'Precisam ser compatíveis e identificados; não se reconhece a terapia apenas pela posição da bomba.' },
    ],
    attention: 'Compare identificação, prescrição e programação com a equipe. Comunique alarmes, interrupções e alterações do acesso, sem ajustar a taxa por iniciativa própria.',
    source: caderno(28),
  },
  {
    moduleId: 'equipamentos', topicTitle: 'Bomba de seringa', kind: 'syringe',
    description: 'Seringa e mecanismo de movimentação do êmbolo em uma representação externa simplificada.',
    parts: [
      { name: 'Seringa compatível', detail: 'A seringa e a solução devem corresponder ao equipamento e à prescrição.' },
      { name: 'Mecanismo de movimentação', detail: 'Movimenta o êmbolo para controlar a administração.' },
      { name: 'Tela e identificação', detail: 'Permitem conferir a programação com a prescrição, conforme o treinamento do serviço.' },
    ],
    attention: 'Trocas, manipulação e programação exigem capacitação e supervisão. O desenho não ensina a instalar seringa nem ajustar uma infusão.',
    source: caderno(28),
  },
  {
    moduleId: 'equipamentos', topicTitle: 'Aspirador', kind: 'suction',
    description: 'Elementos do sistema de aspiração separados visualmente para reconhecimento; a disposição não é um guia de montagem.',
    parts: [
      { name: 'Fonte de vácuo', detail: 'Origem da sucção do sistema.' },
      { name: 'Frasco coletor', detail: 'Recipiente destinado à coleta no sistema.' },
      { name: 'Extensão', detail: 'Tubulação do conjunto, cuja integridade deve ser observada.' },
      { name: 'Filtro', detail: 'Componente do sistema conforme o modelo de equipamento.' },
    ],
    attention: 'Conheça o equipamento e os EPIs com o preceptor. Aspiração exige indicação, capacitação e respeito às atribuições profissionais.',
    source: monitorizacao(11),
  },
  {
    moduleId: 'equipamentos', topicTitle: 'Oxigenoterapia', kind: 'oxygen',
    description: 'Fonte de oxigênio, fluxômetro e interface como elementos de reconhecimento; não representa ajuste ou montagem.',
    parts: [
      { name: 'Fonte de oxigênio', detail: 'Fornece o gás ao sistema prescrito.' },
      { name: 'Fluxômetro', detail: 'Equipamento relacionado ao controle do fluxo, sem valores ou ajustes neste desenho.' },
      { name: 'Interface', detail: 'Cânula ou máscara escolhida segundo a prescrição e o contexto clínico.' },
    ],
    attention: 'Confira a interface prescrita e observe pele, conforto e conexões. Não defina fluxos ou metas por conta própria; mantenha fontes de ignição afastadas.',
    source: caderno(8),
  },
  {
    moduleId: 'equipamentos', topicTitle: 'Cânula nasal de alto fluxo', kind: 'high-flow',
    description: 'Cânula, circuito e unidade de aquecimento/umidificação apresentados esquematicamente, sem indicar conexões.',
    parts: [
      { name: 'Cânula nasal', detail: 'Interface que fica em contato com o nariz e exige observação da pele e do conforto.' },
      { name: 'Circuito', detail: 'Tubulação do sistema de suporte respiratório.' },
      { name: 'Aquecimento e umidificação', detail: 'Integram o sistema, conforme o equipamento utilizado.' },
    ],
    attention: 'Comunique falhas, alarmes, desconforto ou piora. Fluxo, temperatura e concentração de oxigênio dependem da orientação do profissional responsável.',
    source: caderno(8),
  },
  {
    moduleId: 'equipamentos', topicTitle: 'Terapia renal substitutiva', kind: 'renal',
    description: 'Equipamento, filtro e linhas de um circuito extracorpóreo em uma visão geral sem representar acesso ao paciente.',
    parts: [
      { name: 'Equipamento de terapia renal', detail: 'Sistema utilizado para suporte à função renal em situações indicadas.' },
      { name: 'Filtro', detail: 'Componente do circuito extracorpóreo.' },
      { name: 'Linhas do circuito', detail: 'Precisam ser protegidas de tração durante os cuidados e a movimentação.' },
    ],
    attention: 'A modalidade e o manejo são definidos pela equipe habilitada. Comunique alarmes e alterações; não manipule circuito, acesso ou parâmetros sem atribuição e capacitação.',
    source: caderno(24),
  },
  {
    moduleId: 'dispositivos', topicTitle: 'Cateter venoso central (CVC)', kind: 'venous',
    description: 'Somente a região externa de um cateter e seu curativo. A posição interna da ponta e a técnica de inserção não são representadas.',
    parts: [
      { name: 'Extensões e conexões', detail: 'As vias devem estar identificadas; número e aparência variam conforme o cateter.' },
      { name: 'Fixação', detail: 'Ajuda a preservar a estabilidade do dispositivo e precisa ser observada durante o cuidado.' },
      { name: 'Curativo e região de inserção', detail: 'Observe integridade, umidade, dor, secreção, sangramento ou deslocamento.' },
    ],
    attention: 'Evite tração e desconexões desnecessárias. Alterações no sítio e resistência devem ser comunicadas; não manipule ou force a infusão.',
    source: caderno(22),
  },
  {
    moduleId: 'dispositivos', topicTitle: 'PICC', kind: 'venous',
    description: 'Representação apenas da região externa e do curativo. O PICC é um cateter central inserido por uma veia periférica; sua ponta interna não é mostrada.',
    parts: [
      { name: 'Extensões e conexões', detail: 'Observe a identificação da linha; número e aparência dependem do modelo.' },
      { name: 'Fixação', detail: 'Deve ser preservada durante higiene, mobilização e demais cuidados.' },
      { name: 'Curativo e região de inserção', detail: 'Observe integridade e sinais de alteração, sem manipulação desnecessária.' },
    ],
    attention: 'O aspecto externo, sozinho, não confirma o tipo nem a posição de um cateter. Confira a identificação e comunique alterações; não force infusão diante de resistência.',
    source: caderno(22),
  },
  {
    moduleId: 'dispositivos', topicTitle: 'Sonda vesical de demora', kind: 'urinary',
    description: 'Segmento externo de drenagem e bolsa coletora. Não mostra anatomia, inserção ou manipulação do sistema.',
    parts: [
      { name: 'Segmento externo e fixação', detail: 'Observe a fixação para prevenir tração do dispositivo.' },
      { name: 'Tubo de drenagem', detail: 'O sistema é fechado; observe dobras, compressões e fluxo.' },
      { name: 'Bolsa coletora', detail: 'Permite acompanhar o volume e as características da urina no período registrado.' },
    ],
    attention: 'Preserve o sistema fechado e a posição orientada pelo protocolo. Ausência de drenagem, vazamento, desconexão e desconforto exigem comunicação.',
    source: caderno(23),
  },
  {
    moduleId: 'dispositivos', topicTitle: 'Sonda nasoenteral', kind: 'enteral',
    description: 'Sonda em detalhe externo, sem mostrar trajeto anatômico ou técnica para verificar o posicionamento.',
    parts: [
      { name: 'Conector da via enteral', detail: 'A identificação deve permitir reconhecer a finalidade da sonda.' },
      { name: 'Segmento externo e marca', detail: 'A mudança da marca externa precisa ser comunicada para avaliação.' },
      { name: 'Fixação', detail: 'Observe integridade, pele e sinais de deslocamento durante os cuidados.' },
    ],
    attention: 'Fixação ou aparência externa não confirmam posição nem liberação. Diante de dúvida ou suspeita de deslocamento, esclareça com o enfermeiro antes do uso.',
    source: caderno(25),
  },
  {
    moduleId: 'dispositivos', topicTitle: 'Tubo orotraqueal', kind: 'tube',
    description: 'Tubo e elementos externos em um desenho isolado. Não mostra profundidade, inserção ou técnica de manipulação.',
    parts: [
      { name: 'Conector', detail: 'Região do dispositivo que se relaciona ao circuito do suporte ventilatório.' },
      { name: 'Tubo', detail: 'Dispositivo de via aérea cuja identificação e posição devem ser conferidas pela equipe.' },
      { name: 'Fixação externa', detail: 'Deve ser protegida de tração durante higiene e mobilização.' },
    ],
    attention: 'Comunique deslocamento, desconexão ou falha imediatamente. Não reposicione o tubo nem manipule o balonete sem atribuição e orientação.',
    source: caderno(8),
  },
  {
    moduleId: 'dispositivos', topicTitle: 'Traqueostomia', kind: 'tracheostomy',
    description: 'Vista isolada de uma cânula de traqueostomia e sua fixação, sem anatomia ou representação da técnica de troca.',
    parts: [
      { name: 'Cânula', detail: 'Componente da via aérea; modelos e características precisam ser confirmados pela identificação.' },
      { name: 'Flange', detail: 'Parte externa de apoio da cânula, em contato com a região ao redor do estoma.' },
      { name: 'Fixação', detail: 'Observe integridade, pele e estabilidade conforme o plano de cuidados.' },
    ],
    attention: 'Deslocamento ou suspeita de obstrução exigem resposta imediata da equipe. O desenho não orienta troca de cânula ou procedimentos de via aérea.',
    source: caderno(8),
  },
  {
    moduleId: 'dispositivos', topicTitle: 'Cateteres de oxigenoterapia', kind: 'interfaces',
    description: 'Duas interfaces alternativas: cânula nasal e máscara. Estão separadas no desenho e não representam uma montagem conjunta.',
    parts: [
      { name: 'Cânula nasal', detail: 'Interface com prongas nasais; observe conforto e pontos de contato com a pele.' },
      { name: 'Máscara', detail: 'Outra interface de oxigenoterapia, com indicações e limitações próprias.' },
      { name: 'Extensão', detail: 'Tubulação da interface; observe integridade e conexões conforme orientação.' },
    ],
    attention: 'Confira a interface prescrita e comunique desconforto ou desconexão. As interfaces não são intercambiáveis por iniciativa do estudante.',
    source: caderno(8),
  },
];
