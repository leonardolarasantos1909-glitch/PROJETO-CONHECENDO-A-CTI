import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { Activity, ArrowRight, ArrowUpRight, BookOpen, Brain, ChevronDown, Eye, MessageCircle } from 'lucide-react';
import { scales, scaleComparison } from './scales';
import { pdfReaderLink } from './pdf-catalog';
import './scales-guide.css';

const scaleIcons = { eva: MessageCircle, bps: Activity, painad: Eye, rass: Brain };
const CADERNO_PDF = '/materiais/caderno-cti-adulto-digital.pdf';

export default function ScalesGuide({ initialScale, renderFavorite }: { initialScale?: string; renderFavorite?: (id: string) => ReactNode } = {}) {
  const [selectedId, setSelectedId] = useState(scales.find(scale => scale.id === initialScale)?.id ?? scales[0].id);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const prefix = useId();
  const selected = scales.find(scale => scale.id === selectedId) ?? scales[0];
  const tabId = (id: string) => `${prefix}-tab-${id}`;
  const panelId = (id: string) => `${prefix}-panel-${id}`;

  useEffect(() => {
    setSelectedId(scales.find(scale => scale.id === initialScale)?.id ?? scales[0].id);
  }, [initialScale]);

  function selectTab(index: number, focus = false) {
    const next = scales[index];
    if (!next) return;
    setSelectedId(next.id);
    if (focus) tabRefs.current[index]?.focus();
  }

  function handleTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let destination: number;
    switch (event.key) {
      case 'ArrowRight': destination = (index + 1) % scales.length; break;
      case 'ArrowLeft': destination = (index + scales.length - 1) % scales.length; break;
      case 'Home': destination = 0; break;
      case 'End': destination = scales.length - 1; break;
      default: return;
    }
    event.preventDefault();
    selectTab(destination, true);
  }

  function openComparisonScale(id: string) {
    const index = scales.findIndex(scale => scale.id === id);
    if (index < 0) return;
    selectTab(index, true);
    tabRefs.current[index]?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' });
  }

  return <div className="scales-guide">
    <p className="scales-intro">EVA, BPS e PAINAD avaliam dor em perfis diferentes de pacientes. A RASS descreve agitação e sedação. Selecione uma aba para conhecer cada instrumento.</p>
    <div className="scales-tabs" role="tablist" aria-label="Escolha uma escala">
      {scales.map((scale, index) => {
        const Icon = scaleIcons[scale.id as keyof typeof scaleIcons] ?? Activity;
        return <button
          key={scale.id}
          type="button"
          role="tab"
          id={tabId(scale.id)}
          aria-controls={panelId(scale.id)}
          aria-selected={selectedId === scale.id}
          tabIndex={selectedId === scale.id ? 0 : -1}
          ref={element => { tabRefs.current[index] = element; }}
          onClick={() => selectTab(index)}
          onKeyDown={event => handleTabKey(event, index)}
        >
          <Icon size={21} aria-hidden="true"/>
          <span><strong>{scale.label}</strong><span>{scale.category}</span></span>
        </button>;
      })}
    </div>

    {scales.map(scale => <div
      key={scale.id}
      role="tabpanel"
      id={panelId(scale.id)}
      aria-labelledby={tabId(scale.id)}
      hidden={selectedId !== scale.id}
      tabIndex={0}
      className="scales-tabpanel"
    >{selectedId === scale.id && <>
      <section className="scales-overview" aria-labelledby={`${prefix}-name-${scale.id}`}>
        <div className="scales-overview-heading">
          <div><span className="scales-category">{scale.category}</span><h2 id={`${prefix}-name-${scale.id}`}>{scale.name}</h2></div>
          {scale.range && <div className="scales-range"><span>{scale.range.label}</span><strong>{scale.range.min} a {scale.range.max}</strong></div>}
        </div>
        <p>{scale.purpose}</p>
        {renderFavorite?.(scale.id)}
        {scale.id.toLowerCase() === 'eva' && <figure className="scales-eva-example">
          <div role="img" aria-label="Linha ilustrativa da EVA: de sem dor a pior dor imaginável, sem medida real na tela.">
            <div className="scales-eva-line" aria-hidden="true"/>
            <div className="scales-eva-labels" aria-hidden="true"><span>Sem dor</span><span>Pior dor imaginável</span></div>
          </div>
          <figcaption>Ilustração sem medida real na tela</figcaption>
        </figure>}
      </section>

      {scale.criteria && <section className="scales-card scales-criteria" aria-labelledby={`${prefix}-criteria-${scale.id}`}>
        <h3 id={`${prefix}-criteria-${scale.id}`}>Itens e critérios da escala</h3>
        <p className="scales-criteria-intro">{scale.criteria.intro}</p>
        <p className="scales-criteria-method"><strong>Como a leitura é formada:</strong> {scale.criteria.method}</p>

        {scale.criteria.steps && <ol className="scales-criteria-steps">{scale.criteria.steps.map((step, index) => <li key={index}>
          <strong>{step.title}</strong><p>{step.detail}</p>
        </li>)}</ol>}

        {scale.criteria.domains && <div className="scales-domains">{scale.criteria.domains.map((domain, index) => {
          const points = domain.levels.map(level => level.points);
          return <details className="scales-domain" key={domain.id} open={index === 0}>
            <summary>
              <span><strong>{domain.title}</strong><span>{Math.min(...points)} a {Math.max(...points)} pontos</span></span>
              <ChevronDown size={20} aria-hidden="true"/>
            </summary>
            <div className="scales-domain-content">
              <table className="scales-domain-table">
                <caption className="sr-only">{scale.label}: pontos e critérios de {domain.title}</caption>
                <thead><tr><th scope="col">Pontos</th><th scope="col">Critério</th></tr></thead>
                <tbody>{domain.levels.map(level => <tr key={level.points}>
                  <th scope="row"><span className="scales-domain-points">{level.points}</span></th>
                  <td>{level.criterion}</td>
                </tr>)}</tbody>
              </table>
              <a className="scales-domain-source" href={`${CADERNO_PDF}#page=${domain.page}`} target="_blank" rel="noopener noreferrer">Conferir na página {domain.page} do caderno <ArrowUpRight size={16} aria-hidden="true"/></a>
            </div>
          </details>;
        })}</div>}

        {scale.criteria.example && <div className="scales-criteria-example"><h4>Exemplo para estudo</h4><p>{scale.criteria.example}</p></div>}
      </section>}

      {scale.levelGuide && <section className="scales-card scales-levels" aria-labelledby={`${prefix}-levels-${scale.id}`}>
        <h3 id={`${prefix}-levels-${scale.id}`}>Pontuações descritas na escala</h3>
        <dl>{scale.levelGuide.map(level => <div className="scales-level" key={level.score}>
          <dt><span className="scales-score">{level.score}</span><strong>{level.label}</strong></dt>
          <dd>{level.description}</dd>
        </div>)}</dl>
      </section>}

      <div className="scales-content-grid">
        <section className="scales-card" aria-labelledby={`${prefix}-when-${scale.id}`}>
          <span className="scales-section-index" aria-hidden="true">01</span>
          <h3 id={`${prefix}-when-${scale.id}`}>Quando utilizar</h3>
          <ul>{scale.when.map((text, index) => <li key={index}>{text}</li>)}</ul>
        </section>
        <section className="scales-card" aria-labelledby={`${prefix}-measures-${scale.id}`}>
          <span className="scales-section-index" aria-hidden="true">02</span>
          <h3 id={`${prefix}-measures-${scale.id}`}>O que a escala avalia</h3>
          <dl className="scales-measures">{scale.measures.map((measure, index) => <div key={index}><dt>{measure.title}</dt><dd>{measure.detail}</dd></div>)}</dl>
        </section>
        <section className="scales-card" aria-labelledby={`${prefix}-read-${scale.id}`}>
          <span className="scales-section-index" aria-hidden="true">03</span>
          <h3 id={`${prefix}-read-${scale.id}`}>Como interpretar a leitura</h3>
          <ul>{scale.howToRead.map((text, index) => <li key={index}>{text}</li>)}</ul>
        </section>
        <section className="scales-card scales-care" aria-labelledby={`${prefix}-care-${scale.id}`}>
          <span className="scales-section-index" aria-hidden="true">04</span>
          <h3 id={`${prefix}-care-${scale.id}`}>Cuidados na avaliação</h3>
          <ul>{scale.care.map((text, index) => <li key={index}>{text}</li>)}</ul>
        </section>
      </div>

      <section className="scales-card scales-sources" aria-labelledby={`${prefix}-sources-${scale.id}`}>
        <div className="scales-sources-title"><BookOpen size={23} aria-hidden="true"/><h3 id={`${prefix}-sources-${scale.id}`}>Fontes e leitura complementar</h3></div>
        <ul>{scale.references.map(reference => <li key={reference.id}><a {...pdfReaderLink(reference.href)}><span>{reference.label}</span><ArrowUpRight size={18} aria-hidden="true"/>{pdfReaderLink(reference.href).target && <span className="sr-only"> (abre em nova aba)</span>}</a></li>)}</ul>
        {scale.sourcePages.length > 0 && <div className="scales-caderno-links"><span>No caderno do projeto:</span>{scale.sourcePages.map(page => <a key={page} href={`${CADERNO_PDF}#page=${page}`} target="_blank" rel="noopener noreferrer">Página {page}<ArrowUpRight size={16} aria-hidden="true"/><span className="sr-only"> do PDF (abre em outra aba)</span></a>)}</div>}
      </section>
    </>}</div>)}

    <section className="scales-comparison" aria-labelledby={`${prefix}-compare`}>
      <div className="scales-comparison-heading"><span className="scales-category">PARA COMPARAR</span><h2 id={`${prefix}-compare`}>O que muda entre as escalas?</h2></div>
      <div className="scales-comparison-grid">{scaleComparison.map(item => <article className="scales-comparison-card" key={item.id}>
        <h3>{item.label}</h3>
        <dl><div><dt>Avalia</dt><dd>{item.assesses}</dd></div><div><dt>Para quem</dt><dd>{item.population}</dd></div><div><dt>Como observar</dt><dd>{item.report}</dd></div></dl>
        <button type="button" onClick={() => openComparisonScale(item.id)} aria-label={`Consultar ${item.label}`}>Consultar {item.label}<ArrowRight size={17} aria-hidden="true"/></button>
      </article>)}</div>
      <p className="scales-study-note">Escolha uma aba para conhecer a finalidade, a leitura e os cuidados de cada instrumento.</p>
    </section>
    <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">Escala selecionada: {selected.label}.</span>
  </div>;
}
