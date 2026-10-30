/** Editorial content is separate from interface and never implies professional approval. */
export const clinicalCategories = ['Cardiovasculares', 'Respiratórias', 'Neurológicas', 'Renais e metabólicas', 'Infecciosas', 'Gastrointestinais e hepáticas', 'Hematológicas e outras condições críticas'] as const;
export type ClinicalCategory = typeof clinicalCategories[number];
export type ClinicalReference = {
  title: string;
  organization: string;
  url: string;
  publicationDate?: string;
  accessedAt?: string;
  verification: 'verified' | 'pending';
  note: string;
};
export type ClinicalCondition = {
  id: string;
  slug: string;
  name: string;
  acronym: string;
  synonyms: string[];
  category: ClinicalCategory;
  keywords: string[];
  quickSummary: string;
  definition: string;
  pathophysiology: string;
  causes: string[];
  manifestations: string[];
  diagnosis: string[];
  treatmentOverview: string[];
  nursingTechnicianCare: string[];
  warningSigns: string[];
  /** Keys in clinicalResources, resolved against existing destinations at build time. */
  relatedDevices: string[];
  relatedScales: string[];
  relatedContentIds: string[];
  clinicalCase: { scenario: string; question: string; answer: string };
  references: ClinicalReference[];
  relatedConditionIds: string[];
  reviewedAt: string | null;
  clinicalReviewStatus: 'pending' | 'approved' | 'needs_update';
  version: string;
};
