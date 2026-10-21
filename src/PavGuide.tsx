import { useId } from 'react';
import { ArrowUpRight, BookOpen } from 'lucide-react';
import { pavMeasures, pavReferences } from './pav';
import './pav-guide.css';

export default function PavGuide() {
  const prefix = useId();

  return <section className="pav-guide" aria-labelledby={`${prefix}-measures`}>
    <div className="pav-guide-heading">
      <h3 id={`${prefix}-measures`}>Medidas de prevenção</h3>
      <p>Confira a aplicação com o preceptor. O conjunto de medidas precisa ser adaptado ao protocolo adotado pelo serviço e à condição de cada pessoa.</p>
    </div>

    <ol className="pav-measures" role="list">{pavMeasures.map((measure, index) => <li key={measure.id}>
      <div className="pav-measure-heading"><span className="pav-measure-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><h4>{measure.title}</h4></div>
      <p>{measure.detail}</p>
      {measure.scope && <p className="pav-measure-scope">{measure.scope}</p>}
    </li>)}</ol>

    <section className="pav-sources" aria-labelledby={`${prefix}-sources`}>
      <h3 id={`${prefix}-sources`}><BookOpen size={21} aria-hidden="true"/>Fontes e referências</h3>
      <ul role="list">{pavReferences.map(reference => <li key={reference.id}>
        <a href={reference.href} target="_blank" rel="noopener noreferrer"><span>{reference.label}</span><ArrowUpRight size={17} aria-hidden="true"/><span className="sr-only"> (abre em nova aba)</span></a>
      </li>)}</ul>
    </section>
  </section>;
}
