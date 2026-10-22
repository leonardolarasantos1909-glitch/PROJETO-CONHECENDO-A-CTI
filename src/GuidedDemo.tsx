import { useEffect, useId, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Presentation, RotateCcw } from 'lucide-react';
import { guidedDemoSteps } from './guided-demo';
import './project-preparation.css';

type DemoSession = { index: number; viewed: string[]; finished: boolean };
// This tab's transient memory allows returning from a linked screen without browser storage.
let demoSession: DemoSession = { index: 0, viewed: [], finished: false };

export default function GuidedDemo() {
  const prefix = useId();
  const [session, setSession] = useState<DemoSession>(() => ({ ...demoSession, viewed: [...demoSession.viewed] }));
  const heading = useRef<HTMLHeadingElement>(null);
  const moveFocus = useRef(false);
  const step = guidedDemoSteps[session.index];

  useEffect(() => {
    demoSession = { ...session, viewed: [...session.viewed] };
    if (moveFocus.current) { heading.current?.focus(); moveFocus.current = false; }
  }, [session]);

  function goTo(index: number) {
    if (index < 0 || index >= guidedDemoSteps.length) return;
    moveFocus.current = true;
    setSession(previous => ({ ...previous, index, finished: false }));
  }

  function restart() {
    moveFocus.current = true;
    setSession({ index: 0, viewed: [], finished: false });
  }

  return <section className="project-preparation guided-demo" aria-labelledby={`${prefix}-title`}>
    <div className="preparation-intro"><Presentation size={27} aria-hidden="true"/><div><h2 id={`${prefix}-title`}>Demonstração guiada</h2><p>Um roteiro de aproximadamente 5–8 minutos, no seu ritmo, para apresentar os dois públicos e os recursos educativos.</p></div></div>
    <p>Use somente cenários fictícios. As etapas vistas ficam apenas na memória desta aba; você pode voltar ao roteiro depois de explorar uma tela. Recarregar o aplicativo ou reiniciar esta demonstração limpa esse acompanhamento.</p>
    <div className="demo-progress"><strong>{session.viewed.length} de {guidedDemoSteps.length} etapas marcadas como vistas</strong><progress value={session.viewed.length} max={guidedDemoSteps.length} aria-label="Etapas marcadas como vistas na demonstração"/></div>
    <nav className="demo-step-nav" aria-label="Etapas da demonstração">{guidedDemoSteps.map((item, index) => <button key={item.id} type="button" aria-label={`${index + 1}. ${item.title}`} aria-current={!session.finished && index === session.index ? 'step' : undefined} onClick={() => goTo(index)}><span>{index + 1}</span>{session.viewed.includes(item.id) && <Check size={15} aria-hidden="true"/>}</button>)}</nav>

    {session.finished ? <div className="preparation-card demo-complete">
      <h3 ref={heading} tabIndex={-1}>Demonstração percorrida</h3><p>Você marcou {session.viewed.length} de {guidedDemoSteps.length} etapas como vistas. Este acompanhamento é um roteiro de apresentação, não certificação, avaliação clínica ou registro de treinamento obrigatório.</p><p>Reúna as pendências de revisão e as observações da equipe responsável. A implantação institucional e qualquer coleta remota de avaliação dependem de decisões e autorizações próprias.</p><div className="preparation-actions"><button className="preparation-button" type="button" onClick={() => goTo(0)}>Rever etapas <ArrowRight size={17} aria-hidden="true"/></button><button className="preparation-secondary" type="button" onClick={restart}><RotateCcw size={17} aria-hidden="true"/> Reiniciar demonstração</button></div>
    </div> : <div className="preparation-card demo-current">
      <p className="demo-step-number">Etapa {session.index + 1} de {guidedDemoSteps.length}</p><h3 ref={heading} tabIndex={-1}>{step.title}</h3><p className="demo-purpose">{step.purpose}</p><ol>{step.actions.map(action => <li key={action}>{action}</li>)}</ol>
      <div className="demo-links">{step.links.map(link => <a className="preparation-link" key={link.href} href={link.href}>{link.label} <ArrowRight size={17} aria-hidden="true"/></a>)}</div>
      <label className="demo-mark" htmlFor={`${prefix}-viewed`}><input id={`${prefix}-viewed`} type="checkbox" checked={session.viewed.includes(step.id)} onChange={event => {
        const checked = event.target.checked;
        setSession(previous => ({ ...previous, viewed: checked ? [...new Set([...previous.viewed, step.id])] : previous.viewed.filter(id => id !== step.id) }));
      }}/><span>Marcar esta etapa como vista</span></label>
      <div className="demo-controls"><button className="preparation-secondary" type="button" disabled={session.index === 0} onClick={() => goTo(session.index - 1)}><ArrowLeft size={17} aria-hidden="true"/> Etapa anterior</button><button className="preparation-button" type="button" onClick={() => {
        if (session.index + 1 < guidedDemoSteps.length) goTo(session.index + 1);
        else { moveFocus.current = true; setSession(previous => ({ ...previous, finished: true })); }
      }}>{session.index + 1 === guidedDemoSteps.length ? 'Concluir demonstração' : 'Próxima etapa'} <ArrowRight size={17} aria-hidden="true"/></button></div>
      <button className="preparation-link demo-restart" type="button" onClick={restart}><RotateCcw size={17} aria-hidden="true"/> Reiniciar demonstração</button>
    </div>}
    <p className="preparation-small">O aplicativo é um projeto acadêmico educativo em avaliação. Conteúdos, referências e rotinas locais precisam de revisão e das autorizações aplicáveis antes de uso institucional.</p>
  </section>;
}
