import assert from 'node:assert/strict';
import test from 'node:test';
import { solutionSteps } from '../src/solutionSteps.ts';
import { logicTables, tableFamilies } from '../src/courseTables.ts';
import { truthRows } from '../src/engine.ts';

test('splits an explanation into ordered steps and keeps a specific hint', () => {
  const steps = solutionSteps({
    explanation: 'Q → R es ¬Q ∨ R. Entonces ¬P ∨ ¬Q ∨ R, que es lo mismo que ¬(P ∧ Q) ∨ R.',
    hints: ['Reescribí la implicación como disyunción.', 'Q → R es ¬Q ∨ R. Entonces ¬P ∨ ¬Q ∨ R, que es lo mismo que ¬(P ∧ Q) ∨ R.'],
  });
  assert.equal(steps[0], 'Reescribí la implicación como disyunción');
  assert.ok(steps.some(step => step.includes('¬Q ∨ R')));
  assert.equal(steps.filter(step => step.includes('¬(P ∧ Q)')).length, 1);
});

test('uses the guided line instead of a generic hint', () => {
  const steps = solutionSteps({
    explanation: 'Listo.',
    hints: ['Identificá primero la definición o regla que aplica.'],
    guidedSteps: [{ expression: '¬R', rule: 'Modus tollens', hint: 'Negá el consecuente.' }],
  });
  assert.deepEqual(steps, ['Modus tollens · ¬R · Negá el consecuente.']);
});

test('each course table can be consulted', () => {
  assert.deepEqual(tableFamilies('discreta').map(item => item.id), logicTables.map(item => item.id));
  assert.ok(tableFamilies('precalculo').some(item => item.id === 'factors'));
  for (const table of logicTables) {
    const rows = truthRows(table.expr, table.variables);
    assert.equal(rows.length, 2 ** table.variables.length);
  }
});
