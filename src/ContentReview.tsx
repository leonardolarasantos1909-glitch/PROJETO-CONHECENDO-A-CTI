import { useEffect, useId, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, BookOpen, ClipboardCheck } from 'lucide-react';
import { contentRegistry, getContentMetadata, type ContentMetadata } from './content-registry';
import { pdfReaderLink } from './pdf-catalog';
import './content-review.css';

export function ContentReview({ contentId, compact = false }: { contentId: string; compact?: boolean }) {
  const item = getContentMetadata(contentId);
  const prefix = useId();
  if (!item) return <aside className="content-review" aria-label="Situação da revisão"><p><strong>Revisão profissional pendente</strong></p><p>Data e responsável pela revisão: a definir. Referências específicas ainda precisam ser documentadas.</p></aside>;
  return <aside className={`content-review${compact ? ' content-review-compact' : ''}`} aria-label="Situação da revisão">
    <p className="content-review-status"><ClipboardCheck size={18} aria-hidden="true"/><strong>{item.status === 'institutional_validated' ? 'Validação institucional documentada' : item.status === 'educational_reviewed' ? 'Revisão educativa documentada' : 'Revisão profissional pendente'}</strong></p>
    <p>Última revisão clínica: {item.lastReviewedAt ?? 'não realizada'}. Responsável: {item.reviewedBy ?? 'a definir'}. Versão do conteúdo: {item.version}.</p>
    {!compact && <details><summary><BookOpen size={17} aria-hidden="true"/> Referências e origem deste conteúdo</summary>
      <div id={`${prefix}-references`}>
        {item.referenceStatus === 'specific_reference_pending' && <p className="content-review-gap">Referência específica pendente de conferência. Materiais relacionados não equivalem à validação de cada afirmação.</p>}
        {item.references.length ? <ul>{item.references.map(ref => <li key={`${ref.href}-${ref.label}`}><a {...(ref.href.startsWith('/materiais/') ? pdfReaderLink(ref.href) : { href: ref.href, ...(ref.href.startsWith('https://') ? { target: '_blank', rel: 'noopener noreferrer' } : {}) })}>{ref.label}<ArrowUpRight size={15} aria-hidden="true"/>{ref.href.startsWith('/') || ref.href.startsWith('https://') ? <span className="sr-only"> (abre em outra aba)</span> : null}</a></li>)}</ul> : <p>Referências específicas ainda não foram vinculadas a este item.</p>}
        {item.notes.map(note => <p key={note}>{note}</p>)}
        <p>Conteúdo educativo. Não representa protocolo institucional oficialmente aprovado. A data de atualização do aplicativo não é data de revisão clínica.</p>
      </div>
    </details>}
  </aside>;
}

const normalize = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const PAGE_SIZE = 30;
export function ContentCatalog() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [limit, setLimit] = useState(PAGE_SIZE);
  const listRef = useRef<HTMLUListElement>(null);
  const firstNewResultRef = useRef<number | null>(null);
  const id = useId();
  const filtered = contentRegistry.filter(item => (!category || item.category === category) && (!status || item.status === status) && normalize(`${item.title} ${item.description}`).includes(normalize(query.trim())));
  const categories = [...new Set(contentRegistry.map(item => item.category))];
  function resetLimit() { firstNewResultRef.current = null; setLimit(PAGE_SIZE); }
  useEffect(() => {
    const index = firstNewResultRef.current;
    if (index === null) return;
    firstNewResultRef.current = null;
    listRef.current?.querySelectorAll<HTMLAnchorElement>('h3 a')[index]?.focus();
  }, [limit]);
  const statusLabel = (item: ContentMetadata) => item.status === 'pending_review' ? 'Pendente de revisão' : item.status === 'educational_reviewed' ? 'Revisão educativa' : 'Validação institucional';
  return <section className="content-catalog" aria-labelledby={`${id}-heading`}>
    <h2 id={`${id}-heading`}>Conteúdos, referências e revisão</h2>
    <p>Este catálogo registra a origem e as pendências de cada conteúdo. A presença de uma referência ou de uma transcrição conferida pelo autor não representa aprovação institucional do aplicativo.</p>
    <div className="content-catalog-filters">
      <label>Pesquisar conteúdo<input type="search" value={query} onChange={event => { setQuery(event.target.value); resetLimit(); }} autoComplete="off"/></label>
      <label>Categoria<select value={category} onChange={event => { setCategory(event.target.value); resetLimit(); }}><option value="">Todas as categorias</option>{categories.map(value => <option key={value}>{value}</option>)}</select></label>
      <label>Situação<select value={status} onChange={event => { setStatus(event.target.value); resetLimit(); }}><option value="">Todas as situações</option><option value="pending_review">Pendente de revisão</option><option value="educational_reviewed">Revisão educativa</option><option value="institutional_validated">Validação institucional</option></select></label>
    </div>
    <p role="status">{filtered.length} conteúdos encontrados. Mostrando {Math.min(limit, filtered.length)}.</p>
    <ul ref={listRef} id={`${id}-results`} className="content-catalog-list">{filtered.slice(0, limit).map(item => <li key={item.id}><div><span>{item.category} · {statusLabel(item)}</span><h3><a href={item.href}>{item.title}<ArrowRight size={16} aria-hidden="true"/></a></h3><p>{item.description}</p></div><ContentReview contentId={item.id}/></li>)}</ul>
    {!filtered.length && <p>Nenhum conteúdo corresponde aos filtros. Tente outra categoria ou situação.</p>}
    {filtered.length > limit && <button className="button" aria-controls={`${id}-results`} onClick={() => { firstNewResultRef.current = limit; setLimit(previous => previous + PAGE_SIZE); }}>Mostrar mais conteúdos</button>}
  </section>;
}

export default ContentReview;
