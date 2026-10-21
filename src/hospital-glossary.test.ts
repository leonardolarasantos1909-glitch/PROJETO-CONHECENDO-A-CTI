import { describe, expect, it } from 'vitest';
import raw from './data/glossario-hospital.txt?raw';
import { filterGlossary, glossarySource, glossaryTerms } from './hospital-glossary';
import { searchContent } from './search';

const byTerm = (label: string) => glossaryTerms.filter(item => item.term === label);

describe('Transcrição do glossário fornecido para o projeto', () => {
  it('preserva o arquivo recebido e as746 entradas sem duplicar o primeiro envio parcial', async () => {
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
      expect(item.sourceLabel).toBe(glossarySource.label);
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

  it('mantém o texto enviado nas pendências e destaca a associação deslocada de TG EXT', () => {
    expect(byTerm('TG EXT')[0].definition).toBe('Tangente externa');
    expect(byTerm('TG EXT')[0].reviewNote).toContain('vieram separadas');
    expect(byTerm('TS')[0].definition).toBe('Tipagem sanguínea');
    expect(byTerm('VCM')[0].definition).toBe('Volume corpuscular médio');
    expect(byTerm('TG INT')[0].definition).toBe('Tangente interna');
    expect(byTerm('NPT')[0].definition).toBe('Nutrição parenteral potal');
    expect(byTerm('PPlato')[0].definition).toBe('Pressão de Plantô');
    expect(byTerm('MSSA')[0].definition).toContain('Methicillin-resistant');
    for (const label of ['MSSA', 'SIRS', 'NPT', 'PPlato', 'VEF1', 'ECOG', 'KeV', 'MeV', 'AC + D', 'FOLFIRI', 'R-CHOP', 'R-CVP']) expect(byTerm(label)[0].reviewNote).toBeTruthy();
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
