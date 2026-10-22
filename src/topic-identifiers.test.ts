import { describe, expect, it } from 'vitest';
import { modules } from './content';
import { topicFavoriteId, topicHref } from './favorites';
import { scaleIdForRoute, scaleIdForTopic, scaleTopicTitle, topicIdentifiers, topicMatchesRoute, topicRouteId, topicSlug } from './topic-identifiers';

describe('Identificadores estáveis de assuntos e escalas', () => {
  it('mantém um mapeamento explícito para todos os 36 títulos e preserva os IDs públicos existentes', () => {
    const topics = modules.flatMap(module => module.topics.map(topic => ({ moduleId: module.id, title: topic.title })));
    expect(topics).toHaveLength(36);
    expect(Object.values(topicIdentifiers).flatMap(Object.keys)).toHaveLength(topics.length);
    for (const topic of topics) {
      expect(Object.hasOwn(topicIdentifiers[topic.moduleId], topic.title)).toBe(true);
      expect(topicRouteId(topic.moduleId, topic.title)).toBe(topicSlug(topic.title));
      expect(topicFavoriteId(topic.moduleId, topic.title)).toBe(`topic.${topic.moduleId}.${topicSlug(topic.title)}`);
      expect(topicMatchesRoute(topic.moduleId, topic.title, topicRouteId(topic.moduleId, topic.title))).toBe(true);
    }
    expect(topicRouteId('rotinas', 'Higiene, conforto e mobilização')).toBe(topicRouteId('registros', 'Higiene, conforto e mobilização'));
    expect(topicFavoriteId('rotinas', 'Higiene, conforto e mobilização')).not.toBe(topicFavoriteId('registros', 'Higiene, conforto e mobilização'));
  });

  it('resolve escalas por relação explícita de nome e ID, sem depender da posição nos catálogos', () => {
    const expected = [
      ['rass', 'RASS'], ['painad', 'PAINAD'], ['eva', 'EVA — Escala Visual Analógica'], ['bps', 'BPS — Behavioral Pain Scale'],
    ];
    for (const [id, title] of expected) {
      expect(scaleTopicTitle(id)).toBe(title);
      expect(scaleIdForTopic(title)).toBe(id);
      expect(topicHref('escalas', title)).toBe(`#escalas/${id}`);
      expect(scaleIdForRoute(id)).toBe(id);
      expect(scaleIdForRoute(topicSlug(title))).toBe(id);
      expect(topicMatchesRoute('escalas', title, id)).toBe(true);
      expect(topicMatchesRoute('escalas', title, topicSlug(title))).toBe(true);
      expect(topicMatchesRoute('registros', title, id)).toBe(id === topicSlug(title));
    }
    expect(scaleTopicTitle('glasgow')).toBeUndefined();
    expect(scaleIdForTopic('Escala de Coma de Glasgow')).toBeUndefined();
    expect(topicHref('escalas', 'Escala de Coma de Glasgow')).toBe('#escalas/escala-de-coma-de-glasgow');
    expect(topicMatchesRoute('escalas', 'RASS', 'eva')).toBe(false);
    expect(topicMatchesRoute('escalas', 'RASS')).toBe(false);
    expect(scaleTopicTitle('__proto__')).toBeUndefined();
    expect(scaleIdForRoute('escala-de-coma-de-glasgow')).toBeUndefined();
    expect(scaleIdForRoute('__proto__')).toBeUndefined();
    expect(scaleIdForRoute()).toBeUndefined();
  });
});
