import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { INTEGRATION_KEY, integrationItems } from './integration-checklist';
import { readSavedIds, writeSavedIds } from './learning-storage';
import { modules } from './content';

const ids = integrationItems.map(item => item.id);
let values: Map<string, string>;
beforeEach(() => {
  values = new Map();
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key),
  });
});
afterEach(() => { vi.unstubAllGlobals(); });

describe('Roteiro genérico de integração do colaborador', () => {
  it('tem nove itens com IDs estáveis, fontes e vínculos a conteúdos já existentes', () => {
    expect(integrationItems).toHaveLength(9);
    expect(new Set(ids).size).toBe(ids.length);
    const routes = new Set(modules.map(item => `#${item.id}`));
    for (const item of integrationItems) {
      expect(item.id).toMatch(/^[a-z0-9-]+$/);
      expect(item.title.length).toBeGreaterThan(10);
      expect(item.detail.length).toBeGreaterThan(30);
      expect(item.sourceLabel.length).toBeGreaterThan(20);
      expect(routes.has(item.href)).toBe(true);
    }
  });

  it('salva e reinicia o novo roteiro sem alterar o checklist do estagiário', () => {
    values.set('cti-first-day-v1', '["preceptor","maos"]');
    expect(INTEGRATION_KEY).not.toBe('cti-first-day-v1');
    expect(writeSavedIds(INTEGRATION_KEY, [ids[0], ids[2]])).toBe(true);
    expect(readSavedIds(INTEGRATION_KEY, ids)).toEqual([ids[0], ids[2]]);
    expect(writeSavedIds(INTEGRATION_KEY, [])).toBe(true);
    expect(readSavedIds(INTEGRATION_KEY, ids)).toEqual([]);
    expect(values.get('cti-first-day-v1')).toBe('["preceptor","maos"]');
  });

  it('não aceita IDs desconhecidos nem duplicados ao restaurar marcações', () => {
    values.set(INTEGRATION_KEY, JSON.stringify([ids[0], 'unknown', ids[0], { id: ids[1] }, ids[1]]));
    expect(readSavedIds(INTEGRATION_KEY, ids)).toEqual([ids[0], ids[1]]);
    values.set(INTEGRATION_KEY, '{broken');
    expect(readSavedIds(INTEGRATION_KEY, ids)).toEqual([]);
  });
});
