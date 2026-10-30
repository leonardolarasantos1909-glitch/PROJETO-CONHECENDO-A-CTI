import { modules } from './content';
import { scales } from './scales';
import { caseStudies } from './cases';
import { firstDayItems, glossaryTerms } from './starter-data';
import { glossarySource } from './hospital-glossary';
import { learningMaterials } from './materials';
import { apostilas } from './apostilas';
import { equipmentDiagrams } from './equipment-diagrams';
import { pavReferences, pavTopic } from './pav';
import { extraQuestionSources } from './extra-questions';
import { topicFavoriteId, topicHref } from './favorites';
import { scaleIdForTopic } from './topic-identifiers';
import { newTools } from './new-tools';
import { annotationScenarios } from './annotation-lab';
import { virtualStations } from './virtual-cti';
import { integrationItems } from './integration-checklist';
import { FEEDBACK_INSTRUMENT_VERSION } from './pbl-feedback';
import { guidedDemoSteps } from './guided-demo';
import { communicationCases, communicationSituations, familyGuidance, familyReferences, familySections, visitorGuidance } from './family-welcome';
import { familyCaseHref, familyContentReferences, familyLeafletPdfs, familySectionHref } from './family-catalog';
import familyLeaflet from './data/family-leaflet.json';
import { clinicalConditions, clinicalFavoriteId, clinicalHref, clinicalModule } from './clinical-dictionary';

export type ContentReference = { label: string; href: string; page?: number };
export type ContentMetadata = {
  id: string;
  title: string;
  category: string;
  recommendedAudiences: ('estagiario' | 'colaborador')[];
  description: string;
  href: string;
  references: ContentReference[];
  referenceStatus: 'provided_materials' | 'specific_reference_pending';
  lastReviewedAt: string | null;
  reviewedBy: string | null;
  status: 'pending_review' | 'educational_reviewed' | 'institutional_validated';
  version: string;
  publicationScope: 'educational_public' | 'institutional_public' | 'restricted';
  authorizationReference: string | null;
  notes: string[];
};

const caderno = (page: number, label = `Caderno CTI Adulto — página ${page}`): ContentReference => ({ label, page, href: `/materiais/caderno-cti-adulto-digital.pdf#page=${page}` });
const uniqueReferences = (refs: ContentReference[]) => [...new Map(refs.map(ref => [ref.href, ref])).values()];
const pending = (entry: Pick<ContentMetadata, 'id' | 'title' | 'category' | 'description' | 'href'> & Partial<ContentMetadata>): ContentMetadata => ({
  recommendedAudiences: ['estagiario', 'colaborador'], references: [], referenceStatus: 'specific_reference_pending',
  lastReviewedAt: null, reviewedBy: null, status: 'pending_review', version: '1',
  publicationScope: 'educational_public', authorizationReference: null, notes: [], ...entry,
});

function moduleReferences(moduleId: string): ContentReference[] {
  if (moduleId === 'acolher-familia') return familyReferences.map(reference => ({ label: reference.title, href: reference.href }));
  const mapped = extraQuestionSources.filter(source => source.moduleId === moduleId && source.page)
    .map(source => caderno(source.page!, source.label));
  const caseRefs = caseStudies.filter(item => item.relatedModule.href.split('/')[0] === `#${moduleId}`).flatMap(item => item.sources);
  const diagrams = equipmentDiagrams.filter(item => item.moduleId === moduleId).map(item => item.source);
  const scaleRefs = moduleId === 'escalas' ? scales.flatMap(scale => scale.references) : [];
  return uniqueReferences([...mapped, ...caseRefs, ...diagrams, ...scaleRefs]);
}

const existingTools = [
  { id: 'primeiro-dia', title: 'Checklist do primeiro dia', description: 'Roteiro educativo para ambientação, com marcações locais.', references: firstDayItems.filter(item => item.sourcePage).map(item => caderno(item.sourcePage!, item.sourceLabel)) },
  { id: 'glossario', title: 'Siglário', description: 'Transcrição e atualizações fornecidas pelo responsável pelo projeto.', references: [{ label: 'Relatório indicado pelo responsável; transcrição fornecida, sem conferência online independente.', href: glossarySource.href }] },
  { id: 'caderno', title: 'Caderno digital', description: 'Livro educativo com leitura horizontal e retomada local.', references: [{ label: 'PDF de origem do caderno', href: learningMaterials[0].href }] },
  { id: 'favoritos', title: 'Meus favoritos', description: 'Atalhos de leitura guardados somente neste navegador.', references: [] },
];

const familySectionReferenceIds: Record<string, string[]> = {
  acolhimento: familyGuidance.flatMap(item => item.referenceIds),
  visitante: visitorGuidance.flatMap(item => item.referenceIds),
  falas: communicationSituations.flatMap(item => item.referenceIds),
  simulador: communicationCases.flatMap(item => item.referenceIds),
  material: familyReferences.map(reference => reference.id),
};

function additionalToolMetadata(id: string): Partial<ContentMetadata> {
  if (id === 'tool.calculadora') return {
    notes: ['Ferramenta de aritmética comum, com operações e limites documentados e verificados por testes de software. Não contém conteúdo clínico nem coleta ou conserva as contas digitadas.'],
  };
  if (id === 'tool.laboratorio') return {
    references: uniqueReferences(annotationScenarios.flatMap(item => item.sourceRefs)), referenceStatus: 'provided_materials',
    notes: ['Exercícios fictícios baseados nos casos e nas páginas do caderno indicados. Rubrica de autorrevisão educativa, sem pontuação automática, certificação ou validação de competência. A revisão profissional permanece pendente.'],
  };
  if (id === 'tool.cti-virtual') return {
    references: uniqueReferences(virtualStations.map(item => item.source)), referenceStatus: 'provided_materials',
    notes: ['Box fictício construído com desenhos educativos existentes. As posições não representam planta, localização de materiais ou instalação de equipamentos da instituição. Não ensina ajustes de tratamento.'],
  };
  if (id === 'tool.integracao') return {
    recommendedAudiences: ['colaborador'], references: uniqueReferences(integrationItems.map(item => ({ label: item.sourceLabel, href: item.href }))),
    notes: ['Base educativa local indicada nos módulos. Referências profissionais específicas e cada item de ambientação ainda precisam de revisão institucional. As marcações não registram treinamento obrigatório ou autorização para procedimentos.'],
  };
  if (id === 'tool.avaliacao-pbl') return {
    version: FEEDBACK_INSTRUMENT_VERSION,
    references: [{ label: 'Sobre o Projeto — privacidade e limites da demonstração educacional', href: '#projeto' }],
    notes: [`Questionário próprio desta demonstração, versão ${FEEDBACK_INSTRUMENT_VERSION}. Não foi apresentado como instrumento validado de usabilidade, aprendizagem ou competência. Respostas ficam na sessão; a exportação é manual e depende de consentimento. Coleta remota e validação do instrumento permanecem pendentes de proposta e autorização.`],
  };
  if (id === 'tool.demonstracao') return {
    references: uniqueReferences(guidedDemoSteps.flatMap(step => step.links.map(link => ({ label: `Percurso da demonstração — ${link.label}`, href: link.href })))),
    notes: ['Roteiro funcional de apresentação dos recursos existentes, sem dados reais. Os vínculos demonstram as telas do projeto e não constituem referências clínicas nem aprovação institucional.'],
  };
  return {};
}

/** Metadata adapts the existing catalogs; it does not duplicate or silently rewrite clinical text. */
export const contentRegistry: ContentMetadata[] = [
  pending({ ...clinicalModule, category: 'Módulo', notes: ['Módulo educativo de patologias e condições críticas. As 30 fichas estão pendentes de revisão clínica; não há aprovação institucional.'] }),
  ...clinicalConditions.map(item => pending({ id: clinicalFavoriteId(item.id), title: item.name, category: 'Dicionário Clínico', description: item.quickSummary, href: clinicalHref(item.id), version: item.version,
    references: item.references.map(ref => ({ label: `${ref.organization} — ${ref.title}${ref.verification === 'pending' ? ' (conferência pendente)' : ''}`, href: ref.url })),
    referenceStatus: 'specific_reference_pending',
    notes: ['Rascunho educativo. A consulta técnica de uma fonte não equivale à revisão profissional da ficha nem à aprovação institucional.', ...item.references.map(ref => ref.note)],
  })),
  ...modules.map(module => pending({
    id: `module.${module.id}`, title: module.title, description: module.description, category: 'Módulo', href: `#${module.id}`,
    references: moduleReferences(module.id),
    notes: ['Materiais relacionados já presentes no projeto. A revisão e o vínculo de cada afirmação à fonte específica permanecem pendentes.'],
  })),
  ...modules.flatMap(module => module.topics.map(topic => {
    const scale = module.id === 'escalas' ? scales.find(item => item.id === scaleIdForTopic(topic.title)) : undefined;
    const diagram = equipmentDiagrams.find(item => item.moduleId === module.id && item.topicTitle === topic.title);
    const questionRefs = extraQuestionSources.filter(source => source.moduleId === module.id && source.page && source.label.includes(topic.title)).map(source => caderno(source.page!, source.label));
    const references = uniqueReferences(topic.title === pavTopic.title ? pavReferences : scale ? scale.references : [...(diagram ? [diagram.source] : []), ...questionRefs]);
    return pending({ id: topicFavoriteId(module.id, topic.title), title: topic.title, category: module.id === 'escalas' ? 'Escala' : 'Assunto',
      description: topic.purpose, href: topicHref(module.id, topic.title), references,
      referenceStatus: references.length ? 'provided_materials' : 'specific_reference_pending',
      notes: references.length ? ['Fontes fornecidas no projeto; confirmar versão, adequação profissional e vigência antes de validação clínica.'] : ['Referência específica deste assunto ainda precisa ser documentada. A lista geral de portais não valida o texto.'],
    });
  })),
  ...familySections.map(section => pending({ id: `family.section.${section.id}`, title: section.title, category: 'Acolhimento familiar', description: section.description, href: familySectionHref(section.id),
    references: familyContentReferences(familySectionReferenceIds[section.id] ?? []), referenceStatus: 'specific_reference_pending',
    notes: ['Orientações gerais de acolhimento e segurança. Aplicação, atribuições, condições clínicas e participação em cuidados dependem de supervisão e normas aplicáveis. A regra relatada para a CTI Cardio é local e ainda precisa de confirmação institucional.'],
  })),
  ...communicationSituations.map(item => pending({ id: `family.speech.${item.id}`, title: item.title, category: 'Comunicação com familiares', description: item.recommended, href: familySectionHref('falas'),
    references: familyContentReferences(item.referenceIds), referenceStatus: 'specific_reference_pending',
    notes: ['Exemplos de comunicação educativa, sem previsão de recuperação, promessa de prognóstico ou garantia de percepção durante sedação. Revisão pela enfermeira responsável pendente.'],
  })),
  ...communicationCases.map(item => pending({ id: `family.case.${item.id}`, title: item.title, category: 'Simulação de comunicação', description: item.situation, href: familyCaseHref(item.id),
    references: familyContentReferences(item.referenceIds), referenceStatus: 'specific_reference_pending',
    notes: ['Situação inteiramente fictícia. As alternativas e explicações orientam a reflexão; não substituem supervisão ou protocolo institucional e não certificam competência.'],
  })),
  ...familyLeafletPdfs.map(item => pending({ id: `pdf.${item.id}`, title: item.title, category: 'PDF', description: item.description, href: familySectionHref('material'), version: familyLeaflet.version,
    references: [{ label: `${familyLeaflet.fullTitle} — ${item.layout === 'booklet-a4' ? 'duas faces A4 impostas para dobra central' : 'quatro páginas A5 em ordem de leitura'}`, href: item.href }, ...familyContentReferences(familySectionReferenceIds.material)], referenceStatus: 'provided_materials',
    notes: ['Material educativo sujeito à validação institucional. Atualização editorial e geração de PDF não equivalem a revisão clínica. Confirmar o conteúdo com a enfermeira responsável antes de entregar aos familiares.'],
  })),
  ...scales.map(scale => pending({ id: `scale.${scale.id}`, title: scale.name, category: 'Escala', description: scale.purpose, href: `#escalas/${scale.id}`,
    references: scale.references, referenceStatus: 'provided_materials', notes: ['Guia de leitura educativo, sem avaliação de paciente ou decisão clínica autônoma.'],
  })),
  ...caseStudies.map(item => pending({ id: `case.${item.id}`, title: item.title, category: 'Caso simulado', description: item.summary, href: `#quiz/${item.id}`,
    references: item.sources, referenceStatus: 'provided_materials', notes: ['Cenário fictício. Não representa caso real nem certificação de competência.'],
  })),
  ...annotationScenarios.map(item => pending({ id: `annotation.${item.id}`, title: item.title, category: 'Exercício de anotação', description: item.goal, href: `#laboratorio/${item.id}`,
    references: item.sourceRefs, referenceStatus: 'provided_materials',
    notes: ['Cenário inteiramente fictício. Os exemplos conservam somente os fatos fornecidos, sem completar dados ausentes. A rubrica é educativa e depende de revisão profissional.'],
  })),
  ...virtualStations.map(item => pending({ id: `virtual.${item.id}`, title: item.title, category: 'CTI virtual', description: item.description, href: '#cti-virtual',
    references: [item.source], referenceStatus: 'provided_materials',
    notes: ['Representação educativa de um box fictício; não descreve equipamentos instalados, localização real ou operação autorizada de uma instituição.'],
  })),
  ...firstDayItems.map(item => pending({ id: `checklist.${item.id}`, title: item.title, category: 'Checklist do primeiro dia', description: item.detail, href: '#primeiro-dia',
    recommendedAudiences: ['estagiario'], references: [{ label: item.sourceLabel, href: item.href }, ...(item.sourcePage ? [caderno(item.sourcePage)] : [])],
    referenceStatus: item.sourcePage ? 'provided_materials' : 'specific_reference_pending',
    notes: ['Orientação geral para conversar com o preceptor. A organização e os fluxos reais devem ser apresentados pela equipe autorizada. Marcar este item não equivale a treinamento ou certificação.'],
  })),
  ...integrationItems.map(item => pending({ id: `integration.${item.id}`, title: item.title, category: 'Checklist de integração', description: item.detail, href: '#integracao',
    recommendedAudiences: ['colaborador'], references: [{ label: item.sourceLabel, href: item.href }],
    notes: ['Origem educativa indicada no módulo local; referência profissional específica e aplicação ao setor ainda pendentes de validação institucional. Não apresenta fluxo interno autorizado nem comprova competência.'],
  })),
  ...[...learningMaterials, ...apostilas].map(item => pending({ id: `pdf.${item.id}`, title: item.title, category: 'PDF', description: item.description, href: `#biblioteca/${item.id}`,
    references: [{ label: `${item.title} — arquivo fornecido; referências e créditos preservados no documento.`, href: item.href }],
    referenceStatus: 'provided_materials', notes: ['Integridade do arquivo não equivale a revisão clínica. Confirmar direitos de divulgação e autorização de materiais de terceiros.'],
  })),
  ...glossaryTerms.map(term => pending({ id: `term.${term.id}`, title: term.term, category: 'Siglário', description: term.definition, href: `#glossario/${term.id}`,
    references: [{ label: 'Fonte indicada para a transcrição fornecida; não verificada diretamente neste ambiente.', href: glossarySource.href }, ...(term.reference ? [term.reference] : [])],
    referenceStatus: 'provided_materials', notes: [term.sourceLabel, ...(term.reviewNote ? [term.reviewNote] : [])],
  })),
  ...existingTools.map(tool => pending({ id: `tool.${tool.id}`, title: tool.title, category: 'Ferramenta', description: tool.description, href: `#${tool.id}`,
    references: uniqueReferences(tool.references), referenceStatus: tool.references.length ? 'provided_materials' : 'specific_reference_pending',
    ...(tool.id === 'primeiro-dia' ? { recommendedAudiences: ['estagiario'] } : {}),
  })),
  ...newTools.map(tool => pending({ id: tool.id, title: tool.title, category: 'Ferramenta', description: tool.description, href: tool.href,
    notes: ['Recurso de demonstração e aprendizagem. As orientações e eventuais fluxos do setor dependem de validação profissional e institucional.'],
    ...additionalToolMetadata(tool.id),
  })),
];

/** Public bundles cannot carry restricted material or unsupported institutional approval labels. */
export function assertPublishableMetadata(entries: readonly ContentMetadata[]): void {
  const ids = new Set<string>();
  for (const entry of entries) {
    if (!entry.id || ids.has(entry.id)) throw new Error(`Identificador de conteúdo ausente ou repetido: ${entry.id}`);
    ids.add(entry.id);
    if (!entry.title || !entry.description || !entry.version || !entry.category || !entry.recommendedAudiences.length) throw new Error(`Metadados incompletos: ${entry.id}`);
    if (!['pending_review', 'educational_reviewed', 'institutional_validated'].includes(entry.status) || !['educational_public', 'institutional_public', 'restricted'].includes(entry.publicationScope) || entry.recommendedAudiences.some(audience => !['estagiario', 'colaborador'].includes(audience))) throw new Error(`Classificação de conteúdo inválida: ${entry.id}`);
    if (entry.publicationScope === 'restricted') throw new Error(`Material restrito não pode integrar o aplicativo público: ${entry.id}`);
    if (entry.status === 'institutional_validated' && (!entry.reviewedBy?.trim() || !entry.lastReviewedAt || !entry.authorizationReference?.trim() || !entry.references.length)) throw new Error(`Validação institucional sem evidência suficiente: ${entry.id}`);
    if (entry.status === 'educational_reviewed' && (!entry.reviewedBy?.trim() || !entry.lastReviewedAt || !entry.references.length)) throw new Error(`Revisão educativa sem registro suficiente: ${entry.id}`);
    if (entry.publicationScope === 'institutional_public' && entry.status !== 'institutional_validated') throw new Error(`Publicação institucional sem validação: ${entry.id}`);
    if (entry.lastReviewedAt && (!/^\d{4}-\d{2}-\d{2}$/.test(entry.lastReviewedAt) || Number.isNaN(Date.parse(`${entry.lastReviewedAt}T00:00:00Z`)) || new Date(`${entry.lastReviewedAt}T00:00:00Z`).toISOString().slice(0, 10) !== entry.lastReviewedAt)) throw new Error(`Data de revisão inválida: ${entry.id}`);
    for (const ref of entry.references) if (!ref.label || !/^(?:https:\/\/|#[a-z]|\/materiais\/)/.test(ref.href)) throw new Error(`Referência inválida: ${entry.id}`);
  }
}

assertPublishableMetadata(contentRegistry);

export function getContentMetadata(id: string): ContentMetadata | undefined {
  return contentRegistry.find(entry => entry.id === id || (id.startsWith('material.') && entry.id === id.replace(/^material\./, 'pdf.')));
}
