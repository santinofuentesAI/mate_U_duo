import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lessons } from '../src/content';
import { bank } from '../src/learning';
import { grade } from '../src/engine';
import { clampDrillCount, drillsFor, topicPractice, topicTitle } from '../src/topicDrills';

test('each course lists skill drills and fills the chosen count with unique graded items', () => {
  assert.deepEqual(drillsFor('precalculo').map(item => item.id), ['simplify', 'factor', 'synthetic', 'equations', 'inequalities', 'powers', 'notables', 'rationalize']);
  assert.deepEqual(drillsFor('discreta').map(item => item.id), ['tables', 'equivalences', 'sets', 'cardinality', 'connectives', 'implication', 'inference', 'quantifiers', 'venn']);
  assert.equal(clampDrillCount(0), 1);
  assert.equal(clampDrillCount(99), 40);
  for (const course of ['precalculo', 'discreta'] as const) {
    const catalog = bank(lessons, course);
    const path = lessons.filter(lesson => lesson.course === course);
    for (const drill of drillsFor(course)) {
      const items = topicPractice(course, drill.id, 30, `seed-${course}-${drill.id}`, catalog, path);
      assert.equal(items.length, 30, drill.id);
      assert.equal(new Set(items.map(item => item.question.id)).size, 30, drill.id);
      assert.equal(new Set(items.map(item => item.question.prompt)).size, 30, drill.id);
      assert.ok(items.every(item => item.lesson.course === course), drill.id);
      assert.equal(topicTitle(drill.id, 10), `${drill.label} · 10`);
      for (const { question } of items) {
        if (question.type !== 'choice' || !question.options) continue;
        assert.ok(question.options.includes(String(question.answer)), question.prompt);
        assert.equal(new Set(question.options).size, question.options.length, question.prompt);
      }
      const again = topicPractice(course, drill.id, 30, `seed-${course}-${drill.id}`, catalog, path);
      assert.deepEqual(again.map(item => item.question.prompt), items.map(item => item.question.prompt));
      for (const { question } of items) {
        assert.equal(grade(question, question.answer, question.exclusions).correct, true, `${drill.id} ${question.id}: ${question.prompt}`);
      }
    }
  }
});

test('topic practice stays on the chosen skill', () => {
  const catalog = bank(lessons, 'precalculo');
  const path = lessons.filter(lesson => lesson.course === 'precalculo');
  const syntheticItems = topicPractice('precalculo', 'synthetic', 12, 'synth-seed', catalog, path);
  assert.ok(syntheticItems.every(item => item.question.type === 'choice' && item.question.options && item.question.options.length >= 2));
  const factorItems = topicPractice('precalculo', 'factor', 12, 'factor-seed', catalog, path);
  assert.ok(factorItems.every(item => item.question.requiredForm === 'factored' || /^Factorizá/i.test(item.question.prompt)));
  const inequalityItems = topicPractice('precalculo', 'inequalities', 12, 'ineq-seed', catalog, path);
  assert.ok(inequalityItems.every(item => /inecuaci|¿Cuál es S para|[<>≤≥]/.test(`${item.question.prompt} ${item.lesson.title}`)));
  assert.throws(() => topicPractice('discreta', 'synthetic', 10, 'bad', catalog, path));
});
