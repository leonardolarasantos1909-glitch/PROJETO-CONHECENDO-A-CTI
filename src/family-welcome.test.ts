import { describe, expect, it } from 'vitest';
import {
  communicationCases, communicationSituations, familyGuidance, familyReferences,
  familySearchText, familySections, familyWelcomeModule, localVisitingRule, visitorGuidance,
} from './family-welcome';

const uniqueIds = (items: { id: string }[]) => new Set(items.map(item => item.id)).size === items.length;

describe('Acolher também é cuidar — conteúdos educativos', () => {
  it('oferece as cinco áreas do pedido e conserva identificadores legíveis e estáveis', () => {
    expect(familyWelcomeModule).toMatchObject({
      id: 'acolher-familia', title: 'Acolher também é cuidar',
      description: 'Aprenda a acolher familiares e promover uma assistência humanizada e segura',
    });
    expect(familySections.map(item => item.id)).toEqual(['acolhimento', 'visitante', 'falas', 'simulador', 'material']);
    expect(familyGuidance).toHaveLength(6);
    expect(visitorGuidance).toHaveLength(5);
    expect(communicationSituations).toHaveLength(8);
    for (const collection of [familySections, familyGuidance, visitorGuidance, communicationSituations, communicationCases]) {
      expect(uniqueIds(collection)).toBe(true);
      for (const item of collection) expect(item.id).toMatch(/^[a-z]+(?:-[a-z]+)*$/);
    }
  });

  it('apresenta oito cenários inteiramente fictícios, com três alternativas distintas e explicação para cada escolha', () => {
    expect(communicationCases).toHaveLength(8);
    for (const item of communicationCases) {
      expect(item.situation).toMatch(/^Situação fictícia:/);
      expect(item.options).toHaveLength(3);
      expect(new Set(item.options.map(option => option.text)).size).toBe(3);
      expect(Number.isInteger(item.answer)).toBe(true);
      expect(item.answer).toBeGreaterThanOrEqual(0);
      expect(item.answer).toBeLessThan(item.options.length);
      expect(item.explanation.length).toBeGreaterThan(90);
      expect(new Set(item.options.map(option => option.feedback)).size).toBe(3);
      for (const option of item.options) expect(option.feedback.length).toBeGreaterThan(65);
    }
  });

  it('vincula cada orientação, frase e cenário a fontes identificáveis sem converter acesso em revisão clínica', () => {
    expect(uniqueIds(familyReferences)).toBe(true);
    const references = new Map(familyReferences.map(item => [item.id, item]));
    for (const collection of [familyGuidance, visitorGuidance, communicationSituations, communicationCases]) {
      for (const item of collection) {
        expect(item.referenceIds.length).toBeGreaterThan(0);
        for (const id of item.referenceIds) expect(references.has(id), `Referência ausente para ${item.id}: ${id}`).toBe(true);
      }
    }
    for (const item of familyReferences) {
      expect(item.title).toBeTruthy();
      expect(item.href).toMatch(/^(https:\/\/|#[a-z])/);
      expect(item.scope.length).toBeGreaterThan(20);
      expect(item.note.length).toBeGreaterThan(20);
      if (item.lastAccessedAt !== null) expect(item.lastAccessedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it('mantém incerteza sobre a percepção durante sedação e encaminha alarmes e manipulação para a equipe', () => {
    const sedation = visitorGuidance.find(item => item.id === 'paciente-sedado')!;
    expect(sedation.attention).toContain('Não é possível afirmar');
    expect(sedation.attention).toContain('necessariamente ouve ou compreende tudo');
    expect(sedation.attention).toContain('Não prometa uma resposta');
    const alarms = communicationCases.find(item => item.id === 'alarme-e-ajuda')!;
    expect(alarms.options[alarms.answer].text).toContain('não toque');
    expect(alarms.options[alarms.answer].text).toContain('acionar a equipe');
    const device = communicationCases.find(item => item.id === 'dispositivo-sem-manipulacao')!;
    expect(device.options[device.answer].text).toContain('não manipule');
    expect(device.options[device.answer].text).toContain('chamar a equipe');
    const participation = visitorGuidance.find(item => item.id === 'participacao-segura')!;
    expect(participation.attention).toContain('autorização, orientação e supervisão');
  });

  it('não generaliza a informação local de visitação nem a apresenta como norma aprovada', () => {
    expect(localVisitingRule).toMatchObject({ unit: 'CTI Cardio', reportedRule: 'Um visitante por vez', status: 'pending_confirmation' });
    expect(localVisitingRule.note).toContain('sujeita à confirmação institucional');
    expect(localVisitingRule.note).toContain('Não é regra universal');
    const generalAdvice = [...familyGuidance.map(item => item.text), ...visitorGuidance.map(item => item.text)].join(' ');
    expect(generalAdvice.toLowerCase()).not.toContain('um visitante por vez');
    expect(familySearchText).toContain('A família faz parte do cuidado');
    expect(familySearchText).toContain('prognóstico');
    expect(familySearchText).toContain('Higienização das mãos');
  });
});
