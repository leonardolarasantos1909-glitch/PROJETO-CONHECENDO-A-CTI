import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import FamilyLeaflet, { FamilyLeafletPage } from './FamilyLeaflet';
import leaflet from './data/family-leaflet.json';

describe('Folheto para familiares', () => {
  it('mantém quatro páginas lógicas e a imposição frente/verso, sem apresentar aprovação institucional', () => {
    expect(leaflet.pages.map(page => page.number)).toEqual([1, 2, 3, 4]);
    expect(leaflet.print.sheets).toEqual([[4, 1], [2, 3]]);
    expect(leaflet.lastClinicalReview).toBeNull();
    expect(leaflet.validationStatus).toBe('pending_institutional_review');
    expect(leaflet.pdfs.map(pdf => pdf.pages)).toEqual([2, 4]);
    expect(JSON.stringify(leaflet)).not.toMatch(/CTI Cardio|um visitante por vez/i);
  });

  it('oferece leitura HTML de cada página com o mesmo conteúdo da fonte, sem imagem de paciente ou iframe', () => {
    for (const page of leaflet.pages) {
      const markup = renderToStaticMarkup(<FamilyLeafletPage pageNumber={page.number}/>);
      expect(markup).toContain(`data-page="${page.number}"`);
      expect(markup).toContain(page.title);
      expect(markup).toContain(leaflet.statusNotice);
      for (const block of page.blocks ?? []) {
        expect(markup).toContain(block.title);
        expect(markup).toContain(block.text);
      }
      if (page.message) expect(markup).toContain(page.message);
      expect(markup).not.toMatch(/<iframe|<object|<embed|<img|<input|<textarea/);
    }
    expect(leaflet.pages[1].blocks?.find(block => block.title === 'Quando há sedação')?.text).toContain('Não é possível garantir');
  });

  it('expõe download real, impressão e quatro seletores nomeados sem coleta de informações', () => {
    const markup = renderToStaticMarkup(<FamilyLeaflet/>);
    expect(markup).toContain('Baixar PDF');
    expect(markup).toContain('Imprimir');
    expect(markup).toContain('href="/materiais/acolher-familia/folheto-familia-a4.pdf"');
    expect(markup).toContain('download="bem-vindo-cti-folheto-a4-frente-verso.pdf"');
    expect(markup).toContain('Página 1 de 4');
    expect((markup.match(/aria-label="Ver página /g) ?? []).length).toBe(4);
    expect(markup).not.toMatch(/<form|<input|<textarea|<iframe|<object|<embed/);
  });
});
