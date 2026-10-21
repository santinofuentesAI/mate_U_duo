import { test } from 'node:test';
import assert from 'node:assert/strict';
import { INTRO_KEY, introPending, markIntroSeen } from '../src/progress';

test('the introduction shows once, until the student enters', () => {
  const store = new Map<string, string>();
  const memory = {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => { store.set(key, value); },
    removeItem: (key: string) => { store.delete(key); },
  };
  const previous = globalThis.localStorage;
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: memory });
  try {
    assert.equal(introPending(), true);
    markIntroSeen();
    assert.equal(store.get(INTRO_KEY), '1');
    assert.equal(introPending(), false);
  } finally {
    Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: previous });
  }
});
