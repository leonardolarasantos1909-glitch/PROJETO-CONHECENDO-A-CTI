import { ArrowRight, ArrowUpRight, Download, HeartHandshake } from 'lucide-react';
import { familyLeafletPdfs } from './family-catalog';
import ContentReview from './ContentReview';

export default function FamilyLibraryMaterials() {
  return <section className="pdf-materials family-library" aria-labelledby="family-library-title">
    <div className="eyebrow">ACOLHER TAMBÉM É CUIDAR</div>
    <h2 id="family-library-title">Folheto para familiares</h2>
    <p className="pdf-intro">Material próprio para entregar à família após validação da enfermeira responsável e da instituição. Os familiares não precisam instalar o aplicativo.</p>
    <div className="pdf-grid">{familyLeafletPdfs.map(material => <article className="pdf-card" key={material.id} id={`material-${material.id}`} tabIndex={-1} aria-label={material.title}>
      <div className="pdf-card-top"><span className="pdf-icon"><HeartHandshake size={25} aria-hidden="true"/></span><span className="pdf-tag">VALIDAÇÃO INSTITUCIONAL PENDENTE</span></div>
      <h3>{material.title}</h3><p>{material.description}</p>
      <div className="pdf-actions"><a className="button" href={material.href} target="_blank" rel="noopener noreferrer" aria-label={`Abrir PDF: ${material.title} (outra aba ou visualizador do aparelho)`}>Abrir PDF <ArrowUpRight size={16} aria-hidden="true"/></a><a className="pdf-open" href={material.href} download={material.filename}><Download size={16} aria-hidden="true"/>Baixar PDF</a></div>
      <a className="institutional-link" href="#acolher-familia/material">Ver prévia e orientações de impressão <ArrowRight size={16} aria-hidden="true"/></a>
      <ContentReview contentId={`pdf.${material.id}`} compact/>
    </article>)}</div>
  </section>;
}
