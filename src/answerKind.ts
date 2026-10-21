import type { Course, Question, QuestionType } from './types';
import type { KeyboardMode } from './Keyboard';

function haystack(question: Question): string {
  const answer = Array.isArray(question.answer) ? question.answer.join(' ') : question.answer;
  return `${question.tag} ${question.prompt} ${question.math ?? ''} ${answer}`;
}

/** El teclado sigue al problema. Lo último de Discreta no usa el pad de contar. */
function specializedMode(question: Question, course: Course): KeyboardMode | null {
  const text = haystack(question);
  if (course === 'discreta' && question.type === 'text' && /potencia|producto cartesiano|cardinalidad|\||×|P\(/i.test(text)) return 'cardinality';
  if (course === 'discreta' && (question.type === 'logic' || question.type === 'text') && /cuantific|predicado|universal y existencial|anidado/i.test(text)) return 'quantifier';
  if (course === 'precalculo' && (question.type === 'algebra' || question.type === 'text')) {
    if (/inecuac/i.test(text)) return 'inequality';
    if (/radical|racionalizaci|valor absoluto|\\sqrt|∛/i.test(text)) return 'radical';
  }
  return null;
}

const precalcNotebook = ['x', 'y', '√()', '^2', '^3', '^()', '()/()', '(', ')', '+', '−', '×', '=', '≠', '±', '≤', '≥', '∈', 'ℝ'];
const discreteNotebook = ['P', 'Q', 'R', '¬', '∧', '∨', '→', '↔', '∀', '∃', '∄', '∈', '∉', '⊆', '∪', '∩', '−', '×', '△', '∅', '(', ')', '{', '}', '∴'];

/** Figuras del cuaderno de pasos, según la sección que se está viendo. */
export function notebookSymbols(course: Course, topic: string): string[] {
  const text = topic.toLowerCase();
  if (course === 'discreta') {
    if (/potencia|producto|cardinal/.test(text)) return ['|', 'P', '×', '2^', '∪', '∩', '−', '⊆', '∈', 'ℕ', '∅', '{', '}', ',', '(', ')'];
    if (/venn|conjunto|ley|inclusi/.test(text)) return ['A', 'B', 'C', '∪', '∩', '−', 'ᶜ', '⊆', '∈', '|', '∅', 'Ω', '{', '}', '(', ')'];
    if (/cuantific|predicado|universal|existencial/.test(text)) return ['∀', '∃', '¬', '∧', '∨', '→', '↔', '∈', '∉', 'ℕ', 'ℤ', 'ℝ', 'P', 'x', '(', ')'];
    return discreteNotebook;
  }
  if (/inecuac/.test(text)) return ['x', 'y', '≤', '≥', '<', '>', '∞', '∪', '∅', '[', ']', '(', ')', '+', '−', '=', '≠'];
  if (/radical|racionalizaci|valor absoluto/.test(text)) return ['x', '√()', '∛()', '|', '^2', '^3', '(', ')', '+', '−', '=', '≠'];
  return precalcNotebook;
}

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
  const specialized = specializedMode(question, course);
  if (specialized) return specialized;
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
