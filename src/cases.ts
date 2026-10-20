export type CaseSubject = 'Equipamentos' | 'Dispositivos' | 'Comunicação' | 'Registros' | 'Escalas';

export type CaseStep = {
  id: string;
  situation: string;
  question: string;
  options: { text: string; feedback: string }[];
  answer: number;
};

export type StudyCase = {
  id: string;
  title: string;
  subject: CaseSubject;
  summary: string;
  goal: string;
  steps: CaseStep[];
  discussion: string;
  relatedModule: { label: string; href: string };
  sources: { label: string; href: string }[];
};

const caderno = (page: number) => ({
  label: `Caderno CTI Adulto — página ${page}`,
  href: `/materiais/caderno-cti-adulto-digital.pdf#page=${page}`,
});

/** Situações fictícias criadas a partir dos materiais do projeto; revisão clínica pendente. */
export const caseStudies: StudyCase[] = [
  {
    id: 'alarme-na-mobilizacao',
    title: 'Um alarme durante a mobilização',
    subject: 'Equipamentos',
    summary: 'Um alarme surge durante um cuidado acompanhado pela equipe. O foco é observar e comunicar.',
    goal: 'Reconhecer que o alarme exige atenção ao paciente e avaliação da equipe responsável.',
    steps: [
      {
        id: 'reconhecer-alarme',
        situation: 'Situação fictícia: durante uma mobilização acompanhada pelo preceptor, o ventilador começa a alarmar. Você ainda não sabe a causa.',
        question: 'Qual atitude deve orientar sua participação?',
        options: [
          { text: 'Silenciar o alarme e terminar o cuidado antes de avisar.', feedback: 'Silenciar sem avaliar a causa pode atrasar o reconhecimento de uma falha. O alarme precisa ser comunicado e o paciente observado.' },
          { text: 'Observar o paciente e avisar imediatamente a equipe responsável.', feedback: 'Essa é a atitude esperada nesta situação. A equipe precisa avaliar o paciente e a causa do alarme; o estagiário participa com supervisão.' },
          { text: 'Mudar os parâmetros até o alarme desaparecer.', feedback: 'Fazer o alarme desaparecer não demonstra que o problema foi resolvido. A alteração de parâmetros não cabe ao estagiário por iniciativa própria.' },
          { text: 'Esperar que outro estudante reconheça o equipamento.', feedback: 'Esperar pode atrasar a ajuda. Acione a equipe responsável e descreva o que observou, sem depender de outro estudante para decidir.' },
        ],
        answer: 1,
      },
      {
        id: 'comunicar-alarme',
        situation: 'Na continuação simulada, o preceptor assume a avaliação. Você foi orientado a comunicar o que presenciou, sem fazer um diagnóstico.',
        question: 'Qual comunicação é mais útil?',
        options: [
          { text: '“O ventilador está quebrado, tenho certeza.”', feedback: 'A causa ainda não foi estabelecida. Atribuir um diagnóstico ao equipamento pode desviar a avaliação dos achados reais.' },
          { text: '“Foi só um alarme, então não houve problema.”', feedback: 'A presença de um alarme não permite concluir que nada ocorreu. Descreva o momento, o cuidado em andamento e os achados observados.' },
          { text: '“O alarme começou durante a mobilização; precisamos avaliar o paciente e o circuito.”', feedback: 'A mensagem informa o contexto e pede avaliação, sem afirmar uma causa não confirmada. Acrescente somente os achados que realmente observou.' },
          { text: '“Depois conto na passagem de plantão.”', feedback: 'A passagem de plantão não substitui a comunicação imediata de uma mudança durante o cuidado. Primeiro solicite a avaliação necessária.' },
        ],
        answer: 2,
      },
    ],
    discussion: 'Converse com o preceptor: como pedir ajuda no setor e quais observações você pode realizar dentro de sua competência? Reveja o cuidado ao paciente antes de interpretar apenas a tela do equipamento.',
    relatedModule: { label: 'Revisar equipamentos hospitalares', href: '#equipamentos' },
    sources: [caderno(8)],
  },
  {
    id: 'duvida-sobre-sonda',
    title: 'A sonda está liberada para uso?',
    subject: 'Dispositivos',
    summary: 'Há uma dúvida sobre a liberação da sonda para a dieta. O caso trabalha verificação e comunicação.',
    goal: 'Distinguir presença e fixação do dispositivo de confirmação e liberação para o uso prescrito.',
    steps: [
      {
        id: 'esclarecer-liberacao',
        situation: 'Situação fictícia: antes de uma dieta prescrita, você não consegue confirmar se a sonda nasoenteral está liberada para uso.',
        question: 'O que fazer diante dessa dúvida?',
        options: [
          { text: 'Não iniciar a administração e esclarecer a liberação com o enfermeiro.', feedback: 'Essa é a atitude esperada. A dúvida precisa ser esclarecida antes do uso, seguindo o processo de confirmação e liberação adotado pelo serviço.' },
          { text: 'Iniciar uma pequena quantidade para testar a sonda.', feedback: 'Administrar para testar não confirma posicionamento seguro. Esclareça a liberação e o método de confirmação antes de iniciar o cuidado.' },
          { text: 'Usar porque a sonda parece bem fixada.', feedback: 'A fixação externa, sozinha, não comprova posicionamento nem liberação. A conferência precisa seguir o processo institucional.' },
          { text: 'Seguir a opinião de um colega que também está começando.', feedback: 'A dúvida sobre liberação exige orientação do profissional responsável e verificação no processo autorizado, não apenas a opinião de outro estudante.' },
        ],
        answer: 0,
      },
      {
        id: 'registrar-interrupcao',
        situation: 'Na continuação simulada, o enfermeiro orientou aguardar a avaliação antes de iniciar a dieta.',
        question: 'Como essa ocorrência deve ser tratada no registro autorizado?',
        options: [
          { text: 'Registrar a dieta como administrada porque estava prescrita.', feedback: 'Prescrição não significa execução. O registro deve refletir o cuidado efetivamente realizado e não pode indicar uma administração que não ocorreu.' },
          { text: 'Omitir a ocorrência porque não houve administração.', feedback: 'Uma interrupção ou não início e sua razão podem ser relevantes à continuidade do cuidado. Registre conforme o padrão institucional.' },
          { text: 'Escrever apenas “sonda ruim”, sem explicar.', feedback: 'A expressão é vaga e sugere uma conclusão não verificada. Descreva a dúvida, a comunicação e a orientação recebida de maneira objetiva.' },
          { text: 'Registrar o não início, o motivo e a comunicação e orientação recebidas.', feedback: 'Essa é a descrição esperada nesta situação. Acrescente horário e identificação dos envolvidos conforme o sistema e as regras do serviço.' },
        ],
        answer: 3,
      },
    ],
    discussion: 'Pergunte ao preceptor onde conferir a liberação de uso e como registrar a dieta não iniciada. O exercício não ensina um método de confirmação de posição nem autoriza usar o dispositivo.',
    relatedModule: { label: 'Revisar dispositivos', href: '#dispositivos' },
    sources: [caderno(25), caderno(38)],
  },
  {
    id: 'comunicacao-de-mudanca',
    title: 'Uma mudança precisa ser comunicada',
    subject: 'Comunicação',
    summary: 'Organize uma comunicação de ajuda e preserve uma pendência na passagem de plantão.',
    goal: 'Comunicar achados e contexto sem aguardar o registro ou presumir que a outra pessoa já sabe.',
    steps: [
      {
        id: 'pedir-avaliacao',
        situation: 'Situação fictícia: você percebe uma mudança em relação à observação anterior durante um cuidado supervisionado. O enfermeiro ainda não recebeu essa informação.',
        question: 'Qual mensagem favorece uma avaliação oportuna?',
        options: [
          { text: '“Está diferente; depois vejo se continua.”', feedback: 'Esperar sem comunicar pode atrasar a avaliação. Descreva a mudança percebida e peça ajuda pelo fluxo do setor, sem presumir que ela vai passar.' },
          { text: '“Observei esta mudança em relação à avaliação anterior; preciso de sua avaliação.”', feedback: 'A mensagem apresenta a mudança e solicita avaliação. Complemente com contexto, horários e achados objetivos, sem atrasar a chamada para terminar um registro.' },
          { text: '“Já sei a causa; vou alterar o tratamento.”', feedback: 'Uma mudança observada não autoriza concluir a causa ou alterar o tratamento. O estudante deve comunicar e seguir a orientação do profissional responsável.' },
          { text: '“Vou mandar uma foto do prontuário para alguém conferir.”', feedback: 'Fotos e compartilhamento em canais não autorizados comprometem o sigilo. Use o fluxo de comunicação assistencial autorizado pelo serviço.' },
        ],
        answer: 1,
      },
      {
        id: 'transferir-pendencia',
        situation: 'Na continuação simulada, a equipe foi avisada e deixou uma reavaliação como pendência. O plantão está terminando.',
        question: 'O que deve ser transmitido à equipe que recebe o plantão?',
        options: [
          { text: 'Somente que “o plantão foi tranquilo”.', feedback: 'Uma descrição genérica omite a mudança e a pendência. A continuidade do cuidado depende de informações específicas e verificáveis.' },
          { text: 'Uma hipótese pessoal como se fosse um diagnóstico confirmado.', feedback: 'Separe os achados observados das hipóteses. Apresente o contexto e a avaliação pendente sem atribuir uma confirmação que não existe.' },
          { text: 'A mudança, o que foi comunicado e feito e qual reavaliação permanece pendente.', feedback: 'Esses elementos ajudam a dar continuidade ao cuidado. Confirme dúvidas com quem recebe o plantão e use o instrumento institucional.' },
          { text: 'Nada, porque a equipe seguinte pode descobrir no prontuário.', feedback: 'O prontuário não substitui uma passagem de plantão clara. Pendências precisam ser comunicadas pelo fluxo previsto, preservando o sigilo.' },
        ],
        answer: 2,
      },
    ],
    discussion: 'Com o preceptor, adapte uma comunicação fictícia ao roteiro SBAR: situação, contexto, dados observados e ajuda necessária. Descubra o canal local e o que fazer se a ajuda não chegar.',
    relatedModule: { label: 'Revisar rotinas e passagem de plantão', href: '#rotinas' },
    sources: [caderno(39), caderno(38)],
  },
  {
    id: 'registro-do-cuidado',
    title: 'Uma anotação que conta o que aconteceu',
    subject: 'Registros',
    summary: 'Escolha uma descrição objetiva e lide com um volume que não pôde ser medido.',
    goal: 'Distinguir observações e ações realizadas de expressões vagas ou informações presumidas.',
    steps: [
      {
        id: 'descrever-cuidado',
        situation: 'Situação fictícia: durante uma higiene supervisionada, houve desconforto. A equipe foi informada e ajustou a posição conforme orientação.',
        question: 'Qual princípio orienta a anotação desse cuidado?',
        options: [
          { text: 'Registrar “banho feito, tudo normal”, para ser breve.', feedback: 'A expressão omite o desconforto e as ações. Brevidade não deve eliminar informações necessárias à compreensão do cuidado.' },
          { text: 'Copiar a anotação anterior e mudar o horário.', feedback: 'A anotação deve corresponder à observação e ao cuidado daquele momento. Copiar sem avaliar pode perpetuar informações incorretas.' },
          { text: 'Incluir detalhes que você não observou para deixar o relato completo.', feedback: 'Completar lacunas com suposições compromete o registro. Descreva o que observou, fez e comunicou, sem inventar achados.' },
          { text: 'Descrever horário, achados, cuidado, comunicação e resposta observada.', feedback: 'Esses elementos tornam o cuidado rastreável. Use o padrão institucional e registre apenas o que foi observado ou efetivamente realizado.' },
        ],
        answer: 3,
      },
      {
        id: 'volume-nao-medido',
        situation: 'Na continuação simulada, uma eliminação ocorreu, mas o volume não pôde ser medido.',
        question: 'Como lidar com essa informação?',
        options: [
          { text: 'Informar a ocorrência e que o volume não foi medido, conforme o padrão local.', feedback: 'Essa descrição preserva o que se sabe e o que não foi medido. Comunique a situação ao responsável quando pertinente e siga o padrão de registro.' },
          { text: 'Repetir o volume do período anterior.', feedback: 'Um volume anterior não representa uma nova medição. Reutilizá-lo cria um dado que não foi obtido.' },
          { text: 'Estimar e registrar como se o volume tivesse sido medido.', feedback: 'Uma estimativa não pode aparecer como uma medição real. Registre a limitação com clareza, seguindo as regras do serviço.' },
          { text: 'Omitir a eliminação para evitar um campo incompleto.', feedback: 'A omissão esconde uma ocorrência relevante. Informe que houve eliminação e a impossibilidade de mensurar, sem inventar o volume.' },
        ],
        answer: 0,
      },
    ],
    discussion: 'Compare com o preceptor uma anotação fictícia vaga e outra objetiva. Quais dados permitem entender o evento sem acrescentar julgamentos? Não insira informações de pacientes neste aplicativo.',
    relatedModule: { label: 'Revisar anotações de enfermagem', href: '#registros' },
    sources: [caderno(38), caderno(24)],
  },
  {
    id: 'escolha-e-limites-das-escalas',
    title: 'Qual informação cada escala oferece?',
    subject: 'Escalas',
    summary: 'Diferencie relato de dor, comportamento observado e nível de despertar.',
    goal: 'Reconhecer o autorrelato e os limites da observação, sem converter uma escala em outra.',
    steps: [
      {
        id: 'valorizar-autorrelato',
        situation: 'Situação fictícia: uma pessoa intubada compreende a orientação e consegue indicar sua experiência por uma comunicação acessível.',
        question: 'Qual princípio deve orientar a escolha do instrumento de dor com o enfermeiro?',
        options: [
          { text: 'Usar PAINAD em toda pessoa intubada.', feedback: 'A PAINAD tem um perfil de uso específico, descrito no caderno para demência avançada sem autorrelato confiável. A intubação não determina essa escolha.' },
          { text: 'Concluir ausência de dor porque a pessoa está quieta.', feedback: 'Imobilidade não comprova ausência de dor. É necessário considerar a comunicação possível, o contexto e o instrumento adequado.' },
          { text: 'Tentar o autorrelato confiável e escolher um instrumento adequado ao perfil.', feedback: 'Esse é o princípio descrito no caderno. A intubação, por si só, não impede autorrelato; confirme a comunicação e o instrumento com o enfermeiro.' },
          { text: 'Definir a dor apenas pela frequência cardíaca no monitor.', feedback: 'Sinais vitais isolados não medem a experiência da dor. A avaliação precisa considerar o autorrelato quando possível e instrumentos apropriados.' },
        ],
        answer: 2,
      },
      {
        id: 'distinguir-sedacao-dor',
        situation: 'Na continuação simulada, durante a discussão de outro exemplo, alguém afirma que uma pessoa sem movimentos não sente dor porque está sedada.',
        question: 'Qual resposta ajuda a revisar essa conclusão?',
        options: [
          { text: '“Sedação sempre elimina a necessidade de avaliar a dor.”', feedback: 'Sedação e analgesia não são equivalentes. A ausência de movimentos não dispensa considerar dor e limitações da avaliação.' },
          { text: '“A ausência de movimentos pode limitar a observação; RASS e escalas de dor avaliam aspectos diferentes.”', feedback: 'Essa distinção está nos materiais. Registre as limitações e discuta a avaliação com o enfermeiro; não converta RASS em uma medida de dor.' },
          { text: '“Basta transformar o valor da RASS em uma nota de dor.”', feedback: 'A RASS descreve agitação e despertar, não intensidade da dor. Seus níveis não devem ser convertidos em um escore de autorrelato.' },
          { text: '“O estudante deve suspender a sedação para testar.”', feedback: 'O exercício não autoriza suspender ou ajustar sedação. A avaliação deve seguir a orientação responsável, o treinamento e o instrumento do serviço.' },
        ],
        answer: 1,
      },
    ],
    discussion: 'Discuta com o preceptor quais formas de comunicação estão disponíveis e o que pode impedir observar uma resposta. Reveja as diferenças entre EVA, BPS, PAINAD e RASS, sem classificar pacientes com este exercício.',
    relatedModule: { label: 'Revisar escalas clínicas', href: '#escalas' },
    sources: [caderno(10), caderno(15), caderno(18)],
  },
];

export const caseSearchText = [
  'casos simulados fictícios PBL aprendizagem baseada em problemas',
  ...caseStudies.flatMap(item => [
    item.title, item.subject, item.summary, item.goal, item.discussion,
    ...item.steps.flatMap(step => [step.situation, step.question, ...step.options.flatMap(option => [option.text, option.feedback])]),
  ]),
].join(' ');
