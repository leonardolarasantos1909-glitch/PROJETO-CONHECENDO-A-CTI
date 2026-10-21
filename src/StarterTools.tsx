import { useEffect, useId, useState, type ReactNode } from 'react';
import { ArrowRight, ArrowUpRight, Check, ClipboardCheck, Search, X } from 'lucide-react';
import { filterGlossary, firstDayItems, glossaryTerms } from './starter-data';
import { readSavedIds, writeSavedIds } from './learning-storage';
import './starter-tools.css';

const CHECKLIST_KEY = 'cti-first-day-v1';
const CHECKLIST_IDS = firstDayItems.map(item => item.id);
const CADERNO_PDF = '#pdf/caderno-digital';

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
        <div className="starter-item-body"><p>{item.detail}</p><a href={item.href}>Revisar assunto relacionado <ArrowRight size={16} aria-hidden="true"/></a><p className="starter-source">Base: {item.sourceLabel}.{item.sourcePage && <> <a href={`${CADERNO_PDF}?page=${item.sourcePage}`}>Conferir no caderno <ArrowUpRight size={14} aria-hidden="true"/></a></>}</p></div>
      </li>;
    })}</ul>
    <div className="starter-checklist-bottom">{completed.length === firstDayItems.length && <p role="status">Roteiro marcado. Continue levando suas dúvidas ao preceptor e respeitando a supervisão em cada atividade.</p>}<button className="starter-secondary" onClick={() => update([])} disabled={completed.length === 0}>Desmarcar todos os itens</button></div>
    <p className="starter-review">Conteúdo educativo baseado nos módulos e no caderno do projeto. A organização e os fluxos locais devem ser apresentados pela equipe. Revisão clínica e institucional pendente.</p>
  </section>;
}

export function Glossary({ renderFavorite, initialTerm, initialQuery }: { renderFavorite?: (id: string) => ReactNode; initialTerm?: string; initialQuery?: string }) {
  const [query, setQuery] = useState(() => glossaryTerms.find(item => item.id === initialTerm)?.term ?? initialQuery ?? '');
  const prefix = useId();
  const results = filterGlossary(query);

  useEffect(() => {
    setQuery(glossaryTerms.find(item => item.id === initialTerm)?.term ?? initialQuery ?? '');
  }, [initialTerm, initialQuery]);

  return <section className="starter-glossary" aria-labelledby={`${prefix}-heading`}>
    <div className="starter-intro"><Search size={25} aria-hidden="true"/><div><h2 id={`${prefix}-heading`}>Siglas e termos sem complicação</h2><p>Pesquise uma sigla, um nome ou uma palavra da explicação. Cada termo aponta para um assunto do aplicativo e para a base utilizada.</p></div></div>
    <label className="starter-search" htmlFor={`${prefix}-search`}><Search size={20} aria-hidden="true"/><span className="sr-only">Pesquisar siglas e termos do glossário</span><input id={`${prefix}-search`} type="search" placeholder="Ex.: CVC, saturação ou balanço hídrico" value={query} onChange={event => setQuery(event.target.value)}/>{query && <button aria-label="Limpar pesquisa do glossário" onClick={() => setQuery('')}><X size={19}/></button>}</label>
    <p className="starter-results" role="status">{results.length === 1 ? '1 termo encontrado' : `${results.length} termos encontrados`}{query ? ` para “${query}”` : ''}.</p>
    <div className="starter-glossary-grid">{results.map(item => <article className="starter-term" id={`glossary-${item.id}`} key={item.id}>
      <div className="starter-term-top"><h3>{item.term}</h3>{renderFavorite?.(item.id)}</div>
      <p>{item.definition}</p>
      <a className="starter-related" href={item.href}>Explorar assunto relacionado <ArrowRight size={17} aria-hidden="true"/></a>
      <div className="starter-term-source"><span>Base: {item.sourceLabel}.</span>{item.sourcePage && <a href={`${CADERNO_PDF}?page=${item.sourcePage}`}>Conferir no caderno <ArrowUpRight size={15} aria-hidden="true"/></a>}</div>
    </article>)}</div>
    {!results.length && <div className="starter-empty"><h3>Nenhum termo encontrado.</h3><p>Tente uma sigla, como “CVC”, ou uma palavra, como “pressão”.</p><button className="starter-secondary" onClick={() => setQuery('')}>Mostrar todos os termos</button></div>}
    <p className="starter-review">Definições educativas elaboradas a partir dos módulos e do caderno fornecido pelo autor. Consulte as referências preservadas no material e a nomenclatura adotada pelo serviço. Revisão clínica e institucional pendente.</p>
  </section>;
}
