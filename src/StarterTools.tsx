import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { ArrowRight, ArrowUpRight, Check, ClipboardCheck, Search, X } from 'lucide-react';
import { filterGlossary, firstDayItems, glossaryTerms } from './starter-data';
import { readSavedIds, writeSavedIds } from './learning-storage';
import './starter-tools.css';

const CHECKLIST_KEY = 'cti-first-day-v1';
const CHECKLIST_IDS = firstDayItems.map(item => item.id);
const CADERNO_PDF = '/materiais/caderno-cti-adulto-digital.pdf';

export function FirstDayChecklist() {
  const [completed, setCompleted] = useState(() => readSavedIds(CHECKLIST_KEY, CHECKLIST_IDS));
  const [storageFailed, setStorageFailed] = useState(false);
  const prefix = useId();

  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key === CHECKLIST_KEY || event.key === null) setCompleted(readSavedIds(CHECKLIST_KEY, CHECKLIST_IDS));
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const update = (ids: string[]) => {
    setCompleted(ids);
    setStorageFailed(!writeSavedIds(CHECKLIST_KEY, ids));
  };

  return <section className="starter-checklist" aria-labelledby={`${prefix}-heading`}>
    <div className="starter-intro"><ClipboardCheck size={25} aria-hidden="true"/><div><h2 id={`${prefix}-heading`}>Meu primeiro dia na CTI</h2><p>Use este roteiro para conversar com o preceptor e reconhecer o setor. Marque o que já foi apresentado a você.</p></div></div>
    <div className="starter-progress">
      <div><strong>{completed.length} de {firstDayItems.length} itens marcados</strong><span>Roteiro pessoal de integração; não certifica competência.</span></div>
      <progress value={completed.length} max={firstDayItems.length} aria-label="Itens marcados no roteiro do primeiro dia"/>
    </div>
    <p className="starter-storage" role="status">{storageFailed ? 'Não foi possível guardar estas marcações no aparelho. Elas continuam nesta tela, mas podem desaparecer ao sair.' : 'As marcações são guardadas somente neste navegador quando o aparelho permite. Não informe dados de pacientes. O navegador pode apagar os dados salvos.'}</p>
    <ul className="starter-checklist-items">{firstDayItems.map((item, index) => {
      const checked = completed.includes(item.id);
      return <li className={checked ? 'is-complete' : ''} key={item.id}>
        <label htmlFor={`${prefix}-${item.id}`}><input id={`${prefix}-${item.id}`} type="checkbox" checked={checked} onChange={() => update(checked ? completed.filter(id => id !== item.id) : [...completed, item.id])}/><span><span className="starter-item-number">{String(index + 1).padStart(2, '0')}</span><strong>{item.title}</strong>{checked && <Check className="starter-item-check" size={18} aria-hidden="true"/>}</span></label>
        <div className="starter-item-body"><p>{item.detail}</p><a href={item.href}>Revisar assunto relacionado <ArrowRight size={16} aria-hidden="true"/></a><p className="starter-source">Base: {item.sourceLabel}.{item.sourcePage && <> <a href={`${CADERNO_PDF}#page=${item.sourcePage}`} target="_blank" rel="noopener noreferrer">Conferir no caderno <ArrowUpRight size={14} aria-hidden="true"/></a></>}</p></div>
      </li>;
    })}</ul>
    <div className="starter-checklist-bottom">{completed.length === firstDayItems.length && <p role="status">Roteiro marcado. Continue levando suas dúvidas ao preceptor e respeitando a supervisão em cada atividade.</p>}<button className="starter-secondary" onClick={() => update([])} disabled={completed.length === 0}>Desmarcar todos os itens</button></div>
    <p className="starter-review">Conteúdo educativo baseado nos módulos e no caderno do projeto. A organização e os fluxos locais devem ser apresentados pela equipe. Revisão clínica e institucional pendente.</p>
  </section>;
}

const GLOSSARY_PAGE_SIZE = 40;
const GLOSSARY_INITIALS = ['0–9', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];

export function Glossary({ renderFavorite, initialTerm, initialQuery }: { renderFavorite?: (id: string) => ReactNode; initialTerm?: string; initialQuery?: string }) {
  const initialEntry = glossaryTerms.find(item => item.id === initialTerm);
  const [query, setQuery] = useState(() => initialEntry?.term ?? initialQuery ?? '');
  const [selectedTermId, setSelectedTermId] = useState<string | undefined>(() => initialEntry?.id);
  const [group, setGroup] = useState('');
  const [limit, setLimit] = useState(GLOSSARY_PAGE_SIZE);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsHeadingRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const firstNewResultRef = useRef<number | null>(null);
  const prefix = useId();
  const groups = GLOSSARY_INITIALS;
  const results = filterGlossary(query).filter(item => (!group || item.group === group) && (!selectedTermId || item.id === selectedTermId));
  const visibleResults = results.slice(0, limit);

  useEffect(() => {
    const entry = glossaryTerms.find(item => item.id === initialTerm);
    setQuery(entry?.term ?? initialQuery ?? '');
    setSelectedTermId(entry?.id);
    setGroup('');
    setLimit(GLOSSARY_PAGE_SIZE);
    firstNewResultRef.current = null;
  }, [initialTerm, initialQuery]);

  useEffect(() => {
    const index = firstNewResultRef.current;
    if (index === null) return;
    firstNewResultRef.current = null;
    gridRef.current?.querySelectorAll<HTMLElement>('.starter-term')[index]?.focus();
  }, [limit, query, group, selectedTermId]);

  function updateQuery(value: string) {
    firstNewResultRef.current = null;
    setSelectedTermId(undefined);
    setQuery(value);
    setGroup('');
    setLimit(GLOSSARY_PAGE_SIZE);
  }

  function clearSearch() {
    updateQuery('');
    inputRef.current?.focus();
  }

  return <section className="starter-glossary" aria-labelledby={`${prefix}-heading`}>
    <div className="starter-intro"><Search size={25} aria-hidden="true"/><div><h2 id={`${prefix}-heading`}>Siglas e significados</h2><p>Pesquise uma sigla ou uma palavra da definição. Consulte os termos dentro do aplicativo, inclusive offline após o primeiro carregamento completo.</p></div></div>
    <form className="glossary-controls" role="search" aria-label="Pesquisar no siglário" onSubmit={event => {
      event.preventDefault();
      resultsHeadingRef.current?.focus();
    }}>
      <label className="starter-search" htmlFor={`${prefix}-search`}><Search size={20} aria-hidden="true"/><span className="sr-only">Pesquisar siglas e termos do siglário</span><input ref={inputRef} id={`${prefix}-search`} type="search" aria-label="Pesquisar siglas e termos do siglário" autoComplete="off" enterKeyHint="search" placeholder="Ex.: CVC, saturação ou balanço hídrico" value={query} onChange={event => updateQuery(event.target.value)}/>{query && <button type="button" aria-label="Limpar pesquisa do siglário" onClick={clearSearch}><X size={19} aria-hidden="true"/></button>}</label>
      <label className="glossary-initial-filter" htmlFor={`${prefix}-initial`}><span>Filtrar por inicial</span><select id={`${prefix}-initial`} value={group} onChange={event => {
        firstNewResultRef.current = null;
        setSelectedTermId(undefined);
        setGroup(event.target.value);
        setLimit(GLOSSARY_PAGE_SIZE);
      }}><option value="">Todas as iniciais</option>{groups.map(initial => <option key={initial} value={initial}>{initial}</option>)}</select></label>
    </form>
    <h3 className="glossary-results-heading" ref={resultsHeadingRef} tabIndex={-1}>Resultados do siglário</h3>
    <p className="starter-results" role="status" aria-live="polite" aria-atomic="true">{results.length === 1 ? '1 termo encontrado' : `${results.length} termos encontrados`}{query ? ` para “${query}”` : ''}{group ? ` com inicial ${group}` : ''}. Mostrando {visibleResults.length} de {results.length}. O siglário tem {glossaryTerms.length} entradas.</p>
    <div ref={gridRef} className="starter-glossary-grid" id={`${prefix}-results`}>{visibleResults.map(item => <article className="starter-term" id={`glossary-${item.id}`} key={item.id} tabIndex={-1} aria-labelledby={`${prefix}-term-${item.id}`}>
      <div className="starter-term-top"><h3 id={`${prefix}-term-${item.id}`}>{item.term}</h3>{renderFavorite?.(item.id)}</div>
      <p>{item.definition}</p>
      {item.reviewNote && <div className="glossary-review-note"><strong>Conferir com a fonte</strong><p>{item.reviewNote}</p></div>}
      {item.href && <a className="starter-related" href={item.href}>Explorar assunto relacionado <ArrowRight size={17} aria-hidden="true"/></a>}
    </article>)}</div>
    {visibleResults.length < results.length && <button className="starter-secondary glossary-more" type="button" aria-controls={`${prefix}-results`} onClick={() => {
      firstNewResultRef.current = visibleResults.length;
      setLimit(previous => previous + GLOSSARY_PAGE_SIZE);
    }}>Mostrar mais termos</button>}
    {!results.length && <div className="starter-empty"><h3>Nenhum termo encontrado.</h3><p>Tente outra sigla ou palavra da definição, ou limpe a pesquisa e o filtro.</p><button className="starter-secondary" type="button" onClick={clearSearch}>Mostrar todos os termos</button></div>}
    <p className="starter-review glossary-transcription-source">Transcrição fornecida para este projeto, a partir do glossário indicado no Google Looker Studio. Revisão clínica e institucional pendente.</p>
  </section>;
}
