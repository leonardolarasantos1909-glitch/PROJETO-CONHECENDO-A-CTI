import { access } from 'node:fs/promises';
import { createServer } from 'vite';

// Execute the actual public catalog before bundling; Vite build alone does not
// evaluate application modules. This is an editorial gate, not clinical review.
const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' });
try {
  const { contentRegistry, assertPublishableMetadata } = await server.ssrLoadModule('/src/content-registry.ts');
  const { modules } = await server.ssrLoadModule('/src/content.ts');
  const { newTools } = await server.ssrLoadModule('/src/new-tools.ts');
  const { caseStudies } = await server.ssrLoadModule('/src/cases.ts');
  const { annotationScenarios } = await server.ssrLoadModule('/src/annotation-lab.ts');
  const { familySections, communicationCases } = await server.ssrLoadModule('/src/family-welcome.ts');
  const { clinicalConditions, assertClinicalConditions, clinicalResources } = await server.ssrLoadModule('/src/clinical-dictionary.ts');
  assertClinicalConditions(clinicalConditions);
  const { medications, assertMedications, medicationCases } = await server.ssrLoadModule('/src/medication-guide.ts');
  assertMedications(medications);
  if (medications.length !== 40) throw new Error('As 40 fichas de medicamentos iniciais são obrigatórias.');
  for (const studyCase of medicationCases) {
    if (studyCase.medicationIds.some(id => !medications.some(item => item.id === id)) || !studyCase.options[studyCase.answer]) throw new Error(`Caso de medicamento inválido: ${studyCase.id}`);
  }
  if (clinicalConditions.length !== 30) throw new Error('As 30 fichas clínicas iniciais são obrigatórias.');
  const routes = new Set(['inicio', 'modulos', 'projeto', 'caderno', 'pdf', 'primeiro-dia', 'glossario', 'favoritos', 'dicionario-clinico', 'medicamentos', ...modules.map(item => item.id), ...newTools.map(item => item.href.slice(1))]);
  assertPublishableMetadata(contentRegistry);
  const verifyLink = async (href, owner) => {
    if (href.startsWith('https://')) { new URL(href); return; }
    if (href.startsWith('/materiais/')) { await access(`public${href.split('#')[0]}`); return; }
    if (!href.startsWith('#')) throw new Error(`Link público inválido em ${owner}: ${href}`);
    const [route, target] = href.slice(1).split('?')[0].split('/');
    if (!routes.has(route)) throw new Error(`Rota ausente em ${owner}: ${href}`);
    if (target && route === 'quiz' && !caseStudies.some(item => item.id === target)) throw new Error(`Caso ausente: ${href}`);
    if (target && route === 'laboratorio' && !annotationScenarios.some(item => item.id === target)) throw new Error(`Cenário ausente: ${href}`);
    if (target && route === 'dicionario-clinico' && !clinicalConditions.some(item => item.id === target)) throw new Error(`Ficha clínica ausente: ${href}`);
    if (route === 'medicamentos' && target) {
      if (target === 'casos') {
        const caseId = new URLSearchParams(href.split('?')[1]).get('caso');
        if (caseId && !medicationCases.some(item => item.id === caseId)) throw new Error(`Caso de medicamento ausente: ${href}`);
      } else if (!medications.some(item => item.id === target)) throw new Error(`Medicamento ausente: ${href}`);
    }
    if (route === 'acolher-familia') {
      if (target && !familySections.some(item => item.id === target)) throw new Error(`Seção de acolhimento ausente: ${href}`);
      const caseId = new URLSearchParams(href.split('?')[1]).get('caso');
      if (caseId && (target !== 'simulador' || !communicationCases.some(item => item.id === caseId))) throw new Error(`Caso de acolhimento ausente: ${href}`);
    }
  };
  for (const item of contentRegistry) {
    await verifyLink(item.href, item.id);
    for (const reference of item.references) await verifyLink(reference.href, item.id);
  }
  for (const resource of Object.values(clinicalResources)) await verifyLink(resource.href, 'dicionario-clinico');
  console.log(`Catálogo conferido: ${contentRegistry.length} registros públicos; links locais, metadados e evidências de validação consistentes. A revisão clínica permanece independente.`);
} finally {
  await server.close();
}
