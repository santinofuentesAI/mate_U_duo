import test from 'node:test';
import assert from 'node:assert/strict';
import type { Course, Question } from '../src/types';
import { lessons } from '../src/content';
import { bookExercises } from '../src/bookExercises';
import { caseExercises } from '../src/caseStudies';
import { generateExam } from '../src/exam';
import { bank } from '../src/learning';
import { drillsFor, topicPractice } from '../src/topicDrills';
import { inputModeFor } from '../src/answerKind';
import { typeableGlyphs } from '../src/Keyboard';
import { grade, normalize, truthRows } from '../src/engine';

const VENN = ['000', '100', '010', '001', '110', '101', '011', '111'];

function elements(value: string | string[]): string[] {
  const raw = Array.isArray(value) ? value : value.replace(/[{}]/g, '').split(/[;,]/);
  return [...new Set(raw.map(part => normalize(part)).filter(Boolean))].sort();
}

function missingGlyphs(question: Question, course: Course): string[] {
  const available = new Set(typeableGlyphs(inputModeFor(question, course)));
  let text = Array.isArray(question.answer) ? question.answer.join('') : question.answer;
  if (question.type === 'logic') text = text.replace(/\s/g, '').toUpperCase();
  else if (question.type === 'algebra') text = text.replace(/\s/g, '').replace(/[−–-]/g, '−').replace(/[×·]/g, '*').replace(/÷/g, '/');
  else text = text.replace(/[−–-]/g, '−').replace(/\s+/g, ' ').trim();
  const missing: string[] = [];
  for (const ch of text) if (!available.has(ch) && !missing.includes(ch)) missing.push(ch === ' ' ? 'SPACE' : ch);
  return missing;
}

function solvable(label: string, question: Question, course: Course, problems: string[]) {
  const type = question.type;
  try {
    switch (type) {
      case 'choice': {
        if (!question.options?.includes(String(question.answer))) problems.push(`${label} la opción correcta no está entre los botones`);
        if (!grade(question, question.answer).correct) problems.push(`${label} la opción no se corrige como buena`);
        return;
      }
      case 'set': {
        const wanted = elements(question.answer);
        const universe = question.universe ?? [];
        const missing = wanted.filter(part => !universe.some(item => normalize(item) === part));
        if (missing.length) problems.push(`${label} faltan botones del conjunto: ${missing.join(', ')}`);
        const picked = universe.filter(item => wanted.includes(normalize(item)));
        if (!grade(question, picked).correct) problems.push(`${label} la selección no se corrige como buena`);
        return;
      }
      case 'venn': {
        const wanted = elements(question.answer);
        const missing = wanted.filter(code => !VENN.includes(code));
        if (missing.length) problems.push(`${label} el diagrama no tiene ${missing.join(', ')}`);
        if (!grade(question, wanted).correct) problems.push(`${label} las regiones no se corrigen como buenas`);
        return;
      }
      case 'order': {
        const options = [...(question.options ?? [])];
        const answer = Array.isArray(question.answer) ? question.answer : [];
        const used: string[] = [];
        for (const step of answer) {
          const index = options.findIndex(option => normalize(option) === normalize(step));
          if (index < 0) {
            problems.push(`${label} el paso no se puede tocar: ${step}`);
            return;
          }
          used.push(options.splice(index, 1)[0]);
        }
        if (options.length) problems.push(`${label} sobran pasos que no entran en la respuesta`);
        if (!grade(question, used).correct) problems.push(`${label} el orden no se corrige como bueno`);
        return;
      }
      case 'table': {
        const answer = question.answer;
        if (!Array.isArray(answer) || !question.expression || !question.variables) {
          problems.push(`${label} la tabla no tiene filas para completar`);
          return;
        }
        const rows = truthRows(question.expression, question.variables);
        if (rows.length !== answer.length) problems.push(`${label} la tabla tiene ${rows.length} filas y la respuesta ${answer.length}`);
        if (answer.some(cell => !['v', 'f'].includes(normalize(cell)))) problems.push(`${label} hay una casilla que no es V o F`);
        if (!grade(question, answer).correct) problems.push(`${label} la tabla no se corrige como buena`);
        return;
      }
      case 'synthetic': {
        if (!question.coefficients || question.root === undefined || !Array.isArray(question.answer)) problems.push(`${label} la división sintética no tiene casillas`);
        else if (!grade(question, question.answer).correct) problems.push(`${label} la fila no se corrige como buena`);
        return;
      }
      case 'guidedproof':
      case 'examproof': {
        const lines = (question.guidedSteps ?? []).map(step => step.expression);
        if (type === 'examproof') lines.unshift(question.translation ?? '');
        const available = new Set(typeableGlyphs('logic'));
        for (const line of lines) {
          const text = line.replace(/\s/g, '').toUpperCase();
          const missing = [...new Set([...text].filter(ch => !available.has(ch)))];
          if (missing.length) problems.push(`${label} el teclado lógico no tiene ${missing.join(' ')} para ${line}`);
        }
        for (const step of question.guidedSteps ?? []) {
          if (!question.options?.includes(step.rule)) problems.push(`${label} la regla ${step.rule} no es un botón`);
        }
        return;
      }
      case 'text':
      case 'logic':
      case 'algebra': {
        const missing = missingGlyphs(question, course);
        if (missing.length) problems.push(`${label} el ${inputModeFor(question, course)} no tiene ${missing.join(' ')} para ${Array.isArray(question.answer) ? question.answer.join(',') : question.answer}`);
        if (!grade(question, question.answer, question.exclusions ?? []).correct) problems.push(`${label} la respuesta clave no se corrige como buena`);
        return;
      }
      default: {
        const never: never = type;
        problems.push(`${label} tipo sin control ${never}`);
      }
    }
  } catch (error) {
    problems.push(`${label} falló: ${error instanceof Error ? error.message : 'error'}`);
  }
}

function collect(): string[] {
  const problems: string[] = [];
  for (const lesson of lessons) {
    for (const question of lesson.questions) solvable(`Nivel ${lesson.title} · ${question.id}`, question, lesson.course, problems);
  }
  for (const exercise of bookExercises) solvable(`Libro ${exercise.question.id}`, exercise.question, exercise.course, problems);
  for (const exercise of caseExercises) solvable(`Caso ${exercise.question.id}`, exercise.question, exercise.course, problems);
  for (const course of ['discreta', 'precalculo'] as const) {
    const path = lessons.filter(lesson => lesson.course === course);
    const units = [...new Set(path.map(lesson => lesson.unit))];
    for (const version of [1, 2] as const) {
      for (const item of generateExam(course, units, `cobertura-${course}-${version}`, lessons, 35, version)) {
        solvable(`Examen ${item.question.id}`, item.question, course, problems);
      }
    }
    const catalog = bank(lessons, course);
    for (const drill of drillsFor(course)) {
      for (const item of topicPractice(course, drill.id, 12, `cobertura-${drill.id}`, catalog, path)) {
        solvable(`Práctica ${drill.id} · ${item.question.id}`, item.question, course, problems);
      }
    }
  }
  return problems;
}

test('cada ejercicio se puede completar con los botones o el teclado de ese ejercicio', () => {
  const problems = collect();
  assert.deepEqual(problems, []);
});
