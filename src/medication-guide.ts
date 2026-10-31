import { medicationCategories, type Medication } from './medication-types';
import { cardiovascularMedications } from './data/medications-cardiovascular';
import { sedationPainMedications } from './data/medications-sedation-pain';
import { anticoagDiureticMedications } from './data/medications-anticoag-diuretic';
import { antimicrobialMedications } from './data/medications-antimicrobial';
import { metabolicOtherMedications } from './data/medications-metabolic-other';
import { getClinicalCondition } from './clinical-dictionary';
export { medicationCategories } from './medication-types';
export type { Medication } from './medication-types';
export { medicationCases, medicationCaseHref, getMedicationCases } from './medication-cases';

export const medicationModule = {
  id: 'module.medicamentos', title: 'Guia de Medicamentos', href: '#medicamentos',
  description: 'Consulta farmacológica educativa para relacionar observação, segurança e cuidados de enfermagem, sem prescrição ou preparo.',
};
export const medicationHref = (id: string) => `#medicamentos/${id}`;
export const medicationFavoriteId = (id: string) => `medication.${id}`;
export const medications: Medication[] = [...cardiovascularMedications, ...sedationPainMedications, ...anticoagDiureticMedications, ...antimicrobialMedications, ...metabolicOtherMedications]
  .sort((a, b) => a.genericName.localeCompare(b.genericName, 'pt-BR'));
export const normalizeMedicationSearch = (text: string) => text.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().replace(/\s+/g, ' ');
export function getMedication(id: string): Medication | undefined { return medications.find(item => item.id === id); }
export function searchMedications(query: string, category = '', highAlertOnly = false): Medication[] {
  const normalized = normalizeMedicationSearch(query), words = [...new Set(normalized.split(' ').filter(Boolean))];
  return medications.map((item, index) => {
    const title = normalizeMedicationSearch(item.genericName);
    const names = [item.activeIngredient, ...item.aliases, ...item.commercialNames.map(brand => brand.name)].map(normalizeMedicationSearch);
    const text = [title, ...names, normalizeMedicationSearch(item.pharmacologicalClass), normalizeMedicationSearch(item.category)].join(' ');
    const score = !normalized ? 0 : title === normalized ? 100 : names.includes(normalized) ? 90 : title.startsWith(normalized) ? 80 : 0;
    return { item, index, text, score };
  }).filter(({ item, text }) => (!category || item.category === category) && (!highAlertOnly || item.highAlert.flagged) && words.every(word => text.includes(word)))
    .sort((a, b) => b.score - a.score || a.index - b.index).map(({ item }) => item);
}
export function medicationsForCondition(id: string): Medication[] { return medications.filter(item => item.relatedConditionIds.includes(id)); }

const textFields = ['id', 'genericName', 'activeIngredient', 'pharmacologicalClass', 'summary', 'purpose', 'mechanism', 'formulationsNote', 'commercialNamesNote', 'version'] as const;
const listFields = ['intensiveCareUses', 'adverseEffects', 'contraindicationsPrecautions', 'nursingCare', 'monitoring', 'warningSigns'] as const;
const validDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
/** Build gate checks editorial integrity; it is not pharmacological or institutional validation. */
export function assertMedications(entries: readonly Medication[] = medications): void {
  const ids = new Set<string>(), ingredients = new Set<string>();
  for (const item of entries) {
    if (textFields.some(key => typeof item[key] !== 'string' || !item[key].trim()) || listFields.some(key => !Array.isArray(item[key]) || !item[key].length || item[key].some(value => typeof value !== 'string' || !value.trim()))) throw new Error(`Ficha de medicamento incompleta: ${item.id}`);
    const ingredient = normalizeMedicationSearch(item.activeIngredient);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.id) || ids.has(item.id) || ingredients.has(ingredient)) throw new Error(`Medicamento ou princípio ativo duplicado/inválido: ${item.id}`);
    ids.add(item.id); ingredients.add(ingredient);
    if (!medicationCategories.includes(item.category)) throw new Error(`Categoria de medicamento inválida: ${item.id}`);
    if (item.clinicalReviewStatus !== 'pending' || item.reviewedAt !== null) throw new Error(`Validação clínica não comprovada: ${item.id}`);
    if (!Array.isArray(item.aliases) || item.aliases.some(alias => typeof alias !== 'string' || !alias.trim())) throw new Error(`Alias de medicamento inválido: ${item.id}`);
    if (!Array.isArray(item.routes) || !item.routes.length || item.routes.some(route => !route || typeof route.name !== 'string' || !route.name.trim() || typeof route.context !== 'string' || !route.context.trim())) throw new Error(`Via sem contexto da apresentação: ${item.id}`);
    if (!item.highAlert || typeof item.highAlert.flagged !== 'boolean' || !item.highAlert.scope?.trim() || !item.highAlert.rationale?.trim() || item.highAlert.verification !== 'pending') throw new Error(`Classificação de alto risco inválida: ${item.id}`);
    if (!Array.isArray(item.references) || !item.references.length) throw new Error(`Fonte de medicamento ausente: ${item.id}`);
    const references = new Set<string>();
    for (const ref of item.references) {
      if (!ref.id?.trim() || references.has(ref.id) || !ref.title?.trim() || !ref.organization?.trim() || !ref.note?.trim() || !['pending', 'verified'].includes(ref.verification) || !['product_label', 'safety', 'guideline', 'lookup_portal'].includes(ref.scope)) throw new Error(`Referência de medicamento inválida: ${item.id}`);
      references.add(ref.id);
      let url: URL; try { url = new URL(ref.url); } catch { throw new Error(`URL de medicamento inválida: ${item.id}`); }
      if (url.protocol !== 'https:' || url.username || url.password) throw new Error(`URL de medicamento inválida: ${item.id}`);
      if (ref.verification === 'pending' && ref.accessedAt) throw new Error(`Consulta de fonte não comprovada: ${item.id}`);
      if (ref.verification === 'verified' && (!ref.accessedAt || !validDate(ref.accessedAt))) throw new Error(`Data de conferência de fonte inválida: ${item.id}`);
    }
    if (item.highAlert.flagged && !item.references.some(ref => ref.id === item.highAlert.referenceId && ref.scope === 'safety')) throw new Error(`Fonte de classificação de alto risco ausente: ${item.id}`);
    if (!Array.isArray(item.commercialNames)) throw new Error(`Nomes comerciais inválidos: ${item.id}`);
    const brands = new Set<string>();
    for (const brand of item.commercialNames) {
      const ref = item.references.find(ref => ref.id === brand.referenceId);
      if (!brand.name?.trim() || brands.has(normalizeMedicationSearch(brand.name)) || !brand.presentation?.trim() || !validDate(brand.verifiedAt) || !ref || ref.scope !== 'product_label' || ref.verification !== 'verified') throw new Error(`Nome comercial sem bula específica conferida: ${item.id}`);
      brands.add(normalizeMedicationSearch(brand.name));
    }
    if (!Array.isArray(item.relatedConditionIds) || new Set(item.relatedConditionIds).size !== item.relatedConditionIds.length || item.relatedConditionIds.some(id => !getClinicalCondition(id))) throw new Error(`Patologia de medicamento inexistente: ${item.id}`);
  }
}
