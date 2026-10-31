import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, ClipboardList, Copy, Pill, Search, ShieldCheck, TriangleAlert, X } from 'lucide-react';
import { FavoriteButton } from './Favorites';
import { clinicalHref, getClinicalCondition } from './clinical-dictionary';
import { getMedicationCases, medicationCaseHref } from './medication-cases';
import { getMedication, medicationCategories, medicationFavoriteId, medicationHref, medications, searchMedications } from './medication-guide';
import type { Medication, MedicationCategory } from './medication-types';
import './medication-guide.css';

type MedicationGuideProps = { initialMedication?: string; initialQuery?: string };
const educationalNote = 'Conteúdo educativo para profissionais e estudantes de enfermagem. Não substitui avaliação clínica, prescrição, bula da apresentação, protocolos institucionais ou supervisão do enfermeiro.';
const highAlertNote = 'A classificação de medicamento potencialmente perigoso (MPP) pode depender da apresentação, via e contexto. A sinalização deste guia está pendente de conferência e não se aplica automaticamente a todas as formulações. A ausência de sinalização não significa ausência de risco.';
const displayDate = (date: string) => /^\d{4}-\d{2}-\d{2}$/.test(date) ? date.split('-').reverse().join('/') : date;

function BulletList({ items }: { items: string[] }) {
  return <ul className="medication-bullets">{items.map((item, index) => <li key={`${index}-${item}`}>{item}</li>)}</ul>;
}

function Fold({ title, children }: { title: string; children: ReactNode }) {
  return <details className="medication-fold"><summary>{title}</summary><div className="medication-fold-content">{children}</div></details>;
}

function MedicationCard({ medication }: { medication: Medication }) {
  return <article className="medication-card">
    <a className="medication-card-link" href={medicationHref(medication.id)}>
      <span className="medication-category-label">{medication.category}</span>
      <h3>{medication.genericName}</h3>
      <span className="medication-card-class">{medication.pharmacologicalClass}</span>
      {medication.highAlert.flagged && <span className="medication-high-alert-badge"><TriangleAlert size={16} aria-hidden="true"/>MPP no contexto descrito · conferência pendente</span>}
      <p>{medication.summary}</p>
      <span className="medication-open">Consultar ficha <ArrowRight size={17} aria-hidden="true"/></span>
    </a>
    <FavoriteButton id={medicationFavoriteId(medication.id)}/>
  </article>;
}

function MedicationDetail({ medication }: { medication: Medication }) {
  const prefix = useId();
  const heading = useRef<HTMLHeadingElement>(null);
  const copyField = useRef<HTMLInputElement>(null);
  const [copyStatus, setCopyStatus] = useState('');
  const [manualLink, setManualLink] = useState('');
  const cases = getMedicationCases(medication.id);
  const conditions = medication.relatedConditionIds.flatMap(id => {
    const condition = getClinicalCondition(id);
    return condition ? [condition] : [];
  });

  useEffect(() => {
    setCopyStatus('');
    setManualLink('');
    heading.current?.focus({ preventScroll: true });
  }, [medication.id]);
  useEffect(() => {
    if (manualLink) { copyField.current?.focus(); copyField.current?.select(); }
  }, [manualLink]);

  async function copyLink() {
    const link = `${window.location.href.split('#')[0]}${medicationHref(medication.id)}`;
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(link);
      setManualLink('');
      setCopyStatus('Link da ficha copiado.');
    } catch {
      setManualLink(link);
      setCopyStatus('Selecione e copie o link abaixo para compartilhar esta ficha.');
    }
  }

  return <article className="medication-entry" aria-labelledby={`${prefix}-title`}>
    <a className="medication-back" href="#medicamentos"><ArrowLeft size={17} aria-hidden="true"/>Todos os medicamentos</a>
    <header className="medication-entry-header">
      <span className="medication-category-label">{medication.category}</span>
      <h2 ref={heading} tabIndex={-1} id={`${prefix}-title`}>{medication.genericName}</h2>
      <p className="medication-entry-class">{medication.pharmacologicalClass}</p>
      <div className="medication-entry-actions"><FavoriteButton id={medicationFavoriteId(medication.id)}/><button className="medication-secondary" type="button" onClick={copyLink}><Copy size={17} aria-hidden="true"/>Copiar link da ficha</button></div>
      <p className="medication-copy-status" role="status">{copyStatus}</p>
      {manualLink && <label className="medication-manual-link">Link para copiar<input ref={copyField} type="text" readOnly value={manualLink} onFocus={event => event.currentTarget.select()}/></label>}
    </header>
    <aside className="medication-validation" aria-label="Situação da revisão clínica"><ShieldCheck size={22} aria-hidden="true"/><div><strong>Pendente de validação clínica</strong><p>Última revisão clínica: {medication.reviewedAt ? displayDate(medication.reviewedAt) : 'não realizada'}. Versão editorial: {medication.version}. A ficha não representa orientação institucional aprovada.</p></div></aside>
    <section className="medication-summary" aria-labelledby={`${prefix}-summary`}><span className="medication-section-kicker">ENTENDA EM 30 SEGUNDOS</span><h3 id={`${prefix}-summary`}>O essencial para começar</h3><p>{medication.summary}</p></section>
    <aside className={`medication-risk-notice${medication.highAlert.flagged ? ' is-flagged' : ''}`} aria-labelledby={`${prefix}-risk`}>
      <h3 id={`${prefix}-risk`}><TriangleAlert size={22} aria-hidden="true"/>{medication.highAlert.flagged ? 'Medicamento potencialmente perigoso no contexto descrito' : 'Classificação de risco exige conferência'}</h3>
      <p><strong>Escopo:</strong> {medication.highAlert.scope}</p><p>{medication.highAlert.rationale}</p><p><strong>Conferência da classificação: pendente.</strong> {highAlertNote}</p>
      {medication.highAlert.referenceId && <p className="medication-scope-note">Fonte indicada para conferir esta classificação: {medication.references.find(reference => reference.id === medication.highAlert.referenceId)?.title ?? medication.highAlert.referenceId}. Veja as referências e suas limitações ao final da ficha.</p>}
    </aside>
    <div className="medication-care-grid">
      <section className="medication-care" aria-labelledby={`${prefix}-care`}><h3 id={`${prefix}-care`}><ClipboardList size={22} aria-hidden="true"/>Cuidados de enfermagem</h3><BulletList items={medication.nursingCare}/><p className="medication-scope-note">Atue conforme sua habilitação, a prescrição, a supervisão do enfermeiro e os protocolos aplicáveis. Esta ficha não autoriza iniciar, suspender ou ajustar tratamentos.</p></section>
      <section className="medication-alerts" aria-labelledby={`${prefix}-alerts`}><h3 id={`${prefix}-alerts`}><TriangleAlert size={22} aria-hidden="true"/>Sinais de alerta e quando comunicar</h3><BulletList items={medication.warningSigns}/><p className="medication-scope-note">Diante de deterioração ou risco imediato, comunique o enfermeiro e acione o fluxo de emergência da instituição. Não espere concluir a leitura.</p></section>
    </div>
    <section className="medication-full-entry" aria-labelledby={`${prefix}-full`}><h3 id={`${prefix}-full`}>Aprofunde seu estudo</h3>
      <Fold title="Identificação, princípio ativo e nomes comerciais"><dl className="medication-identification">
        <div><dt>Nome genérico</dt><dd>{medication.genericName}</dd></div><div><dt>Princípio ativo</dt><dd>{medication.activeIngredient}</dd></div><div><dt>Classe farmacológica</dt><dd>{medication.pharmacologicalClass}</dd></div><div><dt>Categoria</dt><dd>{medication.category}</dd></div><div><dt>Outros termos cadastrados</dt><dd>{medication.aliases.length ? medication.aliases.join(' · ') : 'Nenhum outro termo cadastrado.'}</dd></div>
        <div><dt>Nomes comerciais verificados</dt><dd>{medication.commercialNames.length ? <ul className="medication-bullets">{medication.commercialNames.map(commercial => <li key={`${commercial.name}-${commercial.presentation}`}><strong>{commercial.name}</strong> — {commercial.presentation}. Fonte: {medication.references.find(reference => reference.id === commercial.referenceId)?.title ?? commercial.referenceId}. Conferência: {displayDate(commercial.verifiedAt)}.</li>)}</ul> : 'Nenhum nome comercial verificado disponível.'}<p>{medication.commercialNamesNote}</p><p>Nomes comerciais ajudam a identificar produtos. A apresentação, o fabricante, o registro e a bula precisam corresponder ao produto prescrito.</p></dd></div>
      </dl></Fold>
      <Fold title="Finalidade e mecanismo de ação"><h4>Para que é utilizado?</h4><p>{medication.purpose}</p><h4>Como age no organismo?</h4><p>{medication.mechanism}</p></Fold>
      <Fold title="Usos no contexto da terapia intensiva"><p className="medication-scope-note">Associações educativas. A presença de uma condição clínica não determina indicação automática deste medicamento.</p><BulletList items={medication.intensiveCareUses}/></Fold>
      <Fold title="Apresentações e vias — contexto educativo"><p>{medication.formulationsNote}</p><p className="medication-scope-note"><strong>Via estudada não equivale à via prescrita.</strong> Confirme a via autorizada na bula da apresentação e a prescrição do paciente. As apresentações não são intercambiáveis por iniciativa própria.</p><dl className="medication-identification">{medication.routes.map((route, index) => <div key={`${route.name}-${index}`}><dt>{route.name}</dt><dd>{route.context}</dd></div>)}</dl></Fold>
      <Fold title="Efeitos adversos"><BulletList items={medication.adverseEffects}/></Fold>
      <Fold title="Contraindicações, precauções e interações"><p className="medication-scope-note">Resumo para estudo. Consulte a bula específica e comunique dúvidas ao enfermeiro e à equipe responsável antes de administrar.</p><BulletList items={medication.contraindicationsPrecautions}/></Fold>
      <Fold title="Monitorização e registros"><BulletList items={medication.monitoring}/></Fold>
    </section>
    <section className="medication-related" aria-labelledby={`${prefix}-conditions`}><h3 id={`${prefix}-conditions`}>Conecte com o Dicionário Clínico</h3><p>Condições relacionadas para estudo. Esta associação não confirma diagnóstico nem constitui prescrição ou recomendação de tratamento.</p>{conditions.length ? <ul className="medication-related-list">{conditions.map(condition => <li key={condition.id}><a href={clinicalHref(condition.id)}>{condition.name}<ArrowRight size={17} aria-hidden="true"/></a></li>)}</ul> : <p>Não há ficha correspondente cadastrada no Dicionário Clínico para os usos descritos.</p>}</section>
    {cases.length > 0 && <section className="medication-related" aria-labelledby={`${prefix}-cases`}><h3 id={`${prefix}-cases`}>Pratique com casos fictícios</h3><p>Situações inteiramente fictícias para refletir sobre observação, segurança e comunicação com a equipe. Não recebem dados de pacientes nem certificam competência clínica.</p><ul className="medication-related-list">{cases.map(studyCase => <li key={studyCase.id}><a href={medicationCaseHref(studyCase.id)}>{studyCase.title}<ArrowRight size={17} aria-hidden="true"/></a></li>)}</ul></section>}
    <section className="medication-references" aria-labelledby={`${prefix}-references`}><h3 id={`${prefix}-references`}><BookOpen size={22} aria-hidden="true"/>Referências e rastreabilidade</h3><p>Uma referência cadastrada não equivale a revisão clínica ou aprovação institucional. Títulos, versões e vigência das fontes pendentes ainda precisam ser conferidos.</p><ol>{medication.references.map((reference, index) => <li key={`${reference.id}-${index}`}>
      <a href={reference.url} target="_blank" rel="noopener noreferrer">{reference.title}<span className="sr-only"> — abre em outra aba</span></a><p>{reference.organization}{reference.publicationDate ? ` · Publicação/versão informada: ${displayDate(reference.publicationDate)}` : ' · Data/versão não conferida'}.</p>
      {reference.scope === 'lookup_portal' && <p className="medication-reference-portal"><strong>Portal de pesquisa, não bula específica do produto.</strong> Este endereço permite buscar uma bula; não comprova a apresentação, as vias ou as afirmações desta ficha.</p>}
      <p className={reference.verification === 'pending' ? 'medication-reference-pending' : 'medication-reference-verified'}><strong>{reference.verification === 'pending' ? 'Conferência da fonte e de sua vigência pendente.' : 'Acesso à fonte conferido.'}</strong> {reference.note}</p>
      {reference.accessedAt && <p>Consulta registrada: {displayDate(reference.accessedAt)}.</p>}
    </li>)}</ol></section>
    <p className="medication-education-note">{educationalNote}</p>
    <a className="medication-back" href="#medicamentos"><ArrowLeft size={17} aria-hidden="true"/>Voltar ao Guia de Medicamentos</a>
  </article>;
}

export function MedicationGuide({ initialMedication, initialQuery }: MedicationGuideProps) {
  const prefix = useId();
  const [query, setQuery] = useState(initialQuery ?? '');
  const [category, setCategory] = useState<MedicationCategory | ''>('');
  const [highAlertOnly, setHighAlertOnly] = useState(false);
  const searchField = useRef<HTMLInputElement>(null);
  useEffect(() => { setQuery(initialQuery ?? ''); setCategory(''); setHighAlertOnly(false); }, [initialQuery, initialMedication]);
  const selected = initialMedication ? getMedication(initialMedication) : undefined;
  if (initialMedication && !selected) return <section className="medication-guide medication-unavailable" aria-labelledby={`${prefix}-missing`}><h2 id={`${prefix}-missing`}>Ficha não encontrada</h2><p>Este medicamento não está disponível neste endereço. Consulte os nomes na lista do guia.</p><a className="medication-primary" href="#medicamentos"><ArrowLeft size={18} aria-hidden="true"/>Voltar à pesquisa</a></section>;
  if (selected) return <div className="medication-guide"><MedicationDetail key={selected.id} medication={selected}/></div>;
  const filtered = searchMedications(query, category, highAlertOnly);
  return <section className="medication-guide medication-index" aria-labelledby={`${prefix}-intro`}>
    <div className="medication-index-intro"><Pill size={28} aria-hidden="true"/><div><h2 id={`${prefix}-intro`}>Medicamentos no contexto do CTI</h2><p>Relacione a finalidade dos medicamentos à observação, aos cuidados prescritos, à monitorização e à comunicação com o enfermeiro.</p></div><span className="medication-total">{medications.length} fichas educativas</span></div>
    <div className="medication-module-favorite"><FavoriteButton id="module.medicamentos"/></div>
    <p className="medication-education-note">{educationalNote}</p>
    <a className="medication-secondary" href="#medicamentos/casos">Praticar com casos fictícios<ArrowRight size={18} aria-hidden="true"/></a>
    <div className="medication-validation"><ShieldCheck size={21} aria-hidden="true"/><p><strong>Fichas pendentes de validação clínica.</strong> A revisão por profissional habilitado ainda não foi realizada. Fontes, apresentações e classificação de risco precisam de conferência.</p></div>
    <section className="medication-risk-notice is-flagged" aria-labelledby={`${prefix}-high-alert`}><h2 id={`${prefix}-high-alert`}>Medicamentos potencialmente perigosos</h2><p>{highAlertNote}</p><p>Abrir uma ficha permite conferir o contexto sinalizado, os cuidados e os sinais de alerta. A classificação e as fontes continuam pendentes de validação.</p><button className="medication-secondary" type="button" onClick={() => { setHighAlertOnly(true); searchField.current?.focus(); searchField.current?.scrollIntoView({ block: 'center' }); }}>Ver medicamentos sinalizados<ArrowRight size={18} aria-hidden="true"/></button></section>
    <form className="medication-search" role="search" aria-label="Pesquisa do Guia de Medicamentos" onSubmit={event => event.preventDefault()}>
      <label htmlFor={`${prefix}-query`}>Pesquisar medicamentos</label>
      <div className="medication-search-controls"><div className="medication-search-field"><Search size={21} aria-hidden="true"/><input ref={searchField} id={`${prefix}-query`} type="search" autoComplete="off" placeholder="Nome genérico, classe ou princípio ativo" value={query} onChange={event => setQuery(event.target.value)} aria-describedby={`${prefix}-search-help`}/>{query && <button type="button" className="medication-clear" aria-label="Limpar pesquisa de medicamentos" onClick={() => { setQuery(''); searchField.current?.focus(); }}><X size={19} aria-hidden="true"/></button>}</div><label className="medication-category-filter" htmlFor={`${prefix}-category`}>Categoria<select id={`${prefix}-category`} value={category} onChange={event => setCategory(event.target.value as MedicationCategory | '')}><option value="">Todas as categorias</option>{medicationCategories.map(value => <option key={value} value={value}>{value}</option>)}</select></label></div>
      <p className="medication-search-help" id={`${prefix}-search-help`}>Busca local por nome genérico, classe, princípio ativo e nomes comerciais verificados. Nenhum nome comercial é publicado sem conferência.</p>
      <label className="medication-high-alert-filter"><input type="checkbox" checked={highAlertOnly} onChange={event => setHighAlertOnly(event.target.checked)} aria-describedby={`${prefix}-risk-help`}/><span>Mostrar apenas medicamentos sinalizados como potencialmente perigosos (MPP)</span></label>
      <p className="medication-search-help" id={`${prefix}-risk-help`}>{highAlertNote}</p>
      <p role="status" className="medication-result-count">{filtered.length} {filtered.length === 1 ? 'ficha encontrada' : 'fichas encontradas'}{category ? ` em ${category}` : ''}{highAlertOnly ? ' com sinalização de MPP no contexto descrito' : ''}.</p>
    </form>
    <section aria-labelledby={`${prefix}-all`}><div className="medication-list-heading"><h2 id={`${prefix}-all`}>{query.trim() || category || highAlertOnly ? 'Resultados da pesquisa' : 'Todos os medicamentos em ordem alfabética'}</h2><p>Abra uma ficha para consultar o resumo, os cuidados, os sinais de alerta e as informações completas.</p></div>
      {filtered.length ? <div className="medication-card-grid">{filtered.map(medication => <MedicationCard key={medication.id} medication={medication}/>)}</div> : <div className="medication-empty"><Search size={28} aria-hidden="true"/><h3>Nenhuma ficha encontrada</h3><p>Tente o nome genérico, uma classe ou o princípio ativo. A pesquisa aceita termos com ou sem acento.</p><button type="button" className="medication-secondary" onClick={() => { setQuery(''); setCategory(''); setHighAlertOnly(false); searchField.current?.focus(); }}>Limpar pesquisa e filtros</button></div>}
    </section>
  </section>;
}

export default MedicationGuide;
