import { describe, expect, it } from 'vitest';
import { guidedDemoSteps } from './guided-demo';

describe('Roteiro de demonstração sem dados reais', () => {
  it('cobre os recursos com destinos internos estáveis e etapas distintas', () => {
    expect(guidedDemoSteps).toHaveLength(9);
    expect(new Set(guidedDemoSteps.map(step => step.id)).size).toBe(9);
    const targets = guidedDemoSteps.flatMap(step => step.links.map(link => link.href));
    for (const expected of ['#perfil', '#primeiro-dia', '#integracao', '#glossario', '#cti-virtual', '#escalas', '#quiz', '#laboratorio', '#biblioteca', '#caderno', '#avaliacao-pbl', '#conteudos']) expect(targets).toContain(expected);
    for (const target of targets) expect(target).toMatch(/^#[a-z0-9-]+$/);
  });
});
