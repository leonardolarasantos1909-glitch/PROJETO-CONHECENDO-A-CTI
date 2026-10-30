import { useEffect, useId, useState } from 'react';
import { ArrowRight, BookOpen } from 'lucide-react';
import { clinicalHref, conditionsForContent } from './clinical-dictionary';
import './clinical-dictionary.css';

/** Reverse links are derived from the same mapping used on each clinical entry. */
export default function ClinicalRelated({ href }: { href: string }) {
  const id = useId();
  const [expanded, setExpanded] = useState(false);
  useEffect(() => setExpanded(false), [href]);
  const conditions = conditionsForContent(href);
  if (!conditions.length) return null;
  return <aside className="clinical-context-links" aria-labelledby={`${id}-title`}>
    <h3 id={`${id}-title`}><BookOpen size={20} aria-hidden="true"/>Relacione com o Dicionário Clínico</h3>
    <p>Explore condições associadas a este conteúdo. Fichas educativas pendentes de validação clínica.</p>
    <ul id={`${id}-conditions`}>{(expanded ? conditions : conditions.slice(0, 6)).map(condition => <li key={condition.id}><a href={clinicalHref(condition.id)}>{condition.name}<ArrowRight size={17} aria-hidden="true"/></a></li>)}</ul>
    {conditions.length > 6 && <button type="button" className="clinical-secondary clinical-context-expand" aria-expanded={expanded} aria-controls={`${id}-conditions`} onClick={() => setExpanded(value => !value)}>{expanded ? 'Mostrar menos condições' : `Mostrar todas as ${conditions.length} condições relacionadas`}</button>}
  </aside>;
}
