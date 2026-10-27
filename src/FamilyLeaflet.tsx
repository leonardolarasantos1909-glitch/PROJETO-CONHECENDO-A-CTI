import { useEffect, useId, useRef, useState, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, ArrowRight, BookOpen, Download, Printer } from 'lucide-react';
import leaflet from './data/family-leaflet.json';
import './family-leaflet.css';

const a4 = leaflet.pdfs.find(pdf => pdf.layout === 'booklet-a4')!;
const a5 = leaflet.pdfs.find(pdf => pdf.layout === 'reading-a5')!;
const issueDate = leaflet.updatedAt.split('-').reverse().join('/');

/** Original vector illustration: conversation and partnership, without real people. */
function FamilyIllustration() {
  return <svg className="family-leaflet-illustration" viewBox="0 0 320 160" role="img" aria-label="Desenho educativo de duas pessoas conversando, com um coração representando acolhimento e parceria.">
    <g fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="76" cy="48" r="19"/><circle cx="244" cy="48" r="19"/>
      <path d="M40 135v-26c0-21 16-36 36-36s36 15 36 36v26M208 135v-26c0-21 16-36 36-36s36 15 36 36v26"/>
      <path d="M94 105l37 23 29-13 29 13 37-23M70 93v27M60 107h20"/>
      <path d="M160 94l-28-25c-20-18 7-44 28-21 21-23 48 3 28 21z"/>
      <path d="M115 27l9-9h72v21h-17M205 38l-9 9"/>
    </g>
  </svg>;
}

export function FamilyLeafletPage({ pageNumber, headingRef }: { pageNumber: number; headingRef?: RefObject<HTMLHeadingElement | null> }) {
  const page = leaflet.pages.find(item => item.number === pageNumber)!;
  return <article className={`family-leaflet-panel${pageNumber === 1 ? ' family-leaflet-cover' : ''}`} data-page={pageNumber} aria-label={`Página ${pageNumber}: ${page.title}`}>
    <div className="family-leaflet-page-content">
      <p className="family-leaflet-project">{leaflet.projectName} · Para familiares</p>
      <h3 ref={headingRef} tabIndex={headingRef ? -1 : undefined}>{page.title}</h3>
      {page.subtitle && <p className="family-leaflet-subtitle">{page.subtitle}</p>}
      {page.intro && <p className="family-leaflet-intro">{page.intro}</p>}
      {pageNumber === 1 && <FamilyIllustration/>}
      {page.blocks?.map(block => <section className="family-leaflet-block" key={block.title}><h4>{block.title}</h4><p>{block.text}</p></section>)}
      {page.message && <p className="family-leaflet-message">{page.message}</p>}
    </div>
    <div className="family-leaflet-page-footer">
      <p>{leaflet.statusNotice}</p>
      <p>Versão {leaflet.version} · Atualização editorial: {issueDate}</p>
      <p>Revisão clínica: não realizada · Revisão institucional: pendente</p>
      <span>{pageNumber} / 4</span>
    </div>
  </article>;
}

/** Preview is native HTML; the original, printable PDF remains a real download. */
export default function FamilyLeaflet() {
  const [pageIndex, setPageIndex] = useState(0);
  const [printHost, setPrintHost] = useState<HTMLElement | null>(null);
  const [printNotice, setPrintNotice] = useState('');
  const previousPage = useRef(0);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const prefix = useId();
  useEffect(() => {
    const host = document.createElement('div');
    host.className = 'family-leaflet-print-root';
    const previousMarker = document.body.getAttribute('data-family-leaflet-print');
    document.body.setAttribute('data-family-leaflet-print', 'ready');
    document.body.append(host);
    setPrintHost(host);
    return () => {
      host.remove();
      if (previousMarker === null) document.body.removeAttribute('data-family-leaflet-print');
      else document.body.setAttribute('data-family-leaflet-print', previousMarker);
    };
  }, []);
  useEffect(() => {
    if (previousPage.current !== pageIndex) headingRef.current?.focus({ preventScroll: true });
    previousPage.current = pageIndex;
  }, [pageIndex]);

  function print() {
    try {
      window.print();
      setPrintNotice('Confira A4 em paisagem, tamanho real e frente e verso pela borda curta. Faça uma cópia de teste antes de distribuir.');
    } catch {
      setPrintNotice('O navegador não abriu a impressão. Baixe o PDF e use a opção de imprimir do visualizador do aparelho ou de um computador.');
    }
  }

  return <section className="family-leaflet" aria-labelledby={`${prefix}-title`}>
    <h2 id={`${prefix}-title`}>Material para entregar ao familiar</h2>
    <p className="family-leaflet-description">{leaflet.fullTitle}. Confira as quatro páginas abaixo. A entrega aos familiares depende da validação da enfermeira responsável e da instituição.</p>
    <div className="family-leaflet-actions">
      <a className="button" href={a4.href} download="bem-vindo-cti-folheto-a4-frente-verso.pdf" target="_blank" rel="noopener noreferrer" aria-describedby={`${prefix}-save-help`}><Download size={18} aria-hidden="true"/>Baixar PDF</a>
      <button type="button" className="family-leaflet-secondary" onClick={print} disabled={!printHost}><Printer size={18} aria-hidden="true"/>Imprimir</button>
      <a className="family-leaflet-reading" href={a5.href} target="_blank" rel="noopener noreferrer"><BookOpen size={18} aria-hidden="true"/>PDF para leitura<span className="sr-only"> — abre em outra aba</span></a>
    </div>
    <p className="family-leaflet-small" id={`${prefix}-save-help`}>O botão Baixar PDF entrega duas páginas A4 já montadas para impressão. Se o navegador abrir o arquivo, ele será exibido em outra aba. O PDF para leitura traz as quatro páginas A5 em sequência. No iPhone, você também pode usar Compartilhar → Salvar em Arquivos; no Android, procure o arquivo em Downloads.</p>
    <nav className="family-leaflet-pages" aria-label="Páginas da prévia do folheto">{leaflet.pages.map((page, index) => <button key={page.number} type="button" aria-label={`Ver página ${page.number}: ${page.title}`} aria-current={pageIndex === index ? 'page' : undefined} onClick={() => setPageIndex(index)}>{page.number}</button>)}</nav>
    <div className="family-leaflet-preview" id={`${prefix}-preview`}><FamilyLeafletPage pageNumber={pageIndex + 1} headingRef={headingRef}/></div>
    <div className="family-leaflet-controls">
      <button type="button" className="family-leaflet-secondary" aria-label="Página anterior do folheto" aria-controls={`${prefix}-preview`} disabled={pageIndex === 0} onClick={() => setPageIndex(index => index - 1)}><ArrowLeft size={18} aria-hidden="true"/>Anterior</button>
      <p role="status">Página {pageIndex + 1} de {leaflet.pages.length}</p>
      <button type="button" className="family-leaflet-secondary" aria-label="Próxima página do folheto" aria-controls={`${prefix}-preview`} disabled={pageIndex === leaflet.pages.length - 1} onClick={() => setPageIndex(index => index + 1)}>Próxima<ArrowRight size={18} aria-hidden="true"/></button>
    </div>
    <details className="family-leaflet-print-help"><summary>Como imprimir e dobrar o folheto</summary><ol>{leaflet.print.instructions.map(instruction => <li key={instruction}>{instruction}</li>)}</ol><p>Não é preciso informar dados do paciente. O folheto não define horários de visita nem regras específicas de um setor.</p></details>
    {printNotice && <p role="status" className="family-leaflet-print-notice">{printNotice}</p>}
    {printHost && createPortal(<>{leaflet.print.sheets.map((sheet, index) => <div className="family-leaflet-print-sheet" data-side={index === 0 ? 'frente' : 'verso'} key={index}>{sheet.map(pageNumber => <FamilyLeafletPage key={pageNumber} pageNumber={pageNumber}/>)}</div>)}</>, printHost)}
  </section>;
}
