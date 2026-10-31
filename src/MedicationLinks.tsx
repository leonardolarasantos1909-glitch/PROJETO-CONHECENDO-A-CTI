import { useEffect, useId, useState } from 'react';
import { ArrowRight, Pill } from 'lucide-react';
import { medicationHref, medicationsForCondition } from './medication-guide';
import './medication-guide.css';

/** Reciprocal links use the medicine records, keeping both directions consistent. */
export default function MedicationLinks({ conditionId }: { conditionId: string }) {
  const id = useId();
  const [expanded, setExpanded] = useState(false);
  useEffect(() => setExpanded(false), [conditionId]);
  const medications = medicationsForCondition(conditionId);
  if (!medications.length) return null;
  return <aside className="medication-context-links" aria-labelledby={`${id}-title`}>
    <h3 id={`${id}-title`}><Pill size={20} aria-hidden="true"/>Relacione com o Guia de Medicamentos</h3>
    <p>Associações educativas para estudo, pendentes de validação clínica. A presença desta condição não indica automaticamente um medicamento e não constitui prescrição ou recomendação de tratamento.</p>
    <ul id={`${id}-medications`}>{(expanded ? medications : medications.slice(0, 6)).map(medication => <li key={medication.id}><a href={medicationHref(medication.id)}>{medication.genericName}<ArrowRight size={17} aria-hidden="true"/></a></li>)}</ul>
    {medications.length > 6 && <button type="button" className="medication-secondary medication-context-expand" aria-expanded={expanded} aria-controls={`${id}-medications`} onClick={() => setExpanded(value => !value)}>{expanded ? 'Mostrar menos medicamentos' : `Mostrar todos os ${medications.length} medicamentos relacionados`}</button>}
  </aside>;
}
