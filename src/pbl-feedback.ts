export const FEEDBACK_INSTRUMENT_VERSION = '1.0.0';

/** Local educational questionnaire, not a validated clinical or competency instrument. */
export const pblFeedbackQuestions = [
  { id: 'localizar', text: 'Consegui localizar os conteúdos que procurava.' },
  { id: 'clareza', text: 'Os textos e as instruções foram claros para mim.' },
  { id: 'navegacao', text: 'Consegui navegar e retornar entre as telas com facilidade.' },
  { id: 'ambientacao', text: 'Os roteiros me ajudaram a organizar dúvidas sobre a ambientação na CTI.' },
  { id: 'equipamentos', text: 'Os desenhos me ajudaram a reconhecer equipamentos e dispositivos.' },
  { id: 'discussao', text: 'Os casos e exercícios estimularam minha reflexão e a discussão com a equipe.' },
  { id: 'limites', text: 'Ficou claro que o aplicativo é educativo e não substitui supervisão ou protocolos aplicáveis.' },
] as const;

export const feedbackScale = [
  { value: '1', label: '1 — Discordo totalmente' },
  { value: '2', label: '2 — Discordo' },
  { value: '3', label: '3 — Nem concordo nem discordo' },
  { value: '4', label: '4 — Concordo' },
  { value: '5', label: '5 — Concordo totalmente' },
  { value: 'na', label: 'Não avaliei' },
] as const;

export type FeedbackQuestionId = typeof pblFeedbackQuestions[number]['id'];
export type FeedbackValue = typeof feedbackScale[number]['value'];
export type FeedbackAnswers = Partial<Record<FeedbackQuestionId, FeedbackValue>>;
export type FeedbackExport = {
  instrumentVersion: string;
  answers: { item: FeedbackQuestionId; answer: FeedbackValue }[];
};

const allowedValues = new Set<string>(feedbackScale.map(option => option.value));

export function isFeedbackValue(value: unknown): value is FeedbackValue {
  return typeof value === 'string' && allowedValues.has(value);
}

export function feedbackAnsweredCount(answers: FeedbackAnswers): number {
  return pblFeedbackQuestions.filter(question => isFeedbackValue(answers[question.id])).length;
}

/** Export only the fixed questionnaire fields; never pass through arbitrary metadata. */
export function buildFeedbackExport(answers: unknown, consented: boolean): FeedbackExport | null {
  if (!consented || !answers || typeof answers !== 'object' || Array.isArray(answers)) return null;
  const supplied = answers as Record<string, unknown>;
  const selected: FeedbackExport['answers'] = [];
  for (const question of pblFeedbackQuestions) {
    const value = Object.hasOwn(supplied, question.id) ? supplied[question.id] : undefined;
    if (!isFeedbackValue(value)) return null;
    selected.push({ item: question.id, answer: value });
  }
  return { instrumentVersion: FEEDBACK_INSTRUMENT_VERSION, answers: selected };
}

export function feedbackValueLabel(value: FeedbackValue): string {
  return feedbackScale.find(option => option.value === value)!.label;
}
