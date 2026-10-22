import { useEffect, useId, useRef, useState } from 'react';
import { BookOpen, ClipboardPenLine, RotateCcw } from 'lucide-react';
import { annotationScenarios, rubricCriteria } from './annotation-lab';
import { pdfReaderLink } from './pdf-catalog';
import ContentReview from './ContentReview';
import './annotation-lab.css';

type AnnotationLabProps = { initialScenario?: string };

/** A private, in-memory writing exercise using only the fixed fictional facts. */
export default function AnnotationLab({ initialScenario }: AnnotationLabProps) {
  const resolveScenario = (id: string | undefined) => annotationScenarios.find(item => item.id === id) ?? annotationScenarios[0];
  const [scenarioId, setScenarioId] = useState(() => resolveScenario(initialScenario).id);
  const [draft, setDraft] = useState('');
  const [reviewVisible, setReviewVisible] = useState(false);
  const [checked, setChecked] = useState<string[]>([]);
  const [focusRevision, setFocusRevision] = useState(0);
  const focusDestination = useRef<'scenario' | 'review' | 'editor' | null>(null);
  const scenarioHeadingRef = useRef<HTMLHeadingElement>(null);
  const reviewHeadingRef = useRef<HTMLHeadingElement>(null);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const previousInitialScenario = useRef(initialScenario);
  const prefix = useId();
  const selectedScenario = resolveScenario(scenarioId);

  // A route that opens another scenario must not carry over a previous draft.
  useEffect(() => {
    if (initialScenario === previousInitialScenario.current) return;
    previousInitialScenario.current = initialScenario;
    setScenarioId(resolveScenario(initialScenario).id);
    setDraft('');
    setChecked([]);
    setReviewVisible(false);
    focusDestination.current = 'scenario';
    setFocusRevision(previous => previous + 1);
  }, [initialScenario]);

  useEffect(() => {
    const destination = focusDestination.current;
    if (!destination) return;
    focusDestination.current = null;
    const target = destination === 'scenario' ? scenarioHeadingRef.current
      : destination === 'review' ? reviewHeadingRef.current : editorRef.current;
    target?.focus();
  }, [focusRevision]);

  function changeScenario(id: string) {
    setScenarioId(resolveScenario(id).id);
    setDraft('');
    setChecked([]);
    setReviewVisible(false);
    focusDestination.current = 'scenario';
    setFocusRevision(previous => previous + 1);
  }

  function reset() {
    setDraft('');
    setChecked([]);
    setReviewVisible(false);
    focusDestination.current = 'editor';
    setFocusRevision(previous => previous + 1);
  }

  function revealReview() {
    if (!draft.trim()) return;
    setReviewVisible(true);
    focusDestination.current = 'review';
    setFocusRevision(previous => previous + 1);
  }

  function toggleCriterion(id: string) {
    setChecked(previous => previous.includes(id) ? previous.filter(item => item !== id) : [...previous, id]);
  }

  return <section className="annotation-lab" aria-label="Laboratório de anotações de enfermagem">
    <div className="lab-intro">
      <span className="lab-icon"><ClipboardPenLine size={27} aria-hidden="true"/></span>
      <div>
        <h2>Pratique uma anotação com dados fictícios</h2>
        <p>Leia os fatos, escreva e compare seu texto com uma rubrica de autorrevisão. Não há correção clínica automática nem certificação.</p>
      </div>
    </div>
    <div className="lab-privacy" id={`${prefix}-privacy`}>
      <strong>Use somente os fatos do exercício.</strong>
      <p>Não digite dados reais de pacientes, prontuários ou profissionais. O texto fica apenas nesta tela, não é salvo nem enviado e é apagado ao sair do laboratório ou trocar de cenário.</p>
    </div>
    <div className="lab-panel">
      <label className="lab-selector" htmlFor={`${prefix}-scenario`}>Escolha um cenário fictício
        <select className="lab-scenario-select" id={`${prefix}-scenario`} value={selectedScenario.id} onChange={event => changeScenario(event.target.value)} aria-describedby={`${prefix}-change-note`}>
          {annotationScenarios.map(item => <option value={item.id} key={item.id}>{item.title}</option>)}
        </select>
      </label>
      <p className="lab-hint" id={`${prefix}-change-note`}>Trocar de cenário apaga a anotação e a autorrevisão atuais.</p>

      <div className="lab-scenario">
        <span className="lab-tag">SITUAÇÃO INTEIRAMENTE FICTÍCIA</span>
        <h3 ref={scenarioHeadingRef} tabIndex={-1}>{selectedScenario.title}</h3>
        <p>{selectedScenario.goal}</p>
        <h4>Fatos disponíveis</h4>
        <ol className="lab-facts">{selectedScenario.facts.map(fact => <li key={fact.id}>{fact.text}</li>)}</ol>
        <div className="lab-missing">
          <h4>O que o cenário não informa</h4>
          <ul>{selectedScenario.missingData.map(item => <li key={item}>{item}</li>)}</ul>
          <p>Reconheça essas lacunas. Em um registro real, horários, identificação profissional e demais informações exigidas devem seguir a avaliação, a supervisão e as normas aplicáveis; aqui, não preencha dados que não foram fornecidos.</p>
        </div>
      </div>

      <label className="lab-editor-label" htmlFor={`${prefix}-draft`}>Sua anotação do cenário fictício</label>
      <p className="lab-hint" id={`${prefix}-editor-help`}>Escreva apenas com base nos fatos acima. Limite de 2.500 caracteres. Não use este campo para uma anotação real.</p>
      <textarea className="lab-editor" id={`${prefix}-draft`} ref={editorRef} rows={7} maxLength={2500} value={draft} aria-describedby={`${prefix}-editor-help ${prefix}-privacy`} spellCheck onChange={event => {
        setDraft(event.target.value);
        setChecked([]);
        setReviewVisible(false);
      }}/>
      <div className="lab-actions">
        <button type="button" className="lab-button" disabled={!draft.trim()} onClick={revealReview}>Conferir meu texto</button>
        <button type="button" className="lab-button lab-reset" onClick={reset}><RotateCcw size={17} aria-hidden="true"/>Limpar exercício</button>
      </div>
      <p className="lab-hint">“Conferir meu texto” abre critérios para você revisar e um exemplo comentado. O aplicativo não analisa sua anotação.</p>

      {reviewVisible && <div className="lab-review">
        <h3 ref={reviewHeadingRef} tabIndex={-1}>Autorrevisão do seu texto</h3>
        <p>Compare seu texto com os fatos do cenário e marque manualmente os critérios que você considera atendidos. Se editar a anotação, a autorrevisão será reiniciada.</p>
        <fieldset className="lab-rubric">
          <legend>Rubrica de autoavaliação — cinco critérios</legend>
          {rubricCriteria.map(criterion => <label key={criterion.id} className="lab-rubric-item">
            <input type="checkbox" checked={checked.includes(criterion.id)} onChange={() => toggleCriterion(criterion.id)} aria-describedby={`${prefix}-${criterion.id}-help`}/>
            <span><strong>{criterion.label}</strong><span id={`${prefix}-${criterion.id}-help`}>{criterion.explanation}</span></span>
          </label>)}
        </fieldset>
        <p className="lab-self-count" role="status">{checked.length} de {rubricCriteria.length} critérios assinalados nesta autorrevisão.</p>
        <p>Essa contagem expressa somente sua conferência. Não é nota, avaliação de competência, certificação ou autorização para executar cuidados.</p>
        <div className="lab-example">
          <h4>Exemplo restrito aos fatos fornecidos</h4>
          <blockquote>{selectedScenario.example}</blockquote>
          <p>{selectedScenario.exampleComment}</p>
          <p>Este é um exercício de escrita. O exemplo é incompleto para uso em prontuário e não deve ser copiado para um registro real.</p>
        </div>
        <div className="lab-example lab-problematic">
          <h4>Compare: por que este exemplo precisa de revisão?</h4>
          <blockquote>{selectedScenario.problematicExample}</blockquote>
          <p>{selectedScenario.problematicComment}</p>
        </div>
        <p>Que informação faltou para produzir um registro completo? Leve a dúvida ao preceptor ou enfermeiro responsável, sem inventar a resposta.</p>
      </div>}

      <div className="lab-sources">
        <h3><BookOpen size={19} aria-hidden="true"/>Materiais usados neste exercício</h3>
        <ul>{selectedScenario.sourceRefs.map(source => <li key={source.href}>
          {source.href.startsWith('#') ? <a href={source.href}>{source.label}</a> : <a {...pdfReaderLink(source.href)}>{source.label}<span className="sr-only"> — abre o PDF em outra aba</span></a>}
        </li>)}</ul>
        <a href={selectedScenario.relatedHref}>Revisar o módulo de anotações de enfermagem</a>
        <p>Base: materiais educativos já fornecidos ao projeto. Revisão clínica e institucional pendente; não há validação profissional registrada.</p>
      </div>
    </div>
    <ContentReview contentId={`annotation.${selectedScenario.id}`}/>
  </section>;
}
