import { ArrowRight, ArrowUpRight, BookOpen, Download, FileText, Printer } from 'lucide-react';
import { learningMaterials } from './materials';
import { PdfInstructions, PdfOpenHelp } from './MobileInstructions';

export function PdfMaterials() {
  return <section className="pdf-materials" aria-labelledby="pdf-materials-heading">
    <div className="eyebrow">MATERIAIS DO PROJETO</div>
    <h2 id="pdf-materials-heading">Seu caderno, do seu jeito.</h2>
    <p className="pdf-intro">Leia a versão digital ou baixe o caderno de bolso para imprimir, se preferir. Os textos, as referências e os links dos cadernos do autor foram preservados.</p>
    <PdfOpenHelp/>
    <div className="pdf-grid">{learningMaterials.map(material => {
      const printable = material.use === 'print';
      const Icon = printable ? Printer : BookOpen;
      return <article className="pdf-card" key={material.id} id={`material-${material.id}`} tabIndex={-1} aria-label={material.title}>
        <div className="pdf-card-top"><span className={`pdf-icon ${printable ? 'print' : ''}`}><Icon size={25}/></span><span className="pdf-tag">{printable ? 'IMPRESSÃO OPCIONAL' : 'LEITURA DIGITAL'}</span></div>
        <h3>{material.title}</h3>
        <p>{material.description}</p>
        <div className="pdf-meta"><FileText size={14}/> PDF · {material.pages} {printable ? 'folhas A4' : 'páginas'} · {(material.bytes / 1024 / 1024).toLocaleString('pt-BR', { maximumFractionDigits: 2 })} MB</div>
        <div className="pdf-actions">{printable ? <>
          <a className="button" href={material.href} download={material.originalFilename}><Download size={16}/> Baixar para imprimir</a>
          <a className="pdf-open" href={material.href} target="_blank" rel="noopener noreferrer" aria-label="Abrir PDF de impressão em outra aba ou no visualizador do aparelho">Abrir PDF <ArrowUpRight size={15}/></a>
        </> : <>
          <a className="button" href="#caderno" aria-label="Ler caderno digital como livro"><BookOpen size={16}/> Ler caderno</a>
          <a className="pdf-open" href={material.href} target="_blank" rel="noopener noreferrer" aria-label="Abrir PDF do caderno em outra aba ou no visualizador do aparelho">Abrir PDF <ArrowUpRight size={15}/></a>
          <a className="pdf-open" href={material.href} download={material.originalFilename}><Download size={15}/> Baixar PDF</a>
        </>}</div>
        {printable && <details className="pdf-instructions"><summary>Como imprimir o caderno de bolso</summary><ol><li>Selecione papel <strong>A4</strong>, <strong>tamanho real / 100%</strong> e frente única.</li><li>Imprima <strong>uma página do PDF por folha</strong>. O arquivo já traz quatro páginas de bolso em cada A4.</li><li>Recorte e organize pela numeração de 01 a 96.</li></ol></details>}
      </article>;
    })}</div>
    <PdfInstructions/>
  </section>;
}

export function MaterialsShortcut() {
  return <a className="materials-shortcut" href="#biblioteca"><span className="pdf-icon"><BookOpen size={23}/></span><span><strong>Cadernos e apostilas de estudo</strong><span>Leia, baixe as apostilas ou imprima o caderno de bolso.</span></span><ArrowRight size={20}/></a>;
}
