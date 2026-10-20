import test from 'node:test';
import assert from 'node:assert/strict';
import { threeSetTotals, twoSetTotals } from '../src/vennCount';

test('two-set scratch totals match inclusion-exclusion regions', () => {
  const totals = twoSetTotals({ onlyA: '25', onlyB: '15', both: '25', out: '35' });
  assert.equal(totals.a, 50);
  assert.equal(totals.b, 40);
  assert.equal(totals.union, 65);
  assert.equal(totals.total, 100);
});

test('three-set scratch totals use lunas, not the printed pair cardinals', () => {
  const totals = threeSetTotals({
    onlyA: '28',
    onlyB: '20',
    onlyC: '20',
    ab: '7',
    ac: '2',
    bc: '5',
    abc: '3',
    out: '0',
  });
  assert.equal(totals.a, 40);
  assert.equal(totals.b, 35);
  assert.equal(totals.c, 30);
  assert.equal(totals.union, 85);
});
