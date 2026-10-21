import { describe, expect, it } from 'vitest';
import { normalizeSearch, searchContent, searchIndex } from './search';
import { modules } from './content';
import { topicSlug } from './favorites';
import { glossaryTerms } from './starter-data';
import { learningMaterials } from './materials';
import { apostilas } from './apostilas';
import { caseStudies } from './cases';

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
    expect(searchIndex.filter(item => item.kind === 'Módulo')).toHaveLength(8);
    expect(searchIndex.filter(item => item.kind === 'PDF')).toHaveLength(7);
    expect(searchIndex.filter(item => item.kind === 'Caso simulado')).toHaveLength(5);
    const materialIds = [...learningMaterials, ...apostilas].map(item => item.id);
    for (const item of searchIndex) {
      expect(item.title).toBeTruthy();
      expect(item.description).toBeTruthy();
      expect(item.external).not.toBe(true);
      expect(item.href).toMatch(/^#[a-z0-9-]+(?:\/[a-z0-9-]+)?$/);
      const [route, target] = item.href.slice(1).split('/');
      if (route === 'glossario') { if (target) expect(glossaryTerms.some(term => term.id === target)).toBe(true); }
      else if (route === 'biblioteca') { if (target) expect(materialIds).toContain(target); }
      else if (route === 'quiz') { if (target) expect(caseStudies.some(studyCase => studyCase.id === target)).toBe(true); }
      else if (['caderno', 'primeiro-dia', 'favoritos'].includes(route)) expect(target).toBeUndefined();
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

});
