import type { Module } from './content';

/** Educational authoring data. Professional and institutional validation is pending. */
export type FamilySectionId = 'acolhimento' | 'visitante' | 'falas' | 'simulador' | 'material';
export type FamilyReference = { id: string; title: string; href: string; scope: string; lastAccessedAt: string | null; note: string };
export type FamilyGuidance = { id: string; title: string; text: string; example: string; referenceIds: string[] };
export type VisitorGuidance = { id: string; title: string; text: string; attention: string; referenceIds: string[] };
export type CommunicationSituation = { id: string; title: string; recommended: string; avoid: string; explanation: string; referenceIds: string[] };
export type CommunicationCase = {
  id: string;
  title: string;
  situation: string;
  question: string;
  options: [{ text: string; feedback: string }, { text: string; feedback: string }, { text: string; feedback: string }];
  answer: number;
  explanation: string;
  referenceIds: string[];
};

export const familyWelcomeModule: Module = {
  id: 'acolher-familia',
  title: 'Acolher também é cuidar',
  description: 'Aprenda a acolher familiares e promover uma assistência humanizada e segura',
  label: 'Família e humanização',
  topics: [],
};

export const familySections: { id: FamilySectionId; title: string; description: string }[] = [
  { id: 'acolhimento', title: 'Acolhimento familiar', description: 'Apresentação, escuta, empatia, atribuições e privacidade.' },
  { id: 'visitante', title: 'Como orientar o visitante', description: 'Vínculo, conversa, higiene das mãos e participação segura.' },
  { id: 'falas', title: 'O que dizer? O que evitar?', description: 'Oito situações para consultar exemplos e seus limites.' },
  { id: 'simulador', title: 'Simulador de comunicação', description: 'Pratique oito situações fictícias e leia a explicação de cada alternativa.' },
  { id: 'material', title: 'Material para entregar ao familiar', description: 'Conheça, baixe ou imprima o folheto próprio para familiares.' },
];

export const familyGuidance: FamilyGuidance[] = [
  {
    id: 'apresentar-se', title: 'Apresente-se e ofereça ajuda',
    text: 'Cumprimente o visitante de forma respeitosa, diga seu nome e sua função real e pergunte de que orientação ele precisa. Se estiver em estágio, apresente-se como estagiário e indique que atua com supervisão. Não se apresente como profissional de outra categoria.',
    example: '“Olá, meu nome é ___. Sou ___ aqui da CTI. Posso ajudar com alguma orientação?”',
    referenceIds: ['etica-enfermagem', 'comunicacao-familiar'],
  },
  {
    id: 'explicar-funcao', title: 'Explique sua função e seus limites',
    text: 'Explique em linguagem simples como pode ajudar no acolhimento e nos cuidados, de acordo com suas atribuições e a supervisão aplicável. Dúvidas sobre diagnóstico, tratamento ou prognóstico devem ser encaminhadas ao profissional responsável. Não antecipe informações que não recebeu autorização para comunicar.',
    example: '“Posso orientar sobre a visita e chamar a equipe responsável para conversar sobre essa dúvida clínica.”',
    referenceIds: ['etica-enfermagem'],
  },
  {
    id: 'escutar', title: 'Escute antes de responder',
    text: 'Dê espaço para o familiar falar, evite interrupções e palavras técnicas desnecessárias. Confira se compreendeu a preocupação e se sua orientação foi entendida. Respeite diferenças culturais, crenças, preferências e necessidades de comunicação, solicitando os recursos autorizados quando necessário.',
    example: '“Quero entender melhor o que está preocupando você. Pode me contar?”',
    referenceIds: ['comunicacao-familiar', 'etica-enfermagem'],
  },
  {
    id: 'acolher-ansiedade', title: 'Acolha a ansiedade sem prometer resultados',
    text: 'Reconheça que a internação pode trazer medo, choro e incerteza. Ofereça escuta e ajuda dentro de suas possibilidades, respeitando se a pessoa prefere silêncio ou companhia. Evite minimizar sentimentos, comparar situações ou garantir recuperação. Se houver necessidade, solicite apoio à equipe pelos canais do serviço.',
    example: '“Vejo que este momento está sendo difícil. Posso ficar aqui por um momento ou chamar alguém da equipe para ajudar?”',
    referenceIds: ['comunicacao-familiar', 'etica-enfermagem'],
  },
  {
    id: 'encaminhar-duvidas', title: 'Encaminhe dúvidas clínicas com responsabilidade',
    text: 'Ouça a pergunta e reconheça quando ela ultrapassa suas atribuições ou as informações que pode fornecer. Combine o encaminhamento ao enfermeiro ou ao profissional responsável, conforme a organização do setor. Não invente respostas, interpretações dos equipamentos, prazos ou garantias de melhora.',
    example: '“Entendo que você queira essa informação. Vou encaminhar sua pergunta ao profissional responsável, para que ela seja esclarecida adequadamente.”',
    referenceIds: ['etica-enfermagem', 'comunicacao-familiar'],
  },
  {
    id: 'preservar-privacidade', title: 'Preserve privacidade e confidencialidade',
    text: 'Confirme, pelos meios autorizados do serviço, quem pode receber informações. O parentesco, por si só, não dispensa a verificação da autorização e da vontade da pessoa assistida. Evite conversas sobre condições clínicas em corredores ou ao alcance de outros visitantes. Não mostre prontuários, telas ou imagens nem compartilhe dados por canais pessoais.',
    example: '“Para preservar a privacidade, vou confirmar com a equipe como podemos encaminhar essa conversa e quem está autorizado a receber as informações.”',
    referenceIds: ['etica-enfermagem'],
  },
];

export const visitorGuidance: VisitorGuidance[] = [
  {
    id: 'paciente-sedado', title: 'Paciente sedado',
    text: 'Oriente que o familiar pode falar com calma, dizer quem é e compartilhar palavras de afeto, respeitando as condições clínicas, as preferências da pessoa e as orientações da equipe. A presença e a comunicação podem manter o vínculo mesmo quando não há resposta observável.',
    attention: 'Não é possível afirmar, para cada pessoa sedada, que ela necessariamente ouve ou compreende tudo. Não prometa uma resposta. Antes de tocar ou realizar qualquer cuidado, peça orientação à equipe.',
    referenceIds: ['comunicacao-familiar'],
  },
  {
    id: 'assuntos-cotidiano', title: 'Assuntos do cotidiano',
    text: 'Sugira assuntos familiares e de interesse da pessoa, como lembranças agradáveis, acontecimentos cotidianos ou mensagens de afeto. Respeite suas preferências, sua vontade de conversar e a necessidade de descanso. Fale com a pessoa, sem presumir que ela não participa da conversa por estar sem resposta.',
    attention: 'Evite discutir conflitos ou trazer notícias potencialmente perturbadoras sem orientação adequada. Se não souber o que dizer ou se perceber desconforto, peça apoio à equipe.',
    referenceIds: ['comunicacao-familiar'],
  },
  {
    id: 'higiene-maos', title: 'Higienização das mãos',
    text: 'Oriente a higiene das mãos antes e depois do contato com o paciente e conforme as indicações do serviço. Quando estiverem visivelmente sujas ou após usar o banheiro, utilize água e sabonete. A preparação alcoólica é utilizada quando indicada e as mãos não estão visivelmente sujas; friccione conforme a orientação recebida e aguarde secar.',
    attention: 'Mostre onde e como higienizar as mãos. Peça à equipe orientação sobre precauções e EPIs aplicáveis à visita. O uso de luvas não substitui a higiene das mãos.',
    referenceIds: ['higiene-maos'],
  },
  {
    id: 'equipamentos-dispositivos', title: 'Equipamentos e dispositivos',
    text: 'Explique que monitores, bombas, ventiladores, sondas e cateteres fazem parte dos recursos de cuidado. O visitante não deve tocar nos controles, puxar, desconectar ou reposicionar dispositivos. Um alarme pode ter diferentes causas e precisa ser avaliado pela equipe.',
    attention: 'Se algo parecer diferente ou um alarme tocar, chame a equipe. O familiar não deve silenciar alarmes, alterar ajustes ou tentar resolver o problema por conta própria.',
    referenceIds: ['seguranca-visitante'],
  },
  {
    id: 'participacao-segura', title: 'Participação segura da família',
    text: 'Convide o familiar a compartilhar com a equipe informações relevantes sobre hábitos, preferências, necessidades de comunicação e aspectos importantes para a pessoa. Valorize a vontade do próprio paciente quando ele puder expressá-la. A família pode fazer perguntas e comunicar o que percebe sem precisar interpretar sinais ou equipamentos.',
    attention: 'Participar de cuidados diretos depende de autorização, orientação e supervisão, conforme a avaliação da equipe e as normas institucionais. Não convide o visitante a executar procedimentos ou manipular dispositivos com base apenas neste aplicativo.',
    referenceIds: ['comunicacao-familiar', 'seguranca-visitante'],
  },
];

export const communicationSituations: CommunicationSituation[] = [
  {
    id: 'familiar-chorando', title: 'Familiar chorando',
    recommended: '“Vejo que este momento está sendo difícil. Quer me contar o que está preocupando você? Posso ajudar a chamar a equipe.”',
    avoid: '“Não chore, isso não é motivo para tanto. Vai ficar tudo bem.”',
    explanation: 'Acolher é reconhecer a emoção e oferecer escuta e ajuda, sem obrigar a pessoa a falar ou prometer recuperação. Minimizar o sofrimento pode dificultar a confiança e o diálogo.',
    referenceIds: ['comunicacao-familiar', 'etica-enfermagem'],
  },
  {
    id: 'pergunta-prognostico', title: 'Pergunta sobre o prognóstico',
    recommended: '“Entendo sua preocupação com a recuperação. Essa conversa precisa ser feita pelo profissional responsável. Vou ajudar a encaminhar sua pergunta.”',
    avoid: '“Tenho certeza de que vai sair daqui logo; pode ficar tranquilo.”',
    explanation: 'O acolhimento não autoriza prever a evolução ou garantir desfechos. Reconheça a dúvida, respeite as atribuições e encaminhe uma conversa adequada, sem prometer quando ela ocorrerá se isso não estiver combinado.',
    referenceIds: ['etica-enfermagem', 'comunicacao-familiar'],
  },
  {
    id: 'medo-equipamentos', title: 'Medo dos equipamentos',
    recommended: '“Esses recursos ajudam a equipe a acompanhar e cuidar. Posso explicar de forma geral e chamar o responsável para suas dúvidas. Evite tocar nos controles e nas conexões.”',
    avoid: '“É só olhar os números: se estiverem verdes, está tudo normal.”',
    explanation: 'A aparência da tela, a cor ou um valor isolado não permitem concluir como a pessoa está. Ofereça uma explicação simples da finalidade e uma forma de pedir ajuda, sem interpretar o quadro clínico.',
    referenceIds: ['seguranca-visitante', 'comunicacao-familiar'],
  },
  {
    id: 'sedado-consegue-ouvir', title: 'A pessoa sedada consegue ouvir?',
    recommended: '“Não posso garantir o que ela está ouvindo ou compreendendo. Se a equipe orientar, você pode falar com calma, dizer quem é e compartilhar palavras de carinho, sem esperar uma resposta.”',
    avoid: '“Ela ouve e entende tudo, mesmo sem responder.”',
    explanation: 'Ausência de resposta não permite assegurar nem excluir a percepção. Apoie o vínculo de forma respeitosa e compatível com as condições clínicas, sem transformar uma possibilidade em certeza.',
    referenceIds: ['comunicacao-familiar'],
  },
  {
    id: 'monitor-alarme', title: 'Monitor apresentando alarme',
    recommended: '“Vou chamar a equipe para avaliar. Por favor, não toque no aparelho nem tente desligar o alarme.”',
    avoid: '“Isso é normal. Pode apertar esse botão para parar o barulho.”',
    explanation: 'Alarmes exigem atenção e podem ter diferentes causas. O familiar deve chamar a equipe; o profissional age conforme sua competência, supervisão e fluxo local, sem minimizar o alarme ou delegar ajustes ao visitante.',
    referenceIds: ['seguranca-visitante', 'etica-enfermagem'],
  },
  {
    id: 'nao-sabe-conversar', title: 'Não sabe como conversar com o paciente',
    recommended: '“Você pode dizer que está aqui e falar de assuntos de que ele gosta, respeitando sua vontade e o descanso. Não precisa encontrar palavras perfeitas. Se tiver dúvida, podemos pedir orientação à equipe.”',
    avoid: '“Precisa conversar o tempo todo para ele melhorar.”',
    explanation: 'Apoie uma presença possível e respeitosa, sem impor tempo de conversa ou responsabilizar o familiar pela recuperação. Preferências, descanso e orientações da equipe devem orientar a visita.',
    referenceIds: ['comunicacao-familiar'],
  },
  {
    id: 'quer-manipular-dispositivo', title: 'Quer manipular um dispositivo',
    recommended: '“Não mexa nessa sonda ou conexão. Vou chamar a equipe para verificar. Sua ajuda pode ser avisar o que você percebeu.”',
    avoid: '“Pode ajeitar ou reconectar; é só encaixar novamente.”',
    explanation: 'Manipular ou reconectar dispositivos pode causar dano e não deve ser delegado ao visitante. Intervenções precisam de avaliação e atuação da equipe habilitada, conforme as atribuições e o protocolo aplicável.',
    referenceIds: ['seguranca-visitante', 'etica-enfermagem'],
  },
  {
    id: 'informacao-fora-competencia', title: 'Pede informações fora da sua competência',
    recommended: '“Essa informação precisa ser confirmada pelo responsável. Vou encaminhar sua dúvida e respeitar a privacidade da pessoa.”',
    avoid: '“Vou dar uma olhada no prontuário e contar minha interpretação para você.”',
    explanation: 'Não especule sobre informações clínicas, mostre prontuários ou ultrapasse suas atribuições. Confirme a autorização para compartilhar informações e encaminhe a pergunta pelos canais do serviço.',
    referenceIds: ['etica-enfermagem'],
  },
];

/** All situations are fictional. Answers support discussion, not certification. */
export const communicationCases: CommunicationCase[] = [
  {
    id: 'escutar-sem-promessas', title: 'Quando o familiar chora',
    situation: 'Situação fictícia: durante a visita, uma pessoa começa a chorar e diz que tem medo de perder seu familiar. Ela não fez uma pergunta clínica específica.',
    question: 'Qual resposta favorece o acolhimento?',
    options: [
      { text: 'Reconhecer o sofrimento, oferecer escuta e perguntar se ela deseja apoio da equipe.', feedback: 'A resposta acolhe a emoção e oferece ajuda sem exigir que a pessoa pare de chorar ou prometer um resultado clínico.' },
      { text: 'Dizer que ela precisa ser forte e parar de chorar para não atrapalhar a recuperação.', feedback: 'Essa fala minimiza o sofrimento e atribui ao familiar uma responsabilidade indevida pela recuperação. Reconheça a emoção e ofereça apoio.' },
      { text: 'Garantir que tudo ficará bem para tranquilizá-la rapidamente.', feedback: 'Uma promessa de recuperação não pode ser sustentada por esta situação. Acolha a preocupação sem garantir um desfecho.' },
    ],
    answer: 0,
    explanation: 'Escutar, respeitar o tempo da pessoa e oferecer ajuda são ações educativas de acolhimento. A necessidade de apoio adicional e a forma de acioná-lo dependem da equipe e da organização local.',
    referenceIds: ['comunicacao-familiar', 'etica-enfermagem'],
  },
  {
    id: 'encaminhar-prognostico', title: 'Uma pergunta sobre a recuperação',
    situation: 'Situação fictícia: um visitante pergunta ao estagiário se a pessoa internada vai se recuperar e em quantos dias poderá ir para casa. O cenário não fornece avaliação ou previsão da equipe.',
    question: 'Como responder dentro dos limites de sua atuação?',
    options: [
      { text: 'Usar o aspecto do monitor para estimar uma data de alta.', feedback: 'A tela do equipamento não permite prever recuperação ou alta. Não faça estimativas nem interpretações clínicas com base nesta situação.' },
      { text: 'Responder que não sabe e encerrar a conversa sem encaminhamento.', feedback: 'Reconhecer o limite é necessário, mas o acolhimento pode incluir uma forma de encaminhar a dúvida ao profissional responsável.' },
      { text: 'Reconhecer a preocupação e ajudar a encaminhar a pergunta ao profissional responsável.', feedback: 'Essa resposta acolhe a dúvida sem inventar prazos ou prognóstico, respeitando as atribuições e o fluxo autorizado de comunicação.' },
    ],
    answer: 2,
    explanation: 'Acolher e encaminhar não exige adivinhar uma resposta. Informações sobre evolução, tratamento e prognóstico precisam ser comunicadas pelo responsável, com respeito à privacidade e à autorização aplicável.',
    referenceIds: ['etica-enfermagem', 'comunicacao-familiar'],
  },
  {
    id: 'explicar-equipamentos', title: 'Receio diante dos equipamentos',
    situation: 'Situação fictícia: um visitante diz que está assustado com as telas e os aparelhos ao lado do leito. Ele quer entender por que estão ali, sem pedir um diagnóstico.',
    question: 'Qual abordagem educativa é mais adequada?',
    options: [
      { text: 'Ensinar a identificar a gravidade pela cor dos números na tela.', feedback: 'Cor ou número isolado não definem a condição clínica. Essa explicação pode criar falsa segurança e levar a interpretações inadequadas.' },
      { text: 'Explicar a finalidade geral dos recursos e orientar a chamar a equipe, sem tocar nos controles.', feedback: 'Uma explicação simples pode reduzir dúvidas sem atribuir ao visitante a interpretação ou o manejo dos equipamentos.' },
      { text: 'Pedir que ele observe e ajuste os aparelhos para ajudar quando a equipe estiver ocupada.', feedback: 'O visitante não deve ajustar equipamentos. A avaliação e o manejo precisam ser feitos pela equipe habilitada conforme suas atribuições.' },
    ],
    answer: 1,
    explanation: 'Explique somente o que cabe à sua função e ao que foi autorizado. Convide o visitante a comunicar dúvidas e observações, sem deduzir diagnóstico, prognóstico ou segurança pelos aparelhos.',
    referenceIds: ['seguranca-visitante', 'comunicacao-familiar'],
  },
  {
    id: 'conversar-sem-certezas', title: 'Conversar com a pessoa sedada',
    situation: 'Situação fictícia: um familiar pergunta se a pessoa sedada consegue ouvi-lo. Não há informação individual sobre nível de consciência, percepção ou compreensão.',
    question: 'Que orientação respeita o vínculo e a incerteza?',
    options: [
      { text: 'Explicar que não é possível garantir a percepção e orientar uma fala calma e respeitosa conforme a equipe.', feedback: 'A resposta apoia a presença e a comunicação sem afirmar que a pessoa necessariamente ouve, compreende ou responderá.' },
      { text: 'Afirmar que toda pessoa sedada entende tudo o que é dito.', feedback: 'O cenário não permite essa certeza. Sedação e ausência de resposta não autorizam garantir audição ou compreensão individual.' },
      { text: 'Dizer que conversar é inútil enquanto não houver resposta.', feedback: 'Ausência de resposta não permite concluir que a comunicação não tem lugar. Apoie o vínculo sem garantir ou excluir percepção.' },
    ],
    answer: 0,
    explanation: 'Uma comunicação cuidadosa evita certezas não sustentadas. O familiar pode se apresentar e usar palavras de afeto, respeitando preferências, condições clínicas e orientação da equipe.',
    referenceIds: ['comunicacao-familiar'],
  },
  {
    id: 'alarme-e-ajuda', title: 'Um alarme durante a visita',
    situation: 'Situação fictícia: o monitor começa a emitir um alarme. O visitante aponta para um botão e pergunta se pode apertá-lo para interromper o som. A causa do alarme não foi avaliada.',
    question: 'Qual resposta deve orientar a comunicação com o visitante?',
    options: [
      { text: 'Autorizar o visitante a apertar o botão enquanto procura alguém.', feedback: 'O visitante não deve silenciar ou ajustar equipamentos. Isso pode atrasar a avaliação do alarme pela equipe.' },
      { text: 'Dizer que alarmes são sempre normais e que ele pode ignorar.', feedback: 'O alarme pode ter diferentes causas e ainda não foi avaliado. Não minimize a situação nem garanta ausência de problema.' },
      { text: 'Pedir que não toque no aparelho e acionar a equipe para avaliar conforme o fluxo do setor.', feedback: 'A resposta orienta uma ação segura ao visitante e encaminha a avaliação à equipe, sem interpretar a causa ou ensinar ajustes.' },
    ],
    answer: 2,
    explanation: 'O profissional participa conforme suas atribuições, supervisão e fluxo local. O familiar contribui chamando a equipe e descrevendo o que percebeu; não deve tentar corrigir ou silenciar alarmes.',
    referenceIds: ['seguranca-visitante', 'etica-enfermagem'],
  },
  {
    id: 'apoio-para-conversar', title: '“Não sei o que dizer”',
    situation: 'Situação fictícia: durante a visita, um familiar diz que não sabe como conversar e teme falar algo inadequado. O cenário não informa uma restrição específica à comunicação.',
    question: 'Qual sugestão evita pressão e respeita a pessoa?',
    options: [
      { text: 'Exigir que ele converse sem parar para estimular a recuperação.', feedback: 'Não há indicação de que conversar continuamente seja necessário. Evite impor uma tarefa ou responsabilizar o familiar pela evolução.' },
      { text: 'Sugerir palavras simples de presença ou assuntos de interesse, respeitando descanso e orientações da equipe.', feedback: 'A sugestão acolhe a dúvida e oferece possibilidades sem impor uma forma única de presença ou prometer benefício clínico.' },
      { text: 'Orientar a discutir conflitos familiares para fazer a pessoa reagir.', feedback: 'Conversas potencialmente perturbadoras não devem ser usadas para provocar reações. Respeite preferências e peça orientação quando houver dúvida.' },
    ],
    answer: 1,
    explanation: 'Presença, fala e silêncio podem ser respeitados conforme a vontade da pessoa e as condições da visita. A equipe pode ajudar a adequar a comunicação sem criar obrigações ou garantias.',
    referenceIds: ['comunicacao-familiar'],
  },
  {
    id: 'dispositivo-sem-manipulacao', title: 'Uma conexão parece fora do lugar',
    situation: 'Situação fictícia: um visitante percebe algo diferente em uma conexão e se oferece para encaixá-la. O tipo de dispositivo e a causa da alteração não foram identificados.',
    question: 'Qual orientação é segura nesta situação?',
    options: [
      { text: 'Pedir que não manipule a conexão e chamar a equipe para verificar.', feedback: 'A resposta evita uma intervenção sem avaliação. O visitante pode comunicar a observação enquanto a equipe assume a verificação.' },
      { text: 'Ensinar rapidamente como reconectar, pois o familiar está disposto a ajudar.', feedback: 'Disposição para ajudar não substitui avaliação, atribuição ou capacitação. Não delegue reconexões e ajustes de dispositivos ao visitante.' },
      { text: 'Pedir uma foto para avaliar depois, antes de chamar a equipe.', feedback: 'O cenário pede avaliação da equipe, sem adiar a ajuda ou registrar imagens de pacientes e dispositivos para canais pessoais.' },
    ],
    answer: 0,
    explanation: 'Nenhuma técnica de reconexão é indicada por este exercício. O cuidado direto depende da equipe habilitada e dos protocolos aplicáveis; a parceria do familiar inclui observar e pedir ajuda.',
    referenceIds: ['seguranca-visitante', 'etica-enfermagem'],
  },
  {
    id: 'limites-e-confidencialidade', title: 'Uma dúvida clínica fora da sua atuação',
    situation: 'Situação fictícia: um visitante pede ao técnico ou estagiário uma interpretação de resultados que não foram apresentados pela equipe. Não foi confirmada sua autorização para receber informações.',
    question: 'Como acolher a solicitação preservando limites e privacidade?',
    options: [
      { text: 'Mostrar a tela do prontuário para que o visitante faça sua própria interpretação.', feedback: 'Mostrar prontuários ou telas sem autorização compromete a confidencialidade. Também não substitui uma explicação do profissional responsável.' },
      { text: 'Dar uma interpretação pessoal, pois se trata de um familiar interessado.', feedback: 'O parentesco não dispensa a confirmação de autorização e uma opinião pessoal não substitui a comunicação profissional dentro das atribuições.' },
      { text: 'Reconhecer a dúvida, confirmar o encaminhamento autorizado e chamar o responsável para esclarecê-la.', feedback: 'A resposta oferece ajuda sem divulgar dados indevidamente, inventar interpretação ou ultrapassar a competência de quem acolhe.' },
    ],
    answer: 2,
    explanation: 'Acolhimento inclui proteger a vontade e a privacidade da pessoa assistida. A equipe deve verificar quem está autorizado e organizar o esclarecimento conforme as atribuições profissionais.',
    referenceIds: ['etica-enfermagem', 'comunicacao-familiar'],
  },
];

export const localVisitingRule = {
  id: 'visita-cti-cardio',
  unit: 'CTI Cardio',
  reportedRule: 'Um visitante por vez',
  status: 'pending_confirmation',
  note: 'Informação local relatada pelo responsável pelo projeto, ainda sujeita à confirmação institucional. Não é regra universal da CTI nem autorização de visita. Confirme com a equipe as orientações vigentes, exceções e formas de acolhimento; este aplicativo não substitui essa confirmação.',
} as const;

/** Proposed external reading and existing project material; no independent clinical validation is asserted. */
export const familyReferences: FamilyReference[] = [
  {
    id: 'etica-enfermagem',
    title: 'Cofen — Resolução nº 564/2017, Código de Ética dos Profissionais de Enfermagem',
    href: 'https://www.cofen.gov.br/resolucao-cofen-no-5642017/',
    scope: 'Referência normativa proposta para discussão de atribuições, sigilo e privacidade. A equipe revisora deve conferir o texto, sua vigência e a adequação das orientações ao contexto.',
    lastAccessedAt: null,
    note: 'O acesso externo foi bloqueado com HTTP 403 nesta execução; o texto não foi lido ou conferido aqui. O vínculo não comprova revisão clínica, vigência normativa confirmada ou aprovação institucional do módulo.',
  },
  {
    id: 'comunicacao-familiar',
    title: 'NHS — Intensive care',
    href: 'https://www.nhs.uk/conditions/intensive-care/',
    scope: 'Leitura geral proposta sobre cuidados intensivos e orientação às famílias. A equipe precisa conferir a pertinência ao público brasileiro e ao módulo; esta indicação não sustenta uma garantia sobre audição ou compreensão durante sedação.',
    lastAccessedAt: null,
    note: 'O acesso externo foi bloqueado com HTTP 403 nesta execução; a página não foi lida ou conferida aqui. Trata-se de leitura proposta, sem atribuir à fonte apoio textual verificado a cada frase ou validação clínica e institucional.',
  },
  {
    id: 'higiene-maos',
    title: 'OMS — Hand hygiene',
    href: 'https://www.who.int/teams/integrated-health-services/infection-prevention-control/hand-hygiene',
    scope: 'Portal e materiais educativos propostos para conferência das indicações de higiene das mãos. Não substituem a seleção de uma referência específica, a revisão das orientações ao visitante ou os protocolos aplicáveis.',
    lastAccessedAt: null,
    note: 'O acesso externo foi bloqueado com HTTP 403 nesta execução; o portal não foi lido ou conferido aqui. A existência do link não valida cada frase nem representa revisão clínica ou aprovação institucional do material.',
  },
  {
    id: 'seguranca-visitante',
    title: 'Conhecendo a CTI — Equipamentos hospitalares',
    href: '#equipamentos',
    scope: 'Origem educativa reaproveitada do módulo existente e do pedido do responsável: finalidade geral de equipamentos, comunicação de alarmes e prevenção de manipulação indevida. Os materiais relacionados permanecem na biblioteca do projeto.',
    lastAccessedAt: null,
    note: 'Leitura educativa do próprio projeto, com revisão profissional e de referências pendente. Não é protocolo institucional aprovado nem comprovação de vigência. As orientações específicas ao visitante exigem validação pela equipe responsável.',
  },
];

export const familySearchText = [
  familyWelcomeModule.title, familyWelcomeModule.description, 'A família faz parte do cuidado',
  ...familySections.flatMap(item => [item.title, item.description]),
  ...familyGuidance.flatMap(item => [item.title, item.text, item.example]),
  ...visitorGuidance.flatMap(item => [item.title, item.text, item.attention]),
  ...communicationSituations.flatMap(item => [item.title, item.recommended, item.avoid, item.explanation]),
  ...communicationCases.flatMap(item => [item.title, item.situation, item.question, item.explanation, ...item.options.flatMap(option => [option.text, option.feedback])]),
].join(' ');
