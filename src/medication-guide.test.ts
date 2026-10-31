import { describe, expect, it } from 'vitest';
import {
  assertMedications, getMedication, getMedicationCases, medicationCaseHref, medicationCases,
  medicationCategories, medicationFavoriteId, medicationHref, medicationModule, medications,
  medicationsForCondition, normalizeMedicationSearch, searchMedications,
} from './medication-guide';
import type { Medication } from './medication-types';
import { clinicalConditions, getClinicalCondition } from './clinical-dictionary';
import { findFavorites, normalizeFavoriteIds } from './favorites';
import { getContentMetadata } from './content-registry';
import { searchContent, searchIndex } from './search';

const copy = () => structuredClone(medications);
const invalid = (change: (entry: Medication, all: Medication[]) => void) => {
  const entries = copy();
  change(entries[0], entries);
  return () => assertMedications(entries);
};
const verifiedBrandFixture = (): Medication => {
  const item = structuredClone(medications[0]);
  item.id = 'fixture-bula-conferida';
  item.references.push({ id: 'fixture-product-label', title: 'Bula fictícia exclusiva do teste', organization: 'Organização fictícia de teste', url: 'https://example.invalid/bula-ficticia', scope: 'product_label', verification: 'verified', accessedAt: '2026-10-30', note: 'Fixture de software: não representa bula, produto ou conferência reais.' });
  item.commercialNames = [{ name: 'Marca Fictícia Somente Teste', presentation: 'Apresentação fictícia documentada apenas no teste', referenceId: 'fixture-product-label', verifiedAt: '2026-10-30' }];
  return item;
};

describe('Guia educativo de medicamentos da CTI', () => {
  it('mantém 40 princípios ativos únicos nas 11 categorias e em ordem alfabética', () => {
    expect(medications).toHaveLength(40);
    expect(new Set(medications.map(item => item.id)).size).toBe(40);
    expect(new Set(medications.map(item => normalizeMedicationSearch(item.activeIngredient))).size).toBe(40);
    expect(new Set(medications.map(item => normalizeMedicationSearch(item.genericName))).size).toBe(40);
    expect(medicationCategories).toHaveLength(11);
    expect(medicationCategories.map(category => medications.filter(item => item.category === category).length)).toEqual([5, 4, 4, 4, 3, 2, 8, 2, 2, 4, 2]);
    expect(medications.map(item => item.genericName)).toEqual(medications.map(item => item.genericName).sort((a, b) => a.localeCompare(b, 'pt-BR')));
    expect(() => assertMedications()).not.toThrow();
    expect(getMedication('__proto__')).toBeUndefined();
    expect(getMedication('medicamento-inexistente')).toBeUndefined();
  });

  it('oferece os campos educativos completos sem alegar revisão clínica ou consulta de fonte pendente', () => {
    for (const item of medications) {
      expect(getMedication(item.id)).toBe(item);
      for (const field of ['genericName', 'activeIngredient', 'pharmacologicalClass', 'summary', 'purpose', 'mechanism', 'formulationsNote', 'commercialNamesNote'] as const) {
        expect(item[field].trim(), `${item.id}: ${field}`).not.toBe('');
      }
      for (const field of ['adverseEffects', 'contraindicationsPrecautions', 'monitoring', 'warningSigns'] as const) expect(item[field].length, `${item.id}: ${field}`).toBeGreaterThanOrEqual(3);
      expect(item.nursingCare.length, item.id).toBeGreaterThanOrEqual(4);
      expect(item.intensiveCareUses.length).toBeGreaterThan(0);
      expect(item.routes.length).toBeGreaterThan(0);
      for (const route of item.routes) {
        expect(route.name.trim()).not.toBe('');
        expect(route.context.trim()).not.toBe('');
      }
      expect(item.clinicalReviewStatus).toBe('pending');
      expect(item.reviewedAt).toBeNull();
      expect(item.version).toBe('1.0');
      expect(item.references.length).toBeGreaterThan(0);
      for (const ref of item.references) {
        expect(new URL(ref.url).protocol).toBe('https:');
        expect(ref.note.trim()).not.toBe('');
        if (ref.verification === 'pending') expect(ref.accessedAt).toBeUndefined();
        else expect(ref.accessedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      }
      for (const brand of item.commercialNames) {
        const source = item.references.find(ref => ref.id === brand.referenceId);
        expect(source).toMatchObject({ scope: 'product_label', verification: 'verified' });
        expect(source?.accessedAt).toBeTruthy();
        expect(brand.presentation.trim()).not.toBe('');
      }
    }
  });

  it('pesquisa nome genérico, princípio ativo, sinônimos, classes e categorias sem depender de acentos', () => {
    expect(normalizeMedicationSearch('  ÁCIDO —   Clorídrico! ')).toBe('acido cloridrico');
    expect(searchMedications('NOREPINEFRINA')[0]?.id).toBe('noradrenalina');
    expect(searchMedications('EPINEFRINA')[0]?.id).toBe('adrenalina');
    expect(searchMedications('  CLORETO DE POTASSIO ')[0]?.id).toBe('cloreto-potassio');
    for (const item of medications) {
      for (const query of [item.genericName, item.activeIngredient, ...item.aliases, item.pharmacologicalClass, item.category]) {
        expect(searchMedications(query).map(result => result.id), `${item.id}: ${query}`).toContain(item.id);
      }
      expect(searchMedications(item.genericName)[0].id).toBe(item.id);
    }
    expect(searchMedications('medicamento-nao-cadastrado-12345')).toEqual([]);
    expect(searchMedications('noradrenalina palavraimpossivel123')).toEqual([]);
  });

  it('combina categoria e filtro MPP preservando os resultados alfabéticos da consulta vazia', () => {
    expect(searchMedications('')).toEqual(medications);
    expect(searchMedications('  ')).toEqual(medications);
    expect(searchMedications('', '', true)).toEqual(medications.filter(item => item.highAlert.flagged));
    for (const category of medicationCategories) {
      expect(searchMedications('', category)).toEqual(medications.filter(item => item.category === category));
      expect(searchMedications('', category, true)).toEqual(medications.filter(item => item.category === category && item.highAlert.flagged));
    }
    expect(searchMedications('noradrenalina', 'Antimicrobianos', true)).toEqual([]);
    expect(searchMedications('', 'categoria-inexistente')).toEqual([]);
    expect(searchMedications('ceftriaxona', '', true)).toEqual([]);
  });

  it('exige bula específica conferida para marcas e permite pesquisá-las numa fixture isolada', () => {
    const fixture = verifiedBrandFixture();
    expect(() => assertMedications([fixture])).not.toThrow();
    const originalCount = medications.length;
    try {
      medications.push(fixture);
      expect(searchMedications('marca ficticia somente teste')).toEqual([fixture]);
      expect(searchMedications('MARCA FICTÍCIA', fixture.category, fixture.highAlert.flagged)).toContain(fixture);
    } finally {
      medications.splice(originalCount);
    }
    expect(medications).toHaveLength(40);
    const lookupOnly = structuredClone(fixture);
    lookupOnly.references.find(ref => ref.id === 'fixture-product-label')!.scope = 'lookup_portal';
    expect(() => assertMedications([lookupOnly])).toThrow(/Nome comercial sem bula específica/);
    const pendingLabel = structuredClone(fixture);
    const pendingRef = pendingLabel.references.find(ref => ref.id === 'fixture-product-label')!;
    pendingRef.verification = 'pending'; delete pendingRef.accessedAt;
    expect(() => assertMedications([pendingLabel])).toThrow(/Nome comercial sem bula específica/);
    for (const mutate of [
      (item: Medication) => { item.commercialNames[0].referenceId = 'fonte-ausente'; },
      (item: Medication) => { item.commercialNames[0].presentation = ''; },
      (item: Medication) => { item.commercialNames[0].verifiedAt = '2026-02-30'; },
      (item: Medication) => { item.commercialNames.push({ ...item.commercialNames[0], name: 'MARCA FICTICIA SOMENTE TESTE' }); },
    ]) {
      const entry = structuredClone(fixture); mutate(entry);
      expect(() => assertMedications([entry])).toThrow(/Nome comercial sem bula específica/);
    }
  });

  it('rejeita identificadores ou princípios ativos repetidos, categorias inválidas e campos incompletos', () => {
    expect(invalid((entry, entries) => { entries.push(structuredClone(entry)); })).toThrow(/duplicado/);
    expect(invalid((entry, entries) => { entries[1].activeIngredient = entry.activeIngredient; })).toThrow(/duplicado/);
    expect(invalid(entry => { entry.id = '../arquivo'; })).toThrow(/inválido/);
    expect(invalid(entry => { entry.category = 'Categoria inválida' as Medication['category']; })).toThrow(/Categoria/);
    expect(invalid(entry => { entry.mechanism = ' '; })).toThrow(/incompleta/);
    expect(invalid(entry => { entry.nursingCare = []; })).toThrow(/incompleta/);
    expect(invalid(entry => { entry.monitoring = [' ']; })).toThrow(/incompleta/);
    expect(invalid(entry => { entry.aliases = ['']; })).toThrow(/Alias/);
    expect(invalid(entry => { entry.routes = []; })).toThrow(/Via sem contexto/);
    expect(invalid(entry => { entry.routes[0].context = ''; })).toThrow(/Via sem contexto/);
    expect(invalid(entry => { entry.clinicalReviewStatus = 'approved' as Medication['clinicalReviewStatus']; })).toThrow(/Validação clínica não comprovada/);
    expect(invalid(entry => { entry.reviewedAt = '2026-10-30' as unknown as null; })).toThrow(/Validação clínica não comprovada/);
  });

  it('rejeita URLs inseguras, referências repetidas e alegações de conferência sem data válida', () => {
    expect(invalid(entry => { entry.references = []; })).toThrow(/Fonte de medicamento ausente/);
    for (const url of ['javascript:alert(1)', 'http://example.org', 'https://usuario:senha@example.org', 'url-invalida']) {
      expect(invalid(entry => { entry.references[0].url = url; })).toThrow(/URL de medicamento inválida/);
    }
    expect(invalid(entry => { entry.references.push(structuredClone(entry.references[0])); })).toThrow(/Referência de medicamento inválida/);
    expect(invalid(entry => { entry.references[0].note = ''; })).toThrow(/Referência de medicamento inválida/);
    expect(invalid(entry => { entry.references[0].verification = 'pending'; entry.references[0].accessedAt = '2026-10-30'; })).toThrow(/Consulta de fonte não comprovada/);
    expect(invalid(entry => { entry.references[0].verification = 'verified'; delete entry.references[0].accessedAt; })).toThrow(/Data de conferência/);
    expect(invalid(entry => { entry.references[0].verification = 'verified'; entry.references[0].accessedAt = '2026-02-30'; })).toThrow(/Data de conferência/);
  });

  it('mantém MPP ligado à apresentação ou via, sem transformar a ausência do alerta em garantia de segurança', () => {
    const flagged = medications.filter(item => item.highAlert.flagged);
    expect(flagged.length).toBeGreaterThan(0);
    expect(flagged.length).toBeLessThan(medications.length);
    for (const item of medications) {
      expect(item.highAlert.scope.trim()).not.toBe('');
      expect(item.highAlert.rationale.trim()).not.toBe('');
      expect(item.highAlert.verification).toBe('pending');
      if (item.highAlert.flagged) expect(item.references.find(ref => ref.id === item.highAlert.referenceId)).toMatchObject({ scope: 'safety' });
    }
    for (const id of ['amiodarona', 'metoprolol']) {
      const item = getMedication(id)!;
      expect(item.routes.map(route => route.name)).toEqual(expect.arrayContaining(['Intravenosa', 'Oral']));
      expect(normalizeMedicationSearch(item.highAlert.scope)).toMatch(/intravenos/);
      expect(normalizeMedicationSearch(item.highAlert.scope)).toMatch(/oral|orais/);
    }
    expect(normalizeMedicationSearch(getMedication('cloreto-potassio')!.highAlert.scope)).toMatch(/concentrado.*intravenoso/);
    expect(normalizeMedicationSearch(getMedication('cloreto-sodio')!.highAlert.scope)).toMatch(/hipertonico.*intravenoso/);
    expect(getMedication('gluconato-calcio')!.highAlert.flagged).toBe(false);
    expect(normalizeMedicationSearch(getMedication('fentanila')!.highAlert.scope)).toContain('transdermic');
    expect(normalizeMedicationSearch(getMedication('morfina')!.highAlert.scope)).toContain('orais');
    expect(invalid(entry => { entry.highAlert.scope = ''; })).toThrow(/Classificação de alto risco/);
    expect(invalid(entry => { entry.highAlert.flagged = true; entry.highAlert.referenceId = 'fonte-ausente'; })).toThrow(/Fonte de classificação/);
    expect(invalid(entry => { entry.highAlert.flagged = true; entry.highAlert.referenceId = entry.references.find(ref => ref.scope === 'lookup_portal')!.id; })).toThrow(/Fonte de classificação/);
  });

  it('resolve vínculos entre medicamentos e patologias nos dois sentidos sem inventar condições', () => {
    let linked = 0;
    for (const item of medications) {
      expect(new Set(item.relatedConditionIds).size).toBe(item.relatedConditionIds.length);
      for (const conditionId of item.relatedConditionIds) {
        linked += 1;
        expect(getClinicalCondition(conditionId)).toBeDefined();
        expect(medicationsForCondition(conditionId)).toContain(item);
      }
    }
    expect(linked).toBeGreaterThan(0);
    for (const condition of clinicalConditions) {
      expect(medicationsForCondition(condition.id)).toEqual(medications.filter(item => item.relatedConditionIds.includes(condition.id)));
    }
    expect(medicationsForCondition('patologia-inexistente')).toEqual([]);
    expect(invalid(entry => { entry.relatedConditionIds.push('patologia-inexistente'); })).toThrow(/Patologia de medicamento inexistente/);
    expect(invalid(entry => { entry.relatedConditionIds = ['sepse', 'sepse']; })).toThrow(/Patologia de medicamento inexistente/);
  });

  it('integra módulo, fichas e casos aos favoritos, à busca geral e à governança existente', () => {
    expect(medicationModule.id).toBe('module.medicamentos');
    expect(findFavorites([medicationModule.id])[0]).toMatchObject({ title: medicationModule.title, href: medicationModule.href });
    expect(searchIndex.some(item => item.id === medicationModule.id && item.href === medicationModule.href)).toBe(true);
    const destinations = [
      { id: medicationModule.id, title: medicationModule.title, href: medicationModule.href },
      ...medications.map(item => ({ id: medicationFavoriteId(item.id), title: item.genericName, href: medicationHref(item.id) })),
      ...medicationCases.map(item => ({ id: `medication-case.${item.id}`, title: item.title, href: medicationCaseHref(item.id) })),
    ];
    for (const destination of destinations) {
      expect(findFavorites([destination.id])[0], destination.id).toMatchObject(destination);
      expect(normalizeFavoriteIds([destination.id, destination.id, 'medication.javascript:alert(1)'])).toEqual([destination.id]);
      expect(searchContent(destination.title).some(result => result.href === destination.href), destination.id).toBe(true);
      expect(getContentMetadata(destination.id), destination.id).toMatchObject({ ...destination, status: 'pending_review', lastReviewedAt: null, reviewedBy: null, authorizationReference: null, publicationScope: 'educational_public' });
    }
    for (const item of medications) {
      expect(medicationFavoriteId(item.id)).toBe(`medication.${item.id}`);
      expect(medicationHref(item.id)).toBe(`#medicamentos/${item.id}`);
      expect(getContentMetadata(medicationFavoriteId(item.id))!.references.map(ref => ref.href)).toEqual(expect.arrayContaining(item.references.map(ref => ref.url)));
    }
    expect(searchContent('norepinefrina').some(result => result.href === medicationHref('noradrenalina'))).toBe(true);
    expect(findFavorites(['module.acolhimento', 'tool.calculadora']).map(item => item.href)).toEqual(['#acolhimento', '#calculadora']);
  });

  it('oferece cinco casos fictícios com respostas corretas, retorno em todas as alternativas e vínculos recíprocos', () => {
    expect(medicationCases).toHaveLength(5);
    expect(new Set(medicationCases.map(item => item.id)).size).toBe(5);
    expect(medicationCases.map(item => [item.id, item.answer])).toEqual([
      ['apresentacao-prescrita', 1], ['alarme-vasoativo', 0], ['sangramento-anticoagulante', 2], ['observacao-insulina', 1], ['reacao-antimicrobiano', 0],
    ]);
    expect(getMedicationCases()).toEqual(medicationCases);
    for (const item of medicationCases) {
      expect(item.scenario).toContain('Cenário fictício');
      expect(item.question.trim()).not.toBe('');
      expect(item.options).toHaveLength(3);
      expect(item.answer).toBeGreaterThanOrEqual(0);
      expect(item.answer).toBeLessThan(item.options.length);
      expect(item.options[item.answer].text).toMatch(/conferir|comunicar|solicitar|pedir/i);
      for (const option of item.options) {
        expect(option.text.trim()).not.toBe('');
        expect(option.feedback.trim().length).toBeGreaterThan(30);
        expect(option.feedback).not.toBe(option.text);
      }
      expect(new Set(item.options.map(option => option.feedback)).size).toBe(item.options.length);
      expect(medicationCaseHref(item.id)).toBe(`#medicamentos/casos?caso=${item.id}`);
      for (const id of item.medicationIds) {
        expect(getMedication(id), `${item.id}: ${id}`).toBeDefined();
        expect(getMedicationCases(id)).toContain(item);
      }
    }
    for (const medication of medications) {
      expect(getMedicationCases(medication.id)).toEqual(medicationCases.filter(item => item.appliesToAll || item.medicationIds.includes(medication.id)));
    }
  });
});
