import type { PracticeItem } from './learning';
import type { Question } from './types';
import { equivalentAlgebra, grade, hasVariableDenominator, normalize } from './engine';

export type FinalAnswers = Record<string, string>;
export type CheckResult = { correct: boolean; error?: string };

export function canCheckFinal(question: Question) {
  return ['choice', 'text', 'algebra', 'logic', 'set', 'venn', 'table', 'synthetic'].includes(question.type);
}

export function finalLabel(question: Question) {
  if (question.type === 'table') return 'Columna final de la tabla';
  if (question.type === 'venn') return 'Regiones del diagrama';
  if (question.type === 'set') return 'Conjunto solución';
  if (question.type === 'logic') return 'Expresión simplificada';
  if (question.answer === 'Verdadero' || question.answer === 'Falso') return 'Verdadero o falso';
  return 'Respuesta final';
}

export function finalExample(question: Question) {
  if (question.type === 'table') return 'V, F, V, F (una por fila, en orden)';
  if (question.type === 'venn') return '100, 101, 111';
  if (question.type === 'set') return '{a, b} o {∅, {a}, {b}, {a,b}}';
  if (question.type === 'logic') return 'P ∨ Q, 1 o 0';
  if (question.type === 'algebra') return '(x+2)(x-3)';
  if (question.type === 'text' && /^\d+$/.test(String(question.answer))) return 'Escribí solo el número';
  if (question.answer === 'Verdadero' || question.answer === 'Falso') return 'V o F';
  return 'Escribí tu resultado';
}

// Split sets only between top-level elements: {a,b} is one element of a power set.
export function splitTopLevel(input: string) {
  let value = input.trim();
  if (value.startsWith('{') && value.endsWith('}')) value = value.slice(1, -1);
  if (!value.trim()) return [];
  const result: string[] = []; let depth = 0; let start = 0;
  for (let i = 0; i < value.length; i++) {
    if ('{('.includes(value[i])) depth++;
    if ('})'.includes(value[i])) depth--;
    if (depth < 0) throw new Error('Revisá los paréntesis o llaves.');
    if (depth === 0 && /[,;\n]/.test(value[i])) { result.push(value.slice(start, i).trim()); start = i + 1; }
  }
  if (depth) throw new Error('Falta cerrar un paréntesis o una llave.');
  result.push(value.slice(start).trim());
  if (result.some(x => !x)) throw new Error('Hay un elemento vacío entre separadores.');
  return result;
}

function choiceAnswer(input: string, expected: string): CheckResult {
  const plain = normalize(input).replace(/[.,:·]/g, ' ').replace(/\s+/g, ' ').trim();
  const expectedPlain = normalize(expected).replace(/[.,:·]/g, ' ').replace(/\s+/g, ' ').trim();
  if (expectedPlain.includes('grado ')) {
    const degree = expectedPlain.match(/grado (\d+)/)?.[1];
    const kind = expectedPlain.match(/^(monomio|binomio|trinomio|polinomio)/)?.[1];
    const terms = expectedPlain.match(/(\d+) terminos/)?.[1];
    return { correct: !!degree && !!kind && new RegExp(`\\b${kind}\\b`).test(plain) && new RegExp(`\\bgrado (?:de )?${degree}\\b`).test(plain) && (!terms || new RegExp(`\\b${terms} terminos\\b`).test(plain)) };
  }
  const v = normalize(input).replace(/[.,:·]/g, '').replace(/\s+/g, '');
  const e = normalize(expected).replace(/[.,:·]/g, '').replace(/\s+/g, '');
  if (e === 'verdadero' || e === 'falso') return { correct: v === e || v === e[0] };
  const superscript: Record<string, string> = { '⁰':'0','¹':'1','²':'2','³':'3','⁴':'4','⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9' };
  const power = (s: string) => s.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, digits => '^' + [...digits].map(c => superscript[c]).join(''));
  return { correct: power(v) === power(e) };
}

export function checkFinal(question: Question, input: string): CheckResult {
  if (!canCheckFinal(question)) return { correct: false, error: 'Esta demostración se revisa en la práctica guiada.' };
  if (!input.trim()) return { correct: false, error: 'Escribí la respuesta final antes de comprobar.' };
  try {
    if (question.type === 'choice') return choiceAnswer(input, String(question.answer));
    if (question.type === 'text' && /^-?\d+(?:\/\d+)?$/.test(String(question.answer))) {
      if (!/^[\d\s()+\-−*/^.,÷×]+$/.test(input)) return { correct: false, error: 'Escribí un resultado numérico, sin variables ni unidades.' };
      return { correct: equivalentAlgebra(input, String(question.answer)) };
    }
    if (question.type === 'set' || question.type === 'venn') return grade(question, splitTopLevel(input));
    if (question.type === 'table' || question.type === 'synthetic') {
      const values = input.trim().split(/[;,\s]+/).filter(Boolean);
      const expected = question.answer as string[];
      if (values.length !== expected.length) return { correct: false, error: `Escribí ${expected.length} valores en el orden de las filas.` };
      return grade(question, values);
    }
    // Book algebra keys currently have no domain exclusions. Do not silently
    // accept an expression when its key requires additional restrictions.
    if (question.type === 'algebra' && question.exclusions?.length)
      return { correct: false, error: 'Este resultado requiere restricciones; resolvelo en la práctica guiada.' };
    const superscript: Record<string, string> = { '⁰':'0','¹':'1','²':'2','³':'3','⁴':'4','⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9' };
    const mathInput = question.type === 'algebra' ? input.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, digits => '^' + [...digits].map(c => superscript[c]).join('')) : input;
    if (question.type === 'algebra' && hasVariableDenominator(mathInput)) return { correct: false, error: 'La expresión cambia el dominio: no introduzcas una división por una variable o un polinomio.' };
    return grade(question, mathInput);
  } catch (error) { return { correct: false, error: error instanceof Error ? error.message : 'Revisá el formato.' }; }
}

export function checkBookFinal(items: PracticeItem[], answers: FinalAnswers) {
  const checkable = items.filter(item => canCheckFinal(item.question));
  return checkable.map(item => ({ item, result: checkFinal(item.question, answers[item.question.id] || '') }));
}

const answerKey = (id: string) => `mate-book-final-${id}`;
const checkKey = (id: string) => `mate-book-check-${id}`;
export function readFinalAnswers(id: string): FinalAnswers {
  try { const value = JSON.parse(localStorage.getItem(answerKey(id)) || '{}'); return value && typeof value === 'object' && !Array.isArray(value) ? value : {}; }
  catch { return {}; }
}
export function saveFinalAnswers(id: string, answers: FinalAnswers) { localStorage.setItem(answerKey(id), JSON.stringify(answers)); }
export function clearFinalCheck(id: string) { try { localStorage.removeItem(checkKey(id)); } catch { /* Preserve the draft if storage is full. */ } }
export function saveFinalCheck(id: string, items: PracticeItem[], answers: FinalAnswers) {
  localStorage.setItem(checkKey(id), JSON.stringify({ ids: items.filter(x => canCheckFinal(x.question)).map(x => x.question.id), answers }));
}
export function hasCheckedFinal(id: string, items: PracticeItem[]) {
  try {
    const record = JSON.parse(localStorage.getItem(checkKey(id)) || 'null');
    const ids = items.filter(x => canCheckFinal(x.question)).map(x => x.question.id);
    if (!ids.length || !record || JSON.stringify(record.ids) !== JSON.stringify(ids)) return false;
    const answers = readFinalAnswers(id);
    return ids.every((key: string) => record.answers?.[key] === answers[key] && checkFinal(items.find(x => x.question.id === key)!.question, answers[key] || '').correct);
  } catch { return false; }
}
export function hasWrittenFinal(id: string, items: PracticeItem[]) {
  const answers = readFinalAnswers(id);
  return items.some(x => canCheckFinal(x.question) && !!answers[x.question.id]?.trim());
}
