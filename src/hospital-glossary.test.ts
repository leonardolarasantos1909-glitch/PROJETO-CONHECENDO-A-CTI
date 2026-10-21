import { describe, expect, it } from 'vitest';
import raw from './data/glossario-hospital.txt?raw';
import confirmation from './data/siglario-confirmacao.json';
import { filterGlossary, glossaryConfirmationLabel, glossarySource, glossaryTerms } from './hospital-glossary';
import { searchContent } from './search';
import { findFavorites } from './favorites';

const byTerm = (label: string) => glossaryTerms.filter(item => item.term === label);

describe('Transcrição do glossário fornecido para o projeto', () => {
  it('preserva o arquivo recebido e as 746 entradas sem duplicar o primeiro envio parcial', async () => {
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw));
    expect(Array.from(new Uint8Array(digest), value => value.toString(16).padStart(2, '0')).join('')).toBe('b4d467453c57ee43fce01d3087965587254677f96c104ccc0d2451630b8bbfa3');
    expect(glossaryTerms).toHaveLength(746);
    expect(new Set(glossaryTerms.map(item => item.id)).size).toBe(746);
    expect(new Set(glossaryTerms.map(item => item.term)).size).toBe(745);
    expect(byTerm('2D')).toHaveLength(1);
    expect(byTerm('CTI')[0].definition).toBe('Centro de Tratamento Intensivo');
    expect(byTerm('AVP')[0].definition).toBe('Acesso Vascular Periférico');
    expect(byTerm('ºC')[0].definition).toBe('Graus Celsius');
    for (const item of glossaryTerms) {
      expect(item.id).toMatch(/^[a-z0-9-]+$/);
      expect(item.definition.length).toBeGreaterThan(0);
      expect([glossarySource.label, glossaryConfirmationLabel]).toContain(item.sourceLabel);
      expect(item.group).toMatch(/^(0–9|[A-Z])$/);
      if (item.href) expect(item.href).toMatch(/^#[a-z-]+$/);
    }
  });

  it('mantém ambos os significados de HD e os códigos que diferem por caixa ou pontuação', () => {
    expect(byTerm('HD').map(item => item.definition)).toEqual(['Hipótese Diagnóstica', 'Hemodiálise']);
    for (const labels of [['C', 'C.', 'CA', 'Ca'], ['M', 'M.'], ['D', 'D+', 'D-', 'D0'], ['G.', 'g*']]) {
      const items = labels.map(label => byTerm(label)[0]);
      expect(items.every(Boolean)).toBe(true);
      expect(new Set(items.map(item => item.id)).size).toBe(labels.length);
    }
    expect(filterGlossary('D+')[0].definition).toBe('Dias pós-transplante');
    expect(filterGlossary('D-')[0].definition).toBe('Dias pré-transplante');
    expect(filterGlossary('CA')[0].definition).toBe('Câncer');
    expect(filterGlossary('Ca')[0].definition).toBe('Cálcio');
    expect(searchContent('C.')[0].description).toBe('Colimador');
    expect(searchContent('Ca')[0].description).toBe('Cálcio');
    expect(searchContent('D+')[0].description).toBe('Dias pós-transplante');
  });

  it('aplica NPT e a associação esclarecida de TG EXT, preservando as demais definições enviadas', () => {
    expect(byTerm('TG EXT')[0].definition).toBe('Tangente externa');
    expect(byTerm('TG EXT')[0].reviewNote).toBeUndefined();
    expect(byTerm('TS')[0].definition).toBe('Tipagem sanguínea');
    expect(byTerm('VCM')[0].definition).toBe('Volume corpuscular médio');
    expect(byTerm('TG INT')[0].definition).toBe('Tangente interna');
    expect(byTerm('NPT')[0].definition).toBe('Nutrição parenteral total');
    expect(byTerm('NPT')[0].reviewNote).toBeUndefined();
    expect(byTerm('PPlat')[0].definition).toBe('Pressão de Plantô');
    expect(byTerm('MSSA')[0].definition).toContain('Methicillin-resistant');
    for (const label of ['MSSA', 'SIRS', 'PPlat', 'VEF1', 'ECOG', 'KeV', 'MeV', 'AC + D', 'FOLFIRI', 'R-CHOP', 'R-CVP']) expect(byTerm(label)[0].reviewNote).toBeTruthy();
    expect(glossaryTerms.filter(item => item.reviewNote)).toHaveLength(11);
  });

  it('registra somente a confirmação relatada e mantém literalmente as treze entradas recebidas', () => {
    expect(Object.keys(confirmation.entries)).toHaveLength(13);
    for (const supplied of Object.values(confirmation.entries)) {
      const item = byTerm(supplied.term)[0];
      expect(item.definition).toBe(supplied.definition);
      expect(item.sourceLabel).toBe(glossaryConfirmationLabel);
    }
    expect(glossaryTerms.filter(item => item.sourceLabel === glossaryConfirmationLabel)).toHaveLength(13);
    expect(byTerm('ECOG')[0].definition).toBe('Eastern Cooperative Cooperative Group');
    expect(byTerm('KeV')[0].definition).toBe('Kilovolt');
    expect(byTerm('MV')[0].definition).toBe('Murmúrio vesicular');
    expect(byTerm('SIRS')[0].definition).toBe('Síndrome de insuficiência respiratória');
    expect(byTerm('VEF1')[0].definition).toBe('Volume Expiratório Forçado no minuto 1');
  });

  it('mantém os atalhos de PPlato, aplica PPlat e indexa os complementos sem completar medicamentos', () => {
    expect(byTerm('PPlato')).toEqual([]);
    expect(byTerm('PPlat')[0].id).toBe('pplato');
    expect(filterGlossary('PPlato')[0].id).toBe('pplato');
    expect(searchContent('PPlat')[0].href).toBe('#glossario/pplato');
    expect(findFavorites(['term.pplato'])[0].title).toBe('PPlat — Pressão de Plantô');
    expect(findFavorites(['term.pplato'])[0].href).toBe('#glossario/pplato');
    const chop = byTerm('R-CHOP')[0];
    expect(chop.definition).toBe('Rituximabe + Vincristina + Doxorrubicina + Ciclofosfamida');
    expect(chop.supplement).toContain('cinco medicamentos');
    expect(chop.reviewNote).toContain('lista recebida contém quatro');
    const cvp = byTerm('R-CVP')[0];
    expect(cvp.definition).toBe('Rituximabe + Vincristina + Ciclofosfamida');
    expect(cvp.reference?.href).toBe('https://www.cancerresearchuk.org/about-cancer/treatment/drugs/r-cvp');
    expect(filterGlossary('quimioimunoterapia').map(item => item.term)).toEqual(['R-CVP']);
    expect(searchContent('quimioimunoterapia').map(item => item.href)).toContain('#glossario/r-cvp');
  });

  it('pesquisa localmente siglas, palavras da definição, acentos, símbolos e múltiplos significados', () => {
    expect(filterGlossary('SpO₂').map(item => item.id)).toContain('spo2');
    expect(filterGlossary('hemodialise').map(item => item.term)).toContain('HD');
    expect(filterGlossary('balanco parcial').map(item => item.term)).toContain('BHP');
    expect(filterGlossary('A+B')[0].term).toBe('A + B');
    expect(filterGlossary('CVC')[0].definition).toBe('Cateter venoso central');
    expect(filterGlossary('zzzinexistente')).toEqual([]);
    expect(filterGlossary('<script>alert(1)</script>')).toEqual([]);
  });
});
