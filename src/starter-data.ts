export type FirstDayItem = {
  id: string;
  title: string;
  detail: string;
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

export { glossaryTerms, filterGlossary } from './hospital-glossary';
export type { GlossaryTerm } from './hospital-glossary';
