import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { Download, ListChecks, RotateCcw } from 'lucide-react';
import { buildFeedbackExport, feedbackAnsweredCount, feedbackScale, feedbackValueLabel, FEEDBACK_INSTRUMENT_VERSION, isFeedbackValue, pblFeedbackQuestions, type FeedbackAnswers } from './pbl-feedback';
import './project-preparation.css';

export default function PblFeedback() {
  const prefix = useId();
  const [consented, setConsented] = useState(false);
  const [answers, setAnswers] = useState<FeedbackAnswers>({});
  const [showSummary, setShowSummary] = useState(false);
  const [notice, setNotice] = useState('');
  const summaryHeading = useRef<HTMLHeadingElement>(null);
  const consentInput = useRef<HTMLInputElement>(null);
  const completed = feedbackAnsweredCount(answers);
  const exportData = buildFeedbackExport(answers, consented);

  useEffect(() => {
    if (showSummary) summaryHeading.current?.focus();
  }, [showSummary]);

  function clearResponses() {
    setAnswers({});
    setShowSummary(false);
    setConsented(false);
    setNotice('Respostas e concordância limpas desta tela. Uma cópia que você já baixou continua sob seu controle.');
    consentInput.current?.focus();
  }

  function summarize(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!exportData) return;
    setShowSummary(true);
    setNotice('Resumo gerado somente nesta tela. Nenhuma resposta foi enviada.');
    summaryHeading.current?.focus();
  }

  function downloadResponses() {
    const payload = buildFeedbackExport(answers, consented);
    if (!payload || !showSummary) return;
    let url: string | undefined;
    try {
      url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' }));
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'avaliacao-pbl-respostas.json';
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
      setNotice('Arquivo de respostas criado no aparelho. Ele não foi enviado à equipe ou a um servidor.');
    } catch {
      setNotice('O navegador não permitiu criar o arquivo. Seu resumo continua disponível nesta tela.');
    } finally {
      if (url) setTimeout(() => URL.revokeObjectURL(url!), 1000);
    }
  }

  return <section className="project-preparation pbl-feedback" aria-labelledby={`${prefix}-title`}>
    <div className="preparation-intro"><ListChecks size={27} aria-hidden="true"/><div><h2 id={`${prefix}-title`}>Como foi sua experiência?</h2><p>Avaliação voluntária de usabilidade e aprendizagem percebida, para demonstração do PBL.</p></div></div>
    <p>Este questionário educativo foi criado para o projeto. Ele registra sua percepção, não comprova aprendizagem objetiva ou competência clínica e não possui validação formal registrada. Versão do instrumento: {FEEDBACK_INSTRUMENT_VERSION}.</p>
    <div className="preparation-card feedback-privacy" id={`${prefix}-privacy`}><h3>Você decide se quer responder</h3><ul><li>Não solicitamos nome, matrícula, e-mail ou dados de pacientes.</li><li>As respostas ficam apenas na memória desta tela. Sair dela, recarregar ou usar “Limpar respostas” reinicia o questionário.</li><li>Não há envio automático, banco de respostas ou acompanhamento remoto. Responder aqui não encaminha uma avaliação à equipe.</li><li>Se você escolher baixar o arquivo, a cópia ficará em seu aparelho e você decidirá como guardá-la ou compartilhá-la.</li></ul></div>
    <label className="feedback-consent" htmlFor={`${prefix}-consent`}><input ref={consentInput} type="checkbox" id={`${prefix}-consent`} checked={consented} aria-describedby={`${prefix}-privacy`} onChange={event => {
      setConsented(event.target.checked);
      setNotice('');
      if (!event.target.checked) { setAnswers({}); setShowSummary(false); }
    }}/><span>Entendi que a participação é voluntária e que minhas respostas ficam somente nesta tela, sem envio automático.</span></label>

    <form onSubmit={summarize} aria-label="Avaliação local do PBL">
      <fieldset className="feedback-questions" disabled={!consented}><legend>Escolha uma resposta para cada afirmação</legend><p>Use de 1 (discordo totalmente) a 5 (concordo totalmente), ou escolha “Não avaliei”. Você pode deixar de participar a qualquer momento.</p>
        {pblFeedbackQuestions.map((question, index) => <div className="feedback-question" key={question.id}>
          <label htmlFor={`${prefix}-${question.id}`}><span className="feedback-number" aria-hidden="true">{index + 1}</span><span>{question.text}</span></label>
          <select id={`${prefix}-${question.id}`} required value={answers[question.id] ?? ''} onChange={event => {
            const value = event.target.value;
            setAnswers(previous => {
              const next = { ...previous };
              if (isFeedbackValue(value)) next[question.id] = value;
              else delete next[question.id];
              return next;
            });
            setShowSummary(false);
            setNotice('');
          }}><option value="">Escolha uma opção</option>{feedbackScale.map(option => <option value={option.value} key={option.value}>{option.label}</option>)}</select>
        </div>)}
      </fieldset>
      <p className="feedback-count" role="status">{completed} de {pblFeedbackQuestions.length} itens respondidos. “Não avaliei” também é uma resposta válida.</p>
      <div className="preparation-actions"><button className="preparation-button" type="submit" disabled={!exportData}>Gerar meu resumo</button><button className="preparation-secondary" type="button" onClick={clearResponses} disabled={!consented && completed === 0}><RotateCcw size={17} aria-hidden="true"/> Limpar respostas</button></div>
    </form>

    {showSummary && exportData && <section className="preparation-card feedback-summary" aria-labelledby={`${prefix}-summary`}>
      <h3 id={`${prefix}-summary`} ref={summaryHeading} tabIndex={-1}>Meu resumo local</h3>
      <p>Confira as respostas que você escolheu. Não é calculada uma nota de aprendizagem ou certificação.</p>
      <dl>{pblFeedbackQuestions.map(question => <div key={question.id}><dt>{question.text}</dt><dd>{feedbackValueLabel(answers[question.id]!)}</dd></div>)}</dl>
      <button className="preparation-button" type="button" onClick={downloadResponses}><Download size={17} aria-hidden="true"/> Baixar minhas respostas</button>
      <p className="preparation-small">O arquivo contém somente a versão do instrumento e as respostas fechadas. Nenhum identificador, horário ou dado do aparelho é incluído.</p>
    </section>}
    <p className="preparation-notice" role="status" aria-live="polite">{notice}</p>

    <details className="preparation-details"><summary>O que precisa ser definido antes de uma coleta remota?</summary><p>Uma eventual coleta centralizada depende de aprovação de uma proposta específica: finalidade, participação voluntária, consentimento, perguntas, responsável, local de armazenamento, prazo e procedimento de exclusão, controle de acesso e segurança. Esta demonstração não envia respostas e não cria esse serviço.</p></details>
  </section>;
}
