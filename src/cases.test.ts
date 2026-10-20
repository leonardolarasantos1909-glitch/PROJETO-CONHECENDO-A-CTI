import { describe, expect, it } from 'vitest';
import { caseSearchText, caseStudies } from './cases';
import caderno from '../public/caderno/paginas.json';

describe('Casos educativos PBL', () => {
  it('cobre os cinco temas pedidos com situações encadeadas e feedback por alternativa', () => {
    expect(new Set(caseStudies.map(item => item.subject))).toEqual(new Set(['Equipamentos', 'Dispositivos', 'Comunicação', 'Registros', 'Escalas']));
    expect(new Set(caseStudies.map(item => item.id)).size).toBe(caseStudies.length);
    for (const item of caseStudies) {
      expect(item.steps.length).toBeGreaterThanOrEqual(2);
      expect(new Set(item.steps.map(step => step.id)).size).toBe(item.steps.length);
      for (const step of item.steps) {
        expect(step.situation.length).toBeGreaterThan(40);
        expect(step.options).toHaveLength(4);
        expect(new Set(step.options.map(option => option.text)).size).toBe(4);
        expect(Number.isInteger(step.answer)).toBe(true);
        expect(step.answer).toBeGreaterThanOrEqual(0);
        expect(step.answer).toBeLessThan(step.options.length);
        for (const option of step.options) expect(option.feedback.length).toBeGreaterThan(40);
      }
      expect(item.discussion).toContain('preceptor');
    }
  });

  it('vincula cada caso a um módulo existente e a páginas disponíveis no caderno preservado', () => {
    const modules = ['#equipamentos', '#dispositivos', '#rotinas', '#registros', '#escalas'];
    for (const item of caseStudies) {
      expect(modules).toContain(item.relatedModule.href);
      expect(item.sources.length).toBeGreaterThan(0);
      for (const source of item.sources) {
        const page = Number(source.href.match(/^\/materiais\/caderno-cti-adulto-digital\.pdf#page=(\d+)$/)?.[1]);
        expect(page).toBeGreaterThanOrEqual(1);
        expect(page).toBeLessThanOrEqual(caderno.pageCount);
        expect(caderno.pages[page - 1].text.length).toBeGreaterThan(0);
      }
      expect(caseSearchText).toContain(item.title);
      expect(caseSearchText).toContain(item.steps[0].question);
    }
  });
});
