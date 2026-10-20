import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { modules } from './content';
import EquipmentIllustration from './EquipmentIllustration';
import { equipmentDiagrams } from './equipment-diagrams';

describe('Equipamentos e dispositivos ilustrados', () => {
  it('oferece um esquema e uma legenda para cada um dos 15 assuntos existentes', () => {
    const topics = modules.filter(module => ['equipamentos', 'dispositivos'].includes(module.id)).flatMap(module => module.topics.map(topic => ({ moduleId: module.id, title: topic.title })));
    expect(topics).toHaveLength(15);
    expect(equipmentDiagrams).toHaveLength(topics.length);
    for (const topic of topics) {
      const diagrams = equipmentDiagrams.filter(diagram => diagram.moduleId === topic.moduleId && diagram.topicTitle === topic.title);
      expect(diagrams).toHaveLength(1);
      const diagram = diagrams[0];
      const markup = renderToStaticMarkup(<EquipmentIllustration moduleId={topic.moduleId} topicTitle={topic.title}/>);
      expect(markup).toContain('role="img"');
      expect(markup).toContain('<desc');
      expect((markup.match(/class="equipment-marker"/g) ?? []).length).toBe(diagram.parts.length);
      expect(markup).toContain('Legenda de ');
      expect(markup).toContain('revisão clínica e institucional');
      expect(diagram.source.href).toMatch(/^\/materiais\/(?:caderno-cti-adulto-digital|apostilas\/monitorizacao-equipamentos)\.pdf#page=\d+$/);
      const sourcePage = Number(diagram.source.href.split('#page=')[1]);
      expect(sourcePage).toBeGreaterThan(0);
      expect(sourcePage).toBeLessThanOrEqual(diagram.source.href.includes('/apostilas/') ? 24 : 96);
    }
  });

  it('não inventa desenho para um tópico fora do catálogo', () => {
    expect(renderToStaticMarkup(<EquipmentIllustration moduleId="registros" topicTitle="inexistente"/>)).toBe('');
  });
});
