import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { Question } from '../src/types';
import { inputModeFor, usesNumberPad } from '../src/answerKind';

function question(partial: Partial<Question> & Pick<Question, 'type' | 'answer'>): Question {
  return {
    id: 'q',
    prompt: '',
    explanation: '',
    hints: [],
    tag: '',
    difficulty: 1,
    ...partial,
  };
}

test('number pad is only for counting integers, never fractions or algebra', () => {
  assert.equal(usesNumberPad('33'), true);
  assert.equal(usesNumberPad('256,16,2'), true);
  assert.equal(usesNumberPad('5,6'), true);
  assert.equal(usesNumberPad('2/120'), false);
  assert.equal(usesNumberPad('1/8'), false);
  assert.equal(usesNumberPad('(4/5)^8'), false);
  assert.equal(usesNumberPad('P∨Q'), false);
  assert.equal(usesNumberPad(['1', '2']), false);
});

test('Precálculo always gets the algebra pad, including fractions and factoring', () => {
  assert.equal(inputModeFor(question({ type: 'text', answer: '2/120' }), 'precalculo'), 'algebra');
  assert.equal(inputModeFor(question({ type: 'text', answer: '12' }), 'precalculo'), 'algebra');
  assert.equal(inputModeFor(question({ type: 'algebra', answer: '(x-2)*(x^2+2x+4)' }), 'precalculo'), 'algebra');
  assert.equal(inputModeFor(question({ type: 'algebra', answer: '1/8' }), 'precalculo'), 'algebra');
});

test('Discreta picks logic, sets or a count pad from the question kind', () => {
  assert.equal(inputModeFor(question({ type: 'logic', answer: 'P∧¬Q' }), 'discreta'), 'logic');
  assert.equal(inputModeFor(question({ type: 'text', answer: 'P∨Q' }), 'discreta'), 'logic');
  assert.equal(inputModeFor(question({ type: 'text', answer: '33' }), 'discreta'), 'number');
  assert.equal(inputModeFor(question({ type: 'text', answer: '256,16,2' }), 'discreta'), 'number');
  assert.equal(inputModeFor(question({ type: 'set', answer: ['1', '2'] }), 'discreta'), 'sets');
  assert.equal(inputModeFor(question({ type: 'text', answer: '{a,b}' }), 'discreta'), 'sets');
  assert.equal(inputModeFor(question({ type: 'venn', answer: ['100', '101'] }), 'discreta'), 'number');
});
