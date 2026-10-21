import { describe, expect, it } from 'vitest';
import { appPdfs, findAppPdf, pdfReaderLink, validPdfPage } from './pdf-catalog';

describe('Leitor interno dos PDFs', () => {
  it('permite somente os sete documentos do catálogo preservado', () => {
    expect(appPdfs).toHaveLength(7);
    expect(new Set(appPdfs.map(item => item.id)).size).toBe(7);
    expect(findAppPdf('curativos-feridas')?.pages).toBe(33);
    for (const id of [undefined, 'desconhecido', '__proto__', '../../outro.pdf', 'https://exemplo.com']) expect(findAppPdf(id)).toBeUndefined();
    for (const item of appPdfs) {
      expect(item.href).toMatch(/^\/materiais\/(?:apostilas\/)?[a-z0-9-]+\.pdf$/);
      expect(pdfReaderLink(item.href)).toEqual({ href: `#pdf/${item.id}?page=1` });
    }
  });
  it('preserva a página de referências locais sem abrir outra aba', () => {
    expect(pdfReaderLink('/materiais/caderno-cti-adulto-digital.pdf#page=43')).toEqual({ href: '#pdf/caderno-digital?page=43' });
    expect(pdfReaderLink('/materiais/apostilas/cuidados-paciente-critico.pdf#page=4')).toEqual({ href: '#pdf/cuidados-paciente-critico?page=4' });
    expect(pdfReaderLink('https://www.gov.br/anvisa/')).toEqual({ href: 'https://www.gov.br/anvisa/', target: '_blank', rel: 'noopener noreferrer' });
  });
  it('aceita apenas páginas inteiras dentro do documento', () => {
    expect(validPdfPage('96', 96)).toBe(96);
    for (const value of [undefined, null, '', 'texto', '-1', '0', '97', '1.2', 'Infinity', '<script>']) expect(validPdfPage(value, 96)).toBe(1);
  });
});
