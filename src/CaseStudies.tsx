import { pdfReaderLink } from './pdf-catalog';
import { useEffect, useId, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, BookOpen, Check, MessageCircle, RotateCcw } from 'lucide-react';
import { caseStudies } from './cases';
import './case-studies.css';

export default function CaseStudies({ initialCase }: { initialCase?: string } = {}) {
  const prefix = useId();
  const [caseId, setCaseId] = useState(caseStudies.find(item => item.id === initialCase)?.id ?? caseStudies[0].id);
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const moveFocus = useRef(false);
  const studyCase = caseStudies.find(item => item.id === caseId)!;
  const step = studyCase.steps[stepIndex];
  const selected = answers[stepIndex];
  const answered = selected !== undefined;

  useEffect(() => {
    if (moveFocus.current) {
      heading.current?.focus();
      moveFocus.current = false;
    }
  }, [stepIndex, finished, caseId]);

  const reset = (focus = true) => {
    moveFocus.current = focus;
    setStepIndex(0);
    setAnswers([]);
    setFinished(false);
    if (focus && stepIndex === 0 && !finished) heading.current?.focus();
  };

  useEffect(() => {
    const selectedCase = caseStudies.find(item => item.id === initialCase);
    if (!selectedCase) return;
    setCaseId(selectedCase.id);
    setStepIndex(0);
    setAnswers([]);
    setFinished(false);
  }, [initialCase]);

  const advance = () => {
    moveFocus.current = true;
    if (stepIndex + 1 === studyCase.steps.length) setFinished(true);
    else setStepIndex(index => index + 1);
  };

  return <section className="case-studies" aria-labelledby={`${prefix}-title`}>
    <div className="case-heading">
      <span className="case-heading-icon"><MessageCircle size={25} aria-hidden="true"/></span>
      <div><h2 id={`${prefix}-title`}>Aprender com casos simulados</h2><p>Leia a situação, escolha uma atitude e explore a explicação antes de continuar.</p></div>
    </div>
    <p className="case-intro">Os cinco casos são fictícios e servem para discussão com o preceptor. Não recebem dados de pacientes nem certificam competência clínica. Revisão clínica e institucional pendente.</p>

    <div className="case-panel">
      <div className="case-selector">
        <label htmlFor={`${prefix}-select`}>Escolha um caso</label>
        <select id={`${prefix}-select`} value={caseId} onChange={event => {
          setCaseId(event.target.value);
          reset(false);
        }}>{caseStudies.map(item => <option key={item.id} value={item.id}>{item.subject} — {item.title}</option>)}</select>
      </div>
      <div className="case-meta"><span>{studyCase.subject}</span><span>{finished ? 'Discussão final' : `Etapa ${stepIndex + 1} de ${studyCase.steps.length}`}</span></div>
      <progress className="case-progress" value={finished ? studyCase.steps.length : stepIndex} max={studyCase.steps.length} aria-label="Etapas percorridas neste caso"/>
      <p className="case-goal"><strong>Objetivo do caso:</strong> {studyCase.goal}</p>

      {finished ? <div className="case-complete">
        <h3 ref={heading} tabIndex={-1}>Leve essa discussão ao preceptor</h3>
        <p>{studyCase.discussion}</p>
        <details className="case-review"><summary>Rever minhas escolhas neste caso</summary><ol>{studyCase.steps.map((item, index) => {
          const choice = item.options[answers[index]];
          return <li key={item.id}><strong>{item.question}</strong><p>Sua escolha: {choice?.text}</p><p>{choice?.feedback}</p><p className="case-expected"><strong>Atitude esperada:</strong> {item.options[item.answer].text}</p></li>;
        })}</ol></details>
        <p className="case-learning-note">Você percorreu {studyCase.steps.length} decisões para estudo. Este exercício não é uma avaliação de paciente ou habilitação para executar cuidados.</p>
        <button className="case-button" onClick={() => reset()}><RotateCcw size={18} aria-hidden="true"/> Repetir este caso</button>
      </div> : <>
        <h3 ref={heading} tabIndex={-1}>{studyCase.title}</h3>
        <p className="case-situation">{step.situation}</p>
        <fieldset className="case-options" disabled={answered}>
          <legend>{step.question}</legend>
          {step.options.map((option, index) => <button
            className={`case-option${answered && index === step.answer ? ' case-option-expected' : ''}${answered && index === selected && selected !== step.answer ? ' case-option-selected' : ''}`}
            key={option.text}
            onClick={() => setAnswers(previous => [...previous, index])}
          ><span className="case-option-letter" aria-hidden="true">{String.fromCharCode(65 + index)}</span><span>{option.text}{answered && index === selected && <span className="case-choice-label">Sua escolha</span>}{answered && index === step.answer && <span className="case-choice-label"><Check size={15} aria-hidden="true"/> Atitude esperada</span>}</span></button>)}
        </fieldset>
        {answered && <div className="case-feedback" role="status" aria-live="polite" aria-atomic="true">
          <strong>{selected === step.answer ? 'Essa escolha favorece o cuidado seguro.' : 'Vamos refletir sobre essa escolha.'}</strong>
          <p>{step.options[selected].feedback}</p>
          {selected !== step.answer && <p><strong>Atitude esperada:</strong> {step.options[step.answer].text}</p>}
        </div>}
        {answered && <button className="case-button" onClick={advance}>{stepIndex + 1 === studyCase.steps.length ? 'Ver discussão final' : 'Continuar o caso'}<ArrowRight size={18} aria-hidden="true"/></button>}
      </>}

      <div className="case-sources">
        <h4><BookOpen size={18} aria-hidden="true"/> Base para estudar</h4>
        <a href={studyCase.relatedModule.href}>{studyCase.relatedModule.label}<ArrowRight size={16} aria-hidden="true"/></a>
        {studyCase.sources.map(source => <a key={source.href} {...pdfReaderLink(source.href)}>{source.label}<ArrowUpRight size={16} aria-hidden="true"/><span className="sr-only"> (leitura no aplicativo)</span></a>)}
        <p>Casos adaptados dos conteúdos do projeto. As referências e os créditos permanecem no material original.</p>
      </div>
    </div>
  </section>;
}
