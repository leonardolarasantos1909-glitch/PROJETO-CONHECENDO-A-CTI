import { useEffect, useRef } from 'react';
import { ArrowLeft, ArrowUpRight, Download, House } from 'lucide-react';
import { validPdfPage, type AppPdf } from './pdf-catalog';
import ContentReview from './ContentReview';
import './pdf-reader.css';

/** Keep older #pdf links usable without embedding a reduced document preview. */
export default function PdfReader({ material, initialPage }: { material: AppPdf; initialPage?: string | null }) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const page = validPdfPage(initialPage, material.pages);
  useEffect(() => { headingRef.current?.focus({ preventScroll: true }); }, []);

  return <section className="pdf-reader" aria-labelledby="pdf-reader-title">
    <div className="pdf-reader-toolbar">
      <a className="pdf-reader-back" href={`#biblioteca/${material.id}`}><ArrowLeft size={19} aria-hidden="true"/>Voltar à biblioteca</a>
      <a href="#inicio"><House size={18} aria-hidden="true"/>Início</a>
    </div>
    <h1 ref={headingRef} id="pdf-reader-title" tabIndex={-1}>{material.title}</h1>
    <p>Abra o arquivo PDF original no visualizador do seu aparelho para ampliar e ler as páginas.</p>
    {page > 1 && <p>Esta referência é da <strong>página {page} de {material.pages}</strong>. Se o visualizador abrir na capa, procure esse número de página.</p>}
    <div className="pdf-reader-actions">
      <a className="pdf-reader-open" href={`${material.href}#page=${page}`} target="_blank" rel="noopener noreferrer"><ArrowUpRight size={19} aria-hidden="true"/>Abrir PDF<span className="sr-only"> (abre em outra aba ou no visualizador do aparelho)</span></a>
      <a href={material.href} download={material.filename}><Download size={18} aria-hidden="true"/>Baixar PDF</a>
    </div>
    <p className="pdf-reader-return">O aplicativo permanece aberto. Para voltar, feche apenas a aba do PDF e selecione a aba do Conhecendo a CTI. Se o arquivo abrir em outro aplicativo, volte pelo alternador de aplicativos ou pelo ícone do Conhecendo a CTI.</p>
    <ContentReview contentId={`pdf.${material.id}`}/>
  </section>;
}
