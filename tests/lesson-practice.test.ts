import test from 'node:test';
import assert from 'node:assert/strict';
import { lessons } from '../src/content';
import { grade } from '../src/engine';

test('all 47 lessons offer ten distinct exercises ordered by difficulty', () => {
  assert.equal(lessons.length, 47);
  assert.equal(lessons.reduce((sum, lesson) => sum + lesson.questions.length, 0), 470);
  const ids = new Set<string>();
  for (const lesson of lessons) {
    assert.equal(lesson.questions.length, 10, lesson.title);
    assert.deepEqual(lesson.questions.map(q => q.difficulty), [...lesson.questions.map(q => q.difficulty)].sort(), lesson.title);
    assert.equal(lesson.questions.filter(q => q.difficulty === 3).length, 2, lesson.title);
    assert.equal(new Set(lesson.questions.map(q => q.prompt)).size, 10, lesson.title);
    for (const q of lesson.questions) {
      assert.ok(!ids.has(q.id), q.id); ids.add(q.id);
      if (q.type === 'choice') {
        assert.ok(q.options?.includes(String(q.answer)), q.id);
        assert.equal(new Set(q.options).size, q.options?.length, q.id);
      }
      assert.equal(grade(q, q.answer, q.exclusions).correct, true, q.id);
    }
  }
});

test('written arithmetic and factorizations accept equivalent answers but enforce a product', () => {
  const fractions = lessons.find(l => l.title === 'Fracciones numéricas')!;
  assert.equal(grade(fractions.questions.find(q => q.prompt.includes('1/3 + 1/3'))!, '4/6').correct, true);
  const factor = lessons.find(l => l.title === 'Factor común y agrupación')!.questions.find(q => q.prompt === 'Factorizá 3x+6.')!;
  assert.equal(grade(factor, '3*(x+2)').correct, true);
  assert.equal(grade(factor, '3x+6').correct, false);
  const radical = lessons.find(l => l.title === 'Ecuaciones con radicales')!.questions.find(q => q.prompt === 'Resolvé √(x+1)=x−1. Escribí x.')!;
  assert.equal(grade(radical, '3').correct, true);
  assert.equal(grade(radical, '0').correct, false);
});
