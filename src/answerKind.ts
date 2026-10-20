import type { Course, Question, QuestionType } from './types';
import type { KeyboardMode } from './Keyboard';

function looksLikeSetAnswer(answer: string | string[]): boolean {
  if (Array.isArray(answer)) return true;
  return /[{}∪∩∅⊆∈△ᶜ]/.test(answer);
}

/** Integers or comma-separated counts. Fractions like 2/120 are algebra, not a phone pad. */
export function usesNumberPad(answer: string | string[]): boolean {
  if (Array.isArray(answer)) return false;
  const value = answer.trim();
  if (!value || value.includes('/')) return false;
  return /^[\d\s,.\-−]+$/.test(value) && /\d/.test(value);
}

export function numericParts(value: string): string[] {
  return value.split(/[;,]/).map(part => part.trim()).filter(Boolean);
}

export function inputModeFor(question: Question, course: Course): KeyboardMode {
  const type: QuestionType = question.type;
  switch (type) {
    case 'logic':
    case 'guidedproof':
    case 'examproof':
      return 'logic';
    case 'set':
      return 'sets';
    case 'venn':
      return 'number';
    case 'algebra':
      return 'algebra';
    case 'synthetic':
      return 'number';
    case 'choice':
    case 'order':
    case 'table':
      return course === 'precalculo' ? 'algebra' : 'logic';
    case 'text':
      if (course === 'precalculo') return 'algebra';
      if (usesNumberPad(question.answer)) return 'number';
      if (looksLikeSetAnswer(question.answer)) return 'sets';
      return 'logic';
    default: {
      const never: never = type;
      return never;
    }
  }
}
