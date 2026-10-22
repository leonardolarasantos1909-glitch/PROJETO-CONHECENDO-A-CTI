import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import VirtualCTI from './VirtualCTI';
import { virtualStations } from './virtual-cti';
import { equipmentDiagrams } from './equipment-diagrams';
import { modules } from './content';

describe('CTI virtual educativo', () => {
  it('reaproveita oito assuntos e fontes existentes, sem transformar as posições em uma montagem clínica', () => {
    expect(virtualStations).toHaveLength(8);
    expect(new Set(virtualStations.map(item => item.id)).size).toBe(8);
    for (const item of virtualStations) {
      const original = equipmentDiagrams.find(diagram => diagram.moduleId === item.moduleId && diagram.topicTitle === item.topicTitle);
      expect(original).toBeDefined();
      expect(item.description).toBe(original!.description);
      expect(item.source).toBe(original!.source);
      expect(modules.find(module => module.id === item.moduleId)?.topics.some(topic => topic.title === item.topicTitle)).toBe(true);
      expect(item.id).toMatch(/^[a-z0-9-]+$/);
      expect(item.source.href).toMatch(/^\/materiais\/.+\.pdf#page=\d+$/);
      // A 48px target remains inside a 280px-wide, 400px-high minimum scene.
      expect(item.x / 100 * 280).toBeGreaterThanOrEqual(24);
      expect(item.x / 100 * 280).toBeLessThanOrEqual(256);
      expect(item.y / 100 * 400).toBeGreaterThanOrEqual(24);
      expect(item.y / 100 * 400).toBeLessThanOrEqual(376);
    }
  });

  it('oferece todas as opções da cena também em lista, com botões nomeados e sem carregar documentos automaticamente', () => {
    const markup = renderToStaticMarkup(<VirtualCTI/>);
    expect(markup).toContain('Não representa a planta de um hospital');
    expect(markup).toContain('Revisão clínica e institucional pendente');
    expect(markup).toContain('role="group"');
    expect(markup).toContain('lista oferece as mesmas oito opções');
    expect((markup.match(/aria-haspopup="dialog"/g) ?? []).length).toBe(16);
    expect((markup.match(/aria-pressed="false"/g) ?? []).length).toBe(16);
    for (const station of virtualStations) {
      expect((markup.match(new RegExp(`data-station-id="${station.id}"`, 'g')) ?? []).length).toBe(2);
      expect(markup).toContain(`aria-label="Explorar ${station.title} no box"`);
      expect(markup).toContain(`aria-label="Abrir ${station.title} na lista"`);
    }
    expect(markup).not.toMatch(/<iframe|<object|<embed|<img|<input|<textarea|<dialog/);
  });
});
