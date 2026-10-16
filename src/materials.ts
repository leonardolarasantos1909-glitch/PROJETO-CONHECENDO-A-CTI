export type LearningMaterial = {
  id: string;
  title: string;
  description: string;
  href: string;
  originalFilename: string;
  pages: number;
  bytes: number;
  sha256: string;
  use: 'digital' | 'print';
};

export const learningMaterials: LearningMaterial[] = [
  {
    id: 'caderno-digital',
    title: 'Caderno CTI Adulto',
    description: 'O caderno completo para ler no celular ou no computador, com índice e referências de consulta.',
    href: '/materiais/caderno-cti-adulto-digital.pdf',
    originalFilename: 'Caderno_CTI_Adulto_App_A4_Sem_Furos.pdf',
    pages: 96,
    bytes: 1194222,
    sha256: '1643e78fe6e977ca45d6649adedf3dd3f360c3b550a0e8001fc8e1ad7c4f50b5',
    use: 'digital',
  },
  {
    id: 'caderno-bolso',
    title: 'Caderno de bolso para imprimir',
    description: 'Quatro páginas de bolso em cada folha A4. Uma opção para quem quiser recortar e levar o caderno impresso.',
    href: '/materiais/caderno-cti-adulto-bolso-a4.pdf',
    originalFilename: 'Caderno_CTI_Adulto_4_Por_A4_Atualizado_Sem_Furos.pdf',
    pages: 24,
    bytes: 1222692,
    sha256: '033f36d3a1cb8c6baecc0214649943d499a91125242da2ccf11580d8fcb9d175',
    use: 'print',
  },
];

export const materialSearchText = [
  ...learningMaterials.flatMap(m => [m.title, m.description]),
  'PDF A4 bolso imprimir digital baixar materiais caderno plantão gasometria ventilação EVA BPS PAINAD CPOT RASS Glasgow delirium dispositivos medicações bombas cálculos sepse PCR registros transporte horários',
].join(' ');
