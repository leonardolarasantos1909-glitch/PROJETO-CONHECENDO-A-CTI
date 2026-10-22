import { describe, expect, it } from 'vitest';
import { buildFeedbackExport, feedbackAnsweredCount, FEEDBACK_INSTRUMENT_VERSION, pblFeedbackQuestions } from './pbl-feedback';

const completeAnswers = Object.fromEntries(pblFeedbackQuestions.map(question => [question.id, '4']));

describe('Avaliação PBL local e exportação mínima', () => {
  it('exige consentimento e respostas fechadas completas antes de exportar', () => {
    expect(buildFeedbackExport(completeAnswers, false)).toBeNull();
    expect(buildFeedbackExport({}, true)).toBeNull();
    expect(buildFeedbackExport({ ...completeAnswers, clareza: '<script>dados</script>' }, true)).toBeNull();
    expect(buildFeedbackExport({ ...completeAnswers, clareza: 4 }, true)).toBeNull();
    expect(buildFeedbackExport([], true)).toBeNull();
    expect(buildFeedbackExport(null, true)).toBeNull();
  });

  it('descarta campos extras e exporta somente versão e respostas do instrumento', () => {
    const exported = buildFeedbackExport({ ...completeAnswers, nome: 'não exportar', timestamp: 'não exportar', perfil: 'não exportar', sessionId: 'não exportar' }, true)!;
    expect(Object.keys(exported)).toEqual(['instrumentVersion', 'answers']);
    expect(exported.instrumentVersion).toBe(FEEDBACK_INSTRUMENT_VERSION);
    expect(exported.answers).toHaveLength(7);
    expect(exported.answers.map(item => item.item)).toEqual(pblFeedbackQuestions.map(question => question.id));
    expect(exported.answers.every(item => Object.keys(item).join(',') === 'item,answer' && item.answer === '4')).toBe(true);
    expect(JSON.stringify(exported)).not.toContain('não exportar');
  });

  it('permite não avaliar um item sem convertê-lo em nota de aprendizagem', () => {
    const answers = { ...completeAnswers, clareza: 'na' };
    expect(buildFeedbackExport(answers, true)?.answers.find(item => item.item === 'clareza')?.answer).toBe('na');
    expect(feedbackAnsweredCount({ clareza: 'na', localizar: '1' })).toBe(2);
    expect(feedbackAnsweredCount({})).toBe(0);
  });
});
