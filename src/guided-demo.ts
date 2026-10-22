export type GuidedDemoStep = {
  id: string;
  title: string;
  purpose: string;
  actions: string[];
  links: { href: string; label: string }[];
};

export const guidedDemoSteps: GuidedDemoStep[] = [
  {
    id: 'origem', title: 'Apresente o projeto e seu status',
    purpose: 'Comece pelo problema de acolhimento e ambientação que motivou o PBL.',
    actions: ['Explique a origem acadêmica e os dois públicos.', 'Mostre que esta é uma demonstração educacional em avaliação, com revisão profissional e institucional pendentes.'],
    links: [{ href: '#projeto', label: 'Sobre o Projeto' }, { href: '#conteudos', label: 'Ver conteúdos e revisão' }],
  },
  {
    id: 'perfis', title: 'Mostre os dois percursos de entrada',
    purpose: 'A escolha organiza prioridades de aprendizagem, sem cadastro ou identificação.',
    actions: ['Escolha “Sou estagiário” e observe os atalhos recomendados.', 'Troque para “Sou novo colaborador” e mostre que os conteúdos gerais continuam disponíveis.'],
    links: [{ href: '#perfil', label: 'Escolher ou trocar perfil' }, { href: '#inicio', label: 'Ver a tela inicial' }],
  },
  {
    id: 'checklists', title: 'Explore a ambientação com checklists',
    purpose: 'Roteiros distintos ajudam a organizar o primeiro dia e a integração.',
    actions: ['Mostre uma marcação e o progresso local em cada roteiro.', 'Explique que os itens de integração local dependem da instituição e que a conclusão não certifica competência nem autoriza procedimentos.'],
    links: [{ href: '#primeiro-dia', label: 'Primeiro dia do estagiário' }, { href: '#integracao', label: 'Integração do colaborador' }],
  },
  {
    id: 'pesquisa', title: 'Encontre um assunto pelo nome',
    purpose: 'A pesquisa e o Siglário permitem consultar a base compartilhada.',
    actions: ['Pesquise um assunto, como RASS ou equipamentos, na tela inicial.', 'Abra o Siglário e use uma sigla ou uma palavra da definição; mostre as notas de conferência quando presentes.'],
    links: [{ href: '#inicio', label: 'Pesquisar no app' }, { href: '#glossario', label: 'Consultar o Siglário' }],
  },
  {
    id: 'box', title: 'Visite o box fictício',
    purpose: 'Reconheça equipamentos em uma apresentação educativa sem representar o setor real.',
    actions: ['Selecione um equipamento na cena e leia a explicação.', 'Mostre a alternativa textual e a navegação por teclado. Não demonstre ajustes de tratamento.'],
    links: [{ href: '#cti-virtual', label: 'Explorar a CTI virtual' }, { href: '#equipamentos', label: 'Rever equipamentos' }],
  },
  {
    id: 'escalas', title: 'Consulte escalas pela finalidade',
    purpose: 'Distinga estudo de dor, sedação/agitação e nível de consciência.',
    actions: ['Escolha uma finalidade e consulte o instrumento relacionado.', 'Mostre referências, limitações e status de revisão, sem inserir dados reais de pacientes ou recomendar condutas.'],
    links: [{ href: '#escalas', label: 'Abrir escalas educativas' }],
  },
  {
    id: 'problemas', title: 'Aprenda com situações fictícias',
    purpose: 'O PBL estimula reconhecimento de problemas, comunicação e reflexão com a equipe.',
    actions: ['Percorra uma decisão de um caso e leia a explicação.', 'No laboratório, use somente os fatos do cenário para comparar uma anotação com a rubrica de autorrevisão.'],
    links: [{ href: '#quiz', label: 'Praticar com casos e quiz' }, { href: '#laboratorio', label: 'Laboratório de anotações' }],
  },
  {
    id: 'materiais', title: 'Retome o caderno e os materiais',
    purpose: 'Os documentos e seus créditos fazem parte da continuidade do projeto.',
    actions: ['Abra um PDF original e mostre como retornar à aba do aplicativo.', 'No caderno, mostre a leitura de uma página por vez, favoritos e retomada local. O primeiro carregamento e os links externos precisam de conexão.'],
    links: [{ href: '#biblioteca', label: 'Consultar a Biblioteca' }, { href: '#caderno', label: 'Ler o caderno' }],
  },
  {
    id: 'avaliacao', title: 'Encerre com avaliação e pendências',
    purpose: 'Separe percepção de uso, revisão de conteúdo e autorização institucional.',
    actions: ['Mostre o questionário voluntário de demonstração local, sem envio remoto.', 'Apresente as pendências de revisão, créditos e homologação. Não declare adoção oficial pela instituição.'],
    links: [{ href: '#avaliacao-pbl', label: 'Avaliação local do PBL' }, { href: '#conteudos', label: 'Conferir revisão dos conteúdos' }],
  },
];
