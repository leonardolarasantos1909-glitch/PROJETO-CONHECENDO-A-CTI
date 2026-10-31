export type MedicationCase = {
  id: string; title: string; medicationIds: string[]; appliesToAll?: boolean;
  scenario: string; question: string; options: { text: string; feedback: string }[]; answer: number;
};
export const medicationCases: MedicationCase[] = [
  { id: 'apresentacao-prescrita', title: 'O mesmo nome não garante a mesma apresentação', medicationIds: [], appliesToAll: true,
    scenario: 'Cenário fictício: ao conferir um medicamento prescrito, a pessoa em treinamento encontra uma embalagem com o mesmo princípio ativo, mas apresentação e via diferentes das que constam na prescrição.',
    question: 'Qual atitude favorece a segurança antes da administração?', answer: 1,
    options: [
      { text: 'Usar o produto porque o princípio ativo é o mesmo.', feedback: 'O princípio ativo não torna apresentações, sais, concentrações ou vias intercambiáveis. A coincidência do nome não resolve a divergência.' },
      { text: 'Conferir a prescrição e a embalagem com o enfermeiro e esclarecer a divergência pelos canais autorizados antes de administrar.', feedback: 'A identificação do produto e da via precisa corresponder à prescrição e à bula da apresentação, com supervisão e procedimentos institucionais. A ficha educativa não autoriza substituição nem preparo.' },
      { text: 'Escolher outra via disponível e registrar a mudança depois.', feedback: 'A via não pode ser escolhida pelo aplicativo nem alterada por iniciativa própria. O esclarecimento com o enfermeiro e os responsáveis precede a administração.' },
    ],
  },
  { id: 'alarme-vasoativo', title: 'Alarme durante uma infusão prescrita', medicationIds: ['noradrenalina', 'adrenalina', 'dobutamina', 'dopamina', 'vasopressina'],
    scenario: 'Cenário fictício: durante o acompanhamento de uma infusão vasoativa já prescrita e instalada pela equipe, a bomba apresenta um alarme e a pessoa assistida passa a demonstrar piora da perfusão.',
    question: 'Qual é a prioridade da pessoa em treinamento?', answer: 0,
    options: [
      { text: 'Observar a pessoa, comunicar imediatamente o alarme e a mudança ao enfermeiro e seguir o fluxo de ajuda do setor.', feedback: 'A associação entre alarme e deterioração exige avaliação imediata. Relate o que observou, ajude dentro da sua atribuição e treinamento e registre após priorizar a comunicação. O exercício não ensina programação ou correção da bomba.' },
      { text: 'Aumentar a velocidade para compensar a piora.', feedback: 'O aplicativo não define velocidades e a pessoa em treinamento não ajusta vasoativos por iniciativa própria. O tratamento precisa da equipe habilitada, da prescrição e dos protocolos aplicáveis.' },
      { text: 'Silenciar o alarme e esperar o próximo horário de sinais vitais.', feedback: 'Um alarme associado a piora clínica não deve aguardar o próximo horário. A avaliação do paciente e a comunicação são imediatas.' },
    ],
  },
  { id: 'sangramento-anticoagulante', title: 'Uma alteração durante o uso de anticoagulante', medicationIds: ['heparina-nao-fracionada', 'enoxaparina', 'varfarina', 'rivaroxabana'],
    scenario: 'Cenário fictício: uma pessoa com anticoagulação prescrita apresenta sangramento novo e tontura durante o cuidado. O técnico percebe a mudança e está acompanhado pelo preceptor.',
    question: 'Como responder sem tomar uma decisão terapêutica autônoma?', answer: 2,
    options: [
      { text: 'Concluir que o tratamento está incorreto e decidir sua substituição.', feedback: 'A observação é importante, mas não autoriza atribuir a causa nem substituir tratamento. A decisão compete aos profissionais responsáveis.' },
      { text: 'Registrar somente a palavra “sangramento” para a passagem de plantão.', feedback: 'Sangramento com sintomas precisa de avaliação imediata. O registro posterior deve descrever local, início, observações e comunicação, sem inventar volumes ou resultados.' },
      { text: 'Solicitar avaliação imediata do enfermeiro, relatar o sangramento e os sintomas e seguir o fluxo de emergência quando necessário.', feedback: 'Priorize segurança e comunicação. Informe horários e achados objetivos, auxilie o cuidado orientado e registre o ocorrido. Não escolha suspensão, antídoto, dose ou reinício pelo aplicativo.' },
    ],
  },
  { id: 'observacao-insulina', title: 'Mudança de comportamento no acompanhamento da glicemia', medicationIds: ['insulina-humana-regular', 'insulina-glargina'],
    scenario: 'Cenário fictício: uma pessoa com insulina prescrita passa a apresentar suor frio, tremor e comportamento diferente do observado no início do cuidado.',
    question: 'O que fazer com essas observações?', answer: 1,
    options: [
      { text: 'Usar uma regra de correção escolhida na internet.', feedback: 'Não há regra de dose, correção ou ajuste neste guia. Regras externas não substituem prescrição nem protocolo autorizado.' },
      { text: 'Comunicar imediatamente ao enfermeiro, acompanhar a pessoa e realizar verificações previstas na prescrição ou no protocolo dentro da própria competência.', feedback: 'Esses sinais exigem avaliação e podem ter diferentes causas. Acompanhe os achados e a glicemia quando prevista, sem aguardar a leitura do aplicativo ou definir um tratamento por conta própria. Siga a orientação profissional e o fluxo de emergência aplicável.' },
      { text: 'Considerar a observação suficiente para confirmar o diagnóstico e alterar a próxima dose.', feedback: 'Os sinais não autorizam confirmação diagnóstica ou mudança de dose. Relate a alteração e os dados obtidos à equipe responsável.' },
    ],
  },
  { id: 'reacao-antimicrobiano', title: 'Sintomas novos durante tratamento prescrito', medicationIds: ['ceftriaxona', 'cefepima', 'meropenem', 'vancomicina', 'linezolida', 'metronidazol', 'fluconazol', 'aciclovir'],
    scenario: 'Cenário fictício: durante o acompanhamento de um antimicrobiano prescrito, surgem lesões de pele, desconforto respiratório e mal-estar que não estavam presentes antes.',
    question: 'Como priorizar uma resposta segura?', answer: 0,
    options: [
      { text: 'Pedir avaliação imediata do enfermeiro e acionar ajuda conforme o fluxo institucional, descrevendo o medicamento em uso, o início e os sintomas observados.', feedback: 'A alteração respiratória com sintomas novos pode representar uma emergência. Priorize comunicação e assistência sob coordenação da equipe; não espere concluir o registro. Não atribua automaticamente a causa nem selecione antídotos ou alterações da terapia pelo guia.' },
      { text: 'Consultar uma tabela de compatibilidade e corrigir o preparo sozinho.', feedback: 'O guia não contém tabelas de compatibilidade ou instruções de preparo. Uma possível emergência precisa de avaliação imediata e não de tentativa autônoma de correção.' },
      { text: 'Esperar o fim da administração para relatar.', feedback: 'Sinais novos com dificuldade respiratória exigem comunicação imediata. O fluxo autorizado orienta a assistência e a decisão sobre o tratamento.' },
    ],
  },
];
export const medicationCaseHref = (id: string) => `#medicamentos/casos?caso=${id}`;
export function getMedicationCases(medicationId?: string) {
  return medicationId ? medicationCases.filter(item => item.appliesToAll || item.medicationIds.includes(medicationId)) : medicationCases;
}
