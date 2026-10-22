export const PROFILE_KEY = 'cti-learning-profile-v1';

export type LearningProfileId = 'estagiario' | 'colaborador';

export function isLearningProfileId(value: unknown): value is LearningProfileId {
  return value === 'estagiario' || value === 'colaborador';
}

/** Store an educational preference, never a name or an employee identifier. */
export function readLearningProfile(): LearningProfileId | null {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(PROFILE_KEY) ?? 'null');
    return isLearningProfileId(value) ? value : null;
  } catch {
    return null;
  }
}

export function saveLearningProfile(profile: LearningProfileId | null): boolean {
  if (profile !== null && !isLearningProfileId(profile)) return false;
  try {
    if (profile === null) localStorage.removeItem(PROFILE_KEY);
    else localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    return true;
  } catch {
    return false;
  }
}

export const profileLabels: Record<LearningProfileId, string> = {
  estagiario: 'Sou estagiário',
  colaborador: 'Sou novo colaborador',
};

export const profileRecommendations: Record<LearningProfileId, { title: string; description: string; href: string }[]> = {
  estagiario: [
    { title: 'Meu primeiro dia', description: 'Conheça a equipe e acompanhe sua ambientação com o preceptor.', href: '#primeiro-dia' },
    { title: 'Equipamentos e dispositivos', description: 'Reconheça as partes e leve suas dúvidas à equipe.', href: '#equipamentos' },
    { title: 'Siglário', description: 'Consulte as siglas e os termos dos materiais do projeto.', href: '#glossario' },
    { title: 'Casos simulados', description: 'Pratique segurança, comunicação e registros com situações fictícias.', href: '#quiz' },
  ],
  colaborador: [
    { title: 'Minha integração', description: 'Organize os pontos a conhecer com a equipe do setor.', href: '#integracao' },
    { title: 'Rotina e passagem de plantão', description: 'Revise comunicação e continuidade do cuidado.', href: '#rotinas' },
    { title: 'Equipamentos do cuidado', description: 'Reconheça recursos e confirme o treinamento aplicável com a equipe.', href: '#equipamentos' },
    { title: 'Registros de enfermagem', description: 'Reveja os exemplos educativos e as orientações de registro.', href: '#registros' },
  ],
};
