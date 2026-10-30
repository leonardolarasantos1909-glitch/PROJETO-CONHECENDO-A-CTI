import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Check, ClipboardList, Copy, Search, ShieldCheck, TriangleAlert, X } from 'lucide-react';
import { FavoriteButton } from './Favorites';
import {
  clinicalCategories, clinicalConditions, clinicalFavoriteId, clinicalHref, clinicalResourceLinks,
  getClinicalCondition, relatedClinicalConditions, searchClinicalConditions,
} from './clinical-dictionary';
import type { ClinicalCategory, ClinicalCondition } from './clinical-types';
import './clinical-dictionary.css';

type ClinicalDictionaryProps = { initialCondition?: string; initialQuery?: string };
const educationalNote = 'Conteúdo educativo destinado à formação e consulta de profissionais e estudantes de enfermagem. Não substitui avaliação clínica, prescrição, protocolos institucionais ou supervisão do enfermeiro responsável.';
const priorityIds = ['iam', 'insuficiencia-respiratoria-aguda', 'sepse', 'lesao-renal-aguda'];
const displayDate = (date: string) => /^\d{4}-\d{2}-\d{2}$/.test(date) ? date.split('-').reverse().join('/') : date;

function BulletList({ items }: { items: string[] }) {
  return <ul className="clinical-bullets">{items.map((item, index) => <li key={`${index}-${item}`}>{item}</li>)}</ul>;
}

function Fold({ title, children, open = false }: { title: string; children: ReactNode; open?: boolean }) {
  return <details className="clinical-fold" open={open || undefined}><summary>{title}</summary><div className="clinical-fold-content">{children}</div></details>;
}

function ConditionCard({ condition }: { condition: ClinicalCondition }) {
  return <article className="clinical-condition-card">
    <a href={clinicalHref(condition.id)} className="clinical-condition-link">
      <span className="clinical-category-label">{condition.category}</span>
      <h3>{condition.name}</h3>
      {condition.acronym && <span className="clinical-acronym">{condition.acronym}</span>}
      <p>{condition.quickSummary}</p>
      <span className="clinical-open">Consultar ficha <ArrowRight size={17} aria-hidden="true"/></span>
    </a>
    <FavoriteButton id={clinicalFavoriteId(condition.id)}/>
  </article>;
}

function ClinicalConditionDetail({ condition }: { condition: ClinicalCondition }) {
  const prefix = useId();
  const heading = useRef<HTMLHeadingElement>(null);
  const copyField = useRef<HTMLInputElement>(null);
  const [copyStatus, setCopyStatus] = useState('');
  const [manualLink, setManualLink] = useState('');
  const links = clinicalResourceLinks(condition);
  const related = relatedClinicalConditions(condition);

  useEffect(() => {
    setCopyStatus('');
    setManualLink('');
    heading.current?.focus({ preventScroll: true });
  }, [condition.id]);
  useEffect(() => {
    if (manualLink) { copyField.current?.focus(); copyField.current?.select(); }
  }, [manualLink]);

  async function copyLink() {
    const link = `${window.location.href.split('#')[0]}${clinicalHref(condition.id)}`;
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

  return <article className="clinical-entry" aria-labelledby={`${prefix}-title`}>
    <a className="clinical-back" href="#dicionario-clinico"><ArrowLeft size={17} aria-hidden="true"/>Todas as patologias e condições</a>
    <header className="clinical-entry-header">
      <span className="clinical-category-label">{condition.category}</span>
      <h2 ref={heading} tabIndex={-1} id={`${prefix}-title`}>{condition.name}</h2>
      {condition.acronym && <p className="clinical-entry-acronym">{condition.acronym}</p>}
      <div className="clinical-entry-actions"><FavoriteButton id={clinicalFavoriteId(condition.id)}/><button className="clinical-secondary" type="button" onClick={copyLink}><Copy size={17} aria-hidden="true"/>Copiar link da ficha</button></div>
      <p role="status" className="clinical-copy-status">{copyStatus}</p>
      {manualLink && <label className="clinical-manual-link">Link para copiar<input ref={copyField} type="text" readOnly value={manualLink} onFocus={event => event.currentTarget.select()}/></label>}
    </header>
    <aside className="clinical-validation" aria-label="Situação da revisão clínica"><ShieldCheck size={22} aria-hidden="true"/><div>
      <strong>{condition.clinicalReviewStatus === 'approved' ? 'Revisão clínica registrada' : condition.clinicalReviewStatus === 'needs_update' ? 'Conteúdo precisa de atualização e revisão clínica' : 'Pendente de validação clínica'}</strong>
      <p>Última revisão clínica: {condition.reviewedAt ? displayDate(condition.reviewedAt) : 'não realizada'}. Versão editorial: {condition.version}.</p>
    </div></aside>
    <section className="clinical-summary" aria-labelledby={`${prefix}-summary`}><span className="clinical-section-kicker">ENTENDA EM 30 SEGUNDOS</span><h3 id={`${prefix}-summary`}>O essencial para começar</h3><p>{condition.quickSummary}</p></section>
    <div className="clinical-care-grid">
      <section className="clinical-care" aria-labelledby={`${prefix}-care`}><h3 id={`${prefix}-care`}><ClipboardList size={22} aria-hidden="true"/>Cuidados do técnico de enfermagem</h3><BulletList items={condition.nursingTechnicianCare}/><p className="clinical-scope-note">Atue conforme sua habilitação, a prescrição, a supervisão do enfermeiro e os protocolos aplicáveis. A ficha não autoriza iniciar ou ajustar tratamentos.</p></section>
      <section className="clinical-alerts" aria-labelledby={`${prefix}-alerts`}><h3 id={`${prefix}-alerts`}><TriangleAlert size={22} aria-hidden="true"/>Sinais de alerta</h3><BulletList items={condition.warningSigns}/><p className="clinical-scope-note">Diante de deterioração ou risco imediato, comunique o enfermeiro e acione o fluxo de emergência aplicável. Não espere concluir a leitura.</p></section>
    </div>
    <details className="clinical-quick-review"><summary><Check size={20} aria-hidden="true"/>Revisão rápida: o que observar e comunicar</summary><dl>
      <div><dt>O que é?</dt><dd>{condition.definition}</dd></div>
      <div><dt>O que observar?</dt><dd><BulletList items={condition.manifestations}/></dd></div>
      <div><dt>Quando comunicar?</dt><dd><BulletList items={condition.warningSigns}/></dd></div>
      <div><dt>Quais cuidados são relevantes?</dt><dd><BulletList items={condition.nursingTechnicianCare}/></dd></div>
    </dl></details>
    <section className="clinical-full-entry" aria-labelledby={`${prefix}-full`}><h3 id={`${prefix}-full`}>Aprofunde seu estudo</h3>
      <Fold title="Identificação e termos de pesquisa"><dl className="clinical-identification"><div><dt>Nome</dt><dd>{condition.name}</dd></div><div><dt>Siglas</dt><dd>{condition.acronym || 'Sem sigla principal cadastrada.'}</dd></div><div><dt>Sinônimos e termos relacionados</dt><dd>{condition.synonyms.length ? condition.synonyms.join(' · ') : 'Consulte o nome completo e as palavras-chave.'}</dd></div><div><dt>Categoria</dt><dd>{condition.category}</dd></div><div><dt>Palavras-chave</dt><dd>{condition.keywords.join(' · ')}</dd></div></dl></Fold>
      <Fold title="O que é?"><p>{condition.definition}</p></Fold>
      <Fold title="O que acontece no organismo?"><p>{condition.pathophysiology}</p></Fold>
      <Fold title="Causas e fatores associados"><BulletList items={condition.causes}/></Fold>
      <Fold title="Sinais e sintomas"><BulletList items={condition.manifestations}/></Fold>
      <Fold title="Como é diagnosticada?"><p className="clinical-scope-note">A avaliação diagnóstica compete aos profissionais responsáveis. Um achado isolado não confirma esta condição.</p><BulletList items={condition.diagnosis}/></Fold>
      <Fold title="Tratamento — visão geral"><p className="clinical-scope-note">Conheça o contexto do cuidado. Este resumo não é uma prescrição e não orienta doses, início, suspensão ou ajuste de tratamento.</p><BulletList items={condition.treatmentOverview}/></Fold>
      <Fold title="Exemplo clínico educativo"><span className="clinical-case-badge">CENÁRIO INTEIRAMENTE FICTÍCIO</span><p>{condition.clinicalCase.scenario}</p><h4>Pergunta para reflexão</h4><p>{condition.clinicalCase.question}</p><details className="clinical-case-answer"><summary>Ver resposta comentada</summary><p>{condition.clinicalCase.answer}</p></details></Fold>
    </section>
    <section className="clinical-linked-content" aria-labelledby={`${prefix}-links`}><h3 id={`${prefix}-links`}>Conecte com a prática de enfermagem</h3><p>Equipamentos, dispositivos, escalas e materiais já disponíveis no aplicativo. A escolha de instrumentos depende da condição e da capacidade de comunicação da pessoa.</p>
      {links.length ? <ul className="clinical-resource-list">{links.map(link => <li key={`${link.href}-${link.label}`}><a href={link.href}><span><small>{link.kind}</small><strong>{link.label}</strong></span><ArrowRight size={18} aria-hidden="true"/></a></li>)}</ul> : <p>Os conteúdos relacionados desta ficha ainda precisam ser vinculados.</p>}
    </section>
    <section className="clinical-related-conditions" aria-labelledby={`${prefix}-related`}><h3 id={`${prefix}-related`}>Patologias e condições relacionadas</h3><p>Relações para estudo: as condições podem coexistir, compartilhar manifestações ou ter vínculos fisiopatológicos. Uma não confirma a presença da outra.</p><ul className="clinical-related-list">{related.map(item => <li key={item.id}><a href={clinicalHref(item.id)}>{item.name}<ArrowRight size={17} aria-hidden="true"/></a></li>)}</ul></section>
    <section className="clinical-references" aria-labelledby={`${prefix}-references`}><h3 id={`${prefix}-references`}><BookOpen size={22} aria-hidden="true"/>Referências e rastreabilidade</h3><p>Fontes de consulta vinculadas a esta ficha. Conferir uma referência não equivale a revisão clínica, aprovação institucional ou garantia de vigência de todas as recomendações.</p><ul>{condition.references.map((reference, index) => <li key={`${reference.url}-${index}`}>
      <a href={reference.url} target="_blank" rel="noopener noreferrer">{reference.title}<span className="sr-only"> — abre em outra aba</span></a>
      <p>{reference.organization}{reference.publicationDate ? ` · Publicação/versão: ${displayDate(reference.publicationDate)}` : ''}.</p>
      <p className={reference.verification === 'pending' ? 'clinical-reference-pending' : 'clinical-reference-verified'}><strong>{reference.verification === 'pending' ? 'Conferência da fonte pendente.' : 'Acesso à fonte conferido.'}</strong> {reference.note}</p>
      {reference.accessedAt && <p>Consulta registrada: {displayDate(reference.accessedAt)}.</p>}
    </li>)}</ul></section>
    <p className="clinical-education-note">{educationalNote} Esta ficha não representa orientação institucional oficialmente aprovada.</p>
    <a className="clinical-back" href="#dicionario-clinico"><ArrowLeft size={17} aria-hidden="true"/>Voltar ao Dicionário Clínico</a>
  </article>;
}

export default function ClinicalDictionary({ initialCondition, initialQuery }: ClinicalDictionaryProps) {
  const prefix = useId();
  const [query, setQuery] = useState(initialQuery ?? '');
  const [category, setCategory] = useState<ClinicalCategory | ''>('');
  const searchField = useRef<HTMLInputElement>(null);
  useEffect(() => { setQuery(initialQuery ?? ''); setCategory(''); }, [initialQuery, initialCondition]);
  const selected = initialCondition ? getClinicalCondition(initialCondition) : undefined;
  if (initialCondition && !selected) return <section className="clinical-dictionary clinical-unavailable" aria-labelledby={`${prefix}-missing`}><h2 id={`${prefix}-missing`}>Ficha não encontrada</h2><p>Esta condição não está disponível neste endereço. Consulte os nomes na lista do dicionário.</p><a className="clinical-primary" href="#dicionario-clinico"><ArrowLeft size={18} aria-hidden="true"/>Voltar à pesquisa</a></section>;
  if (selected) return <div className="clinical-dictionary"><ClinicalConditionDetail key={selected.id} condition={selected}/></div>;
  const filtered = searchClinicalConditions(query, category);
  const showPriority = !query.trim() && !category;
  const priority = priorityIds.flatMap(id => { const condition = getClinicalCondition(id); return condition ? [condition] : []; });
  return <section className="clinical-dictionary clinical-index" aria-labelledby={`${prefix}-intro`}>
    <div className="clinical-index-intro"><BookOpen size={28} aria-hidden="true"/><div><h2 id={`${prefix}-intro`}>Patologias e condições críticas</h2><p>Entenda as condições clínicas e conecte esse aprendizado à observação, aos cuidados prescritos, aos registros e à comunicação com o enfermeiro.</p></div><span className="clinical-total">{clinicalConditions.length} fichas educativas</span></div>
    <div className="clinical-module-favorite"><FavoriteButton id="module.dicionario-clinico"/></div>
    <p className="clinical-education-note">{educationalNote}</p>
    <div className="clinical-validation"><ShieldCheck size={21} aria-hidden="true"/><p><strong>Fichas pendentes de validação clínica.</strong> A revisão por profissional habilitado ainda não foi realizada. O dicionário complementa a ambientação e os demais módulos de enfermagem.</p></div>
    <form className="clinical-search" role="search" aria-label="Pesquisa do Dicionário Clínico" onSubmit={event => event.preventDefault()}>
      <label htmlFor={`${prefix}-query`}>Pesquisar patologias e condições</label>
      <div className="clinical-search-controls"><div className="clinical-search-field"><Search size={21} aria-hidden="true"/><input id={`${prefix}-query`} ref={searchField} type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Nome, sigla ou sinônimo. Ex.: IAM, infarto" autoComplete="off"/>{query && <button type="button" className="clinical-clear" aria-label="Limpar pesquisa do dicionário" onClick={() => { setQuery(''); searchField.current?.focus(); }}><X size={19} aria-hidden="true"/></button>}</div><label className="clinical-category-filter" htmlFor={`${prefix}-category`}>Categoria<select id={`${prefix}-category`} value={category} onChange={event => setCategory(event.target.value as ClinicalCategory | '')}><option value="">Todas as categorias</option>{clinicalCategories.map(value => <option key={value} value={value}>{value}</option>)}</select></label></div>
      <p role="status" className="clinical-result-count">{filtered.length} {filtered.length === 1 ? 'ficha encontrada' : 'fichas encontradas'}{category ? ` em ${category}` : ''}.</p>
    </form>
    {showPriority && <section className="clinical-priority" aria-labelledby={`${prefix}-priority`}><div className="clinical-list-heading"><h2 id={`${prefix}-priority`}>Comece por estas condições</h2><p>Sugestões de estudo para relacionar reconhecimento, segurança e comunicação. Não representam um ranking de frequência.</p></div><div className="clinical-card-grid clinical-priority-grid">{priority.map(condition => <ConditionCard key={condition.id} condition={condition}/>)}</div></section>}
    <section className="clinical-all-conditions" aria-labelledby={`${prefix}-all`}><div className="clinical-list-heading"><h2 id={`${prefix}-all`}>{query.trim() || category ? 'Resultados da pesquisa' : 'Todas as fichas em ordem alfabética'}</h2><p>Abra uma ficha para consultar o resumo, os cuidados, os sinais de alerta e as informações completas.</p></div>
      {filtered.length ? <div className="clinical-card-grid">{filtered.map(condition => <ConditionCard key={condition.id} condition={condition}/>)}</div> : <div className="clinical-empty"><Search size={28} aria-hidden="true"/><h3>Nenhuma ficha encontrada</h3><p>Tente o nome completo, uma sigla ou uma palavra mais simples. A pesquisa aceita termos com ou sem acento.</p><button type="button" className="clinical-secondary" onClick={() => { setQuery(''); setCategory(''); searchField.current?.focus(); }}>Limpar pesquisa e categoria</button></div>}
    </section>
  </section>;
}
