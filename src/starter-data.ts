export type FirstDayItem = {
  id: string;
  title: string;
  detail: string;
  href: string;
  sourceLabel: string;
  sourcePage?: number;
};

export type GlossaryTerm = {
  id: string;
  term: string;
  aliases: string[];
  definition: string;
  href: string;
  sourceLabel: string;
  sourcePage?: number;
};

export const firstDayItems: FirstDayItem[] = [
  { id: 'preceptor', title: 'Identificar meu preceptor e enfermeiro supervisor', detail: 'Confirme com quem você vai acompanhar os cuidados e a quem levar dúvidas antes de realizar uma atividade.', href: '#acolhimento', sourceLabel: 'Módulo Bem-vindo à CTI · Equipe multiprofissional' },
  { id: 'equipe', title: 'Conhecer a equipe e os canais de comunicação', detail: 'Peça uma apresentação das funções da equipe e de como contatar os profissionais responsáveis no setor.', href: '#acolhimento', sourceLabel: 'Módulo Bem-vindo à CTI · Equipe multiprofissional' },
  { id: 'materiais', title: 'Localizar os materiais com orientação', detail: 'Faça um reconhecimento acompanhado do setor e pergunte onde ficam os materiais de uso cotidiano e de emergência. A localização depende do serviço.', href: '#acolhimento', sourceLabel: 'Módulo Bem-vindo à CTI · Segurança e primeiro dia' },
  { id: 'maos', title: 'Conhecer os recursos para higiene das mãos', detail: 'Localize os recursos disponíveis e revise com o preceptor quando e como higienizar as mãos, conforme as orientações do serviço.', href: '#acolhimento', sourceLabel: 'Módulo Bem-vindo à CTI; Caderno, p. 40', sourcePage: 40 },
  { id: 'epis', title: 'Conferir EPIs e precauções', detail: 'Pergunte onde encontrar os EPIs e como identificar as precauções e as medidas previstas para cada situação. Confirme as dúvidas com o preceptor.', href: '#acolhimento', sourceLabel: 'Módulo Bem-vindo à CTI; Caderno, p. 40', sourcePage: 40 },
  { id: 'identificacao', title: 'Revisar identificação, privacidade e sigilo', detail: 'Conheça a conferência da identificação e as formas autorizadas de comunicação. Não fotografe pacientes, prontuários ou telas para estudar.', href: '#acolhimento', sourceLabel: 'Módulo Bem-vindo à CTI; Caderno, p. 3', sourcePage: 3 },
  { id: 'plantao', title: 'Entender a organização do plantão', detail: 'Acompanhe como são recebidas as informações, os horários e as pendências. Pergunte quais atividades você pode acompanhar e executar sob supervisão.', href: '#rotinas', sourceLabel: 'Módulo Rotinas da CTI; Caderno, pp. 3 e 39', sourcePage: 39 },
  { id: 'equipamentos', title: 'Reconhecer os equipamentos com o preceptor', detail: 'Identifique os equipamentos do setor e saiba a quem comunicar um alarme. A leitura do aplicativo não substitui treinamento para operar ou ajustar equipamentos.', href: '#equipamentos', sourceLabel: 'Módulo Equipamentos hospitalares; Caderno, p. 8', sourcePage: 8 },
  { id: 'ajuda', title: 'Saber como pedir ajuda e acionar o fluxo de emergência', detail: 'Confirme com a equipe como solicitar ajuda imediata e quais são suas atribuições. Não espere terminar um registro para comunicar uma situação urgente.', href: '#rotinas', sourceLabel: 'Módulo Rotinas da CTI · Alterações clínicas e registros' },
  { id: 'registros', title: 'Conhecer as orientações de registro', detail: 'Pergunte como registrar cuidados e comunicações no sistema autorizado, com supervisão. Não coloque informações de pacientes neste aplicativo.', href: '#registros', sourceLabel: 'Módulo Anotações de enfermagem; Caderno, p. 38', sourcePage: 38 },
];

export const glossaryTerms: GlossaryTerm[] = [
  { id: 'avp', term: 'AVP — Acesso venoso periférico', aliases: ['acesso periférico', 'cateter periférico'], definition: 'Acesso a uma veia periférica. Curativo, fixação, conexões e alterações do local fazem parte da observação orientada pela equipe.', href: '#dispositivos', sourceLabel: 'Caderno CTI Adulto, p. 22', sourcePage: 22 },
  { id: 'bh', term: 'BH — Balanço hídrico', aliases: ['entradas e saídas', 'balanco hidrico'], definition: 'Diferença entre os volumes de líquidos registrados como entradas e saídas em um período. O resultado, sozinho, não define a volemia, isto é, o volume de sangue em circulação.', href: '#rotinas', sourceLabel: 'Caderno CTI Adulto, p. 24', sourcePage: 24 },
  { id: 'bps', term: 'BPS — Behavioral Pain Scale', aliases: ['escala comportamental de dor'], definition: 'Escala que observa face, membros superiores e adaptação à ventilação no perfil de adulto crítico intubado descrito no caderno. Não substitui o autorrelato confiável.', href: '#escalas', sourceLabel: 'Caderno CTI Adulto, pp. 11–12', sourcePage: 11 },
  { id: 'cti', term: 'CTI — Centro de Terapia Intensiva', aliases: ['UTI', 'unidade de terapia intensiva'], definition: 'Setor com equipe especializada e recursos para monitorar e cuidar de pessoas com condições graves ou risco de piora.', href: '#acolhimento', sourceLabel: 'Módulo Bem-vindo à CTI · O que é uma CTI?' },
  { id: 'cvc', term: 'CVC — Cateter venoso central', aliases: ['acesso venoso central'], definition: 'Cateter utilizado como acesso venoso central, conforme indicação clínica. Identificar a linha, observar o local e preservar as conexões são cuidados acompanhados pela equipe.', href: '#dispositivos', sourceLabel: 'Módulo Dispositivos; Caderno, p. 22', sourcePage: 22 },
  { id: 'diurese', term: 'Diurese', aliases: ['urina', 'volume urinário'], definition: 'Produção e eliminação de urina. No registro, informe o volume realmente medido e o período a que ele corresponde.', href: '#rotinas', sourceLabel: 'Caderno CTI Adulto, p. 23', sourcePage: 23 },
  { id: 'epi', term: 'EPI — Equipamento de proteção individual', aliases: ['EPIs', 'equipamentos de proteção individual'], definition: 'Equipamento de uso individual para proteção durante o trabalho. A escolha e o uso dependem da exposição e das precauções orientadas pelo serviço.', href: '#acolhimento', sourceLabel: 'Módulo Bem-vindo à CTI; Caderno, p. 40', sourcePage: 40 },
  { id: 'eva', term: 'EVA — Escala Visual Analógica', aliases: ['escala de dor', 'autorrelato'], definition: 'Instrumento de autorrelato em que a pessoa marca sua dor em uma linha contínua. O resultado é a medida da distância da extremidade sem dor até a marca.', href: '#escalas', sourceLabel: 'Caderno CTI Adulto, p. 10', sourcePage: 10 },
  { id: 'fc', term: 'FC — Frequência cardíaca', aliases: ['batimentos cardíacos'], definition: 'Número de batimentos do coração em um minuto. A leitura é observada junto do ritmo, da condição da pessoa e da tendência.', href: '#equipamentos', sourceLabel: 'Caderno CTI Adulto, pp. 4–5', sourcePage: 4 },
  { id: 'fio2', term: 'FiO₂ — Fração inspirada de oxigênio', aliases: ['FiO2', 'fracao inspirada de oxigenio'], definition: 'Proporção de oxigênio na mistura de gases que a pessoa inspira. É um dos dados do suporte respiratório, cuja programação cabe à equipe responsável.', href: '#equipamentos', sourceLabel: 'Caderno CTI Adulto, p. 7', sourcePage: 7 },
  { id: 'fr', term: 'FR — Frequência respiratória', aliases: ['respirações por minuto', 'irpm'], definition: 'Número de ciclos respiratórios em um minuto. Observe também o esforço, o conforto e o suporte respiratório utilizado.', href: '#equipamentos', sourceLabel: 'Caderno CTI Adulto, pp. 4 e 8', sourcePage: 4 },
  { id: 'glasgow', term: 'Glasgow — Escala de Coma de Glasgow', aliases: ['GCS', 'escala de coma', 'consciência'], definition: 'Instrumento que organiza a observação das respostas ocular, verbal e motora. Limitações que impedem testar uma resposta precisam ser documentadas.', href: '#escalas', sourceLabel: 'Caderno CTI Adulto, pp. 19–20', sourcePage: 19 },
  { id: 'pa', term: 'PA — Pressão arterial', aliases: ['pressão sanguínea'], definition: 'Pressão do sangue nas artérias. A leitura deve ser considerada com a técnica da medida, a tendência e os sinais observados na pessoa.', href: '#equipamentos', sourceLabel: 'Caderno CTI Adulto, p. 5', sourcePage: 5 },
  { id: 'pai', term: 'PAI — Pressão arterial invasiva', aliases: ['linha arterial', 'pressão invasiva'], definition: 'Monitorização da pressão por uma linha arterial conectada a um sistema de medição. A curva e o sistema influenciam a leitura; a linha arterial não é via para medicamentos.', href: '#equipamentos', sourceLabel: 'Caderno CTI Adulto, p. 5', sourcePage: 5 },
  { id: 'painad', term: 'PAINAD — Pain Assessment in Advanced Dementia', aliases: ['dor na demência avançada'], definition: 'Escala observacional de dor para o perfil de demência avançada sem autorrelato confiável. Considera respiração, vocalização, face, linguagem corporal e consolabilidade.', href: '#escalas', sourceLabel: 'Caderno CTI Adulto, pp. 13–14', sourcePage: 13 },
  { id: 'pam', term: 'PAM — Pressão arterial média', aliases: ['pressao arterial media'], definition: 'Medida que representa a pressão arterial média durante o ciclo cardíaco. É acompanhada com os sinais de perfusão e a meta individual definida pela equipe.', href: '#equipamentos', sourceLabel: 'Caderno CTI Adulto, pp. 4–5 e 34', sourcePage: 5 },
  { id: 'peep', term: 'PEEP — Pressão positiva ao final da expiração', aliases: ['pressao expiratoria positiva'], definition: 'Pressão positiva mantida ao final da expiração no suporte ventilatório. É um parâmetro acompanhado e ajustado pela equipe responsável.', href: '#equipamentos', sourceLabel: 'Caderno CTI Adulto, p. 7', sourcePage: 7 },
  { id: 'perfusao', term: 'Perfusão', aliases: ['circulação nos tecidos'], definition: 'Circulação de sangue pelos tecidos. A observação reúne pressão, pulso, consciência, extremidades e diurese; um número isolado não define a perfusão.', href: '#rotinas', sourceLabel: 'Caderno CTI Adulto, p. 5', sourcePage: 5 },
  { id: 'picc', term: 'PICC — Cateter central de inserção periférica', aliases: ['cateter central inserido perifericamente'], definition: 'Cateter central introduzido por uma veia periférica. Fixação, curativo e cuidados seguem as orientações específicas recebidas no serviço.', href: '#dispositivos', sourceLabel: 'Módulo Dispositivos; Caderno, p. 22', sourcePage: 22 },
  { id: 'pni', term: 'PNI — Pressão não invasiva', aliases: ['pressão arterial não invasiva', 'manguito'], definition: 'Medida de pressão arterial feita com manguito, sem linha arterial. O tamanho do manguito e a posição influenciam a leitura.', href: '#equipamentos', sourceLabel: 'Caderno CTI Adulto, p. 5', sourcePage: 5 },
  { id: 'pop', term: 'POP — Procedimento Operacional Padrão', aliases: ['procedimento padronizado'], definition: 'Documento que orienta a execução padronizada de uma atividade no serviço. Consulte a versão autorizada pela instituição e esclareça dúvidas com o preceptor.', href: '#rotinas', sourceLabel: 'Módulo Rotinas da CTI; Caderno, p. 9', sourcePage: 9 },
  { id: 'rass', term: 'RASS — Richmond Agitation Sedation Scale', aliases: ['agitação', 'sedação', 'despertar'], definition: 'Escala que organiza a observação de agitação e nível de despertar, de acordo com critérios próprios. Não é uma escala de dor nem um diagnóstico de delirium.', href: '#escalas', sourceLabel: 'Caderno CTI Adulto, pp. 17–18', sourcePage: 17 },
  { id: 'sbar', term: 'SBAR — Comunicação estruturada', aliases: ['situação contexto avaliação recomendação', 'passagem de plantão'], definition: 'Roteiro de comunicação: situação atual, contexto relevante, dados observados e avaliação ou ajuda necessária. O caderno apresenta um exemplo para comunicar mudanças.', href: '#registros', sourceLabel: 'Caderno CTI Adulto, p. 39', sourcePage: 39 },
  { id: 'sne', term: 'SNE — Sonda nasoenteral', aliases: ['sonda enteral', 'dieta enteral'], definition: 'Sonda para acesso enteral introduzida pelo nariz. O uso depende da confirmação do posicionamento e da liberação pelo processo institucional.', href: '#dispositivos', sourceLabel: 'Módulo Dispositivos; Caderno, p. 25', sourcePage: 25 },
  { id: 'spo2', term: 'SpO₂ — Saturação periférica de oxigênio', aliases: ['SpO2', 'oximetria', 'saturação'], definition: 'Estimativa da saturação de oxigênio obtida pelo oxímetro. Confira o sensor e a qualidade do sinal e considere a leitura junto da condição da pessoa e da meta individual.', href: '#equipamentos', sourceLabel: 'Caderno CTI Adulto, pp. 4 e 8', sourcePage: 4 },
  { id: 'svd', term: 'SVD — Sonda vesical de demora', aliases: ['sonda urinária', 'cateter urinário'], definition: 'Dispositivo para drenagem de urina em sistema fechado quando indicado. Fixação, fluxo, conexões e registro do volume fazem parte dos cuidados orientados.', href: '#dispositivos', sourceLabel: 'Módulo Dispositivos; Caderno, p. 23', sourcePage: 23 },
  { id: 'tot', term: 'TOT — Tubo orotraqueal', aliases: ['tubo de via aérea', 'intubação'], definition: 'Tubo introduzido pela boca até a traqueia para manter uma via aérea e permitir suporte ventilatório quando indicado. Fixação e conexões precisam ser preservadas durante os cuidados.', href: '#dispositivos', sourceLabel: 'Módulo Dispositivos; Caderno, p. 8', sourcePage: 8 },
  { id: 'tqt', term: 'TQT — Traqueostomia', aliases: ['cânula de traqueostomia'], definition: 'Abertura na traqueia pela qual uma cânula permite acesso à via aérea. Observe pele, fixação e conexões conforme o plano de cuidados e a supervisão recebida.', href: '#dispositivos', sourceLabel: 'Módulo Dispositivos; Caderno, p. 8', sourcePage: 8 },
  { id: 'vm', term: 'VM — Ventilação mecânica', aliases: ['VMI', 'ventilação mecânica invasiva', 'ventilador'], definition: 'Suporte à respiração realizado por um ventilador. O modo e os parâmetros seguem a equipe responsável, a prescrição e o protocolo institucional.', href: '#equipamentos', sourceLabel: 'Módulo Equipamentos hospitalares; Caderno, p. 7', sourcePage: 7 },
];

const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/₂/g, '2');

export function filterGlossary(query: string): GlossaryTerm[] {
  const words = normalize(query.trim()).split(/\s+/).filter(Boolean);
  return glossaryTerms.filter(item => {
    const text = normalize([item.term, ...item.aliases, item.definition].join(' '));
    return words.every(word => text.includes(word));
  });
}

export const starterSearchText = [...firstDayItems.flatMap(item => [item.title, item.detail]), ...glossaryTerms.flatMap(item => [item.term, ...item.aliases, item.definition])].join(' ');
