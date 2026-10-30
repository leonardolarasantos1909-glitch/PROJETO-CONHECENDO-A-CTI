import { useId, useRef, useState } from 'react';
import { ArrowRight, BookOpen, Search, X } from 'lucide-react';
import { clinicalConditions, clinicalHref, searchClinicalConditions } from './clinical-dictionary';
import './clinical-dictionary.css';

/** Direct, local search keeps the dictionary visible alongside practical study tools. */
export function ClinicalDictionaryFeatured() {
  const prefix = useId();
  const field = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const matches = query.trim() ? searchClinicalConditions(query) : [];
  const destination = `#dicionario-clinico${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ''}`;
  return <section className="clinical-featured" aria-labelledby={`${prefix}-title`}>
    <div className="clinical-featured-heading"><span className="clinical-featured-icon"><BookOpen size={30} aria-hidden="true"/></span><div><span className="clinical-featured-kicker">CONDIÇÕES CLÍNICAS E CUIDADO DE ENFERMAGEM</span><h2 id={`${prefix}-title`} tabIndex={-1}><a href="#dicionario-clinico">Dicionário Clínico<ArrowRight size={23} aria-hidden="true"/></a></h2><p>Consulte {clinicalConditions.length} patologias e condições críticas. Encontre o que observar, os cuidados do técnico e quando comunicar à equipe.</p></div><span className="clinical-featured-count">{clinicalConditions.length}<span>fichas educativas</span></span></div>
    <form role="search" aria-label="Pesquisa rápida no Dicionário Clínico" onSubmit={event => { event.preventDefault(); window.location.hash = destination; }}>
      <label htmlFor={`${prefix}-query`}>Busque diretamente no Dicionário Clínico</label><div className="clinical-featured-search"><div className="clinical-search-field"><Search size={21} aria-hidden="true"/><input id={`${prefix}-query`} ref={field} type="search" autoComplete="off" placeholder="Nome, sigla ou sinônimo. Ex.: sepse, IAM" value={query} onChange={event => setQuery(event.target.value)}/>{query && <button className="clinical-clear" type="button" aria-label="Limpar pesquisa rápida do dicionário" onClick={() => { setQuery(''); field.current?.focus(); }}><X size={19} aria-hidden="true"/></button>}</div><button className="clinical-primary" type="submit">Pesquisar<ArrowRight size={18} aria-hidden="true"/></button></div>
    </form>
    <p className="clinical-featured-status" role="status">{query.trim() ? `${matches.length} ${matches.length === 1 ? 'ficha encontrada' : 'fichas encontradas'} no dicionário.` : ''}</p>
    {query.trim() && <div className="clinical-featured-results">{matches.length ? <ul>{matches.slice(0, 4).map(condition => <li key={condition.id}><a href={clinicalHref(condition.id)}><span><strong>{condition.name}</strong><small>{condition.acronym ? `${condition.acronym} · ` : ''}{condition.category}</small></span><ArrowRight size={17} aria-hidden="true"/></a></li>)}</ul> : <p>Nenhuma ficha encontrada. Tente outro nome, sigla ou sinônimo.</p>}<a className="clinical-featured-all" href={destination}>Abrir pesquisa completa<ArrowRight size={17} aria-hidden="true"/></a></div>}
    <div className="clinical-featured-footer"><a href="#dicionario-clinico">Explorar todas as fichas<ArrowRight size={17} aria-hidden="true"/></a><span>Pendente de validação clínica · Sem login</span></div>
  </section>;
}

export default ClinicalDictionaryFeatured;
