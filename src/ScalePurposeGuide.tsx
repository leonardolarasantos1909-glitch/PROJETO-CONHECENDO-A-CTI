import { useEffect, useId, useState, type ReactNode } from 'react';
import { Activity, ArrowRight, Brain, HeartPulse, Layers } from 'lucide-react';
import { modules } from './content';
import ScalesGuide from './ScalesGuide';
import { scaleIdForRoute } from './topic-identifiers';
import './institutional-tools.css';

type Purpose = 'todas' | 'dor' | 'sedacao' | 'consciencia';
const purposeFor = (id?: string): Purpose => id === 'rass' ? 'sedacao' : ['eva', 'bps', 'painad'].includes(id ?? '') ? 'dor' : ['consciencia', 'escala-de-coma-de-glasgow'].includes(id ?? '') ? 'consciencia' : 'todas';
const choices = [
  { id: 'todas', label: 'Todas as finalidades', icon: Layers },
  { id: 'dor', label: 'Dor', icon: HeartPulse },
  { id: 'sedacao', label: 'Sedação e agitação', icon: Activity },
  { id: 'consciencia', label: 'Nível de consciência', icon: Brain },
] as const;
const painScales = ['eva', 'bps', 'painad'] as const;
const sedationScales = ['rass'] as const;

export default function ScalePurposeGuide({ initialScale, renderFavorite, onOpenGlasgow }: { initialScale?: string; renderFavorite?: (id: string) => ReactNode; onOpenGlasgow?: () => void }) {
  const resolvedScale = scaleIdForRoute(initialScale) ?? initialScale;
  const [purpose, setPurpose] = useState<Purpose>(() => purposeFor(resolvedScale));
  const [activeScale, setActiveScale] = useState(resolvedScale);
  const prefix = useId();
  useEffect(() => { setPurpose(purposeFor(resolvedScale)); setActiveScale(resolvedScale); }, [resolvedScale]);
  function requestScale(id: string) {
    setPurpose(purposeFor(id));
    setActiveScale(id);
  }
  const glasgow = modules.find(module => module.id === 'escalas')?.topics.find(topic => topic.title.includes('Glasgow'));
  return <section className="scale-purpose-guide" aria-labelledby={`${prefix}-title`}>
    <h2 id={`${prefix}-title`}>Estudar escalas por finalidade</h2>
    <p className="institutional-description">Escolha o assunto que deseja estudar. Este seletor organiza materiais educativos; não avalia pacientes nem decide condutas.</p>
    <div className="scale-purpose-options" role="group" aria-label="Finalidade da escala">{choices.map(choice => {
      const Icon = choice.icon;
      return <button key={choice.id} type="button" aria-pressed={purpose === choice.id} onClick={() => setPurpose(choice.id)}><Icon size={19} aria-hidden="true"/>{choice.label}</button>;
    })}</div>
    <p className="institutional-selection" role="status">Finalidade selecionada: {choices.find(choice => choice.id === purpose)?.label}.</p>
    {purpose !== 'consciencia' && <ScalesGuide initialScale={activeScale} onRequestScale={requestScale} renderFavorite={renderFavorite} scaleIds={purpose === 'dor' ? painScales : purpose === 'sedacao' ? sedationScales : undefined}/>}
    {(purpose === 'consciencia' || purpose === 'todas') && glasgow && <article className="institutional-card glasgow-introduction">
      <span className="institutional-eyebrow">NÍVEL DE CONSCIÊNCIA · INTRODUÇÃO</span><h2>{glasgow.title}</h2>
      <p>{glasgow.purpose}</p><p>{glasgow.care}</p><p className="institutional-review-note">{glasgow.risk}</p>
      <p>O tópico existente é introdutório. A versão completa do instrumento e seus critérios precisam de revisão profissional antes de uso assistencial. Não há cálculo de pontuação nesta tela.</p>
      {onOpenGlasgow ? <button type="button" className="institutional-link institutional-topic-button" onClick={onOpenGlasgow}>Explorar o conteúdo de Glasgow <ArrowRight size={17} aria-hidden="true"/></button> : <a className="institutional-link" href="#escalas/escala-de-coma-de-glasgow">Explorar o conteúdo de Glasgow <ArrowRight size={17} aria-hidden="true"/></a>}
    </article>}
  </section>;
}
