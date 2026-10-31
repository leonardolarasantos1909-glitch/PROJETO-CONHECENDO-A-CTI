import { useEffect, useId, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, RotateCcw } from 'lucide-react';
import { FavoriteButton } from './Favorites';
import { getMedication, medicationHref } from './medication-guide';
import { medicationCases } from './medication-cases';
import './medication-guide.css';
import './medication-cases.css';

export default function MedicationCases({ initialCase }: { initialCase?: string }) {
  const prefix = useId();
  const first = medicationCases.find(item => item.id === initialCase) ?? medicationCases[0];
  const [caseId, setCaseId] = useState(first.id);
  const [choice, setChoice] = useState<number | null>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const item = medicationCases.find(item => item.id === caseId)!;
  useEffect(() => { setCaseId((medicationCases.find(item => item.id === initialCase) ?? medicationCases[0]).id); setChoice(null); }, [initialCase]);
  useEffect(() => { title.current?.focus({ preventScroll: true }); }, [caseId]);
  const medicines = item.medicationIds.flatMap(id => { const med = getMedication(id); return med ? [med] : []; });
  return <section className="medication-guide medication-cases" aria-labelledby={`${prefix}-title`}>
    <a className="medication-back" href="#medicamentos"><ArrowLeft size={17} aria-hidden="true"/>Voltar ao Guia de Medicamentos</a>
    <h2 id={`${prefix}-title`}>Aprender com medicamentos e casos fictícios</h2>
    <p>Reflita sobre identificação do produto, observação, segurança e comunicação. Estes cinco cenários são fictícios, não recebem dados de pacientes e não orientam prescrição, preparo ou ajuste de terapia.</p>
    <p className="medication-validation"><strong>Revisão clínica e institucional pendente. A atividade não certifica competência.</strong></p>
    <label className="medication-case-selector">Escolha um caso sobre medicamentos<select value={caseId} onChange={event => { setCaseId(event.target.value); setChoice(null); }}>{medicationCases.map(studyCase => <option key={studyCase.id} value={studyCase.id}>{studyCase.title}</option>)}</select></label>
    <article className="medication-case-panel">
      <h3 ref={title} tabIndex={-1}>{item.title}</h3><FavoriteButton id={`medication-case.${item.id}`}/>
      <p>{item.scenario}</p>
      <fieldset className="medication-case-options" disabled={choice !== null}><legend>{item.question}</legend>{item.options.map((option, index) => <button type="button" key={option.text} onClick={() => setChoice(index)}><span aria-hidden="true">{String.fromCharCode(65 + index)}.</span><span>{option.text}</span></button>)}</fieldset>
      {choice !== null && <div className="medication-case-feedback" role="status" aria-live="polite" aria-atomic="true"><strong>{choice === item.answer ? 'Essa atitude favorece a segurança.' : 'Vamos refletir sobre essa escolha.'}</strong><p>{item.options[choice].feedback}</p>{choice !== item.answer && <p><strong>Atitude esperada:</strong> {item.options[item.answer].text}</p>}<button className="medication-secondary" onClick={() => { setChoice(null); title.current?.focus(); }}><RotateCcw size={17} aria-hidden="true"/>Tentar novamente</button></div>}
      <section className="medication-related"><h3><BookOpen size={20} aria-hidden="true"/>Base para estudar</h3><p>As fichas relacionadas e suas fontes permanecem pendentes de conferência e validação clínica. O exercício é uma criação educativa deste projeto.</p>{medicines.length ? <ul className="medication-related-list">{medicines.map(med => <li key={med.id}><a href={medicationHref(med.id)}>{med.genericName}<ArrowRight size={17} aria-hidden="true"/></a></li>)}</ul> : <a className="medication-secondary" href="#medicamentos">Conferir apresentações no guia<ArrowRight size={17} aria-hidden="true"/></a>}<a className="medication-back" href="#quiz">Casos e quiz do aplicativo<ArrowRight size={17} aria-hidden="true"/></a></section>
    </article>
  </section>;
}
