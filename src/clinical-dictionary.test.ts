import { describe, expect, it } from 'vitest';
import {
  assertClinicalConditions, clinicalCategories, clinicalConditions, clinicalFavoriteId,
  clinicalHref, clinicalModule, clinicalResourceLinks, clinicalResources,
  conditionsForContent, getClinicalCondition, relatedClinicalConditions, searchClinicalConditions,
} from './clinical-dictionary';
import type { ClinicalCondition } from './clinical-types';
import { findFavorites, normalizeFavoriteIds } from './favorites';
import { getContentMetadata } from './content-registry';
import { searchContent, searchIndex } from './search';

const copy = () => structuredClone(clinicalConditions);
const invalid = (change: (entry: ClinicalCondition, all: ClinicalCondition[]) => void) => {
  const all = copy();
  change(all[0], all);
  return () => assertClinicalConditions(all);
};

describe('Dicionário Clínico integrado à aprendizagem na CTI', () => {
  it('oferece as 30 fichas completas nas sete categorias, em ordem alfabética', () => {
    expect(clinicalConditions).toHaveLength(30);
    expect(() => assertClinicalConditions()).not.toThrow();
    expect(clinicalConditions.map(item => item.name)).toEqual(clinicalConditions.map(item => item.name).sort((a, b) => a.localeCompare(b, 'pt-BR')));
    expect(clinicalCategories.map(category => clinicalConditions.filter(item => item.category === category).length)).toEqual([6, 6, 4, 5, 4, 3, 2]);
    for (const item of clinicalConditions) {
      expect(item.quickSummary.trim().split(/\s+/).length).toBeLessThanOrEqual(80);
      expect(item.nursingTechnicianCare.length).toBeGreaterThanOrEqual(2);
      expect(item.warningSigns.length).toBeGreaterThan(0);
      expect(item.clinicalCase.scenario).not.toBe(item.clinicalCase.answer);
      expect(getClinicalCondition(item.id)).toBe(item);
      expect(clinicalHref(item.id)).toBe(`#dicionario-clinico/${item.slug}`);
    }
    expect(getClinicalCondition('__proto__')).toBeUndefined();
    expect(getClinicalCondition('nao-cadastrada')).toBeUndefined();
  });

  it('pesquisa nomes, siglas e sinônimos sem depender de acentos ou caixa', () => {
    for (const query of ['IAM', 'infarto', 'infarto agudo']) expect(searchClinicalConditions(query).some(item => item.id === 'iam')).toBe(true);
    expect(searchClinicalConditions('  IRpA   ')[0].id).toBe('insuficiencia-respiratoria-aguda');
    expect(searchClinicalConditions('LESÃO RENAL')[0].id).toBe('lesao-renal-aguda');
    expect(searchClinicalConditions('lesao renal')[0].id).toBe('lesao-renal-aguda');
    for (const item of clinicalConditions) {
      for (const query of [item.name, item.acronym, ...item.synonyms]) {
        expect(searchClinicalConditions(query).map(result => result.id), `${item.id}: ${query}`).toContain(item.id);
      }
    }
    expect(searchClinicalConditions('condicao-nao-cadastrada-12345')).toEqual([]);
  });

  it('combina categorias e pesquisa local e mantém todos os conteúdos acessíveis', () => {
    expect(searchClinicalConditions('')).toEqual(clinicalConditions);
    for (const category of clinicalCategories) {
      const expected = clinicalConditions.filter(item => item.category === category);
      expect(searchClinicalConditions('', category)).toEqual(expected);
      expect(searchClinicalConditions(category).map(item => item.id)).toEqual(expect.arrayContaining(expected.map(item => item.id)));
    }
    expect(searchClinicalConditions('IAM', 'Respiratórias')).toEqual([]);
    expect(searchClinicalConditions('', 'categoria-inexistente')).toEqual([]);
    expect(searchClinicalConditions('renal impossivel123')).toEqual([]);
  });

  it('usa os catálogos existentes de favoritos, busca geral e governança sem inventar aprovação', () => {
    expect(findFavorites([clinicalModule.id])[0]).toMatchObject({ title: clinicalModule.title, href: clinicalModule.href });
    expect(searchIndex.some(item => item.id === clinicalModule.id && item.href === clinicalModule.href)).toBe(true);
    for (const item of clinicalConditions) {
      const id = clinicalFavoriteId(item.id);
      expect(findFavorites([id])[0]).toMatchObject({ id, title: item.name, href: clinicalHref(item.id) });
      expect(normalizeFavoriteIds([id, id, 'clinical.javascript:alert(1)'])).toEqual([id]);
      expect(searchContent(item.name).some(result => result.href === clinicalHref(item.id))).toBe(true);
      const metadata = getContentMetadata(id)!;
      expect(metadata).toMatchObject({ href: clinicalHref(item.id), title: item.name, status: 'pending_review', lastReviewedAt: null, reviewedBy: null, authorizationReference: null, publicationScope: 'educational_public' });
      expect(metadata.references.map(reference => reference.href)).toEqual(expect.arrayContaining(item.references.map(reference => reference.url)));
    }
    expect(searchContent('IAM').some(item => item.href === clinicalHref('iam'))).toBe(true);
    expect(findFavorites(['module.acolhimento', 'tool.calculadora']).map(item => item.href)).toEqual(['#acolhimento', '#calculadora']);
  });

  it('deriva vínculos de ida e volta da mesma fonte e resolve todas as patologias relacionadas', () => {
    for (const item of clinicalConditions) {
      const links = clinicalResourceLinks(item);
      expect(links.length).toBeGreaterThan(0);
      expect(new Set(links.map(link => link.href)).size).toBe(links.length);
      for (const link of links) {
        expect(Object.values(clinicalResources)).toContainEqual(link);
        expect(conditionsForContent(link.href)).toContain(item);
        expect(conditionsForContent(`${link.href}?origem=consulta`)).toContain(item);
      }
      expect(relatedClinicalConditions(item).map(other => other.id)).toEqual(item.relatedConditionIds);
      expect(relatedClinicalConditions(item)).not.toContain(item);
    }
    expect(conditionsForContent('#equipamentos').length).toBeGreaterThan(0);
    expect(conditionsForContent('#rota-inexistente')).toEqual([]);
  });

  it('separa conferência bibliográfica de revisão profissional, com datas somente quando comprovadas', () => {
    for (const item of clinicalConditions) {
      expect(item.clinicalReviewStatus).toBe('pending');
      expect(item.reviewedAt).toBeNull();
      for (const reference of item.references) {
        expect(new URL(reference.url).protocol).toBe('https:');
        expect(reference.note.trim()).not.toBe('');
        if (reference.verification === 'pending') expect(reference.accessedAt).toBeUndefined();
        else expect(reference.accessedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      }
    }
  });

  it('rejeita identificadores repetidos, slugs inconsistentes e categorias não cadastradas', () => {
    expect(invalid((item, all) => { all.push(structuredClone(item)); })).toThrow(/duplicado/);
    expect(invalid(item => { item.slug = 'outro-slug'; })).toThrow(/Identificador/);
    expect(invalid(item => { item.id = '../arquivo'; })).toThrow(/Identificador/);
    expect(invalid(item => { item.category = 'Outra' as typeof item.category; })).toThrow(/Categoria/);
  });

  it('rejeita fichas incompletas ou resumos que deixam de ser rápidos', () => {
    expect(invalid(item => { item.quickSummary = ''; })).toThrow(/incompleta/);
    expect(invalid(item => { item.quickSummary = Array(81).fill('palavra').join(' '); })).toThrow(/80 palavras/);
    expect(invalid(item => { item.nursingTechnicianCare = []; })).toThrow(/incompleta/);
    expect(invalid(item => { item.warningSigns = ['  ']; })).toThrow(/incompleta/);
    expect(invalid(item => { item.clinicalCase.answer = ''; })).toThrow(/Caso educativo/);
    expect(invalid(item => { item.clinicalCase = { contexto: 'texto', pergunta: 'texto', resposta: 'texto' } as unknown as ClinicalCondition['clinicalCase']; })).toThrow(/Caso educativo/);
    expect(invalid(item => { item.clinicalCase = ['contexto', 'pergunta', 'resposta'] as unknown as ClinicalCondition['clinicalCase']; })).toThrow(/Caso educativo/);
  });

  it('bloqueia aprovações e datas de revisão profissional sem evidências cadastradas', () => {
    expect(invalid(item => { item.clinicalReviewStatus = 'approved'; })).toThrow(/Aprovação clínica/);
    expect(invalid(item => { item.reviewedAt = '2026-10-30'; })).toThrow(/Aprovação clínica/);
  });

  it('rejeita referências ausentes, inseguras e conferências alegadas sem evidência mínima', () => {
    expect(invalid(item => { item.references = []; })).toThrow(/Referência clínica ausente/);
    for (const url of ['javascript:alert(1)', 'http://example.org', 'https://usuario:senha@example.org']) {
      expect(invalid(item => { item.references[0].url = url; })).toThrow(/URL clínica inválida/);
    }
    expect(invalid(item => { item.references[0].title = ''; })).toThrow(/Referência clínica incompleta/);
    expect(invalid(item => { item.references[0].verification = 'pending'; item.references[0].accessedAt = '2026-10-30'; })).toThrow(/Conferência não comprovada/);
    expect(invalid(item => { item.references[0].verification = 'verified'; delete item.references[0].accessedAt; })).toThrow(/Data de consulta ausente/);
    expect(invalid(item => { item.references[0].verification = 'verified'; item.references[0].accessedAt = '2026-02-30'; })).toThrow(/Data de consulta inválida/);
  });

  it('rejeita links internos e associações clínicas que não existem no projeto', () => {
    for (const key of ['equipamento-inexistente', 'constructor', 'toString', '__proto__']) {
      expect(invalid(item => { item.relatedDevices.push(key); })).toThrow(/Recurso clínico ausente/);
      const item = structuredClone(clinicalConditions[0]);
      item.relatedDevices.push(key);
      expect(() => clinicalResourceLinks(item)).toThrow(/Recurso clínico ausente/);
    }
    expect(invalid(item => { item.relatedConditionIds.push('patologia-inexistente'); })).toThrow(/Patologia relacionada inválida/);
    expect(invalid(item => { item.relatedConditionIds.push(item.id); })).toThrow(/Patologia relacionada inválida/);
  });
});
