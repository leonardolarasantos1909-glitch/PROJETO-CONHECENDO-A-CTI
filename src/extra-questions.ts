export type ExtraQuestion = {
  subject: string;
  text: string;
  options: [string, string, string, string];
  answer: number;
  explanation: string;
};

/** Educational additions based on the project's existing modules and caderno. */
export const extraQuestions: ExtraQuestion[] = [
  {
    subject: 'Segurança',
    text: 'Antes de iniciar um cuidado, como deve ser confirmada a identificação da pessoa?',
    options: [
      'Conferindo a identificação conforme o protocolo institucional.',
      'Usando somente o número do leito indicado na passagem de plantão.',
      'Reconhecendo a pessoa pela aparência e pelos equipamentos presentes.',
      'Considerando suficiente que outro estudante confirme o leito.',
    ],
    answer: 0,
    explanation: 'A identificação deve seguir a conferência prevista pelo serviço. Leito, aparência ou reconhecimento informal não substituem esse processo antes do cuidado.',
  },
  {
    subject: 'Segurança',
    text: 'O que orienta a escolha dos EPIs durante as atividades no setor?',
    options: [
      'A preferência pessoal por um equipamento mais confortável.',
      'O uso do mesmo conjunto de EPIs em todas as situações.',
      'A exposição prevista e as precauções orientadas pelo serviço.',
      'A escolha de outro estudante, sem conferir a orientação local.',
    ],
    answer: 2,
    explanation: 'Os EPIs e as medidas adicionais dependem da exposição e das precauções aplicáveis. O preceptor deve apresentar como reconhecer e seguir essas orientações no serviço.',
  },
  {
    subject: 'Segurança',
    text: 'Ao terminar um cuidado no box, qual conferência favorece a segurança?',
    options: [
      'Considerar a tarefa encerrada assim que terminar o procedimento principal.',
      'Conferir posição e proteção da pessoa, conexões, linhas sem tração, alarmes e pendências.',
      'Revisar somente o material descartado, deixando as conexões para o próximo turno.',
      'Verificar apenas se a tela do monitor continua ligada.',
    ],
    answer: 1,
    explanation: 'O cuidado termina com uma conferência do conjunto: pessoa protegida, dispositivos e conexões preservados, alarmes ativos e informações pertinentes comunicadas. A checagem segue o plano e a orientação da equipe.',
  },
  {
    subject: 'Registros',
    text: 'Por que a expressão “diurese boa” é insuficiente em uma anotação?',
    options: [
      'Porque toda anotação de eliminação precisa usar somente siglas.',
      'Porque descrever a urina é permitido apenas na passagem de plantão.',
      'Porque o registro deve conter somente a interpretação do profissional.',
      'Porque não informa volume medido, período e características observadas.',
    ],
    answer: 3,
    explanation: 'O registro deve apresentar dados observados e medidos, com o período correspondente. “Boa” é uma avaliação vaga e não permite acompanhar a eliminação ao longo do cuidado.',
  },
  {
    subject: 'Registros',
    text: 'Situação fictícia: após a higiene, qual informação ajuda a documentar a resposta ao cuidado?',
    options: [
      'Achados observados, tolerância e resposta da pessoa, além do cuidado realizado.',
      'Somente a frase “higiene completa”, sem outros dados pertinentes.',
      'Uma cópia do registro de higiene feito no turno anterior.',
      'Um julgamento sobre a personalidade da pessoa durante o banho.',
    ],
    answer: 0,
    explanation: 'A anotação deve refletir o cuidado efetivamente realizado e a resposta observada, incluindo achados pertinentes. Copiar outro turno ou usar julgamentos não descreve o que aconteceu.',
  },
  {
    subject: 'Registros',
    text: 'Como devem ser escolhidas as siglas usadas na anotação de enfermagem?',
    options: [
      'Usando abreviações pessoais, desde que reduzam o tempo de escrita.',
      'Adotando as abreviações mais usadas nas conversas de celular.',
      'Utilizando siglas padronizadas e a identificação exigida pelo serviço.',
      'Criando uma sigla nova quando o nome do dispositivo for longo.',
    ],
    answer: 2,
    explanation: 'Siglas padronizadas e identificação adequada ajudam a tornar o registro compreensível e rastreável. Abreviações inventadas podem gerar interpretações diferentes.',
  },
  {
    subject: 'Ética',
    text: 'Qual atitude expressa acolhimento e humanização antes de um cuidado?',
    options: [
      'Iniciar o cuidado e explicar apenas se a pessoa perguntar.',
      'Apresentar-se, explicar o cuidado e preservar a intimidade.',
      'Conversar somente com os colegas, mesmo quando a pessoa consegue participar.',
      'Considerar que a presença de equipamentos dispensa a explicação.',
    ],
    answer: 1,
    explanation: 'Apresentação, explicação e respeito à intimidade fazem parte do cuidado. A condição clínica e os equipamentos não retiram a dignidade nem a necessidade de comunicação adequada.',
  },
  {
    subject: 'Ética',
    text: 'Por quais meios devem circular as informações assistenciais necessárias ao cuidado?',
    options: [
      'Por qualquer grupo de mensagens em que haja profissionais de saúde.',
      'Em conversas no corredor, desde que o nome da pessoa seja omitido.',
      'Em arquivos pessoais do estudante, para facilitar consultas posteriores.',
      'Pelos canais autorizados, com os profissionais que precisam dessas informações.',
    ],
    answer: 3,
    explanation: 'O sigilo exige usar os canais autorizados e compartilhar informações com finalidade assistencial. Omitir apenas o nome não elimina a possibilidade de identificação indireta.',
  },
  {
    subject: 'Escalas',
    text: 'Qual característica distingue a EVA apresentada no aplicativo de uma escala numérica?',
    options: [
      'A intensidade é inferida pela expressão facial do paciente.',
      'O resultado é a soma de comportamentos observados pela equipe.',
      'A própria pessoa marca a dor em uma linha contínua, cuja distância é medida.',
      'A intensidade é definida pela frequência cardíaca exibida no monitor.',
    ],
    answer: 2,
    explanation: 'A EVA descrita no caderno usa uma linha contínua no formulário físico; a pessoa faz a marca e a distância é medida. Pedir apenas um número corresponde a outro formato, e a linha da tela é ilustrativa.',
  },
  {
    subject: 'Escalas',
    text: 'Quais são os três domínios observados na BPS descrita no caderno?',
    options: [
      'Expressão facial, membros superiores e adaptação à ventilação.',
      'Abertura ocular, resposta verbal e resposta motora.',
      'Respiração, consolabilidade e diurese.',
      'Pressão arterial, temperatura e frequência cardíaca.',
    ],
    answer: 0,
    explanation: 'A BPS reúne expressão facial, membros superiores e adaptação à ventilação. Cada domínio tem critérios próprios; sinais vitais não substituem esses itens nem o autorrelato quando ele é confiável.',
  },
  {
    subject: 'Escalas',
    text: 'O que significa reconhecer que BPS 3 é a pontuação mínima da escala?',
    options: [
      'Que o resultado comprova, sozinho, ausência de dor.',
      'Que BPS 3 pode ser registrada automaticamente como EVA zero.',
      'Que a observação do contexto deixa de ser necessária.',
      'Que é o mínimo do instrumento, sem comprovar isoladamente ausência de dor.',
    ],
    answer: 3,
    explanation: 'O caderno ressalta que BPS 3, isoladamente, não comprova ausência de dor. O resultado precisa ser registrado com contexto e achados, sem conversão automática para uma escala de autorrelato.',
  },
  {
    subject: 'Escalas',
    text: 'Para qual perfil a PAINAD é apresentada nos materiais do aplicativo?',
    options: [
      'Qualquer pessoa intubada, independentemente das possibilidades de comunicação.',
      'Pessoa com demência avançada sem autorrelato confiável, após tentar comunicação acessível.',
      'Qualquer pessoa que prefira não responder à pergunta naquele momento.',
      'Pessoa alerta que compreende e consegue comunicar sua própria dor.',
    ],
    answer: 1,
    explanation: 'A PAINAD é apresentada para demência avançada sem autorrelato confiável. A impossibilidade de falar, por si só, não indica o instrumento; sua adequação deve ser confirmada com a equipe.',
  },
  {
    subject: 'Escalas',
    text: 'Qual informação a RASS organiza?',
    options: [
      'O nível de agitação e de despertar, com critérios próprios.',
      'A intensidade da dor relatada pela pessoa em uma linha contínua.',
      'A confirmação isolada de delirium.',
      'O risco de infecção de um dispositivo.',
    ],
    answer: 0,
    explanation: 'A RASS descreve agitação e sedação/despertar. Dor e delirium exigem avaliações próprias; uma classificação na RASS não autoriza o estudante a ajustar medicamentos.',
  },
  {
    subject: 'Dispositivos',
    text: 'Qual definição corresponde ao PICC?',
    options: [
      'Sonda destinada à drenagem de urina em sistema fechado.',
      'Tubo de via aérea introduzido pela boca.',
      'Cateter central inserido por uma veia periférica.',
      'Interface usada exclusivamente para fornecer oxigênio pelo nariz.',
    ],
    answer: 2,
    explanation: 'PICC é um cateter central de inserção periférica. Sua identificação e seus cuidados devem seguir as orientações específicas do serviço; o aspecto externo não basta para confirmar tipo ou posição.',
  },
  {
    subject: 'Dispositivos',
    text: 'Qual princípio orienta a observação de uma sonda vesical de demora?',
    options: [
      'Desconectar o sistema periodicamente para conferir se há urina.',
      'Preservar o sistema fechado e observar fixação, fluxo e integridade.',
      'Considerar suficiente observar a bolsa somente na passagem de plantão.',
      'Interpretar ausência de drenagem como ausência de necessidade de acompanhamento.',
    ],
    answer: 1,
    explanation: 'A SVD exige preservação do sistema fechado e observação de fixação, fluxo e integridade. Desconexões desnecessárias aumentam o risco de infecção; mudanças e desconforto devem ser comunicados.',
  },
  {
    subject: 'Dispositivos',
    text: 'Situação fictícia: o curativo de um acesso venoso está úmido ou solto. Como interpretar esse achado?',
    options: [
      'É suficiente observar apenas se a solução continua correndo.',
      'A fixação do cateter elimina a necessidade de avaliar o curativo.',
      'O aspecto do curativo não interfere na observação do acesso.',
      'O achado precisa de avaliação e cuidado conforme o protocolo, com comunicação à equipe.',
    ],
    answer: 3,
    explanation: 'Curativo úmido, sujo ou solto precisa de avaliação e do cuidado previsto no protocolo. A continuidade da infusão não substitui a observação do sítio, do curativo e das conexões.',
  },
  {
    subject: 'Dispositivos',
    text: 'Durante higiene ou mobilização de uma pessoa com tubo orotraqueal, qual cuidado deve integrar o planejamento?',
    options: [
      'Planejar com a equipe como preservar fixação e conexões e evitar tração.',
      'Considerar que a fixação dispensa observar a posição do dispositivo.',
      'Deixar a conferência das conexões somente para o fim do plantão.',
      'Realizar a movimentação sem apoio porque o tubo já está instalado.',
    ],
    answer: 0,
    explanation: 'A equipe deve planejar o cuidado para preservar fixação e conexões e evitar tração. Deslocamentos e falhas exigem comunicação imediata, sem reposicionar o tubo por iniciativa própria.',
  },
  {
    subject: 'Equipamentos',
    text: 'Por que a qualidade do sinal precisa ser considerada ao observar o monitor multiparamétrico?',
    options: [
      'Porque qualquer alarme confirma, sozinho, um diagnóstico.',
      'Porque artefatos e problemas de sensores podem distorcer a leitura.',
      'Porque a tela substitui a observação da pessoa.',
      'Porque um valor isolado mostra toda a evolução do quadro.',
    ],
    answer: 1,
    explanation: 'Movimento, sensores e qualidade do sinal podem influenciar as leituras. A observação reúne a condição da pessoa, os sinais, as tendências e a avaliação da equipe, sem concluir pelo número isolado.',
  },
  {
    subject: 'Equipamentos',
    text: 'Como reconhecer a solução e a terapia associadas a uma bomba de infusão?',
    options: [
      'Pela posição em que a bomba está colocada no suporte.',
      'Pela aparência da bomba, sem conferir o rótulo.',
      'Pela lembrança do que estava sendo infundido no turno anterior.',
      'Conferindo identificação, prescrição e linha com a equipe responsável.',
    ],
    answer: 3,
    explanation: 'A terapia precisa ser conferida pela identificação e pela prescrição, acompanhando a linha correspondente com a equipe. A posição ou aparência da bomba não identifica o conteúdo administrado.',
  },
  {
    subject: 'Equipamentos',
    text: 'Qual característica identifica o funcionamento geral de uma bomba de seringa?',
    options: [
      'A captação de sinais cardíacos por eletrodos.',
      'A coleta de secreções em um frasco por vácuo.',
      'Um mecanismo que movimenta o êmbolo de uma seringa compatível.',
      'A drenagem de urina para uma bolsa coletora.',
    ],
    answer: 2,
    explanation: 'A bomba de seringa movimenta o êmbolo de uma seringa compatível para controlar a administração. Reconhecer essa finalidade não substitui a capacitação para instalar, manipular ou programar o equipamento.',
  },
  {
    subject: 'Rotinas',
    text: 'O que o balanço hídrico reúne em um período definido?',
    options: [
      'Os volumes de entradas e saídas, com registros e horários correspondentes.',
      'Somente a quantidade de urina observada no fim do plantão.',
      'Somente o volume de soluções que ainda está nas bombas.',
      'Uma descrição geral do estado da pele, sem volumes.',
    ],
    answer: 0,
    explanation: 'O acompanhamento do balanço inclui entradas e saídas efetivamente registradas no período. Seu resultado precisa ser considerado no contexto do cuidado e não define, sozinho, a volemia.',
  },
  {
    subject: 'Rotinas',
    text: 'Situação fictícia: surge uma dúvida na conferência da prescrição antes de administrar um medicamento. Qual é o momento de esclarecê-la?',
    options: [
      'Depois da administração, para não atrasar o registro.',
      'Na próxima passagem de plantão, se não houver queixa.',
      'Antes de administrar, com o enfermeiro responsável.',
      'Somente quando a solução terminar.',
    ],
    answer: 2,
    explanation: 'Dúvidas sobre prescrição, identificação e verificações de segurança devem ser esclarecidas antes da administração. O estudante não deve improvisar ou alterar a prescrição por iniciativa própria.',
  },
  {
    subject: 'Comunicação',
    text: 'Qual conjunto de informações favorece a continuidade do cuidado na passagem de plantão?',
    options: [
      'Somente os procedimentos que já foram concluídos.',
      'Somente as condições observadas na admissão.',
      'Apenas a lista de equipamentos que está no box.',
      'Condições atuais, mudanças, dispositivos, riscos e pendências relevantes.',
    ],
    answer: 3,
    explanation: 'A passagem de plantão organiza informações atuais, eventos, dispositivos, riscos, metas e pendências conforme o instrumento institucional. Dúvidas devem ser esclarecidas, preservando o sigilo.',
  },
  {
    subject: 'Comunicação',
    text: 'Situação fictícia: uma mudança importante exige ajuda imediata. Qual sequência favorece o cuidado?',
    options: [
      'Terminar toda a anotação e só depois avisar a equipe.',
      'Solicitar ajuda pelo fluxo do serviço e registrar os achados e ações pertinentes.',
      'Aguardar a próxima medição antes de comunicar qualquer mudança.',
      'Anotar somente “equipe avisada”, sem identificar o que ocorreu.',
    ],
    answer: 1,
    explanation: 'Em uma situação urgente, não se deve esperar concluir o registro para pedir ajuda. A comunicação segue o fluxo do serviço, e a anotação deve refletir achados, horários, profissional acionado e cuidados efetivamente realizados.',
  },
];

const sourceDetails: { label: string; page?: number; moduleId: string }[] = [
  { label: 'Bem-vindo à CTI — Segurança e primeiro dia; Caderno, página 3', page: 3, moduleId: 'acolhimento' },
  { label: 'Bem-vindo à CTI — Segurança e primeiro dia; Caderno, página 40', page: 40, moduleId: 'acolhimento' },
  { label: 'Rotinas da CTI; Caderno, página 40', page: 40, moduleId: 'rotinas' },
  { label: 'Anotações de enfermagem — Eliminações e balanço; Caderno, página 23', page: 23, moduleId: 'registros' },
  { label: 'Anotações de enfermagem — Higiene, conforto e mobilização; Caderno, página 38', page: 38, moduleId: 'registros' },
  { label: 'Caderno CTI Adulto — Anotação de enfermagem, página 38', page: 38, moduleId: 'registros' },
  { label: 'Bem-vindo à CTI — Ética, sigilo e humanização', moduleId: 'acolhimento' },
  { label: 'Bem-vindo à CTI — Ética, sigilo e humanização', moduleId: 'acolhimento' },
  { label: 'Escalas clínicas — EVA; Caderno, página 10', page: 10, moduleId: 'escalas' },
  { label: 'Escalas clínicas — BPS; Caderno, páginas 11–12', page: 11, moduleId: 'escalas' },
  { label: 'Escalas clínicas — BPS; Caderno, página 11', page: 11, moduleId: 'escalas' },
  { label: 'Escalas clínicas — PAINAD; Caderno, páginas 13–14', page: 13, moduleId: 'escalas' },
  { label: 'Escalas clínicas — RASS; Caderno, páginas 17–18', page: 17, moduleId: 'escalas' },
  { label: 'Dispositivos — PICC; Glossário — PICC; Caderno, página 22', page: 22, moduleId: 'dispositivos' },
  { label: 'Dispositivos — Sonda vesical de demora; Caderno, página 23', page: 23, moduleId: 'dispositivos' },
  { label: 'Dispositivos — Cateter venoso central; Caderno, página 22', page: 22, moduleId: 'dispositivos' },
  { label: 'Dispositivos — Tubo orotraqueal; Caderno, página 8', page: 8, moduleId: 'dispositivos' },
  { label: 'Equipamentos hospitalares — Monitor multiparamétrico; Caderno, páginas 4–5', page: 4, moduleId: 'equipamentos' },
  { label: 'Equipamentos hospitalares — Bomba de infusão; Caderno, página 28', page: 28, moduleId: 'equipamentos' },
  { label: 'Equipamentos hospitalares — Bomba de seringa', moduleId: 'equipamentos' },
  { label: 'Rotinas da CTI — Balanço hídrico e dispositivos; Glossário — BH; Caderno, página 24', page: 24, moduleId: 'rotinas' },
  { label: 'Rotinas da CTI — Administração segura de medicamentos; Caderno, página 28', page: 28, moduleId: 'rotinas' },
  { label: 'Rotinas da CTI — Recebimento e passagem de plantão; Caderno, página 39', page: 39, moduleId: 'rotinas' },
  { label: 'Rotinas da CTI — Alterações clínicas e registros; Caderno, páginas 38–39', page: 39, moduleId: 'rotinas' },
];

/** Source map for editorial review; this is not a claim of clinical validation. */
export const extraQuestionSources = extraQuestions.map((question, index) => ({
  text: question.text,
  ...sourceDetails[index],
}));
