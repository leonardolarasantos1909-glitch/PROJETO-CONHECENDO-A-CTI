import { describe, expect, it } from 'vitest';
import { normalizeSearch, searchCategories, searchContent, searchIndex } from './search';
import { modules } from './content';
import { topicSlug } from './favorites';
import { glossaryTerms } from './starter-data';
import { learningMaterials } from './materials';
import { apostilas } from './apostilas';
import { caseStudies } from './cases';
import { newTools } from './new-tools';
import { annotationScenarios } from './annotation-lab';
import { virtualStations } from './virtual-cti';
import { communicationCases, communicationSituations, familySections } from './family-welcome';
import { familyCaseHref, familyLeafletPdfs, familySectionHref, isFamilySection } from './family-catalog';
import { getClinicalCondition } from './clinical-dictionary';
import { getMedication, medicationCases } from './medication-guide';

describe('Busca por nome e assunto', () => {
  it('prioriza o conteúdo específico para nomes, siglas e aliases', () => {
    expect(searchContent('PAV')[0].href).toBe('#rotinas/bundle-de-prevencao-da-pav');
    expect(searchContent('bundle de PAV')[0].href).toBe('#rotinas/bundle-de-prevencao-da-pav');
    expect(searchContent('RASS')[0].href).toBe('#escalas/rass');
    expect(searchContent('Escala Visual Analógica')[0].href).toBe('#escalas/eva');
    expect(searchContent('SNE')[0].href).toBe('#glossario/sne');
    expect(searchContent('SPO2')[0].href).toBe('#glossario/spo2');
    expect(searchContent('SpO₂')).toEqual(searchContent('spo2'));
    expect(searchContent('avp')[0].href).toBe('#glossario/avp');
    expect(searchContent('avp').some(item => item.href === '#rotinas/bundle-de-prevencao-da-pav')).toBe(false);
  });

  it('aceita acentos, pontuação, espaços e palavras em outra ordem sem exigir a frase completa', () => {
    expect(normalizeSearch('  SpO₂ — CÂNULA  ')).toBe('spo2 canula');
    expect(searchContent('CÂNULA NASAL DE ALTO FLUXO')[0].href).toBe('#equipamentos/canula-nasal-de-alto-fluxo');
    expect(searchContent('alto fluxo canula')[0].href).toBe('#equipamentos/canula-nasal-de-alto-fluxo');
    expect(searchContent('PAV cuff').map(item => item.href)).toContain('#rotinas/bundle-de-prevencao-da-pav');
    expect(searchContent('oral higiene')[0].href).toBe('#rotinas/bundle-de-prevencao-da-pav');
    expect(searchContent('  CVC  ')).toEqual(searchContent('cvc'));
    expect(searchContent('monitor-multiparametrico')).toEqual(searchContent('monitor multiparamétrico'));
  });

  it('leva aos PDFs, ferramentas e casos pelos destinos internos corretos', () => {
    expect(searchContent('Medicações e Bombas de Infusão')[0].href).toBe('#biblioteca/medicacoes-bombas-infusao');
    expect(searchContent('Caderno de bolso para imprimir')[0].href).toBe('#biblioteca/caderno-bolso');
    expect(searchContent('livro')[0].href).toBe('#caderno');
    expect(searchContent('meus favoritos')[0].href).toBe('#favoritos');
    expect(searchContent('checklist')[0].href).toBe('#primeiro-dia');
    expect(searchContent('A sonda está liberada para uso?')[0].href).toBe('#quiz/duvida-sobre-sonda');
  });

  it('prioriza palavras inteiras e mantém a busca por parte do nome', () => {
    const painResults = searchContent('dor');
    expect(painResults[0].href).toMatch(/^#(?:escalas(?:\/|$)|glossario\/(?:eva|bps|painad)$)/);
    expect(painResults.findIndex(item => item.href === '#escalas/eva')).toBeLessThan(painResults.findIndex(item => item.title === 'Ventilador mecânico'));
    expect(searchContent('canu')[0].href).toBe('#equipamentos/canula-nasal-de-alto-fluxo');
    expect(searchContent('infus').some(item => item.title.includes('infusão'))).toBe(true);
  });

  it('não lista resultados sem termo e não inventa respostas para consultas desconhecidas', () => {
    for (const query of ['', '   ', '!!!', 'inexistentezzz', '<script>alert(1)</script>']) expect(searchContent(query)).toEqual([]);
    const results = searchContent('dor');
    expect(results.length).toBeGreaterThan(5);
    expect(new Set(results.map(item => item.id)).size).toBe(results.length);
    expect(searchContent('dor')).toEqual(results);
  });

  it('indexa cada nome do catálogo uma vez e mantém todos os destinos dentro do app', () => {
    expect(new Set(searchIndex.map(item => item.id)).size).toBe(searchIndex.length);
    expect(searchIndex.filter(item => item.kind === 'Módulo')).toHaveLength(modules.length + 2);
    expect(searchIndex.filter(item => item.kind === 'PDF')).toHaveLength(9);
    expect(searchIndex.filter(item => item.kind === 'Caso simulado')).toHaveLength(13 + medicationCases.length);
    const materialIds = [...learningMaterials, ...apostilas, ...familyLeafletPdfs].map(item => item.id);
    for (const item of searchIndex) {
      expect(item.title).toBeTruthy();
      expect(item.description).toBeTruthy();
      expect(item.external).not.toBe(true);
      expect(item.href).toMatch(/^#[a-z0-9-]+(?:\/[a-z0-9-]+)?(?:\?caso=[a-z0-9-]+)?$/);
      const [path, query] = item.href.slice(1).split('?');
      const [route, target] = path.split('/');
      if (route === 'glossario') { if (target) expect(glossaryTerms.some(term => term.id === target)).toBe(true); }
      else if (route === 'dicionario-clinico') { if (target) expect(getClinicalCondition(target)).toBeDefined(); }
      else if (route === 'medicamentos') {
        if (target === 'casos') { if (query) expect(medicationCases.some(item => item.id === new URLSearchParams(query).get('caso'))).toBe(true); }
        else if (target) expect(getMedication(target)).toBeDefined();
      }
      else if (route === 'acolher-familia') {
        if (target) expect(isFamilySection(target)).toBe(true);
        if (query) {
          expect(target).toBe('simulador');
          expect(communicationCases.some(item => item.id === new URLSearchParams(query).get('caso'))).toBe(true);
        }
      }
      else if (route === 'biblioteca') { if (target) expect(materialIds).toContain(target); }
      else if (route === 'quiz') { if (target) expect(caseStudies.some(studyCase => studyCase.id === target)).toBe(true); }
      else if (route === 'laboratorio') { if (target) expect(annotationScenarios.some(scenario => scenario.id === target)).toBe(true); }
      else if (['caderno', 'primeiro-dia', 'favoritos'].includes(route) || newTools.some(tool => tool.href === `#${route}`)) expect(target).toBeUndefined();
      else {
        const module = modules.find(entry => entry.id === route);
        expect(module).toBeDefined();
        if (target && route === 'escalas' && ['eva', 'bps', 'painad', 'rass'].includes(target)) continue;
        if (target) expect(module!.topics.some(topic => topicSlug(topic.title) === target)).toBe(true);
      }
    }
  });
  it('encontra o Siglário pelo nome novo e pelo nome anterior', () => {
    for (const query of ['Siglário', 'siglario', 'glossario']) {
      expect(searchContent(query)[0].title).toBe('Siglário');
      expect(searchContent(query)[0].href).toBe('#glossario');
    }
    expect(searchIndex.filter(item => item.kind === 'Siglário')).toHaveLength(746);
    expect(searchIndex.some(item => item.kind as string === 'Glossário')).toBe(false);
  });

  it('filtra por categoria mantendo a relevância e todos os resultados relacionados', () => {
    const all = searchContent('pressao');
    expect(new Set(all.map(item => item.kind)).size).toBeGreaterThan(1);
    for (const category of searchCategories) {
      expect(searchContent('pressão', category)).toEqual(all.filter(item => item.kind === category));
      expect(searchContent('', category)).toEqual([]);
    }
    expect(searchContent('pressao', 'Siglário').length).toBeGreaterThan(4);
    expect(searchContent('RASS', 'Escala')[0].href).toBe('#escalas/rass');
    expect(searchContent('RASS', '')).toEqual(searchContent('RASS'));
    expect(searchContent('PAV', 'Assunto')[0].href).toBe('#rotinas/bundle-de-prevencao-da-pav');
  });

  it('inclui as novas ferramentas sem remover os atalhos anteriores', () => {
    for (const tool of newTools) {
      expect(searchIndex.find(item => item.id === tool.id)).toMatchObject({ href: tool.href, kind: 'Ferramenta', title: tool.title });
      expect(searchContent(tool.title, 'Ferramenta')[0].id).toBe(tool.id);
    }
    expect(searchContent('feedback', 'Ferramenta')[0].href).toBe('#avaliacao-pbl');
    expect(searchContent('rubrica', 'Ferramenta')[0].href).toBe('#laboratorio');
    expect(searchContent('checklist')[0].href).toBe('#primeiro-dia');
    expect(searchContent('monitor')[0].href).toBe('#equipamentos/monitor-multiparametrico');
    expect(searchContent('ventilador')[0].href).toBe('#equipamentos/ventilador-mecanico');
  });

  it('encontra os exercícios específicos pelo nome e pelos fatos fictícios sem indexar rascunhos do usuário', () => {
    for (const scenario of annotationScenarios) {
      const result = searchContent(scenario.title, 'Ferramenta')[0];
      expect(result).toMatchObject({ id: `annotation.${scenario.id}`, href: `#laboratorio/${scenario.id}`, description: scenario.goal });
    }
    expect(searchContent('volume nao pode ser medido', 'Ferramenta').some(item => item.id === 'annotation.volume-nao-medido')).toBe(true);
    expect(searchContent('alguem escreveu um rascunho privado inexistente', 'Ferramenta')).toEqual([]);
    expect(searchIndex.filter(item => item.id.startsWith('annotation.'))).toHaveLength(3);
    expect(searchIndex.filter(item => item.id.startsWith('virtual.'))).toHaveLength(8);
    for (const station of virtualStations) expect(searchIndex.find(item => item.id === `virtual.${station.id}`)?.href).toBe('#cti-virtual');
  });

  it('localiza acolhimento familiar, falas, oito simulações e as duas versões do folheto', () => {
    expect(searchContent('Acolher também é cuidar')[0]).toMatchObject({ id: 'module.acolher-familia', href: '#acolher-familia', kind: 'Módulo' });
    expect(searchContent('humanizacao', 'Módulo').some(item => item.href === '#acolher-familia')).toBe(true);
    expect(searchContent('paciente sedado').some(item => item.href === '#acolher-familia/visitante')).toBe(true);
    expect(searchContent('um visitante por vez').some(item => item.href === '#acolher-familia/visitante')).toBe(true);
    for (const section of familySections) expect(searchIndex.find(item => item.id === `family.section.${section.id}`)).toMatchObject({ title: section.title, href: familySectionHref(section.id), kind: 'Assunto' });
    for (const item of communicationSituations) expect(searchIndex.find(entry => entry.id === `family.speech.${item.id}`)).toMatchObject({ title: item.title, href: '#acolher-familia/falas' });
    for (const item of communicationCases) {
      expect(searchIndex.find(entry => entry.id === `family.case.${item.id}`)).toMatchObject({ title: item.title, href: familyCaseHref(item.id), kind: 'Caso simulado' });
      expect(searchContent(item.title, 'Caso simulado').some(entry => entry.id === `family.case.${item.id}`)).toBe(true);
    }
    for (const item of familyLeafletPdfs) expect(searchContent(item.title, 'PDF').some(entry => entry.id === `material.${item.id}`)).toBe(true);
    expect(searchIndex.filter(item => item.id.startsWith('family.case.'))).toHaveLength(8);
    expect(searchIndex.filter(item => item.id.startsWith('family.speech.'))).toHaveLength(8);
    expect(searchIndex.filter(item => item.id.startsWith('family.section.'))).toHaveLength(5);
  });

  it('encontra a calculadora comum pelo nome e pelas operações básicas', () => {
    for (const query of ['calculadora', 'calculadora comum', 'soma', 'subtracao', 'multiplicacao', 'divisao']) {
      expect(searchContent(query, 'Ferramenta')[0]).toMatchObject({ id: 'tool.calculadora', href: '#calculadora' });
    }
  });

});
