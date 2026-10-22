import { useEffect, useId, useRef, useState } from 'react';
import { ArrowRight, Check, ClipboardCheck, RotateCcw } from 'lucide-react';
import { INTEGRATION_KEY, integrationItems } from './integration-checklist';
import { readSavedIds, writeSavedIds } from './learning-storage';
import './integration-checklist.css';

const IDS = integrationItems.map(item => item.id);

export default function IntegrationChecklist() {
  const [completed, setCompleted] = useState(() => readSavedIds(INTEGRATION_KEY, IDS));
  const [storageFailed, setStorageFailed] = useState(false);
  const prefix = useId();
  const firstItem = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key === INTEGRATION_KEY || event.key === null) setCompleted(readSavedIds(INTEGRATION_KEY, IDS));
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const update = (ids: string[]) => {
    setCompleted(ids);
    setStorageFailed(!writeSavedIds(INTEGRATION_KEY, ids));
  };

  return <section className="integration-checklist" aria-labelledby={`${prefix}-title`}>
    <div className="integration-intro"><ClipboardCheck size={26} aria-hidden="true"/><div><h2 id={`${prefix}-title`}>Minha ambientação no setor</h2><p>Um roteiro educativo para organizar sua chegada com a equipe, incluindo quem já tem experiência em outra instituição.</p></div></div>
    <div className="integration-review"><strong>Pendente de validação institucional</strong><p>Os itens são sugestões genéricas de ambientação. A equipe deve validar o roteiro e apresentar os fluxos locais autorizados. Concluir as marcações não representa treinamento obrigatório, certificação ou autorização para executar procedimentos.</p></div>
    <div className="integration-progress"><div><strong>{completed.length} de {integrationItems.length} itens marcados</strong><span>Progresso pessoal neste navegador.</span></div><progress max={integrationItems.length} value={completed.length} aria-label="Itens marcados no roteiro de integração"/></div>
    <p className="integration-storage" role="status">{storageFailed ? 'Não foi possível guardar as marcações neste navegador. Elas funcionam nesta sessão, mas podem desaparecer ao sair.' : 'As marcações ficam somente neste navegador. Não são enviadas à instituição. Não informe dados de pacientes; o navegador pode apagar os dados locais.'}</p>
    <ol className="integration-items">{integrationItems.map((item, index) => {
      const checked = completed.includes(item.id);
      return <li key={item.id} className={checked ? 'is-complete' : ''}>
        <label htmlFor={`${prefix}-${item.id}`}><input ref={index === 0 ? firstItem : undefined} id={`${prefix}-${item.id}`} type="checkbox" checked={checked} onChange={() => update(checked ? completed.filter(id => id !== item.id) : [...completed, item.id])}/><span className="integration-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><strong>{item.title}</strong>{checked && <Check size={18} aria-hidden="true"/>}</label>
        <div className="integration-item-content"><p>{item.detail}</p><a href={item.href}>Revisar conteúdo relacionado <ArrowRight size={17} aria-hidden="true"/></a><p className="integration-source">Base educativa: {item.sourceLabel}.</p></div>
      </li>;
    })}</ol>
    <div className="integration-bottom">{completed.length === integrationItems.length && <p role="status">Roteiro marcado. Revise as dúvidas com a equipe e siga o processo de integração autorizado pela instituição.</p>}<button type="button" onClick={() => { update([]); firstItem.current?.focus(); }} disabled={completed.length === 0}><RotateCcw size={17} aria-hidden="true"/> Reiniciar checklist de integração</button></div>
    <a className="integration-student-link" href="#primeiro-dia">Consultar também o checklist do estagiário <ArrowRight size={17} aria-hidden="true"/></a>
  </section>;
}
