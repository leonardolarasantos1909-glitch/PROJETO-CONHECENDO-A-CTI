import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { ArrowRight, BookOpen, Check, HeartHandshake, MessageCircle, RotateCcw, ShieldCheck } from 'lucide-react';
import {
  communicationCases, communicationSituations, familyGuidance, familyReferences,
  familySections, localVisitingRule, visitorGuidance,
} from './family-welcome';
import FamilyLeaflet from './FamilyLeaflet';
import { FavoriteButton } from './Favorites';
import './family-welcome.css';

type FamilyWelcomeProps = { initialSection?: string; initialCase?: string };

/** Sources are optional consultation links, never loaded automatically. */
function FamilyReferences({ ids, label = 'Fontes e limites desta seção' }: { ids: readonly string[]; label?: string }) {
  const sources = [...new Set(ids)].flatMap(id => {
    const item = familyReferences.find(reference => reference.id === id);
    return item ? [item] : [];
  });
  return <details className="family-references"><summary><BookOpen size={18} aria-hidden="true"/>{label}</summary>
    {sources.length ? <ul>{sources.map(source => <li key={source.id}>
      <a href={source.href} target="_blank" rel="noopener noreferrer">{source.title}<span className="sr-only"> — abre em outra aba</span></a>
      <p>{source.scope}</p><p>{source.note}</p>
      {source.lastAccessedAt && <p className="family-reference-date">Consulta registrada: {source.lastAccessedAt.split('-').reverse().join('/')}. A consulta não equivale à revisão clínica do módulo.</p>}
    </li>)}</ul> : <p>Referências específicas ainda precisam ser conferidas e documentadas.</p>}
    <p className="family-source-limit">Exemplos adaptados para estudo. As fontes não comprovam adoção do módulo pela instituição. Revisão profissional e aprovação da enfermeira responsável pendentes.</p>
  </details>;
}

/** Every choice and the visited-case count stay only in this mounted exercise. */
function CommunicationSimulator({ initialCase }: { initialCase?: string }) {
  const resolveIndex = (id?: string) => Math.max(0, communicationCases.findIndex(item => item.id === id));
  const [index, setIndex] = useState(() => resolveIndex(initialCase));
  const [selected, setSelected] = useState<number | null>(null);
  const [reviewed, setReviewed] = useState<string[]>([]);
  const [ended, setEnded] = useState(false);
  const [focusRevision, setFocusRevision] = useState(0);
  const focusDestination = useRef<'heading' | 'feedback' | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const previousInitialCase = useRef(initialCase);
  const prefix = useId();
  const item = communicationCases[index];
  const answered = selected !== null;

  useEffect(() => {
    if (initialCase === previousInitialCase.current) return;
    previousInitialCase.current = initialCase;
    setIndex(resolveIndex(initialCase));
    setSelected(null);
    setEnded(false);
    focusDestination.current = 'heading';
    setFocusRevision(value => value + 1);
  }, [initialCase]);

  useEffect(() => {
    const destination = focusDestination.current;
    if (!destination) return;
    focusDestination.current = null;
    (destination === 'feedback' ? feedbackRef.current : headingRef.current)?.focus();
  }, [focusRevision]);

  function moveTo(next: number) {
    setIndex(next);
    setSelected(null);
    setEnded(false);
    focusDestination.current = 'heading';
    setFocusRevision(value => value + 1);
  }

  function answer(option: number) {
    if (answered) return;
    setSelected(option);
    setReviewed(previous => [...new Set([...previous, item.id])]);
    focusDestination.current = 'feedback';
    setFocusRevision(value => value + 1);
  }

  function advance() {
    if (index < communicationCases.length - 1) moveTo(index + 1);
    else {
      setEnded(true);
      focusDestination.current = 'heading';
      setFocusRevision(value => value + 1);
    }
  }

  function restart() {
    setReviewed([]);
    moveTo(0);
  }

  return <section className="family-simulator" aria-label="Simulador educativo de comunicação">
    <div className="family-simulation-context"><MessageCircle size={23} aria-hidden="true"/><p>Oito situações inteiramente fictícias para refletir sobre acolhimento, segurança e comunicação. As escolhas ficam somente nesta tela e não certificam competência nem substituem supervisão.</p></div>
    <label className="family-case-selector" htmlFor={`${prefix}-case`}>Escolha uma situação fictícia
      <select id={`${prefix}-case`} value={item.id} onChange={event => moveTo(resolveIndex(event.target.value))}>
        {communicationCases.map((scenario, position) => <option key={scenario.id} value={scenario.id}>{position + 1}. {scenario.title}</option>)}
      </select>
    </label>
    {ended ? <div className="family-simulation-complete">
      <h3 className="family-case-question" ref={headingRef} tabIndex={-1}>Continue a conversa com a equipe</h3>
      <p>Você consultou a devolutiva de <strong>{reviewed.length} de {communicationCases.length} situações</strong> nesta visita. Essa contagem acompanha sua consulta; não é nota ou avaliação clínica.</p>
      <p>Que palavras ajudam a acolher sem prometer? Que dúvidas precisam ser encaminhadas? Leve essas reflexões ao preceptor ou enfermeiro responsável.</p>
      <button type="button" className="family-action" onClick={restart}><RotateCcw size={18} aria-hidden="true"/>Reiniciar simulações</button>
    </div> : <>
      <p className="family-case-number" id={`${prefix}-number`}>SITUAÇÃO {index + 1} DE {communicationCases.length} · {item.title}</p>
      <p className="family-case-situation">{item.situation}</p>
      <h3 className="family-case-question" ref={headingRef} tabIndex={-1} aria-describedby={`${prefix}-number`}>{item.question}</h3>
      <FavoriteButton id={`family.case.${item.id}`}/>
      <fieldset className="family-sim-options" disabled={answered}><legend>Escolha uma resposta para o cenário</legend>
        {item.options.map((option, position) => <button key={option.text} type="button" className={`family-sim-option${answered && position === item.answer ? ' is-recommended' : ''}${answered && position === selected && position !== item.answer ? ' is-selected' : ''}`} onClick={() => answer(position)}>
          <span className="family-option-letter" aria-hidden="true">{String.fromCharCode(65 + position)}</span><span className="family-option-copy">{option.text}
            {answered && (position === selected || position === item.answer) && <span className="family-option-states">
              {position === selected && <span>Sua escolha</span>}
              {position === item.answer && <span><Check size={15} aria-hidden="true"/>Resposta recomendada neste cenário</span>}
            </span>}
          </span>
        </button>)}
      </fieldset>
      {answered && <div className="family-sim-feedback" ref={feedbackRef} role="status" tabIndex={-1} aria-labelledby={`${prefix}-feedback-title`} aria-describedby={`${prefix}-feedback-text`}>
        <h4 id={`${prefix}-feedback-title`}>{selected === item.answer ? 'Uma resposta alinhada ao acolhimento.' : 'Vamos refletir sobre essa escolha.'}</h4>
        <p id={`${prefix}-feedback-text`}>{item.options[selected].feedback}</p>
        <p><strong>Resposta recomendada neste cenário:</strong> {item.options[item.answer].text}</p>
        <p>{item.explanation}</p>
        <div className="family-sim-actions"><button type="button" className="family-action family-sim-next" onClick={advance}>{index === communicationCases.length - 1 ? 'Concluir percurso' : 'Próxima situação'}<ArrowRight size={18} aria-hidden="true"/></button><button type="button" className="family-secondary" onClick={() => moveTo(index)}><RotateCcw size={17} aria-hidden="true"/>Tentar novamente</button></div>
        <FamilyReferences ids={item.referenceIds} label="Fontes e limites deste cenário"/>
      </div>}
    </>}
  </section>;
}

export default function FamilyWelcome({ initialSection, initialCase }: FamilyWelcomeProps) {
  const resolveSection = (value?: string) => familySections.find(section => section.id === value)?.id ?? (initialCase ? 'simulador' : familySections[0].id);
  const [selected, setSelected] = useState(() => resolveSection(initialSection));
  const previousRoute = useRef({ initialSection, initialCase });
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const prefix = useId();
  const current = familySections.find(section => section.id === selected) ?? familySections[0];

  useEffect(() => {
    if (previousRoute.current.initialSection === initialSection && previousRoute.current.initialCase === initialCase) return;
    previousRoute.current = { initialSection, initialCase };
    setSelected(resolveSection(initialSection));
  }, [initialSection, initialCase]);

  function choose(index: number, focus = false) {
    const section = familySections[index];
    if (!section) return;
    setSelected(section.id);
    if (focus) tabs.current[index]?.focus();
  }

  function tabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    switch (event.key) {
      case 'ArrowRight': next = (index + 1) % familySections.length; break;
      case 'ArrowLeft': next = (index + familySections.length - 1) % familySections.length; break;
      case 'Home': next = 0; break;
      case 'End': next = familySections.length - 1; break;
      default: return;
    }
    event.preventDefault();
    choose(next, true);
  }

  const panel = () => selected === 'acolhimento' ? <>
    <div className="family-guidance-grid">{familyGuidance.map(item => <article className="family-guidance-card" key={item.id}><h3>{item.title}</h3><p>{item.text}</p><blockquote>{item.example}</blockquote></article>)}</div>
    <FamilyReferences ids={familyGuidance.flatMap(item => item.referenceIds)}/>
  </> : selected === 'visitante' ? <>
    <div className="family-guidance-grid">{visitorGuidance.map(item => <article className="family-guidance-card" key={item.id}><h3>{item.title}</h3><p>{item.text}</p><p className="family-attention"><ShieldCheck size={17} aria-hidden="true"/>{item.attention}</p></article>)}</div>
    <aside className="family-local-rule" aria-labelledby={`${prefix}-local-rule`}><h3 id={`${prefix}-local-rule`}>Visitação: confirmar a configuração local</h3><p><strong>{localVisitingRule.unit} — informação relatada:</strong> {localVisitingRule.reportedRule}.</p><p>{localVisitingRule.note}</p><p className="family-local-status">Pendente de confirmação institucional. Não é uma regra geral para todas as CTIs e não deve ser apresentada como orientação oficial já aprovada.</p></aside>
    <FamilyReferences ids={visitorGuidance.flatMap(item => item.referenceIds)}/>
  </> : selected === 'falas' ? <>
    <div className="family-communication">{communicationSituations.map(item => <details key={item.id} className="family-communication-card"><summary><MessageCircle size={20} aria-hidden="true"/><span>{item.title}</span></summary><div className="family-speech-content"><div className="family-speech-example"><h3>Uma forma de acolher</h3><blockquote>{item.recommended}</blockquote></div><div className="family-speech-example family-speech-avoid"><h3>O que evitar</h3><blockquote>{item.avoid}</blockquote></div><p><strong>Por que essa diferença importa?</strong> {item.explanation}</p></div></details>)}</div>
    <FamilyReferences ids={communicationSituations.flatMap(item => item.referenceIds)}/>
  </> : selected === 'simulador' ? <CommunicationSimulator initialCase={initialCase}/> : <FamilyLeaflet/>;

  return <section className="family-welcome" aria-label="Acolher também é cuidar — acolhimento familiar">
    <div className="family-welcome-intro"><span className="family-welcome-icon"><HeartHandshake size={29} aria-hidden="true"/></span><div><h2>A família faz parte do cuidado.</h2><p>Consulta educativa para estagiários e novos colaboradores. Acolha, escute e oriente dentro de suas atribuições, com supervisão e respeito às condições de cada pessoa.</p></div></div>
    <p className="family-audience-note">O aplicativo é para quem aprende e integra a equipe. Os familiares podem receber o folheto próprio; o acesso deles ao aplicativo não é obrigatório.</p>
    <div className="family-review-status"><ShieldCheck size={21} aria-hidden="true"/><p><strong>Revisão clínica e institucional pendente.</strong> Uso institucional sujeito à aprovação da enfermeira responsável. Os exemplos são educativos e não são prescrições ou ordens clínicas.</p></div>
    <div className="family-tabs" role="tablist" aria-label="Seções de acolhimento familiar">{familySections.map((section, index) => <button key={section.id} type="button" role="tab" id={`${prefix}-tab-${section.id}`} aria-controls={`${prefix}-panel-${section.id}`} aria-selected={selected === section.id} tabIndex={selected === section.id ? 0 : -1} ref={element => { tabs.current[index] = element; }} onClick={() => choose(index)} onKeyDown={event => tabKey(event, index)}><span className="family-tab-number" aria-hidden="true">{index + 1}</span><span>{section.title}</span></button>)}</div>
    {familySections.map(section => <section key={section.id} className="family-panel" role="tabpanel" id={`${prefix}-panel-${section.id}`} aria-labelledby={`${prefix}-tab-${section.id}`} hidden={selected !== section.id} tabIndex={selected === section.id ? 0 : -1}>{selected === section.id && <>
      <div className="family-section-heading"><h2>{current.title}</h2><p>{current.description}</p><FavoriteButton id={`family.section.${current.id}`}/></div>
      {panel()}
    </>}</section>)}
  </section>;
}
