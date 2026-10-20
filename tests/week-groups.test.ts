import test from 'node:test';
import assert from 'node:assert/strict';
import { lessons } from '../src/content';
import { weekGroups, weekHeading, weekNumber } from '../src/weekGroups';

test('each lesson unit is one week in Aprender and Biblioteca', () => {
  for (const course of ['discreta', 'precalculo'] as const) {
    const path = lessons.filter(lesson => lesson.course === course);
    const units = [...new Set(path.map(lesson => lesson.unit))];
    const groups = weekGroups(course);
    assert.equal(groups.length, units.length, course);
    assert.deepEqual(groups.map(group => group.unit).sort(), [...units].sort());
    for (const [index, unit] of units.entries()) {
      assert.match(weekHeading(unit, index), /^Semana \d+ · /);
      assert.equal(weekNumber(unit, index), Number(unit.match(/(\d+)/)?.[1] || index + 1));
    }
    assert.ok(groups.every(group => group.lessons.length > 0));
  }
  assert.equal(weekHeading('S1 · Lógica proposicional'), 'Semana 1 · Lógica proposicional');
  assert.equal(weekHeading('B1 · Números reales'), 'Semana 1 · Números reales');
});
