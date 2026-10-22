import { equipmentDiagrams, type EquipmentDiagram } from './equipment-diagrams';

export type VirtualStation = {
  id: string;
  title: string;
  moduleId: EquipmentDiagram['moduleId'];
  topicTitle: string;
  description: string;
  x: number;
  y: number;
  source: EquipmentDiagram['source'];
};

function station(id: string, moduleId: VirtualStation['moduleId'], topicTitle: string, x: number, y: number): VirtualStation {
  const diagram = equipmentDiagrams.find(item => item.moduleId === moduleId && item.topicTitle === topicTitle);
  if (!diagram) throw new Error(`O item do box precisa de um desenho existente: ${moduleId}/${topicTitle}`);
  return { id, title: topicTitle, moduleId, topicTitle, description: diagram.description, x, y, source: diagram.source };
}

/** Positions organize this fictional illustration only; they are not an institutional floor plan or an equipment setup. */
export const virtualStations: VirtualStation[] = [
  station('monitor', 'equipamentos', 'Monitor multiparamétrico', 16, 21),
  station('ventilador', 'equipamentos', 'Ventilador mecânico', 81, 21),
  station('bomba', 'equipamentos', 'Bomba de infusão', 16, 45),
  station('oxigenio', 'equipamentos', 'Oxigenoterapia', 81, 45),
  station('cvc', 'dispositivos', 'Cateter venoso central (CVC)', 16, 69),
  station('sonda-vesical', 'dispositivos', 'Sonda vesical de demora', 81, 69),
  station('sonda-enteral', 'dispositivos', 'Sonda nasoenteral', 37, 87),
  station('tubo', 'dispositivos', 'Tubo orotraqueal', 63, 87),
];
