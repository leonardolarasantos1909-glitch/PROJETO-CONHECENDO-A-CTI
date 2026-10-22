import { describe, expect, it } from 'vitest';
import { favoriteCatalog, findFavorites, topicFavoriteId, topicHref, topicSlug, normalizeFavoriteIds } from './favorites';
import { modules } from './content';
import { glossaryTerms } from './starter-data';
import { newTools } from './new-tools';

describe('Favoritos e atalhos de conteúdo', () => {
  it('abre a aba exata de uma escala e o tópico exato de um módulo', () => {
    expect(topicHref('escalas', 'RASS')).toBe('#escalas/rass');
    expect(topicHref('equipamentos', 'Ventilador mecânico')).toBe('#equipamentos/ventilador-mecanico');
    expect(topicSlug('Higiene, conforto e mobilização')).toBe('higiene-conforto-e-mobilizacao');
  });

  it('mantém um catálogo único com destinos existentes, sem usar URLs salvas pelo navegador', () => {
    expect(new Set(favoriteCatalog.map(item => item.id)).size).toBe(favoriteCatalog.length);
    for (const item of favoriteCatalog) {
      expect(item.title).toBeTruthy();
      const [route, target] = item.href.slice(1).split('/');
      if (route === 'glossario') { if (target) expect(glossaryTerms.some(term => term.id === target)).toBe(true); }
      else if (route === 'caderno' || route === 'primeiro-dia' || newTools.some(tool => tool.href === `#${route}`)) expect(target).toBeUndefined();
      else {
        const module = modules.find(entry => entry.id === route);
        expect(module).toBeDefined();
        if (target && route === 'escalas') expect(['eva', 'bps', 'painad', 'rass', 'escala-de-coma-de-glasgow']).toContain(target);
        else if (target) expect(module!.topics.some(topic => topicSlug(topic.title) === target)).toBe(true);
      }
    }
    const known = topicFavoriteId('equipamentos', 'Monitor multiparamétrico');
    const entries = findFavorites(['javascript:alert(1)', known, 'term.spo2']);
    expect(entries.map(entry => entry.id)).toEqual([known, 'term.spo2']);
    expect(entries[0].href).toBe('#equipamentos/monitor-multiparametrico');
    expect(entries[1].href).toBe('#glossario/spo2');
  });
  it('preserva favoritos ao substituir o glossário sem confundir PAI com PAI + CD', () => {
    expect(normalizeFavoriteIds(['module.acolhimento', 'term.glasgow', 'term.pai', 'term.bps', 'term.spo2', 'term.nao-existe', 'term.pai']))
      .toEqual(['module.acolhimento', 'term.gcs', 'tool.glossario', 'term.spo2']);
    expect(findFavorites(['term.pai'])[0].href).toBe('#glossario');
  });

  it('permite favoritar as novas ferramentas e preserva os identificadores anteriores', () => {
    expect(topicFavoriteId('escalas', 'EVA — Escala Visual Analógica')).toBe('topic.escalas.eva-escala-visual-analogica');
    expect(topicFavoriteId('escalas', 'BPS — Behavioral Pain Scale')).toBe('topic.escalas.bps-behavioral-pain-scale');
    expect(topicFavoriteId('registros', 'Higiene, conforto e mobilização')).toBe('topic.registros.higiene-conforto-e-mobilizacao');
    for (const tool of newTools) expect(findFavorites([tool.id])).toEqual([{ id: tool.id, title: tool.title, href: tool.href, kind: 'Ferramenta' }]);
  });

});
