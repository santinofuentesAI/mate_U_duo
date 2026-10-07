import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bookExercises } from '../src/bookExercises';
import { bank } from '../src/learning';
import { lessons } from '../src/content';
import { bookCatalog, responseStatus, reviewedActivities } from '../src/bookCatalog';
import { freshProgress } from '../src/progress';
import { canCheckFinal, checkBookFinal, checkFinal, splitTopLevel } from '../src/bookVerification';

const question = (id: string) => bookExercises.find(e => e.question.id === id)!.question;

test('book final verifier accepts equivalent mathematical answers and rejects wrong ones', () => {
  assert.ok(checkFinal(question('precalculo-libro-18-1b'), 'F').correct);
  assert.equal(checkFinal(question('precalculo-libro-18-1b'), 'V').correct, false);
  assert.ok(checkFinal(question('precalculo-libro-18-3c'), '(4/5)^8').correct);
  assert.equal(checkFinal(question('precalculo-libro-18-3c'), '(4/5)^7').correct, false);
  assert.ok(checkFinal(question('precalculo-libro-33-2a'), '-5x²-2x-5').correct);
  assert.ok(checkFinal(question('precalculo-libro-33-1a'), 'Binomio de grado 2').correct);
  assert.ok(checkFinal(question('precalculo-libro-42-1e'), '(2-y)(y^2+2y+4)').correct);
  assert.equal(checkFinal(question('precalculo-libro-42-1e'), '8-y^3').correct, false);
  assert.ok(checkFinal(question('precalculo-libro-19-6p'), '2/120').correct);
  assert.equal(checkFinal(question('precalculo-libro-19-6p'), '60').correct, false);
  assert.equal(checkFinal(question('precalculo-libro-19-6a'), '20x/x').correct, false);
  assert.equal(checkFinal(question('precalculo-libro-33-2a'), '(-5x^2-2x-5)*(x-1)/(x-1)').correct, false);
  assert.ok(checkFinal(question('discreta-libro-63-4'), '1').correct);
  assert.equal(checkFinal(question('discreta-libro-63-4'), '0').correct, false);
});

test('sets retain ordered pairs and nested subsets; tables require all rows', () => {
  assert.deepEqual(splitTopLevel('{(a,d), (b,d), (c,d)}'), ['(a,d)', '(b,d)', '(c,d)']);
  assert.deepEqual(splitTopLevel('{∅, {a}, {b}, {a,b}}'), ['∅', '{a}', '{b}', '{a,b}']);
  assert.ok(checkFinal(question('discreta-libro-123-1a'), '{(c,d), (a,d), (b,d)}').correct);
  assert.ok(checkFinal(question('discreta-libro-123-1b'), '{∅, {a}, {b}, {a,b}}').correct);
  assert.ok(checkFinal(question('discreta-libro-123-2-corregido'), '{a,e,f}').correct);
  assert.equal(checkFinal(question('discreta-libro-123-2-corregido'), '{a,d,e,f}').correct, false);
  assert.equal(checkFinal(question('discreta-libro-123-1b'), '{∅,{a},{b}}').correct, false);
  assert.ok(checkFinal(question('discreta-libro-56-2c-tabla'), 'V, V, F, V').correct);
  assert.equal(checkFinal(question('discreta-libro-56-2c-tabla'), 'V, V, V, V').correct, false);
  assert.match(checkFinal(question('discreta-libro-56-2c-tabla'), 'V,F').error!, /4 valores/);
});

test('a book problem with classification and truth table needs both answers', () => {
  const items = bank(lessons, 'discreta');
  const problem = bookCatalog.discreta.find(x => x.id === 'discreta-55-2c')!;
  const reviewed = reviewedActivities(problem, items);
  assert.equal(reviewed.length, 2);
  const correct = { [reviewed[0].question.id]: 'Contingencia', [reviewed[1].question.id]: 'V,V,F,V' };
  assert.ok(checkBookFinal(reviewed, correct).every(x => x.result.correct));
  assert.equal(checkBookFinal(reviewed, { ...correct, [reviewed[1].question.id]: 'V,V,V,V' }).every(x => x.result.correct), false);
  const progress = freshProgress();
  progress.attempts = [{ questionId: reviewed[0].question.id, lessonId: reviewed[0].lesson.id, correct: true, assisted: false, date: new Date().toISOString() }];
  assert.equal(responseStatus(problem, items, progress, true), 'submitted');
  assert.equal(canCheckFinal(question('discreta-libro-73-1a')), false);
});
