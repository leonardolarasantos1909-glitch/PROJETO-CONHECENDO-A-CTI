import { describe, expect, it } from 'vitest';
import { assertPublishableMetadata, contentRegistry, getContentMetadata, type ContentMetadata } from './content-registry';
import { firstDayItems, glossaryTerms } from './starter-data';
import { learningMaterials } from './materials';
import { apostilas } from './apostilas';
import { scales } from './scales';
import { caseStudies } from './cases';
import { newTools } from './new-tools';
import { annotationScenarios } from './annotation-lab';
import { virtualStations } from './virtual-cti';
import { integrationItems } from './integration-checklist';
import { FEEDBACK_INSTRUMENT_VERSION } from './pbl-feedback';
import { communicationCases, communicationSituations, familyReferences, familySections } from './family-welcome';
import { familyCaseHref, familyContentReferences, familyLeafletPdfs, familySectionHref } from './family-catalog';

const fixture = (changes: Partial<ContentMetadata> = {}): ContentMetadata => ({ ...contentRegistry[0], id: 'test.fixture', references: [{ label: 'Fonte fictícia para teste do validador', href: 'https://example.org/test-only' }], ...changes });
const reviewedFixture = () => fixture({ status: 'institutional_validated', publicationScope: 'institutional_public', reviewedBy: 'Responsável fictício do teste', lastReviewedAt: '2026-10-22', authorizationReference: 'Evidência fictícia somente para teste' });

describe('Governança do catálogo público', () => {
  it('adapta os conteúdos existentes sem inventar revisão clínica ou aprovação institucional', () => {
    expect(() => assertPublishableMetadata(contentRegistry)).not.toThrow();
    expect(new Set(contentRegistry.map(item => item.id)).size).toBe(contentRegistry.length);
    expect(contentRegistry.every(item => item.status === 'pending_review' && item.reviewedBy === null && item.lastReviewedAt === null && item.authorizationReference === null && item.publicationScope === 'educational_public')).toBe(true);
    expect(contentRegistry.filter(item => item.category === 'Siglário')).toHaveLength(746);
    for (const term of glossaryTerms) expect(getContentMetadata(`term.${term.id}`)).toMatchObject({ title: term.term, description: term.definition, href: `#glossario/${term.id}` });
    for (const tool of newTools) expect(getContentMetadata(tool.id)).toMatchObject({ title: tool.title, href: tool.href });
  });

  it('preserva os PDFs e as referências específicas já existentes de escalas e casos', () => {
    const materials = [...learningMaterials, ...apostilas];
    expect(contentRegistry.filter(item => item.id.startsWith('pdf.'))).toHaveLength(9);
    for (const material of materials) {
      expect(getContentMetadata(`pdf.${material.id}`)?.references[0].href).toBe(material.href);
      expect(getContentMetadata(`material.${material.id}`)).toBe(getContentMetadata(`pdf.${material.id}`));
    }
    for (const scale of scales) expect(getContentMetadata(`scale.${scale.id}`)?.references).toEqual(scale.references);
    for (const item of caseStudies) expect(getContentMetadata(`case.${item.id}`)?.references).toEqual(item.sources);
    expect(getContentMetadata('topic.rotinas.bundle-de-prevencao-da-pav')?.references.some(ref => ref.href.includes('anvisa') || ref.href.includes('nih.gov'))).toBe(true);
  });

  it('registra lacunas explicitamente sem usar uma lista geral de portais como validação', () => {
    const noSource = contentRegistry.filter(item => !item.references.length);
    expect(noSource.length).toBeGreaterThan(0);
    expect(noSource.every(item => item.referenceStatus === 'specific_reference_pending')).toBe(true);
    expect(contentRegistry.filter(item => item.id.startsWith('module.')).every(item => item.referenceStatus === 'specific_reference_pending')).toBe(true);
    expect(getContentMetadata('topic.escalas.escala-de-coma-de-glasgow')?.referenceStatus).toBe('specific_reference_pending');
  });

  it('inclui cenários, box e os dois roteiros com a origem fornecida e sem aprovação implícita', () => {
    expect(contentRegistry.filter(item => item.id.startsWith('annotation.'))).toHaveLength(3);
    expect(contentRegistry.filter(item => item.id.startsWith('virtual.'))).toHaveLength(8);
    expect(contentRegistry.filter(item => item.id.startsWith('checklist.'))).toHaveLength(10);
    expect(contentRegistry.filter(item => item.id.startsWith('integration.'))).toHaveLength(9);
    for (const item of annotationScenarios) expect(getContentMetadata(`annotation.${item.id}`)).toMatchObject({ title: item.title, description: item.goal, references: item.sourceRefs, href: `#laboratorio/${item.id}` });
    for (const item of virtualStations) expect(getContentMetadata(`virtual.${item.id}`)).toMatchObject({ title: item.title, description: item.description, references: [item.source], href: '#cti-virtual' });
    for (const item of firstDayItems) {
      const metadata = getContentMetadata(`checklist.${item.id}`)!;
      expect(metadata).toMatchObject({ description: item.detail, recommendedAudiences: ['estagiario'], href: '#primeiro-dia' });
      expect(metadata.references).toContainEqual({ label: item.sourceLabel, href: item.href });
      if (item.sourcePage) expect(metadata.references.some(ref => ref.page === item.sourcePage)).toBe(true);
    }
    for (const item of integrationItems) expect(getContentMetadata(`integration.${item.id}`)).toMatchObject({ description: item.detail, recommendedAudiences: ['colaborador'], references: [{ label: item.sourceLabel, href: item.href }], referenceStatus: 'specific_reference_pending' });
  });

  it('registra a base funcional das ferramentas e distingue questionário próprio de instrumento validado', () => {
    for (const id of ['tool.laboratorio', 'tool.cti-virtual', 'tool.integracao', 'tool.avaliacao-pbl', 'tool.demonstracao']) {
      const metadata = getContentMetadata(id)!;
      expect(metadata.references.length).toBeGreaterThan(0);
      expect(metadata.status).toBe('pending_review');
      expect(metadata.reviewedBy).toBeNull();
    }
    expect(getContentMetadata('tool.avaliacao-pbl')).toMatchObject({ version: FEEDBACK_INSTRUMENT_VERSION, referenceStatus: 'specific_reference_pending' });
    expect(getContentMetadata('tool.avaliacao-pbl')?.notes.join(' ')).toContain('Não foi apresentado como instrumento validado');
    expect(getContentMetadata('tool.integracao')?.referenceStatus).toBe('specific_reference_pending');
    expect(getContentMetadata('tool.demonstracao')?.referenceStatus).toBe('specific_reference_pending');
  });

  it('integra os conteúdos familiares com origem rastreável e mantém a validação profissional pendente', () => {
    expect(() => familyContentReferences(['fonte-nao-cadastrada'])).toThrow(/Referência familiar não cadastrada/);
    const module = getContentMetadata('module.acolher-familia')!;
    expect(module).toMatchObject({ title: 'Acolher também é cuidar', href: '#acolher-familia', status: 'pending_review', reviewedBy: null, lastReviewedAt: null });
    expect(module.references).toEqual(familyReferences.map(item => ({ label: item.title, href: item.href })));
    for (const section of familySections) expect(getContentMetadata(`family.section.${section.id}`)).toMatchObject({ title: section.title, href: familySectionHref(section.id), category: 'Acolhimento familiar', status: 'pending_review', referenceStatus: 'specific_reference_pending' });
    for (const item of communicationCases) expect(getContentMetadata(`family.case.${item.id}`)).toMatchObject({ title: item.title, description: item.situation, href: familyCaseHref(item.id), status: 'pending_review' });
    for (const item of communicationSituations) expect(getContentMetadata(`family.speech.${item.id}`)).toMatchObject({ title: item.title, description: item.recommended, href: '#acolher-familia/falas', status: 'pending_review' });
    const references = new Set(familyReferences.map(item => item.href));
    const familyRecords = contentRegistry.filter(item => item.id.startsWith('family.'));
    expect(familyRecords).toHaveLength(21);
    for (const item of familyRecords) {
      expect(item.references.length).toBeGreaterThan(0);
      expect(item.references.every(reference => references.has(reference.href))).toBe(true);
      expect(item).toMatchObject({ lastReviewedAt: null, reviewedBy: null, authorizationReference: null, publicationScope: 'educational_public' });
    }
    for (const item of familyLeafletPdfs) {
      expect(getContentMetadata(`pdf.${item.id}`)).toMatchObject({ title: item.title, href: '#acolher-familia/material', status: 'pending_review', lastReviewedAt: null, reviewedBy: null });
      expect(getContentMetadata(`pdf.${item.id}`)?.references[0].href).toBe(item.href);
      expect(getContentMetadata(`material.${item.id}`)).toBe(getContentMetadata(`pdf.${item.id}`));
    }
  });

  it('bloqueia selos de validação institucional sem responsável, data, autorização e fontes', () => {
    expect(() => assertPublishableMetadata([fixture({ status: 'institutional_validated' })])).toThrow(/Validação institucional/);
    const valid = reviewedFixture();
    expect(() => assertPublishableMetadata([valid])).not.toThrow();
    for (const changes of [{ reviewedBy: null }, { reviewedBy: '  ' }, { lastReviewedAt: null }, { authorizationReference: null }, { authorizationReference: '  ' }, { references: [] }]) {
      expect(() => assertPublishableMetadata([{ ...valid, ...changes }])).toThrow(/Validação institucional/);
    }
    expect(() => assertPublishableMetadata([fixture({ status: 'educational_reviewed' })])).toThrow(/Revisão educativa/);
    expect(() => assertPublishableMetadata([fixture({ publicationScope: 'institutional_public' })])).toThrow(/Publicação institucional/);
  });

  it('rejeita materiais restritos, duplicações e datas ou referências inválidas', () => {
    expect(() => assertPublishableMetadata([fixture({ publicationScope: 'restricted' })])).toThrow(/Material restrito/);
    expect(() => assertPublishableMetadata([fixture(), fixture()])).toThrow(/repetido/);
    for (const lastReviewedAt of ['ontem', '2026-02-30', '2026-99-01']) expect(() => assertPublishableMetadata([fixture({ lastReviewedAt })])).toThrow(/Data de revisão inválida/);
    expect(() => assertPublishableMetadata([fixture({ references: [{ label: 'URL inválida', href: 'javascript:alert(1)' }] })])).toThrow(/Referência inválida/);
    expect(() => assertPublishableMetadata([fixture({ recommendedAudiences: [] })])).toThrow(/Metadados incompletos/);
  });
});
