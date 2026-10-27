import { describe, expect, it } from 'vitest';
import { appPdfs, findAppPdf, pdfReaderLink, validPdfPage } from './pdf-catalog';
import { familyLeafletPdfs } from './family-catalog';

describe('Acesso aos PDFs originais', () => {
  it('preserva os sete documentos anteriores e aceita somente os dois novos folhetos conhecidos', () => {
    expect(appPdfs).toHaveLength(9);
    expect(appPdfs.filter(item => !item.id.startsWith('familia-'))).toHaveLength(7);
    expect(new Set(appPdfs.map(item => item.id)).size).toBe(9);
    expect(findAppPdf('curativos-feridas')?.pages).toBe(33);
    for (const id of [undefined, 'desconhecido', '__proto__', '../../outro.pdf', 'https://exemplo.com']) expect(findAppPdf(id)).toBeUndefined();
    for (const item of appPdfs) {
      expect(item.href).toMatch(/^\/materiais\/(?:(?:apostilas|acolher-familia)\/)?[a-z0-9-]+\.pdf$/);
      expect(pdfReaderLink(item.href)).toEqual({ href: `${item.href}#page=1`, target: '_blank', rel: 'noopener noreferrer' });
    }
  });
  it('diferencia a paginação do folheto imposto A4 e da leitura sequencial A5', () => {
    expect(familyLeafletPdfs.map(item => item.id)).toEqual(['familia-a4', 'familia-a5']);
    expect(findAppPdf('familia-a4')).toMatchObject({ href: '/materiais/acolher-familia/folheto-familia-a4.pdf', pages: 2 });
    expect(findAppPdf('familia-a5')).toMatchObject({ href: '/materiais/acolher-familia/folheto-familia-a5.pdf', pages: 4 });
    expect(pdfReaderLink('/materiais/acolher-familia/folheto-familia-a4.pdf#page=2').href).toBe('/materiais/acolher-familia/folheto-familia-a4.pdf#page=2');
    expect(pdfReaderLink('/materiais/acolher-familia/folheto-familia-a4.pdf#page=4').href).toBe('/materiais/acolher-familia/folheto-familia-a4.pdf#page=1');
    expect(pdfReaderLink('/materiais/acolher-familia/folheto-familia-a5.pdf#page=4').href).toBe('/materiais/acolher-familia/folheto-familia-a5.pdf#page=4');
  });
  it('abre o arquivo original e preserva a página da referência em outra aba', () => {
    expect(pdfReaderLink('/materiais/caderno-cti-adulto-digital.pdf#page=43')).toEqual({ href: '/materiais/caderno-cti-adulto-digital.pdf#page=43', target: '_blank', rel: 'noopener noreferrer' });
    expect(pdfReaderLink('/materiais/apostilas/cuidados-paciente-critico.pdf#page=4')).toEqual({ href: '/materiais/apostilas/cuidados-paciente-critico.pdf#page=4', target: '_blank', rel: 'noopener noreferrer' });
    expect(pdfReaderLink('https://www.gov.br/anvisa/')).toEqual({ href: 'https://www.gov.br/anvisa/', target: '_blank', rel: 'noopener noreferrer' });
  });
  it('aceita apenas páginas inteiras dentro do documento', () => {
    expect(validPdfPage('96', 96)).toBe(96);
    for (const value of [undefined, null, '', 'texto', '-1', '0', '97', '1.2', 'Infinity', '<script>']) expect(validPdfPage(value, 96)).toBe(1);
  });
});
