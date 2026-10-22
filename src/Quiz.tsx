import { useEffect, useId, useRef, useState } from 'react';
import { ArrowRight, Check, GraduationCap } from 'lucide-react';
import { questions, scoreAnswers } from './content';

/** Educational quiz only: responses stay in memory for the current visit. */
export default function Quiz() {
  const [subject, setSubject] = useState('Todos');
  const [answers, setAnswers] = useState<number[]>([]);
  const [index, setIndex] = useState(0);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const focusAfterChange = useRef<'heading' | 'feedback' | null>(null);
  const prefix = useId();
  const items = questions.filter(question => subject === 'Todos' || question.subject === subject);
  const question = items[index];
  const finished = index >= items.length;
  const selected = answers[index];
  const answered = selected !== undefined;

  useEffect(() => {
    const destination = focusAfterChange.current;
    if (!destination) return;
    focusAfterChange.current = null;
    (destination === 'feedback' ? feedbackRef.current : headingRef.current)?.focus();
  }, [subject, index, finished, answered]);

  function reset() {
    focusAfterChange.current = 'heading';
    setAnswers([]);
    setIndex(0);
  }

  function advance() {
    focusAfterChange.current = 'heading';
    setIndex(previous => previous + 1);
  }

  function answer(optionIndex: number) {
    if (answered) return;
    focusAfterChange.current = 'feedback';
    setAnswers(previous => previous[index] === undefined ? [...previous, optionIndex] : previous);
  }

  return <section className="quiz panel" aria-label="Quiz de revisão">
    <p className="quiz-intro">Banco com <strong>{questions.length} questões de revisão</strong>. Escolha um assunto ou pratique todos os temas e leia a explicação após cada resposta.</p>
    <label className="filter">Escolha um assunto <select value={subject} onChange={event => {
      setSubject(event.target.value);
      reset();
    }}>{['Todos', ...new Set(questions.map(question => question.subject))].map(value => <option key={value}>{value}</option>)}</select></label>

    {finished ? <div role="status" className="quiz-result">
      <span className="module-icon"><GraduationCap size={35} aria-hidden="true"/></span>
      <h2 ref={headingRef} tabIndex={-1}>Uma nova etapa no seu aprendizado.</h2>
      <p>Você acertou <strong>{scoreAnswers(items, answers)} de {items.length}</strong> questões.</p>
      <p>Continue explorando os módulos e leve suas dúvidas ao preceptor. Este resultado não certifica competência clínica.</p>
      <button className="button" onClick={reset}>Refazer quiz <ArrowRight size={17} aria-hidden="true"/></button>
    </div> : <>
      <div className="quiz-meta"><span id={`${prefix}-number`}>QUESTÃO {index + 1} DE {items.length}</span><span>{question.subject}</span></div>
      <div className="progress-track"><span style={{ width: `${index / items.length * 100}%` }}/></div>
      <h2 ref={headingRef} tabIndex={-1} aria-describedby={`${prefix}-number`}>{question.text}</h2>
      <fieldset disabled={answered}>
        <legend className="sr-only">Selecione uma resposta</legend>
        {question.options.map((option, optionIndex) => <button
          key={option}
          className={`answer ${answered ? (optionIndex === question.answer ? 'correct' : optionIndex === selected ? 'incorrect' : '') : ''}`}
          onClick={() => answer(optionIndex)}
        >
          <b>{String.fromCharCode(65 + optionIndex)}</b>
          <span className="quiz-answer-copy">
            <span>{option}</span>
            {answered && (optionIndex === selected || optionIndex === question.answer) && <span className="quiz-answer-labels">
              {optionIndex === selected && <span className="quiz-answer-state">Sua escolha</span>}
              {optionIndex === question.answer && <span className="quiz-answer-state"><Check size={16} aria-hidden="true"/> Resposta esperada</span>}
            </span>}
          </span>
        </button>)}
      </fieldset>
      {answered && <div ref={feedbackRef} role="status" className="feedback" tabIndex={-1} aria-labelledby={`${prefix}-feedback-title`} aria-describedby={`${prefix}-feedback-text`}>
        <strong id={`${prefix}-feedback-title`}>{selected === question.answer ? 'Resposta correta.' : 'Vamos aprender com essa resposta.'}</strong>
        <p id={`${prefix}-feedback-text`}>{question.explanation}</p>
        <button className="button" onClick={advance}>{index === items.length - 1 ? 'Ver resultado' : 'Próxima questão'}<ArrowRight size={17} aria-hidden="true"/></button>
      </div>}
    </>}
  </section>;
}
