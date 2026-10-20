import { describe, expect, it } from 'vitest';
import { filterGlossary, firstDayItems, glossaryTerms } from './starter-data';
import caderno from '../public/caderno/paginas.json';

describe('Roteiro e glossário', () => {
  it('localiza definições por sigla, alias, acento e mais de uma palavra', () => {
    expect(filterGlossary('SPO2').map(item => item.id)).toContain('spo2');
    expect(filterGlossary('SpO₂').map(item => item.id)).toContain('spo2');
    expect(filterGlossary('balanco hidrico').map(item => item.id)).toEqual(['bh']);
    expect(filterGlossary('pressao media').map(item => item.id)).toContain('pam');
    expect(filterGlossary('sonda urinaria').map(item => item.id)).toEqual(['svd']);
    expect(filterGlossary('inexistentezzz')).toEqual([]);
    expect(filterGlossary('  ')).toEqual(glossaryTerms);
  });

  it('mantém identificadores únicos e referências locais existentes nas duas ferramentas', () => {
    const routes = new Set(['#acolhimento', '#rotinas', '#equipamentos', '#dispositivos', '#escalas', '#registros']);
    for (const items of [firstDayItems, glossaryTerms]) {
      expect(new Set(items.map(item => item.id)).size).toBe(items.length);
      for (const item of items) {
        expect(item.id).toMatch(/^[a-z0-9-]+$/);
        expect(routes.has(item.href)).toBe(true);
        expect(item.sourceLabel.length).toBeGreaterThan(10);
        if (item.sourcePage !== undefined) {
          expect(caderno.pages[item.sourcePage - 1]?.number).toBe(item.sourcePage);
        }
      }
    }
  });
});
