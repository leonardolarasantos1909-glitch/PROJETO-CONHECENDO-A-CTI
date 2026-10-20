import { describe, expect, it } from 'vitest';
import { scales } from './scales';
import caderno from '../public/caderno/paginas.json';

const normalizeSpacing = (text: string) => text.replace(/\s+/g, ' ').trim();

describe('Critérios resumidos das escalas', () => {
  it.each([
    ['bps', 3, [1, 2, 3, 4], [3, 12]],
    ['painad', 5, [0, 1, 2], [0, 10]],
  ] as const)('mantém os domínios, pontos e descrições de %s consistentes com o caderno', (id, count, points, totalRange) => {
    const domains = scales.find(scale => scale.id === id)!.criteria.domains!;
    expect(domains).toHaveLength(count);
    expect(new Set(domains.map(domain => domain.id)).size).toBe(count);
    for (const domain of domains) {
      expect(domain.levels.map(level => level.points)).toEqual(points);
      const pageText = normalizeSpacing(caderno.pages[domain.page - 1].text);
      expect(pageText).toContain(domain.title);
      let previousPosition = -1;
      for (const level of domain.levels) {
        const position = pageText.indexOf(normalizeSpacing(level.criterion));
        expect(position, `Critério ausente ou fora de ordem: ${domain.title}, ${level.points}`).toBeGreaterThan(previousPosition);
        previousPosition = position;
      }
    }
    expect(domains.reduce((sum, domain) => sum + domain.levels[0].points, 0)).toBe(totalRange[0]);
    expect(domains.reduce((sum, domain) => sum + domain.levels.at(-1)!.points, 0)).toBe(totalRange[1]);
  });

  it('preserva os limites de contato visual como descritos no caderno, sem regra nova para a fronteira', () => {
    const levels = scales.find(scale => scale.id === 'rass')!.levelGuide!;
    const pageText = normalizeSpacing(caderno.pages[17].text);
    for (const [score, criterion] of [
      ['−1', 'Desperta à voz e mantém contato visual por mais de 10 s.'],
      ['−2', 'Desperta à voz com contato visual por menos de 10 s.'],
    ]) {
      expect(pageText).toContain(criterion);
      expect(levels.find(level => level.score === score)!.description).toContain(criterion.slice(0, -1));
    }
  });
});
