import { ArrowRight } from 'lucide-react';
import { FavoriteButton } from './Favorites';
import { newTools } from './new-tools';
import './institutional-tools.css';

export function MoreTools({ route }: { route: string }) {
  return <details className="more-learning-tools"><summary>Mais ferramentas de aprendizagem</summary><nav aria-label="Mais ferramentas">{newTools.map(tool => <a key={tool.id} href={tool.href} aria-current={tool.href === `#${route}` ? 'page' : undefined}>{tool.title}</a>)}</nav></details>;
}

export function AdditionalToolCards() {
  return <section className="additional-learning-tools" aria-labelledby="additional-tools-title"><div className="section-heading"><div><span className="eyebrow">PRATIQUE E EXPLORE</span><h2 id="additional-tools-title">Mais recursos para aprender</h2><p>Explore os materiais e prepare suas dúvidas para conversar com a equipe.</p></div></div><div className="additional-tool-grid">{newTools.filter(tool => tool.id !== 'tool.perfil').map(tool => <article className="additional-tool-card" key={tool.id}><a href={tool.href}><h3>{tool.title}</h3><p>{tool.description}</p><span className="institutional-link">Explorar recurso <ArrowRight size={17} aria-hidden="true"/></span></a><FavoriteButton id={tool.id}/></article>)}</div></section>;
}
