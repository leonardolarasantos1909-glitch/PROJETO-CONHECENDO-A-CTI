import { useId, useRef, useState } from 'react';
import { ArrowRight, Pill, Search, X } from 'lucide-react';
import { medicationHref, medications, searchMedications } from './medication-guide';
import './medication-guide.css';

/** Search stays in this browser and leads directly to an educational medicine entry. */
export function MedicationFeatured() {
  const prefix = useId();
  const field = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const matches = query.trim() ? searchMedications(query) : [];
  const destination = `#medicamentos${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ''}`;
  return <section className="medication-featured" aria-labelledby={`${prefix}-title`}>
    <div className="medication-featured-heading"><span className="medication-featured-icon"><Pill size={30} aria-hidden="true"/></span><div><span className="medication-featured-kicker">MEDICAMENTOS E CUIDADO DE ENFERMAGEM</span><h2 id={`${prefix}-title`} tabIndex={-1}><a href="#medicamentos">Guia de Medicamentos<ArrowRight size={23} aria-hidden="true"/></a></h2><p>Consulte {medications.length} medicamentos. Relacione finalidade, cuidados, monitorização e sinais de alerta no contexto do CTI.</p></div><span className="medication-featured-count">{medications.length}<span>fichas educativas</span></span></div>
    <form role="search" aria-label="Pesquisa rápida no Guia de Medicamentos" onSubmit={event => { event.preventDefault(); window.location.hash = destination; }}>
      <label htmlFor={`${prefix}-query`}>Busque diretamente no Guia de Medicamentos</label><div className="medication-featured-search"><div className="medication-search-field"><Search size={21} aria-hidden="true"/><input id={`${prefix}-query`} ref={field} type="search" autoComplete="off" placeholder="Nome genérico, classe ou princípio ativo" value={query} onChange={event => setQuery(event.target.value)}/>{query && <button className="medication-clear" type="button" aria-label="Limpar pesquisa rápida de medicamentos" onClick={() => { setQuery(''); field.current?.focus(); }}><X size={19} aria-hidden="true"/></button>}</div><button className="medication-primary" type="submit">Pesquisar<ArrowRight size={18} aria-hidden="true"/></button></div>
    </form>
    <p className="medication-featured-status" role="status">{query.trim() ? `${matches.length} ${matches.length === 1 ? 'ficha encontrada' : 'fichas encontradas'} no guia.` : ''}</p>
    {query.trim() && <div className="medication-featured-results">{matches.length ? <ul>{matches.slice(0, 4).map(medication => <li key={medication.id}><a href={medicationHref(medication.id)}><span><strong>{medication.genericName}</strong><small>{medication.category}</small></span><ArrowRight size={17} aria-hidden="true"/></a></li>)}</ul> : <p>Nenhuma ficha encontrada. Tente o nome genérico, a classe ou o princípio ativo.</p>}<a className="medication-featured-all" href={destination}>Abrir pesquisa completa<ArrowRight size={17} aria-hidden="true"/></a></div>}
    <div className="medication-featured-footer"><a href="#medicamentos">Explorar todas as fichas<ArrowRight size={17} aria-hidden="true"/></a><span>Pendente de validação clínica · Sem login</span></div>
  </section>;
}

export default MedicationFeatured;
