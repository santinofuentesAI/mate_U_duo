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
    if (/relacion|gr[aá]fico|composici/.test(text)) return ['(', ')', ',', '∪', '∩', '−', '×', '∘', '{', '}', '∈', 'A', 'B'];
    if (/potencia|producto|cardinal/.test(text)) return ['|', 'P', '×', '2^', '∪', '∩', '−', '⊆', '∈', 'ℕ', '∅', '{', '}', ',', '(', ')'];
    if (/venn|conjunto|ley|inclusi/.test(text)) return ['A', 'B', 'C', '∪', '∩', '−', 'ᶜ', '⊆', '∈', '|', '∅', 'Ω', '{', '}', '(', ')'];
    if (/cuantific|predicado|universal|existencial/.test(text)) return ['∀', '∃', '¬', '∧', '∨', '→', '↔', '∈', '∉', 'ℕ', 'ℤ', 'ℝ', 'P', 'x', '(', ')'];
    return discreteNotebook;
  }
  if (/funci[oó]n de variable|dominio m[aá]ximo|lectura de gr[aá]ficas|trozos/.test(text)) return ['x', 'f()', '√()', '(', ')', '[', ']', '∪', '∞', 'ℝ', '≠', '≤', '≥', '+', '−', '/'];
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

function isPlainNumber(answer: string | string[]): boolean {
  if (Array.isArray(answer)) return false;
  return /^-?\d+(?:\/\d+)?$/.test(answer.trim().replace('−', '-'));
}

/** Qué hay que anotar, sin revelar el resultado. */
export function answerCue(question: Question): string {
  const type = question.type;
  switch (type) {
    case 'choice':
      return 'Tocá una opción. No escribas nada: la opción tocada es la respuesta.';
    case 'text':
      if (isPlainNumber(question.answer) && String(question.answer).includes('/')) return 'Escribí solo el número, en forma a/b si es fracción. No escribas el intervalo ni una frase.';
      if (usesNumberPad(question.answer) || isPlainNumber(question.answer)) return 'Escribí solo el número. Sin lista, sin intervalo y sin explicación.';
      return 'Escribí solo lo que pide el enunciado, en la casilla. No agregues una explicación al lado.';
    case 'algebra':
      return 'Escribí la expresión con el teclado. La última línea es la que se corrige.';
    case 'logic':
      return 'Armá la fórmula con los símbolos. La última línea es la respuesta.';
    case 'set':
      if (/c[oó]digo|regi[oó]n/i.test(question.prompt)) return 'Tocá los códigos de las regiones que cumplen. El primer dígito es A, el segundo B y el tercero C: 1 es adentro y 0 es afuera.';
      return 'Tocá cada elemento que entra. Si no tocás ninguno, la respuesta es el conjunto vacío.';
    case 'venn':
      return 'Tocá las regiones. Cada código es A, B y C: 1 significa adentro y 0 afuera.';
    case 'table':
      return 'Completá V o F, en el mismo orden de las filas.';
    case 'synthetic':
      return 'Completá la fila de coeficientes. El último número es el resto.';
    case 'order':
      return 'Tocá los pasos en el orden en que se hacen.';
    case 'guidedproof':
      return 'Escribí cada línea y elegí la regla que la justifica.';
    case 'examproof':
      return 'Escribí la traducción o la línea nueva, y marcá la regla.';
    default: {
      const never: never = type;
      return never;
    }
  }
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
