import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Download, House, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/legacy/build/pdf.mjs';
import type { PDFDocumentProxy, RenderTask } from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/legacy/build/pdf.worker.min.mjs?url';
import { pdfReaderLink, validPdfPage, type AppPdf } from './pdf-catalog';
import './pdf-reader.css';

GlobalWorkerOptions.workerSrc = workerUrl;
type PageLink = { label: string; href?: string; page?: number };

export default function PdfReader({ material, initialPage }: { material: AppPdf; initialPage?: string | null }) {
  const [document, setDocument] = useState<PDFDocumentProxy | null>(null);
  const [page, setPage] = useState(() => validPdfPage(initialPage, material.pages));
  const [pageInput, setPageInput] = useState(String(page));
  const [attempt, setAttempt] = useState(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [rendering, setRendering] = useState(true);
  const [width, setWidth] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [text, setText] = useState('');
  const [links, setLinks] = useState<PageLink[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const total = document?.numPages ?? material.pages;

  useEffect(() => { headingRef.current?.focus({ preventScroll: true }); }, []);
  useEffect(() => { setPage(validPdfPage(initialPage, material.pages)); }, [initialPage, material.id, material.pages]);
  useEffect(() => { setPageInput(String(page)); }, [page]);
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const resize = () => setWidth(Math.max(1, viewport.clientWidth - 24));
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;
    setDocument(null); setProgress(0); setError(''); setRendering(true);
    const task = getDocument({
      url: material.href,
      cMapUrl: '/pdfjs/cmaps/', cMapPacked: true,
      standardFontDataUrl: '/pdfjs/standard_fonts/', wasmUrl: '/pdfjs/wasm/',
      enableXfa: false,
      disableRange: true, disableStream: true, disableAutoFetch: true,
    });
    task.onProgress = ({ loaded, total: bytes }: { loaded: number; total: number }) => {
      if (!cancelled && bytes > 0) setProgress(Math.min(100, Math.round(loaded / bytes * 100)));
    };
    task.promise.then(pdf => {
      if (cancelled) return;
      setPage(current => validPdfPage(current, pdf.numPages));
      setDocument(pdf);
    }).catch(() => {
      if (!cancelled) setError('Não foi possível carregar este PDF. Confira a conexão e tente novamente. Se ele já estava salvo, o navegador pode ter removido a cópia offline.');
    });
    return () => { cancelled = true; void task.destroy().catch(() => {}); };
  }, [material.href, attempt]);

  useEffect(() => {
    if (!document || !width) return;
    let cancelled = false;
    let renderTask: RenderTask | undefined;
    setRendering(true); setError(''); setText(''); setLinks([]);
    const render = async () => {
      const pdfPage = await document.getPage(page);
      if (cancelled || !canvasRef.current) return;
      const natural = pdfPage.getViewport({ scale: 1 });
      const viewport = pdfPage.getViewport({ scale: width / natural.width * zoom });
      const outputScale = Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(8_000_000 / (viewport.width * viewport.height)));
      const canvas = canvasRef.current;
      canvas.width = Math.ceil(viewport.width * outputScale);
      canvas.height = Math.ceil(viewport.height * outputScale);
      canvas.style.width = `${viewport.width}px`;
      canvas.style.height = `${viewport.height}px`;
      renderTask = pdfPage.render({ canvas, viewport, transform: [outputScale, 0, 0, outputScale, 0, 0] });
      // Cancellation may happen while text or link extraction is still running.
      const rendered = renderTask.promise;
      void rendered.catch(() => {});
      const contents = await pdfPage.getTextContent();
      if (!cancelled) setText(contents.items.map(item => 'str' in item ? `${item.str}${item.hasEOL ? '\n' : ' '}` : '').join(''));
      const annotations = await pdfPage.getAnnotations({ intent: 'display' });
      const pageLinks: PageLink[] = [];
      for (const annotation of annotations) {
        if (annotation.subtype !== 'Link') continue;
        if (typeof annotation.url === 'string' && /^(https?:|mailto:)/i.test(annotation.url)) {
          pageLinks.push({ label: annotation.url, href: annotation.url });
        } else if (annotation.dest) {
          try {
            const destination = typeof annotation.dest === 'string' ? await document.getDestination(annotation.dest) : annotation.dest;
            if (!destination?.length) continue;
            const number = typeof destination[0] === 'number' ? destination[0] + 1 : await document.getPageIndex(destination[0]) + 1;
            if (number >= 1 && number <= document.numPages) pageLinks.push({ label: `Ir para página ${number}`, page: number });
          } catch { /* A malformed PDF link must not block reading. */ }
        }
      }
      if (!cancelled) setLinks(pageLinks);
      await rendered;
      if (!cancelled) setRendering(false);
    };
    render().catch(error => {
      if (!cancelled && error?.name !== 'RenderingCancelledException') {
        setRendering(false);
        setError('Esta página não carregou. Tente novamente ou baixe o PDF para ler no seu aparelho.');
      }
    });
    return () => { cancelled = true; renderTask?.cancel(); };
  }, [document, page, width, zoom, attempt]);

  function goToPage(next: number) {
    if (!Number.isSafeInteger(next) || next < 1 || next > total) return;
    setPage(next);
    requestAnimationFrame(() => viewportRef.current?.scrollIntoView({ block: 'start', behavior: 'auto' }));
  }
  function jump(event: FormEvent) {
    event.preventDefault();
    const number = Number(pageInput);
    if (Number.isSafeInteger(number) && number >= 1 && number <= total) goToPage(number);
  }

  return <section className="pdf-reader" aria-labelledby="pdf-reader-title">
    <div className="pdf-reader-toolbar">
      <a className="pdf-reader-back" href={`#biblioteca/${material.id}`}><ArrowLeft size={19} aria-hidden="true"/>Voltar à biblioteca</a>
      <a className="pdf-reader-home" href="#inicio"><House size={18} aria-hidden="true"/>Início</a>
    </div>
    <h1 ref={headingRef} id="pdf-reader-title" tabIndex={-1}>{material.title}</h1>
    <p className="pdf-reader-intro">Leia uma página por vez. Use “Voltar à biblioteca” ou “Início” para sair do documento.</p>
    <div className="pdf-reader-navigation" aria-label="Páginas do PDF">
      <button disabled={!document || page <= 1} onClick={() => goToPage(page - 1)}><ChevronLeft size={18} aria-hidden="true"/>Anterior</button>
      <span aria-live="polite" aria-atomic="true">Página {page} de {total}</span>
      <button disabled={!document || page >= total} onClick={() => goToPage(page + 1)}>Próxima<ChevronRight size={18} aria-hidden="true"/></button>
    </div>
    <div className="pdf-reader-options">
      <form onSubmit={jump}><label htmlFor="pdf-page-number">Ir para página</label><input id="pdf-page-number" type="number" inputMode="numeric" min={1} max={total} step={1} value={pageInput} onChange={event => setPageInput(event.target.value)}/><button disabled={!document}>Ir</button></form>
      <div className="pdf-reader-zoom"><button aria-label="Diminuir página" disabled={zoom <= 1} onClick={() => setZoom(value => Math.max(1, value - .25))}><ZoomOut size={19}/></button><span>{Math.round(zoom * 100)}%</span><button aria-label="Ampliar página" disabled={zoom >= 2} onClick={() => setZoom(value => Math.min(2, value + .25))}><ZoomIn size={19}/></button></div>
      <a href={material.href} download={material.filename}><Download size={18} aria-hidden="true"/>Baixar PDF</a>
    </div>
    <div className="pdf-reader-feedback" role="status" aria-live="polite">{error || (!document ? `Carregando PDF${progress > 0 ? `: ${progress}%` : '…'}` : rendering ? `Preparando página ${page}…` : '')}</div>
    {error && <button className="pdf-reader-retry" onClick={() => setAttempt(value => value + 1)}><RotateCw size={18} aria-hidden="true"/>Tentar novamente</button>}
    <div ref={viewportRef} className="pdf-reader-viewport" aria-busy={!error && (!document || rendering)}>
      <canvas ref={canvasRef} role="img" aria-label={`${material.title}, página ${page} de ${total}. O texto e os links estão disponíveis abaixo.`} style={{ visibility: document && !rendering && !error ? 'visible' : 'hidden' }}/>
    </div>
    {document && !error && <details className="pdf-reader-text" key={page}>
      <summary>Ver texto e links da página {page}</summary>
      <p>{text || 'Esta página não contém texto selecionável. Consulte a página ilustrada ou baixe o PDF.'}</p>
      {links.length > 0 && <><h2>Links desta página</h2><ul>{links.map((link, index) => <li key={index}>{link.page ? <button onClick={() => goToPage(link.page!)}>{link.label}</button> : <a {...pdfReaderLink(link.href!)}>{link.label}<span className="sr-only"> (abre em nova aba)</span></a>}</li>)}</ul></>}
    </details>}
  </section>;
}
