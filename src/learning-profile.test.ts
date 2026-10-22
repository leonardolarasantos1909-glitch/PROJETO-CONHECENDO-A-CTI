import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { isLearningProfileId, PROFILE_KEY, profileLabels, profileRecommendations, readLearningProfile, saveLearningProfile, type LearningProfileId } from './learning-profile';

class MemoryStorage {
  values = new Map<string, string>();
  getItem(key: string) { return this.values.get(key) ?? null; }
  setItem(key: string, value: string) { this.values.set(key, value); }
  removeItem(key: string) { this.values.delete(key); }
}

let storage: MemoryStorage;
beforeEach(() => { storage = new MemoryStorage(); vi.stubGlobal('localStorage', storage); });
afterEach(() => { vi.unstubAllGlobals(); });

describe('Preferência de aprendizagem sem identificação', () => {
  it('admite apenas os dois perfis e começa sem escolha quando não há preferência', () => {
    expect(readLearningProfile()).toBeNull();
    expect(isLearningProfileId('estagiario')).toBe(true);
    expect(isLearningProfileId('colaborador')).toBe(true);
    for (const value of ['admin', '__proto__', {}, [], null, 1]) expect(isLearningProfileId(value)).toBe(false);
  });

  it('persiste a troca de perfil sem escrever em outras preferências', () => {
    storage.setItem('cti-first-day-v1', '["preceptor"]');
    storage.setItem('cti-favorites-v1', '["term.pplato"]');
    storage.setItem('unrelated-key', 'keep');
    expect(saveLearningProfile('estagiario')).toBe(true);
    expect(readLearningProfile()).toBe('estagiario');
    expect(saveLearningProfile('colaborador')).toBe(true);
    expect(readLearningProfile()).toBe('colaborador');
    expect(storage.getItem(PROFILE_KEY)).toBe('"colaborador"');
    expect(saveLearningProfile(null)).toBe(true);
    expect(readLearningProfile()).toBeNull();
    expect(storage.getItem(PROFILE_KEY)).toBeNull();
    expect(storage.getItem('cti-first-day-v1')).toBe('["preceptor"]');
    expect(storage.getItem('cti-favorites-v1')).toBe('["term.pplato"]');
    expect(storage.getItem('unrelated-key')).toBe('keep');
  });

  it('ignora JSON corrompido, objetos e valores desconhecidos, sem usá-los como perfil', () => {
    for (const raw of ['{', '"admin"', '{"profile":"estagiario"}', '["colaborador"]', 'null', '42', '"javascript:alert(1)"']) {
      storage.setItem(PROFILE_KEY, raw);
      expect(readLearningProfile()).toBeNull();
    }
    expect(saveLearningProfile('admin' as LearningProfileId)).toBe(false);
  });

  it('informa falha quando armazenamento é bloqueado, sem lançar erro', () => {
    vi.stubGlobal('localStorage', {
      getItem() { throw new Error('blocked'); },
      setItem() { throw new Error('blocked'); },
      removeItem() { throw new Error('blocked'); },
    });
    expect(readLearningProfile()).toBeNull();
    expect(saveLearningProfile('estagiario')).toBe(false);
    expect(saveLearningProfile(null)).toBe(false);
  });

  it('mantém recomendações internas distintas sobre uma base compartilhada', () => {
    expect(Object.keys(profileLabels)).toEqual(['estagiario', 'colaborador']);
    expect(profileRecommendations.estagiario.some(item => item.href === '#primeiro-dia')).toBe(true);
    expect(profileRecommendations.colaborador.some(item => item.href === '#integracao')).toBe(true);
    for (const recommendations of Object.values(profileRecommendations)) {
      expect(new Set(recommendations.map(item => item.href)).size).toBe(recommendations.length);
      expect(recommendations.every(item => item.href.startsWith('#') && item.title && item.description)).toBe(true);
      expect(recommendations.some(item => item.href === '#equipamentos')).toBe(true);
    }
  });
});
