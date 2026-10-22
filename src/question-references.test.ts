import { describe, expect, it } from 'vitest';
import { questions, modules } from './content';
import { extraQuestionSources } from './extra-questions';
import { getQuestionReferences } from './question-references';
import caderno from '../public/caderno/paginas.json';

describe('Fontes das questões preservadas', () => {
  it('cobre todo o banco existente sem substituir perguntas ou inventar uma fonte para texto desconhecido', () => {
    expect(questions).toHaveLength(32);
    expect(getQuestionReferences('Pergunta não cadastrada')).toEqual([]);
    for (const question of questions) {
      const references = getQuestionReferences(question.text);
      expect(references.length).toBeGreaterThan(0);
      expect(new Set(references.map(source => source.href)).size).toBe(references.length);
      for (const reference of references) {
        if (reference.href.startsWith('#')) expect(modules.some(module => reference.href === `#${module.id}`)).toBe(true);
        else {
          expect(reference.href).toBe(`/materiais/caderno-cti-adulto-digital.pdf#page=${reference.page}`);
          expect(caderno.pages[reference.page! - 1]?.text.length).toBeGreaterThan(0);
        }
      }
    }
  });

  it('reaproveita as páginas e os módulos do mapa editorial das 24 questões adicionais', () => {
    expect(extraQuestionSources).toHaveLength(24);
    for (const source of extraQuestionSources) {
      const references = getQuestionReferences(source.text);
      expect(references.some(reference => reference.href === `#${source.moduleId}`)).toBe(true);
      expect(references.filter(reference => reference.page).map(reference => reference.page)).toEqual(source.page ? [source.page] : []);
    }
  });

  it('aponta as questões de registros, autorrelato, Glasgow, sonda e alarmes para páginas pertinentes', () => {
    const expectedPages = new Map([
      [questions[1].text, { page: 38, term: 'Anotação de enfermagem' }],
      [questions[3].text, { page: 10, term: 'Tente o autorrelato confiável primeiro.' }],
      [questions[4].text, { page: 20, term: 'Quando não é testável' }],
      [questions[5].text, { page: 25, term: 'Antes de usar' }],
      [questions[6].text, { page: 8, term: 'Via aérea e alarmes' }],
    ]);
    for (const [question, expected] of expectedPages) {
      expect(getQuestionReferences(question).some(reference => reference.page === expected.page)).toBe(true);
      expect(caderno.pages[expected.page - 1].text).toContain(expected.term);
    }
    expect(getQuestionReferences(questions[2].text).every(reference => !reference.page)).toBe(true);
  });
});
