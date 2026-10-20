import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { clearLearningStorage, LAST_PAGE_KEY, readLastPage, readSavedIds, saveLastPage, writeSavedIds } from './learning-storage';

class MemoryStorage {
  values = new Map<string, string>();
  getItem(key: string) { return this.values.get(key) ?? null; }
  setItem(key: string, value: string) { this.values.set(key, value); }
  removeItem(key: string) { this.values.delete(key); }
}

let storage: MemoryStorage;
beforeEach(() => {
  storage = new MemoryStorage();
  vi.stubGlobal('localStorage', storage);
});
afterEach(() => vi.unstubAllGlobals());

describe('Progresso de aprendizagem no aparelho', () => {
  it('recupera somente IDs conhecidos, sem duplicatas ou dados de outras chaves', () => {
    storage.setItem('cti-favorites-v1', JSON.stringify(['first', 'unknown', 42, 'first', 'second', null]));
    storage.setItem('unrelated', 'preserved');
    expect(readSavedIds('cti-favorites-v1', ['first', 'second'])).toEqual(['first', 'second']);
    expect(writeSavedIds('cti-first-day-v1', ['first', 'first', 'second'])).toBe(true);
    expect(readSavedIds('cti-first-day-v1', ['first', 'second'])).toEqual(['first', 'second']);
    expect(storage.getItem('unrelated')).toBe('preserved');
  });

  it.each(['{invalid', 'null', 'true', '3', '{"first":true}', '"first"'])('ignora o formato inválido %s', raw => {
    storage.setItem('cti-favorites-v1', raw);
    expect(readSavedIds('cti-favorites-v1', ['first'])).toEqual([]);
  });

  it('retoma uma página inteira válida e permite voltar à primeira', () => {
    expect(readLastPage(96)).toBe(1);
    expect(saveLastPage(42)).toBe(true);
    expect(readLastPage(96)).toBe(42);
    expect(saveLastPage(1)).toBe(true);
    expect(readLastPage(96)).toBe(1);
  });

  it.each(['{invalid', 'null', 'true', 'false', '"42"', '0', '-1', '97', '2.5', '[]', '{}'])('não retoma uma página inválida: %s', raw => {
    storage.setItem(LAST_PAGE_KEY, raw);
    expect(readLastPage(96)).toBe(1);
  });

  it('rejeita páginas e limites inválidos sem sobrescrever a última página válida', () => {
    saveLastPage(42);
    for (const page of [0, -1, 1.5, Number.NaN, Number.POSITIVE_INFINITY, Number.MAX_SAFE_INTEGER + 1]) {
      expect(saveLastPage(page)).toBe(false);
      expect(readLastPage(96)).toBe(42);
    }
    for (const count of [0, -1, 1.5, Number.NaN, Number.POSITIVE_INFINITY]) expect(readLastPage(count)).toBe(1);
    expect(readLastPage(20)).toBe(1);
  });

  it('permite a leitura sem quebrar quando o navegador bloqueia o armazenamento', () => {
    Object.defineProperty(globalThis, 'localStorage', { configurable: true, get() { throw new Error('Storage blocked'); } });
    expect(readSavedIds('cti-favorites-v1', ['first'])).toEqual([]);
    expect(readLastPage(96)).toBe(1);
    expect(writeSavedIds('cti-favorites-v1', ['first'])).toBe(false);
    expect(saveLastPage(42)).toBe(false);
    expect(clearLearningStorage()).toBe(false);
  });

  it('informa falha de quota sem apagar os dados já salvos', () => {
    saveLastPage(42);
    storage.setItem('cti-favorites-v1', '["first"]');
    storage.setItem = () => { throw new Error('QuotaExceededError'); };
    expect(saveLastPage(50)).toBe(false);
    expect(writeSavedIds('cti-favorites-v1', ['second'])).toBe(false);
    expect(readLastPage(96)).toBe(42);
    expect(readSavedIds('cti-favorites-v1', ['first', 'second'])).toEqual(['first']);
  });

  it('apaga apenas o progresso conhecido do aplicativo e preserva outros dados', () => {
    for (const key of ['cti-first-day-v1', 'cti-favorites-v1', LAST_PAGE_KEY, 'cti-visited']) storage.setItem(key, 'saved');
    storage.setItem('unrelated', 'keep');
    storage.setItem('cti-other', 'keep');
    expect(clearLearningStorage()).toBe(true);
    expect([...storage.values.entries()]).toEqual([['unrelated', 'keep'], ['cti-other', 'keep']]);
  });

  it('tenta limpar as demais chaves do app mesmo se uma remoção falhar', () => {
    storage.setItem('cti-first-day-v1', '["first"]');
    storage.setItem('cti-favorites-v1', '["first"]');
    storage.setItem(LAST_PAGE_KEY, '42');
    const remove = storage.removeItem.bind(storage);
    storage.removeItem = key => { if (key === 'cti-first-day-v1') throw new Error('blocked'); remove(key); };
    expect(clearLearningStorage()).toBe(false);
    expect(storage.getItem('cti-first-day-v1')).toBe('["first"]');
    expect(storage.getItem('cti-favorites-v1')).toBeNull();
    expect(storage.getItem(LAST_PAGE_KEY)).toBeNull();
  });
});
