import inventory from '../public/materiais/apostilas/integridade.json';

type ApostilaEntry = {
  id: string;
  title: string;
  description: string;
  moduleIds: string[];
};

const entries: ApostilaEntry[] = [
  {
    id: 'cuidados-paciente-critico',
    title: 'Cuidados com o Paciente Crítico',
    description: 'Fichas de estudo sobre cuidados, observação e comunicação no CTI adulto.',
    moduleIds: ['rotinas', 'dispositivos'],
  },
  {
    id: 'curativos-feridas',
    title: 'Curativos e Cuidados com Feridas',
    description: 'Avaliação, técnica, coberturas, prevenção e registros no CTI, emergência e APH.',
    moduleIds: ['rotinas', 'dispositivos'],
  },
  {
    id: 'evolucao-anotacao-enfermagem',
    title: 'Evolução e Anotação de Enfermagem',
    description: 'Anotações do técnico, evolução do enfermeiro, exemplos e referências para estudo.',
    moduleIds: ['registros'],
  },
  {
    id: 'medicacoes-bombas-infusao',
    title: 'Medicações e Bombas de Infusão',
    description: 'Fichas de estudo, programação segura e monitorização no CTI adulto.',
    moduleIds: ['rotinas', 'equipamentos'],
  },
  {
    id: 'monitorizacao-equipamentos',
    title: 'Monitorização e Equipamentos',
    description: 'Monitorização e equipamentos no CTI adulto, com mapas de estudo e referências.',
    moduleIds: ['equipamentos'],
  },
];

export const apostilas = entries.map(entry => {
  const file = inventory.materials.find(material => material.id === entry.id);
  if (!file) throw new Error(`Arquivo da apostila não encontrado: ${entry.id}`);
  return {
    ...entry,
    href: file.href,
    pages: file.pages,
    bytes: file.bytes,
    sha256: file.sha256,
    downloadFilename: `Conhecendo_a_CTI_Apostila_${entry.id}.pdf`,
  };
});

export const apostilaSearchText = ['apostila apostilas materiais de estudo PDF', ...apostilas.flatMap(item => [item.title, item.description])].join(' ');
