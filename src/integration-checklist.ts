export const INTEGRATION_KEY = 'cti-integration-v1';

export type IntegrationItem = {
  id: string;
  title: string;
  detail: string;
  href: string;
  sourceLabel: string;
};

/** Generic educational prompts, not a validated institutional onboarding record. */
export const integrationItems: IntegrationItem[] = [
  { id: 'referencia-equipe', title: 'Identificar as pessoas de referência no setor', detail: 'Converse com a equipe sobre quem acompanha sua ambientação, quem é o enfermeiro responsável e a quem levar dúvidas sobre os cuidados e as atribuições.', href: '#acolhimento', sourceLabel: 'Módulo Bem-vindo à CTI · Equipe multiprofissional' },
  { id: 'comunicacao-setor', title: 'Conhecer os canais autorizados de comunicação', detail: 'Peça que a equipe apresente como comunicar mudanças, pendências e pedidos de ajuda, preservando o sigilo. Este roteiro não informa ramais nem fluxos internos.', href: '#rotinas', sourceLabel: 'Módulo Rotinas da CTI · Recebimento e passagem de plantão; Alterações clínicas e registros' },
  { id: 'passagem-plantao', title: 'Acompanhar a organização e a passagem de plantão', detail: 'Reconheça com a equipe o instrumento de passagem de plantão e como são conferidas as informações e pendências. Confirme a rotina local antes de assumir que ela é igual à de outra instituição.', href: '#rotinas', sourceLabel: 'Módulo Rotinas da CTI · Recebimento e passagem de plantão' },
  { id: 'recursos-autorizados', title: 'Reconhecer materiais e recursos com acompanhamento', detail: 'Solicite um reconhecimento acompanhado dos recursos que a instituição autoriza apresentar. A localização real e o acesso aos materiais precisam ser informados pela equipe responsável.', href: '#acolhimento', sourceLabel: 'Módulo Bem-vindo à CTI · Segurança e primeiro dia' },
  { id: 'seguranca-precaucoes', title: 'Revisar identificação, higiene das mãos e precauções', detail: 'Confirme com a equipe os recursos e orientações vigentes de identificação, higiene das mãos, EPIs, descarte e precauções. Siga os documentos autorizados e esclareça diferenças em relação a experiências anteriores.', href: '#acolhimento', sourceLabel: 'Módulo Bem-vindo à CTI · Segurança e primeiro dia' },
  { id: 'equipamentos-capacitacao', title: 'Reconhecer equipamentos e confirmar a capacitação aplicável', detail: 'Identifique os equipamentos e dispositivos utilizados e com quem esclarecer seu funcionamento. A leitura do aplicativo não substitui capacitação, supervisão ou autorização para operar e ajustar recursos.', href: '#equipamentos', sourceLabel: 'Módulos Equipamentos hospitalares e Dispositivos' },
  { id: 'registro-local', title: 'Conhecer as orientações de registro e privacidade', detail: 'Pergunte quais orientações e canais de registro são adotados e autorizados pela instituição. Não copie dados de pacientes, prontuários ou imagens para este aplicativo.', href: '#registros', sourceLabel: 'Módulo Anotações de enfermagem; Módulo Bem-vindo à CTI · Ética, sigilo e humanização' },
  { id: 'documentos-validos', title: 'Confirmar onde consultar os documentos autorizados', detail: 'Peça à equipe que apresente o acesso autorizado aos documentos vigentes e a forma de reconhecer sua versão. Não envie protocolos internos restritos para o aplicativo público.', href: '#biblioteca', sourceLabel: 'Biblioteca científica · Controle de revisão e fontes de consulta' },
  { id: 'duvidas-integracao', title: 'Revisar dúvidas e combinar a continuidade da integração', detail: 'Converse com a pessoa de referência sobre pontos ainda não apresentados e necessidades de acompanhamento. As marcações deste roteiro não comprovam treinamento obrigatório, competência ou liberação para executar procedimentos.', href: '#acolhimento', sourceLabel: 'Módulo Bem-vindo à CTI · Equipe multiprofissional; Segurança e primeiro dia' },
];
