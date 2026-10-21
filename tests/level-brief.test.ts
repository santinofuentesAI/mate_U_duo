import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lessons } from '../src/content.ts';
import { levelBrief } from '../src/levelBrief.ts';
import { referenceFor } from '../src/courseTables.ts';
import { workedExample } from '../src/workedExamples.ts';
import { answerCue } from '../src/answerKind.ts';

test('every level explains what it is before the procedure', () => {
  for (const lesson of lessons) {
    const brief = levelBrief(lesson.title);
    assert.equal(brief.length, 2, lesson.title);
    assert.ok(brief[0].length > 80, lesson.title);
    assert.ok(brief[1].length > 80, lesson.title);
  }
});

test('the side reference follows the level, not the whole course', () => {
  const power = referenceFor('discreta', 'Conjunto potencia y producto');
  assert.deepEqual(power.logicIds, []);
  assert.ok(power.notes.some(note => note.name === 'Conjunto potencia'));
  assert.ok(power.notes.some(note => note.name === 'Vacío'));
  assert.equal(power.about.length, 2);

  const venn = referenceFor('discreta', 'Diagramas de Venn');
  assert.ok(venn.notes.some(note => note.name === 'Inclusión-exclusión'));
  assert.equal(venn.logicIds.length, 0);

  const logic = referenceFor('discreta', 'Tablas de verdad');
  assert.ok(logic.logicIds.includes('imp'));
  assert.equal(logic.notes.length, 0);

  const inequalities = referenceFor('precalculo', 'Inecuaciones racionales');
  assert.deepEqual(inequalities.algebraIds, ['equations']);
  assert.ok(inequalities.notes.some(note => note.name === 'Abierto'));
  assert.ok(!inequalities.algebraIds.includes('powers'));
});

test('every level shows a worked answer before the exercises', () => {
  for (const lesson of lessons) {
    const sample = workedExample(lesson.title);
    assert.ok(sample.length > 40, lesson.title);
    assert.match(sample, /escrib|toc[aá]/iu, lesson.title);
  }
  const power = lessons.find(lesson => lesson.title === 'Conjunto potencia y producto');
  const cardinal = lessons.find(lesson => lesson.title === 'Cardinalidad y conteo');
  const linear = lessons.find(lesson => lesson.title === 'Inecuaciones lineales');
  assert.ok(power && cardinal && linear);
  for (const lesson of [power, cardinal]) {
    const challenges = lesson.questions.slice(-2);
    for (const question of challenges) {
      assert.match(question.prompt, /solo el número/i, question.prompt);
      assert.match(answerCue(question), /solo el número/i);
    }
  }
  assert.match(levelBrief('Conjunto potencia y producto')[0], /subconjuntos/);
  assert.match(power.questions[0].prompt, /subconjuntos/);
  assert.match(power.questions[0].prompt, /solo el número/i);
  const endpoint = linear.questions.find(question => question.answer === '-1/2');
  assert.ok(endpoint);
  assert.match(endpoint.prompt, /solo ese número/i);
  assert.match(answerCue(endpoint), /fracción/i);
});
