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
    description: 'Leia uma página por vez e deslize para os lados, como um livro. Use os botões ou o índice para navegar.',
    href: '/materiais/caderno-cti-adulto-digital.pdf',
    originalFilename: 'Caderno_CTI_Adulto_App_A4_Sem_Furos.pdf',
    pages: 96,
    bytes: 1196355,
    sha256: 'a972f44330d1149e06eec607bc39ce314fb607e3d07f7c3c271864459107a0c8',
    use: 'digital',
  },
  {
    id: 'caderno-bolso',
    title: 'Caderno de bolso para imprimir',
    description: 'Quatro páginas de bolso em cada folha A4. Uma opção para quem quiser recortar e levar o caderno impresso.',
    href: '/materiais/caderno-cti-adulto-bolso-a4.pdf',
    originalFilename: 'Caderno_CTI_Adulto_4_Por_A4_Atualizado_Sem_Furos.pdf',
    pages: 24,
    bytes: 1242866,
    sha256: '5cd9aa49767881706da4af5d6dc58ac09c95473915e56cba262a9d2cb94e9dd6',
    use: 'print',
  },
];

export const materialSearchText = [
  ...learningMaterials.flatMap(m => [m.title, m.description]),
  'PDF A4 bolso imprimir digital baixar materiais caderno plantão gasometria ventilação EVA BPS PAINAD CPOT RASS Glasgow delirium dispositivos medicações bombas cálculos sepse PCR registros transporte horários',
].join(' ');
