import { describe, expect, it } from 'vitest';
import { annotationScenarios, rubricCriteria } from './annotation-lab';
import { caseStudies } from './cases';
import caderno from '../public/caderno/paginas.json';

describe('Laboratório fictício de anotações', () => {
  it('mantém exemplos delimitados aos fatos apresentados, sem horários ou valores inventados', () => {
    expect(annotationScenarios.map(item => item.id)).toEqual(['higiene-supervisionada', 'volume-nao-medido', 'dieta-nao-iniciada']);
    for (const item of annotationScenarios) {
      expect(item.facts.length).toBeGreaterThanOrEqual(2);
      expect(new Set(item.facts.map(fact => fact.id)).size).toBe(item.facts.length);
      expect(item.example).toBe(item.facts.map(fact => fact.text).join(' '));
      expect(item.example).not.toMatch(/\d|\b(mg|mcg|mL|dose|estável|melhorou|confortável|normalmente)\b/i);
      expect(item.missingData.some(text => text.includes('horário'))).toBe(true);
      expect(item.exampleComment.length).toBeGreaterThan(60);
    }
  });

  it('conserva a ausência de medida, resposta ao cuidado e liberação da sonda nos exemplos', () => {
    const [hygiene, unmeasured, diet] = annotationScenarios;
    expect(hygiene.example).toContain('houve desconforto');
    expect(hygiene.example).not.toMatch(/melhor|alívio|confortável/);
    expect(unmeasured.example).toContain('O volume não pôde ser medido.');
    expect(unmeasured.example).not.toMatch(/diurese|informad|comunicad|estimad|anterior/i);
    expect(diet.example).toContain('A administração da dieta não foi iniciada.');
    expect(diet.example).toContain('não foi possível confirmar a liberação');
    expect(diet.example).not.toContain('Dieta administrada');
  });

  it('vincula os cenários somente a casos e páginas de registro já disponíveis', () => {
    for (const item of annotationScenarios) {
      expect(item.relatedHref).toBe('#registros');
      for (const source of item.sourceRefs) {
        if (source.href.startsWith('#quiz/')) {
          const linkedCase = caseStudies.find(existing => source.href === `#quiz/${existing.id}`);
          expect(linkedCase).toBeDefined();
          expect(source.label).toContain(linkedCase!.title);
        } else {
          const page = Number(source.href.split('#page=')[1]);
          expect(page).toBe(source.page);
          expect(caderno.pages[page - 1]?.text.length).toBeGreaterThan(0);
        }
      }
      const recordPage = item.sourceRefs.find(source => source.page === 38);
      expect(recordPage).toBeDefined();
      expect(caderno.pages[37].text).toContain('Registre apenas o que avaliou/executou.');
    }
    expect(caderno.pages[23].text).toContain('Registre o volume realmente recebido ou');
    expect(caderno.pages[24].text).toContain('Registre interrupções e o motivo.');
  });

  it('propõe cinco critérios manuais, reconhecendo dados ausentes em vez de exigir preenchimento', () => {
    expect(rubricCriteria.map(item => item.id)).toEqual(['fidelidade', 'clareza', 'sequencia', 'cuidado-comunicacao', 'sem-inferencias']);
    expect(rubricCriteria.find(item => item.id === 'sequencia')!.explanation).toContain('sem inventar uma hora');
    expect(rubricCriteria.find(item => item.id === 'cuidado-comunicacao')!.explanation).toContain('quando isso não foi informado');
    expect(rubricCriteria.find(item => item.id === 'sem-inferencias')!.explanation).toContain('não deve receber dados de pessoas reais');
  });
});
