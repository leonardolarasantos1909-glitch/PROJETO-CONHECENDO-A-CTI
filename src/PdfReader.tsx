import { useEffect, useRef, useState } from "react";
import {
  getDocument,
  GlobalWorkerOptions,
  type PDFDocumentProxy,
} from "pdfjs-dist";
import worker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { validPdfPage, type AppPdf } from "./pdf-catalog";
GlobalWorkerOptions.workerSrc = worker;
export default function PdfReader({
  material,
  initialPage,
}: {
  material: AppPdf;
  initialPage?: string | null;
}) {
  const canvas = useRef<HTMLCanvasElement>(null),
    container = useRef<HTMLDivElement>(null),
    touch = useRef<{ x: number; y: number } | null>(null),
    documentRef = useRef<PDFDocumentProxy | null>(null),
    searchId = useRef(0);
  const [doc, setDoc] = useState<PDFDocumentProxy | null>(null),
    [page, setPage] = useState(validPdfPage(initialPage, material.pages)),
    [zoom, setZoom] = useState(1),
    [error, setError] = useState(""),
    [query, setQuery] = useState(""),
    [found, setFound] = useState<number[]>([]),
    [searchStatus, setSearchStatus] = useState(""),
    [loading, setLoading] = useState(true),
    [width, setWidth] = useState(600);
  useEffect(() => {
    setPage(validPdfPage(initialPage, material.pages));
  }, [initialPage, material.pages]);
  useEffect(() => {
    const observer = new ResizeObserver((entries) =>
      setWidth(entries[0].contentRect.width),
    );
    if (container.current) observer.observe(container.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    let cancelled = false;
    const task = getDocument({
      url: material.href,
      cMapUrl: "/pdfjs/cmaps/",
      cMapPacked: true,
      standardFontDataUrl: "/pdfjs/standard_fonts/",
      wasmUrl: "/pdfjs/wasm/",
    });
    task.promise
      .then((d) => {
        if (!cancelled) {
          documentRef.current = d;
          setDoc(d);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(
            "Não foi possível carregar o PDF. Tente novamente ou baixe o arquivo original.",
          );
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
      searchId.current++;
      documentRef.current = null;
      void task.destroy();
    };
  }, [material.href]);
  useEffect(() => {
    if (!doc) return;
    let cancelled = false;
    let task:
      | ReturnType<Awaited<ReturnType<PDFDocumentProxy["getPage"]>>["render"]>
      | undefined;
    setLoading(true);
    doc
      .getPage(page)
      .then((p) => {
        if (cancelled || !canvas.current) return;
        const natural = p.getViewport({ scale: 1 });
        const viewport = p.getViewport({
          scale: Math.max(0.1, (width - 24) / natural.width) * zoom,
        });
        const c = canvas.current,
          ratio = devicePixelRatio || 1;
        c.width = Math.ceil(viewport.width * ratio);
        c.height = Math.ceil(viewport.height * ratio);
        c.style.width = `${viewport.width}px`;
        c.style.height = `${viewport.height}px`;
        task = p.render({
          canvas: c,
          viewport,
          transform: ratio === 1 ? undefined : [ratio, 0, 0, ratio, 0, 0],
        });
        return task.promise;
      })
      .then(() => {
        if (!cancelled) setLoading(false);
      })
      .catch((e) => {
        if (!cancelled && e?.name !== "RenderingCancelledException") {
          setError(
            "Falha ao renderizar a página. Use o download como alternativa.",
          );
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
      task?.cancel();
    };
  }, [doc, page, zoom, width]);
  async function search(e: React.FormEvent) {
    e.preventDefault();
    if (!doc || !query.trim()) return;
    const id = ++searchId.current;
    setSearchStatus("Pesquisando…");
    const pages: number[] = [];
    const normalized = query.toLocaleLowerCase("pt-BR");
    try {
      for (let i = 1; i <= doc.numPages; i++) {
        if (id !== searchId.current) return;
        const text = await (await doc.getPage(i)).getTextContent();
        if (
          text.items
            .map((x) => ("str" in x ? x.str : ""))
            .join(" ")
            .toLocaleLowerCase("pt-BR")
            .includes(normalized)
        )
          pages.push(i);
      }
      if (id !== searchId.current) return;
      setFound(pages);
      setSearchStatus(`${pages.length} páginas encontradas.`);
      if (pages[0]) setPage(pages[0]);
    } catch {
      if (id === searchId.current)
        setSearchStatus("Não foi possível pesquisar neste arquivo.");
    }
  }
  return (
    <section className="full-pdf">
      <header className="pdf-controls">
        <a className="secondary" href="#biblioteca">
          ← Biblioteca
        </a>
        <h1>{material.title}</h1>
        <a href={material.href} download={material.filename}>
          Baixar PDF
        </a>
      </header>
      <div className="pdf-controls">
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
          Anterior
        </button>
        <label>
          Página{" "}
          <input
            aria-label="Página do PDF"
            type="number"
            min="1"
            max={doc?.numPages ?? material.pages}
            value={page}
            onChange={(e) =>
              setPage(
                validPdfPage(e.target.value, doc?.numPages ?? material.pages),
              )
            }
          />
        </label>
        <span>de {doc?.numPages ?? material.pages}</span>
        <button
          disabled={page >= (doc?.numPages ?? material.pages)}
          onClick={() => setPage(page + 1)}
        >
          Próxima
        </button>
        <button
          onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
          aria-label="Diminuir zoom"
        >
          −
        </button>
        <span>{Math.round(zoom * 100)}%</span>
        <button
          onClick={() => setZoom(Math.min(3, zoom + 0.25))}
          aria-label="Aumentar zoom"
        >
          +
        </button>
      </div>
      <form className="pdf-controls" onSubmit={search}>
        <label>
          Buscar no PDF
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              searchId.current++;
              setFound([]);
              setSearchStatus("");
            }}
          />
        </label>
        <button disabled={!doc || !query.trim()}>Buscar</button>
        <span role="status">{searchStatus}</span>
        {found.map((n) => (
          <button key={n} type="button" onClick={() => setPage(n)}>
            p. {n}
          </button>
        ))}
      </form>
      {error && <p role="alert">{error}</p>}
      {loading && <p role="status">Carregando página…</p>}
      <div
        className="pdf-canvas"
        ref={container}
        onTouchStart={(e) => {
          touch.current =
            e.touches.length === 1
              ? { x: e.touches[0].clientX, y: e.touches[0].clientY }
              : null;
        }}
        onTouchEnd={(e) => {
          const start = touch.current;
          touch.current = null;
          if (!start || zoom !== 1 || e.changedTouches.length !== 1) return;
          const dx = e.changedTouches[0].clientX - start.x,
            dy = e.changedTouches[0].clientY - start.y;
          if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.5)
            setPage((p) =>
              Math.max(
                1,
                Math.min(
                  doc?.numPages ?? material.pages,
                  p + (dx < 0 ? 1 : -1),
                ),
              ),
            );
        }}
      >
        <canvas ref={canvas} aria-label={`${material.title}, página ${page}`} />
      </div>
      <p className="muted">
        Deslize lateralmente na ampliação de 100% para trocar a página. Conteúdo
        original preservado. Para leitura com tecnologia assistiva, baixe o PDF
        e utilize um leitor compatível.
      </p>
    </section>
  );
}
