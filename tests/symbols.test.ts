import { test } from 'node:test';
import assert from 'node:assert/strict';
import katex from 'katex';
import { allSymbols, symbolGroups } from '../src/symbols';

test('each course has unique symbol ids and formulas that render', () => {
  for (const course of ['discreta', 'precalculo'] as const) {
    const items = allSymbols(course);
    assert.ok(items.length >= 8, course);
    assert.equal(new Set(items.map(item => item.id)).size, items.length);
    for (const item of items) {
      const html = katex.renderToString(item.latex, { throwOnError: true, strict: false, displayMode: true });
      assert.ok(html.includes('katex'));
      assert.ok(item.name && item.meaning);
    }
    assert.ok(symbolGroups(course).every(group => group.items.length > 0));
  }
  assert.ok(allSymbols('discreta').some(item => item.meaning.includes('ℕ')));
});
