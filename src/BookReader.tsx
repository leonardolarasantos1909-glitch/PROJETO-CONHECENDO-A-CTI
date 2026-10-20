import { useCallback, useEffect, useRef, useState, type CSSProperties, type FormEvent } from 'react';
import { ArrowUpRight, BookOpen, ChevronLeft, ChevronRight, FileText, List, MoveHorizontal, RotateCw } from 'lucide-react';
import { parseBookManifest, type BookLink, type BookManifest, type BookPage } from './book';
import { readLastPage, saveLastPage } from './learning-storage';
import './book-reader.css';

const ORIGINAL_PDF = '/materiais/caderno-cti-adulto-digital.pdf';
const MANIFEST = '/caderno/paginas.json';

function useReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return reduced;
}

export default function BookReader() {
  const [book, setBook] = useState<BookManifest | null>(null);
  const [failed, setFailed] = useState(false);
  const [request, setRequest] = useState(0);
  const [page, setPage] = useState(1);
  const [jump, setJump] = useState('1');
  const [resumedFrom, setResumedFrom] = useState<number | null>(null);
  const [storageAvailable, setStorageAvailable] = useState<boolean | null>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const currentPage = useRef(1);
  const jumpEdited = useRef(false);
  const requestedPage = useRef<number | null>(null);
  const navigationFrame = useRef(0);
  const settleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;
    const timer = setTimeout(() => controller.abort(), 15000);
    setBook(null);
    setFailed(false);
    currentPage.current = 1;
    jumpEdited.current = false;
    setPage(1);
    setJump('1');
    setResumedFrom(null);
    setStorageAvailable(null);
    void (async () => {
      try {
        const response = await fetch(MANIFEST, { signal: controller.signal });
        if (!response.ok) throw new Error('Caderno indisponível.');
        const manifest = parseBookManifest(await response.json());
        if (!cancelled) {
          // Set the intended page before mounting the scroll viewport. Its
          // initial resize positions that page without first persisting page 1.
          const saved = readLastPage(manifest.pageCount);
          currentPage.current = saved;
          setPage(saved);
          setJump(String(saved));
          setResumedFrom(saved > 1 ? saved : null);
          setBook(manifest);
        }
      } catch {
        if (!cancelled) setFailed(true);
      } finally {
        clearTimeout(timer);
      }
    })();
    return () => { cancelled = true; clearTimeout(timer); controller.abort(); };
  }, [request]);

  const clearNavigation = useCallback(() => {
    requestedPage.current = null;
    if (navigationFrame.current) cancelAnimationFrame(navigationFrame.current);
    navigationFrame.current = 0;
    if (viewport.current) {
      viewport.current.style.overflow = '';
      viewport.current.style.scrollSnapType = '';
    }
    if (settleTimer.current) clearTimeout(settleTimer.current);
    settleTimer.current = null;
  }, []);

  const rememberPage = useCallback((next: number) => {
    currentPage.current = next;
    setPage(next);
    if (!jumpEdited.current) setJump(String(next));
    setStorageAvailable(saveLastPage(next));
  }, []);

  const goTo = useCallback((next: number) => {
    if (!book) return;
    const destination = Math.max(1, Math.min(book.pageCount, Math.round(next)));
    if (!Number.isFinite(destination)) return;
    const distance = Math.abs(destination - currentPage.current);
    clearNavigation();
    jumpEdited.current = false;
    rememberPage(destination);
    const element = viewport.current;
    if (!element) return;
    requestedPage.current = destination;
    // A touch gesture may still be moving on the compositor after touchend.
    // Pause scrolling for a frame to cancel that momentum before applying a
    // deliberate page selection; otherwise it can restore the old snap target.
    element.style.scrollSnapType = 'none';
    element.style.overflow = 'clip';
    // Keep the scrolling node removed for a painted frame, including on iOS.
    // Restoring it in the first animation frame would retain its old momentum.
    navigationFrame.current = requestAnimationFrame(() => {
      navigationFrame.current = requestAnimationFrame(() => {
        navigationFrame.current = 0;
        element.style.overflow = '';
        const width = element.firstElementChild?.getBoundingClientRect().width || element.clientWidth;
        element.scrollTo({ left: (destination - 1) * width, behavior: reducedMotion || distance !== 1 ? 'auto' : 'smooth' });
      });
    });
    // A delayed scroll event must not overwrite a page selected with the controls.
    // If a browser interrupts smooth scrolling, settle on its actual visible page.
    settleTimer.current = setTimeout(() => {
      requestedPage.current = null;
      settleTimer.current = null;
      element.style.overflow = '';
      element.style.scrollSnapType = '';
      const width = element.firstElementChild?.getBoundingClientRect().width || element.clientWidth;
      const visible = Math.max(1, Math.min(book.pageCount, Math.round(element.scrollLeft / width) + 1));
      rememberPage(visible);
    }, 1500);
  }, [book, clearNavigation, reducedMotion, rememberPage]);

  useEffect(() => {
    if (!book) return;
    const element = viewport.current;
    if (!element) return;
    let scrollFrame = 0;
    let lastWidth = 0;
    const readScroll = () => {
      scrollFrame = 0;
      const width = element.firstElementChild?.getBoundingClientRect().width || element.clientWidth;
      if (!width) return;
      if (Math.abs(width - lastWidth) >= 0.1) { onResize(); return; }
      const target = requestedPage.current;
      if (target !== null) {
        if (navigationFrame.current) return;
        if (Math.abs(element.scrollLeft - (target - 1) * width) < 2) clearNavigation();
        else return;
      }
      const visible = Math.max(1, Math.min(book.pageCount, Math.round(element.scrollLeft / width) + 1));
      if (visible !== currentPage.current) rememberPage(visible);
    };
    const onScroll = () => {
      if (!scrollFrame) scrollFrame = requestAnimationFrame(readScroll);
    };
    const onResize = () => {
      const width = element.firstElementChild?.getBoundingClientRect().width || element.clientWidth;
      if (!width || Math.abs(width - lastWidth) < 0.1) return;
      lastWidth = width;
      if (scrollFrame) cancelAnimationFrame(scrollFrame);
      scrollFrame = 0;
      // Keep the same page when the device rotates or the reader changes width.
      goTo(currentPage.current);
    };
    element.addEventListener('scroll', onScroll, { passive: true });
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(onResize) : null;
    observer?.observe(element);
    window.addEventListener('resize', onResize);
    onResize();
    return () => {
      element.removeEventListener('scroll', onScroll);
      observer?.disconnect();
      window.removeEventListener('resize', onResize);
      if (scrollFrame) cancelAnimationFrame(scrollFrame);
      clearNavigation();
    };
  }, [book, clearNavigation, goTo, rememberPage]);

  useEffect(() => {
    if (!book) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
      const target = event.target;
      if (target instanceof Element && target.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"]), [role="textbox"], [role="combobox"], [role="slider"]')) return;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        goTo(currentPage.current + (event.key === 'ArrowRight' ? 1 : -1));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [book, goTo]);

  const interruptScroll = () => {
    if (requestedPage.current !== null && viewport.current) {
      const element = viewport.current;
      element.scrollTo({ left: element.scrollLeft, behavior: 'auto' });
    }
    clearNavigation();
  };

  const submitJump = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (jump.trim() && Number.isInteger(Number(jump))) goTo(Number(jump));
  };

  if (!book) return <section className="book-reader book-message" aria-label="Caderno digital">
    <span className="book-message-icon"><BookOpen size={28}/></span>
    {failed ? <><h2>Não foi possível abrir o caderno agora.</h2><p role="alert">Verifique a conexão e tente novamente. Você também pode abrir o PDF original.</p><button className="book-action book-action-primary" onClick={() => setRequest(previous => previous + 1)}><RotateCw size={17}/> Tentar novamente</button></>
      : <><h2>Preparando seu caderno…</h2><p role="status">Carregando as páginas para a leitura.</p></>}
    <a className="book-action" href={ORIGINAL_PDF} target="_blank" rel="noopener noreferrer"><FileText size={17}/> Abrir PDF original <ArrowUpRight size={15}/></a>
  </section>;

  const current = book.pages[page - 1];
  return <section className="book-reader" aria-label="Leitor do caderno digital">
    <p className="book-instructions"><MoveHorizontal size={19} aria-hidden="true"/><span>Uma página por vez. Deslize para o lado ou use as setas para continuar.</span></p>
    <div className="book-resume">
      <p role="status">{storageAvailable === false
        ? 'Não foi possível guardar a página neste navegador. Você pode continuar lendo; a posição pode não ser retomada ao reabrir.'
        : resumedFrom !== null
          ? `Leitura retomada na página ${resumedFrom}. A página atual é guardada somente neste aparelho.`
          : storageAvailable === true ? 'A página atual é guardada somente neste aparelho para continuar a leitura depois.' : 'Preparando a posição de leitura…'}</p>
      <button className="book-action" onClick={() => { setResumedFrom(null); goTo(1); }} disabled={page === 1}><RotateCw size={16}/> Voltar ao início do caderno</button>
    </div>
    <div className="book-navigation" role="group" aria-label="Navegar pelas páginas">
      <button className="book-action" onClick={() => goTo(currentPage.current - 1)} disabled={page === 1}><ChevronLeft size={19}/> Anterior</button>
      <div className="book-counter" aria-live="polite" aria-atomic="true">Página <strong>{page}</strong> de {book.pageCount}</div>
      <button className="book-action" onClick={() => goTo(currentPage.current + 1)} disabled={page === book.pageCount}>Próxima <ChevronRight size={19}/></button>
    </div>
    <div ref={viewport} className="book-viewport" tabIndex={0} role="region" aria-label="Páginas do caderno. Deslize para o lado ou use as teclas de seta." onPointerDown={interruptScroll} onWheel={interruptScroll}>
      {book.pages.map(item => <div className="book-slide" key={item.number} aria-hidden={item.number !== page} inert={item.number !== page} aria-label={`Página ${item.number} de ${book.pageCount}`}>
        <div className="book-page" style={{ '--book-page-ratio': item.width / item.height } as CSSProperties}>
          {Math.abs(item.number - page) <= 1 ? <PageImage page={item} current={item.number === page} source={book.source} goTo={goTo}/>
            : <div className="book-page-placeholder" aria-hidden="true"><FileText size={27}/><span>Página {item.number}</span></div>}
        </div>
      </div>)}
    </div>
    <p className="book-page-caption">{current.title || `Página ${page}`}</p>
    <div className="book-tools">
      <button className="book-action" onClick={() => goTo(2)} disabled={book.pageCount < 2}><List size={17}/> Índice</button>
      <form className="book-jump" onSubmit={submitJump}>
        <label htmlFor="book-page-number">Ir para página</label>
        <input id="book-page-number" type="number" inputMode="numeric" min={1} max={book.pageCount} step={1} value={jump} onChange={event => { jumpEdited.current = true; setJump(event.target.value); }} required/>
        <button className="book-action" type="submit">Ir <ChevronRight size={16}/></button>
      </form>
      <a className="book-action book-pdf-link" href={book.source} target="_blank" rel="noopener noreferrer"><FileText size={17}/> PDF original <ArrowUpRight size={15}/></a>
    </div>
    <details className="book-text">
      <summary><FileText size={18} aria-hidden="true"/> Ver texto da página</summary>
      <div className="book-text-content"><h2>{current.title || `Página ${page}`}</h2><p className="book-transcript">{current.text || 'Esta página não contém texto selecionável. Consulte a imagem ou o PDF original.'}</p>
        {current.links.length > 0 && <div className="book-text-links"><h3>Links desta página</h3><ul>{current.links.map((link, index) => <li key={index}><DocumentLink link={link} goTo={goTo}/></li>)}</ul></div>}
      </div>
    </details>
  </section>;
}

function DocumentLink({ link, goTo, overlay = false }: { link: BookLink; goTo: (page: number) => void; overlay?: boolean }) {
  const label = link.label || (link.kind === 'page' ? `Ir para a página ${link.page}` : 'Abrir referência');
  const className = overlay ? 'book-page-link' : undefined;
  const style = overlay ? { left: `${link.bounds.left * 100}%`, top: `${link.bounds.top * 100}%`, width: `${link.bounds.width * 100}%`, height: `${link.bounds.height * 100}%` } : undefined;
  return link.kind === 'page'
    ? <a className={className} style={style} href="#caderno" aria-label={label} title={label} onClick={event => { event.preventDefault(); goTo(link.page); }}>{overlay ? <span className="sr-only">{label}</span> : label}</a>
    : <a className={className} style={style} href={link.href} target="_blank" rel="noopener noreferrer" aria-label={`${label} (nova aba)`} title={`${label} (nova aba)`}>{overlay ? <span className="sr-only">{label}</span> : <>{label} <ArrowUpRight size={14}/></>}</a>;
}

function PageImage({ page, current, source, goTo }: { page: BookPage; current: boolean; source: string; goTo: (page: number) => void }) {
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (state !== 'loading') return;
    const timer = setTimeout(() => setState('error'), 20000);
    return () => clearTimeout(timer);
  }, [state, attempt]);
  return <>
    <img key={attempt} className={`book-page-image ${state === 'ready' ? 'is-ready' : ''}`} src={page.src} width={page.width} height={page.height} alt={`Página ${page.number}${page.title ? `: ${page.title}` : ' do caderno'}`} decoding="async" fetchPriority={current ? 'high' : 'low'} draggable={false} onLoad={() => setState('ready')} onError={() => setState('error')}/>
    {state === 'loading' && <div className="book-page-loading" role={current ? 'status' : undefined}><FileText size={24}/><span>Carregando página {page.number}…</span></div>}
    {state === 'error' && <div className="book-page-error"><FileText size={25}/><strong>Esta página não carregou.</strong><p>Verifique a conexão ou abra o PDF original.</p><button className="book-action" onClick={() => { setState('loading'); setAttempt(previous => previous + 1); }}><RotateCw size={16}/> Tentar novamente</button><a className="book-action" href={`${source}#page=${page.number}`} target="_blank" rel="noopener noreferrer">Abrir no PDF <ArrowUpRight size={15}/></a></div>}
    {state === 'ready' && current && <div className="book-page-links">{page.links.map((link, index) => <DocumentLink key={index} link={link} goTo={goTo} overlay/>)}</div>}
  </>;
}
