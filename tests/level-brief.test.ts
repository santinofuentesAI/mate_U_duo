import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lessons } from '../src/content.ts';
import { levelBrief } from '../src/levelBrief.ts';
import { referenceFor } from '../src/courseTables.ts';

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
