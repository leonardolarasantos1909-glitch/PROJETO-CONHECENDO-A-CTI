import { ArrowRight, ArrowUpRight, BookOpen, Download, FileText } from 'lucide-react';
import { apostilas } from './apostilas';

export function ApostilaMaterials() {
  return <section className="apostila-materials pdf-materials" aria-labelledby="apostila-heading">
    <div className="eyebrow">APROFUNDE SEUS ESTUDOS</div>
    <h2 id="apostila-heading">Apostilas de estudo</h2>
    <p className="pdf-intro">Escolha um assunto para abrir ou baixar. As apostilas seguem as cores do aplicativo e preservam os textos, as ilustrações, as referências e os créditos dos documentos enviados pelo autor.</p>
    <div className="pdf-grid">{apostilas.map(material => <article className="pdf-card apostila-card" key={material.id} id={`material-${material.id}`} tabIndex={-1} aria-label={material.title}>
      <div className="pdf-card-top"><span className="pdf-icon"><BookOpen size={25}/></span><span className="pdf-tag">APOSTILA DE ESTUDO</span></div>
      <h3>{material.title}</h3>
      <p>{material.description}</p>
      <div className="pdf-meta"><FileText size={14}/> PDF · {material.pages} páginas · {(material.bytes / 1024 / 1024).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} MB</div>
      <div className="pdf-actions">
        <a className="button" href={`#pdf/${material.id}`} aria-label={`Abrir apostila: ${material.title}`}><BookOpen size={16}/> Abrir apostila <ArrowRight size={15}/></a>
        <a className="pdf-open" href={material.href} download={material.downloadFilename} aria-label={`Baixar apostila: ${material.title}`}><Download size={15}/> Baixar PDF</a>
      </div>
    </article>)}</div>
    <p className="apostila-offline">Para ler sem internet, use “Baixar PDF” e abra o arquivo salvo em Arquivos no iPhone ou na pasta Downloads no Android.</p>
  </section>;
}

export function RelatedApostilas({ moduleId }: { moduleId: string }) {
  const related = apostilas.filter(material => material.moduleIds.includes(moduleId));
  if (!related.length) return null;
  return <section className="apostila-related" aria-label="Apostilas relacionadas ao módulo">
    <h2>Aprofunde com as apostilas</h2>
    <ul>{related.map(material => <li key={material.id}><a href={`#pdf/${material.id}`}><FileText size={20}/><span><strong>{material.title}</strong><span>PDF · {material.pages} páginas</span></span><ArrowUpRight size={17}/><span className="sr-only">Ler no aplicativo</span></a></li>)}</ul>
    <a className="apostila-library-link" href="#biblioteca">Ver todas as apostilas na Biblioteca <ArrowUpRight size={14}/></a>
  </section>;
}
