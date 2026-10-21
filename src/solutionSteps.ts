import type { Question } from './types';

const boilerplate = new Set([
  'Identificá primero la definición o regla que aplica.',
  'Separá el problema en pasos y revisá los casos extremos.',
  'Relacioná los datos con la regla del ejemplo resuelto.',
  'Separá los datos y escribí la primera transformación.',
  'Usá la ley correspondiente y comprobá cada paso.',
  'Pensá en el tema antes de completar la respuesta.',
]);

function clean(step: string) {
  return step.replace(/[.\s]+$/, '').trim();
}

export function solutionSteps(question: Pick<Question, 'explanation' | 'hints' | 'guidedSteps'>): string[] {
  if (question.guidedSteps?.length) {
    return question.guidedSteps.map(step => [step.rule, step.expression, step.hint].filter(Boolean).join(' · '));
  }
  const explanation = question.explanation.trim();
  const fromExplanation = explanation
    .split(/\s*(?:→|=>)\s*|(?<=\.)\s+/)
    .map(clean)
    .filter(step => step.length > 0);
  const hints = (question.hints || [])
    .map(hint => hint.trim())
    .filter(hint => hint && hint !== explanation && !boilerplate.has(hint) && !fromExplanation.includes(clean(hint)))
    .map(clean);
  const steps = [...hints, ...fromExplanation];
  return steps.length ? steps : [explanation];
}
