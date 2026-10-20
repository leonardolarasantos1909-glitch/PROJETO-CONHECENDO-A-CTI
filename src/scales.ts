export type ScaleCriteria = {
  intro: string;
  method: string;
  example?: string;
  steps?: { title: string; detail: string }[];
  domains?: {
    id: string;
    title: string;
    page: number;
    levels: { points: number; criterion: string }[];
  }[];
};

export type StudyScale = {
  id: 'eva' | 'bps' | 'painad' | 'rass';
  label: string;
  name: string;
  category: string;
  purpose: string;
  when: string[];
  measures: { title: string; detail: string }[];
  howToRead: string[];
  care: string[];
  criteria: ScaleCriteria;
  range?: { min: string; max: string; label: string };
  levelGuide?: { score: string; label: string; description: string }[];
  references: { id: string; label: string; href: string }[];
  sourcePages: number[];
};

// References and page numbers come from the caderno supplied by the author.
// This is an educational reading guide, not a scoring or treatment tool.
const padis = {
  id: 'padis',
  label: 'Devlin et al. — Diretriz PADIS, 2018. Referência [3] do caderno.',
  href: 'https://sccm.org/clinical-resources/guidelines/guidelines/guidelines-for-the-prevention-and-management-of-pa',
};

export const scales: StudyScale[] = [
  {
    id: 'eva',
    label: 'EVA',
    name: 'Escala Visual Analógica',
    category: 'Dor · autorrelato',
    purpose: 'A EVA permite que a própria pessoa indique a intensidade da sua dor. No formato descrito no caderno, utiliza uma linha contínua de 10 cm, sem números, entre “sem dor” e “pior dor imaginável”.',
    when: [
      'Quando a pessoa compreende a orientação e consegue marcar a linha.',
      'Tente o autorrelato confiável primeiro. A intubação, por si só, não o impede.',
    ],
    measures: [
      { title: 'Intensidade referida pela pessoa', detail: 'A avaliação parte do relato do paciente; o observador não deve escolher a marca por ele.' },
      { title: 'Marca na linha contínua', detail: 'No formulário de tamanho correto, mede-se a distância da extremidade “sem dor” até a marca feita pela pessoa.' },
      { title: 'Contexto da avaliação', detail: 'Registre também local, horário e situação da dor, como repouso ou movimento.' },
    ],
    howToRead: [
      'A linha de 10 cm corresponde a 100 mm. Use o formato e a unidade previstos no formulário adotado pelo serviço.',
      'O caderno exemplifica uma marca a 60 mm em 100 mm como EVA 60/100 mm. Compare reavaliações quando o instrumento continuar adequado.',
      'Pedir que a pessoa escolha um número de 0 a 10 corresponde a uma escala numérica. Isso é diferente da linha contínua da EVA.',
    ],
    care: [
      'A ilustração desta tela não tem comprimento calibrado e não serve para medir a dor do paciente.',
      'Se a pessoa não consegue fornecer um autorrelato confiável, discuta com o enfermeiro um instrumento adequado ao seu perfil.',
      'Não atribua a intensidade da dor com base apenas na expressão facial ou nos sinais vitais.',
    ],
    criteria: {
      "intro": "A EVA usa o autorrelato e a marca feita pela própria pessoa na linha contínua. A expressão facial e os sinais vitais não recebem pontos nesse instrumento.",
      "method": "O resultado é a distância entre a extremidade “sem dor” e a marca. Local, contexto e horário enriquecem o registro, mas não são itens somados.",
      "example": "Exemplo do caderno: marca a 60 mm em uma linha de 100 mm = EVA 60/100 mm.",
      "steps": [
        {
          "title": "Compreender e indicar a própria dor",
          "detail": "A pessoa precisa compreender a orientação e conseguir marcar a linha. Tente uma forma de comunicação acessível."
        },
        {
          "title": "Marcar a linha do formulário",
          "detail": "O formulário descrito no caderno tem uma linha contínua de 10 cm, sem números, entre ausência de dor e a pior dor imaginável."
        },
        {
          "title": "Medir a distância da marca",
          "detail": "Meça a partir da extremidade “sem dor”, em milímetros, com o formulário de tamanho correto. A linha desta tela é somente ilustrativa."
        }
      ]
    },
    range: { min: '0 mm', max: '100 mm', label: 'Linha do formulário físico' },
    references: [
      { id: 'eva-rebec', label: 'ReBEC — RBR-86my7w2: EVA em linha de 10 cm. Referência [7] do caderno.', href: 'https://ensaiosclinicos.gov.br/rg/RBR-86my7w2/1' },
      padis,
    ],
    sourcePages: [10, 16],
  },
  {
    id: 'bps',
    label: 'BPS',
    name: 'Behavioral Pain Scale',
    category: 'Dor · observação',
    purpose: 'A BPS observa comportamentos relacionados à dor. O caderno a descreve para o adulto crítico intubado, sem autorrelato confiável e com respostas comportamentais observáveis.',
    when: [
      'Quando não é possível obter autorrelato confiável e o perfil do paciente corresponde ao instrumento adotado pelo serviço.',
      'A presença de tubo orotraqueal, isoladamente, não determina a escolha da BPS. Verifique as possibilidades de comunicação.',
    ],
    measures: [
      { title: 'Expressão facial', detail: 'Observação de tensão e contração da face conforme os critérios da escala.' },
      { title: 'Membros superiores', detail: 'Observação dos movimentos, da flexão e da retração dos membros superiores.' },
      { title: 'Adaptação à ventilação mecânica', detail: 'Observação da tolerância à ventilação, da tosse e da interação com o ventilador no contexto avaliado.' },
    ],
    howToRead: [
      'São três domínios, de 1 a 4 pontos cada. O total varia de 3 a 12.',
      'BPS 3 é o mínimo; isoladamente, não comprova ausência de dor.',
      'O resultado é um escore comportamental. Não converta BPS 6/12 em EVA 6/10 ou em uma intensidade numérica relatada pelo paciente.',
    ],
    care: [
      'Defina e registre o contexto observado, como repouso ou cuidado, conforme o instrumento e a orientação do serviço.',
      'Sedação profunda, bloqueio neuromuscular e alterações neurológicas podem limitar a observação dos comportamentos.',
      'Tosse e dessincronia também exigem avaliação respiratória. Comunique os achados e não atribua automaticamente toda mudança à dor.',
    ],
    criteria: {
      "intro": "São observados três domínios. Abra cada quadro para consultar os critérios resumidos das páginas 11 e 12 do caderno.",
      "method": "Cada domínio recebe de 1 a 4 pontos; a soma dos três varia de 3 a 12. O mínimo de 3, isoladamente, não comprova ausência de dor.",
      "example": "Exemplo educativo do caderno: face 2 + membros superiores 2 + adaptação à ventilação 2 = BPS 6/12.",
      "domains": [
        {
          "id": "expressao-facial",
          "title": "Expressão facial",
          "page": 11,
          "levels": [
            {
              "points": 1,
              "criterion": "Face sem tensão."
            },
            {
              "points": 2,
              "criterion": "Tensão parcial, como sobrancelhas contraídas."
            },
            {
              "points": 3,
              "criterion": "Tensão de toda a face, como olhos fechados."
            },
            {
              "points": 4,
              "criterion": "Careta com contração acentuada."
            }
          ]
        },
        {
          "id": "membros-superiores",
          "title": "Membros superiores",
          "page": 12,
          "levels": [
            {
              "points": 1,
              "criterion": "Sem movimentação."
            },
            {
              "points": 2,
              "criterion": "Flexão parcial."
            },
            {
              "points": 3,
              "criterion": "Flexão completa de membros e dedos."
            },
            {
              "points": 4,
              "criterion": "Retração contínua; membros contraídos."
            }
          ]
        },
        {
          "id": "adaptacao-ventilacao",
          "title": "Adaptação à ventilação",
          "page": 12,
          "levels": [
            {
              "points": 1,
              "criterion": "Tolera ventilação e movimentos."
            },
            {
              "points": 2,
              "criterion": "Tosse durante os movimentos."
            },
            {
              "points": 3,
              "criterion": "Luta contra o ventilador."
            },
            {
              "points": 4,
              "criterion": "Ventilação não controlável pelo padrão observado."
            }
          ]
        }
      ]
    },
    range: { min: '3', max: '12', label: 'Total dos três domínios' },
    references: [
      { id: 'bps-brasil', label: 'Morete et al. — BPS-Brasil. RBTI, 2014;26:373–378. Referência [4] do caderno.', href: 'https://www.scielo.br/j/rbti/a/pJ5k9VwdGcj9xWCjFn9wdZJ/?lang=pt' },
      padis,
    ],
    sourcePages: [11, 12, 15, 16],
  },
  {
    id: 'painad',
    label: 'PAINAD',
    name: 'Pain Assessment in Advanced Dementia',
    category: 'Dor · demência avançada',
    purpose: 'A PAINAD é um instrumento observacional para avaliação de dor em pessoas com demência avançada quando o autorrelato não é confiável.',
    when: [
      'Nesse perfil específico, depois de tentar comunicação acessível com a pessoa.',
      'Confirme a adequação da versão adotada pelo serviço com o enfermeiro. A impossibilidade de falar, por si só, não define a indicação.',
    ],
    measures: [
      { title: 'Respiração independente da vocalização', detail: 'Observação do padrão e do esforço respiratório.' },
      { title: 'Vocalização negativa', detail: 'Observação de gemidos, choro, gritos ou manifestações vocais de sofrimento.' },
      { title: 'Expressão facial', detail: 'Observação da face conforme os critérios do instrumento.' },
      { title: 'Linguagem corporal', detail: 'Observação de relaxamento, tensão, inquietação, rigidez ou resistência ao cuidado.' },
      { title: 'Consolabilidade', detail: 'Observação da necessidade de consolo e da resposta à voz, ao toque ou à distração.' },
    ],
    howToRead: [
      'São cinco domínios de 0 a 2 pontos. O total varia de 0 a 10.',
      'PAINAD 5/10 não equivale automaticamente a EVA 5/10. A escala é observacional, e não um autorrelato numérico.',
      'Não classifique o total como dor leve, moderada ou intensa copiando faixas de uma escala numérica diferente.',
    ],
    care: [
      'PAINAD não substitui automaticamente BPS ou CPOT no paciente sedado em ventilação mecânica.',
      'Alterações respiratórias, agitação e expressão de sofrimento também podem ter outras causas; comunique e considere o contexto com a equipe.',
      'Use a mesma escala nas reavaliações quando continuar adequada. Se a comunicação ou o perfil mudarem, registre o motivo da nova escolha.',
    ],
    criteria: {
      "intro": "São observados cinco domínios no perfil de demência avançada descrito no caderno. Abra os quadros para consultar os critérios resumidos das páginas 13 e 14.",
      "method": "Cada domínio recebe de 0 a 2 pontos; a soma dos cinco varia de 0 a 10. PAINAD 5/10 não equivale automaticamente a EVA 5/10.",
      "domains": [
        {
          "id": "respiracao",
          "title": "Respiração independente da voz",
          "page": 13,
          "levels": [
            {
              "points": 0,
              "criterion": "Normal."
            },
            {
              "points": 1,
              "criterion": "Dificuldade eventual ou hiperventilação breve."
            },
            {
              "points": 2,
              "criterion": "Difícil e ruidosa; hiperventilação prolongada ou Cheyne-Stokes."
            }
          ]
        },
        {
          "id": "vocalizacao",
          "title": "Vocalização negativa",
          "page": 13,
          "levels": [
            {
              "points": 0,
              "criterion": "Ausente."
            },
            {
              "points": 1,
              "criterion": "Gemido eventual ou fala baixa de desagrado."
            },
            {
              "points": 2,
              "criterion": "Chamados repetidos em sofrimento; gemidos altos, gritos ou choro."
            }
          ]
        },
        {
          "id": "expressao-facial",
          "title": "Expressão facial",
          "page": 14,
          "levels": [
            {
              "points": 0,
              "criterion": "Sorri ou sem expressão."
            },
            {
              "points": 1,
              "criterion": "Tristeza, medo ou sobrancelhas contraídas."
            },
            {
              "points": 2,
              "criterion": "Careta."
            }
          ]
        },
        {
          "id": "linguagem-corporal",
          "title": "Linguagem corporal",
          "page": 14,
          "levels": [
            {
              "points": 0,
              "criterion": "Corpo relaxado."
            },
            {
              "points": 1,
              "criterion": "Tensão, inquietação ou agitação aflita."
            },
            {
              "points": 2,
              "criterion": "Rigidez; punhos fechados; joelhos dobrados; resistência ao cuidado ou agressividade."
            }
          ]
        },
        {
          "id": "consolabilidade",
          "title": "Consolabilidade",
          "page": 14,
          "levels": [
            {
              "points": 0,
              "criterion": "Não precisa de consolo."
            },
            {
              "points": 1,
              "criterion": "Acalma ou se distrai com voz/toque."
            },
            {
              "points": 2,
              "criterion": "Permanece inconsolável."
            }
          ]
        }
      ]
    },
    range: { min: '0', max: '10', label: 'Total dos cinco domínios' },
    references: [
      { id: 'painad-brasil', label: 'Pinto et al. — PAINAD-Brasil. Einstein, 2015;13:14–19. Referência [5] do caderno.', href: 'https://www.scielo.br/j/eins/a/3VW8CfBCDq3TfLHgkPw8ZTJ/?lang=pt' },
    ],
    sourcePages: [10, 13, 14, 16],
  },
  {
    id: 'rass',
    label: 'RASS',
    name: 'Richmond Agitation-Sedation Scale',
    category: 'Agitação e sedação',
    purpose: 'A RASS descreve o nível de agitação e de sedação/despertar. Não é uma escala de dor. Dor e delirium precisam de avaliações próprias.',
    when: [
      'Para descrever e acompanhar agitação e nível de despertar conforme treinamento e o instrumento adotado pelo serviço.',
      'Compare o resultado com a meta individualizada pela equipe. Não existe uma meta de RASS universal para todos os pacientes.',
    ],
    measures: [
      { title: 'Comportamento espontâneo', detail: 'A observação inicial identifica calma, inquietação, agitação ou outras respostas descritas no instrumento.' },
      { title: 'Resposta à voz', detail: 'São consideradas abertura dos olhos e presença e duração do contato visual, conforme os critérios completos da RASS.' },
      { title: 'Resposta ao estímulo físico', detail: 'Etapa prevista para ausência de resposta à voz, conforme treinamento, supervisão e formulário adotado.' },
    ],
    howToRead: [
      'Os níveis positivos descrevem agitação; 0 corresponde a alerta e calmo; os níveis negativos descrevem redução do despertar.',
      'RASS 0 não significa ausência de dor. Um valor positivo, isoladamente, não identifica a causa da agitação.',
      'O quadro abaixo resume os níveis para estudo. A sequência e os critérios completos, inclusive os tempos de contato visual, devem ser conferidos no instrumento adotado.',
    ],
    care: [
      'Registre a resposta observada e as interferências na avaliação. Considere medicamentos e limitações sensoriais ou neurológicas com a equipe.',
      'Não suspenda nem ajuste sedação apenas para testar ou com base no número da escala. Siga a prescrição e a supervisão do enfermeiro.',
      'RASS não diagnostica delirium. Não realize estímulos físicos com base apenas nesta tela educativa.',
    ],
    criteria: {
      "intro": "A avaliação considera o comportamento espontâneo, a resposta à voz, o contato visual e sua duração e, quando previsto no instrumento, a resposta ao estímulo físico.",
      "method": "Os fatores não são somados. O resultado corresponde ao nível de agitação ou despertar observado na sequência de avaliação da RASS.",
      "example": "Exemplo do caderno: contato visual por 5 segundos após a voz corresponde a RASS −2.",
      "steps": [
        {
          "title": "Comportamento espontâneo",
          "detail": "Observe se a pessoa está alerta e calma, inquieta, agitada ou combativa. Os níveis 0 a +4 descrevem esses comportamentos."
        },
        {
          "title": "Resposta à voz",
          "detail": "Considere abertura dos olhos, movimentação, presença de contato visual e duração desse contato. Esses elementos distinguem os níveis −1, −2 e −3 conforme o instrumento."
        },
        {
          "title": "Resposta ao estímulo físico",
          "detail": "Na ausência de resposta à voz, a etapa física prevista distingue resposta presente (−4) de ausente (−5). A técnica exige treinamento e supervisão."
        }
      ]
    },
    range: { min: '−5', max: '+4', label: 'Níveis de despertar e agitação' },
    levelGuide: [
      { score: '+4', label: 'Combativo', description: 'Comportamento violento, com risco imediato.' },
      { score: '+3', label: 'Muito agitado', description: 'Tenta retirar dispositivos ou agride.' },
      { score: '+2', label: 'Agitado', description: 'Movimentos frequentes sem finalidade; luta contra o ventilador.' },
      { score: '+1', label: 'Inquieto', description: 'Ansioso ou inquieto, sem movimento vigoroso ou agressivo.' },
      { score: '0', label: 'Alerta e calmo', description: 'Estado de alerta e calma.' },
      { score: '−1', label: 'Sonolento', description: 'Desperta à voz e mantém contato visual por mais de 10 s, conforme o resumo do caderno.' },
      { score: '−2', label: 'Sedação leve', description: 'Desperta à voz com contato visual por menos de 10 s, conforme o resumo do caderno.' },
      { score: '−3', label: 'Sedação moderada', description: 'Movimenta-se ou abre os olhos à voz, sem contato visual.' },
      { score: '−4', label: 'Sedação profunda', description: 'Não responde à voz; responde ao estímulo físico previsto no instrumento.' },
      { score: '−5', label: 'Não despertável', description: 'Sem resposta à voz nem ao estímulo físico previsto no instrumento.' },
    ],
    references: [
      { id: 'rass-vanderbilt', label: 'Vanderbilt/CIBS — RASS e CAM-ICU: recursos em português. Referência [8] do caderno.', href: 'https://www.icudelirium.org/language-translations/portuguese-brazil' },
      padis,
    ],
    sourcePages: [17, 18],
  },
];

export const scaleComparison = [
  { id: 'eva', label: 'EVA', assesses: 'Intensidade da dor por autorrelato.', population: 'Pessoa que compreende e consegue marcar a linha.', report: 'Marca da própria pessoa em uma linha contínua.' },
  { id: 'bps', label: 'BPS', assesses: 'Comportamentos relacionados à dor.', population: 'Adulto crítico intubado, sem autorrelato confiável, com comportamentos observáveis.', report: 'Face, membros superiores e adaptação à ventilação.' },
  { id: 'painad', label: 'PAINAD', assesses: 'Comportamentos relacionados à dor.', population: 'Pessoa com demência avançada sem autorrelato confiável.', report: 'Respiração, vocalização, face, corpo e consolabilidade.' },
  { id: 'rass', label: 'RASS', assesses: 'Agitação e sedação/despertar, e não a dor.', population: 'Paciente cujo nível de agitação ou despertar precisa ser descrito e acompanhado.', report: 'Comportamento e resposta à voz e aos estímulos previstos no instrumento.' },
];

export const scaleSearchText = scales.flatMap(scale => [
  scale.label, scale.name, scale.category, scale.purpose, ...scale.when,
  ...scale.measures.flatMap(item => [item.title, item.detail]), ...scale.howToRead, ...scale.care,
  scale.criteria.intro, scale.criteria.method, scale.criteria.example ?? '',
  ...(scale.criteria.steps?.flatMap(step => [step.title, step.detail]) ?? []),
  ...(scale.criteria.domains?.flatMap(domain => [domain.title, ...domain.levels.map(level => level.criterion)]) ?? []),
]).join(' ');
