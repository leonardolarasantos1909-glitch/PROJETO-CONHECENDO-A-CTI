import type { MedicationReference } from './medication-types';

/** A lookup portal is not a medicine-specific approved label. Never claim otherwise. */
export function medicationSources(name: string): MedicationReference[] {
  return [
    { id: 'anvisa-bulario', title: 'Bulário Eletrônico — localizar a bula profissional da apresentação prescrita', organization: 'Agência Nacional de Vigilância Sanitária (Anvisa)', url: 'https://www.gov.br/anvisa/pt-br/sistemas/bulario-eletronico', scope: 'lookup_portal', verification: 'pending', note: `Pendente localizar e conferir a bula aprovada específica de ${name}, incluindo fabricante, registro, sal, apresentação, vias e versão. O acesso externo foi bloqueado neste ambiente. Este portal de pesquisa não comprova as afirmações desta ficha.` },
    { id: 'ismp-mpp', title: 'Medicamentos potencialmente perigosos de uso hospitalar — Boletim ISMP Brasil, fevereiro de 2019', organization: 'Instituto para Práticas Seguras no Uso de Medicamentos (ISMP Brasil)', url: 'https://www.ismp-brasil.org/site/wp-content/uploads/2019/02/615-boletim-ismp-fevereiro-2019.pdf', scope: 'safety', verification: 'pending', note: 'Documento de 2019 indicado para conferência; não foi possível ler o arquivo nem confirmar sua vigência ou substituição neste ambiente. Conferir a lista mais recente e a classificação da apresentação com a instituição. Não valida indicações, vias ou preparo de um produto específico.' },
  ];
}

export const unverifiedCommercialNamesNote = 'Nomes comerciais não publicados: dependem de conferência da bula e do registro da apresentação no Brasil. Nenhum nome de marca foi apresentado como verificado sem evidência.';
