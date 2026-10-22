import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { ArrowRight, ChevronDown, Search, X } from 'lucide-react';
import { searchCategories, searchContent, type SearchResult } from './search';
import './home-search.css';

type HomeSearchProps = {
  query: string;
  onQueryChange: (value: string) => void;
};

const RESULTS_PER_PAGE = 8;
const QUICK_SEARCHES = ['PAV', 'RASS', 'Curativos'];

export default function HomeSearch({ query, onQueryChange }: HomeSearchProps) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsHeadingRef = useRef<HTMLHeadingElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const firstNewResultRef = useRef<number | null>(null);
  const [category, setCategory] = useState<SearchResult['kind'] | ''>('');
  const [pagination, setPagination] = useState({ query, category, limit: RESULTS_PER_PAGE });
  const hasQuery = query.trim().length > 0;
  const results = hasQuery ? searchContent(query, category) : [];
  const limit = pagination.query === query && pagination.category === category ? pagination.limit : RESULTS_PER_PAGE;
  const visibleResults = results.slice(0, limit);
  useEffect(() => {
    const index = firstNewResultRef.current;
    if (index === null) return;
    firstNewResultRef.current = null;
    listRef.current?.querySelectorAll<HTMLAnchorElement>('a')[index]?.focus();
  }, [limit, query, category]);
  const categoryDescription = category ? ` na categoria ${category}` : '';
  const status = hasQuery
    ? results.length === 0
      ? `Nenhum resultado encontrado para “${query.trim()}”${categoryDescription}.`
      : `${results.length === 1 ? '1 resultado encontrado' : `${results.length} resultados encontrados`} para “${query.trim()}”${categoryDescription}. Mostrando ${visibleResults.length} de ${results.length}.`
    : '';

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (hasQuery) {
      resultsHeadingRef.current?.focus();
    } else {
      inputRef.current?.focus();
    }
  }

  function clearSearch() {
    firstNewResultRef.current = null;
    onQueryChange('');
    setCategory('');
    setPagination({ query: '', category: '', limit: RESULTS_PER_PAGE });
    inputRef.current?.focus();
  }

  function selectQuickSearch(value: string) {
    firstNewResultRef.current = null;
    onQueryChange(value);
    setCategory('');
    setPagination({ query: value, category: '', limit: RESULTS_PER_PAGE });
    inputRef.current?.focus();
  }

  return (
    <section className="home-search" aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} tabIndex={-1}>Pesquisar no app</h2>
      <p className="home-search-intro">
        Encontre assuntos, escalas, termos e materiais pelo nome.
      </p>

      <form role="search" aria-label="Pesquisar no app" onSubmit={handleSubmit}>
        <label className="home-search-sr-only" htmlFor={`${id}-input`}>
          Pesquisar pelo nome ou assunto
        </label>
        <div className="home-search-controls">
          <div className="home-search-field">
            <Search size={21} aria-hidden="true" />
            <input
              ref={inputRef}
              id={`${id}-input`}
              type="search"
              autoComplete="off"
              placeholder="Ex.: PAV, RASS, bomba de infusão..."
              value={query}
              onChange={(event) => {
                const value = event.target.value;
                firstNewResultRef.current = null;
                setPagination({ query: value, category, limit: RESULTS_PER_PAGE });
                onQueryChange(value);
              }}
              enterKeyHint="search"
            />
            {query.length > 0 && (
              <button
                className="home-search-clear"
                type="button"
                onClick={clearSearch}
                aria-label="Limpar pesquisa"
                title="Limpar pesquisa"
              >
                <X size={21} aria-hidden="true" />
              </button>
            )}
          </div>
          <button className="home-search-submit" type="submit">
            Buscar
          </button>
        </div>
        <div className="home-search-category">
          <label htmlFor={`${id}-category`}>Categoria da pesquisa</label>
          <select id={`${id}-category`} value={category} onChange={event => {
            const selected = event.target.value as SearchResult['kind'] | '';
            firstNewResultRef.current = null;
            setCategory(selected);
            setPagination({ query, category: selected, limit: RESULTS_PER_PAGE });
          }}>
            <option value="">Todas as categorias</option>
            {searchCategories.map(value => <option key={value}>{value}</option>)}
          </select>
        </div>
      </form>

      <div className="home-search-shortcuts" aria-label="Atalhos de pesquisa">
        <span>Busca rápida:</span>
        {QUICK_SEARCHES.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => selectQuickSearch(value)}
            aria-label={`Pesquisar ${value}`}
          >
            {value}
          </button>
        ))}
      </div>

      <p className="home-search-status" role="status" aria-live="polite" aria-atomic="true">
        {status}
      </p>

      {hasQuery && (
        <div className="home-search-results">
          <h3 ref={resultsHeadingRef} tabIndex={-1}>
            Resultados da pesquisa
          </h3>

          {results.length === 0 ? (
            <div className="home-search-empty">
              <p>Tente outro nome ou uma palavra do assunto que você procura.</p>
              <button type="button" onClick={clearSearch}>
                Limpar pesquisa
              </button>
            </div>
          ) : (
            <>
              <ul ref={listRef} id={`${id}-results`} className="home-search-list">
                {visibleResults.map((result) => (
                  <li key={result.id}>
                    <a
                      href={result.href}
                      {...(result.external
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                    >
                      <div className="home-search-result-copy">
                        <span className="home-search-kind">{result.kind}</span>
                        <h4>{result.title}</h4>
                        <p>{result.description}</p>
                        {result.external && (
                          <span className="home-search-sr-only">Abre em nova aba.</span>
                        )}
                      </div>
                      <ArrowRight size={21} aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
              {visibleResults.length < results.length && (
                <button
                  className="home-search-more"
                  type="button"
                  aria-controls={`${id}-results`}
                  onClick={() => {
                    firstNewResultRef.current = visibleResults.length;
                    setPagination({ query, category, limit: limit + RESULTS_PER_PAGE });
                  }}
                >
                  Mostrar mais resultados
                  <ChevronDown size={19} aria-hidden="true" />
                </button>
              )}
            </>
          )}
        </div>
      )}
    </section>
  );
}
