import test from 'node:test';
import assert from 'node:assert/strict';
import { lessons } from '../src/content';
import { bookExercises } from '../src/bookExercises';
import { extraBookExercises, solutionOrigins } from '../src/extraBookExercises';
import { equivalentAlgebra, grade, isFactored, isLinearFactorization } from '../src/engine';
import { lessonPassed } from '../src/learning';
import { bookCatalog } from '../src/bookCatalog';
import { bookProblemsForLesson, missingCourseWeeks, nextStudyProblem, studyTour } from '../src/bookStudy';

test('a sum written with explicit products is not treated as a factorization', () => {
  assert.equal(isFactored('-5*x^2-2*x-5'), false);
  assert.equal(isFactored('3*x+6'), false);
  assert.equal(isFactored('(x+3)*(x+5)'), true);
  assert.equal(isFactored('3*(x+2)'), true);
  assert.equal(equivalentAlgebra('(x+y)^2-(x-y)^2', '4*x*y'), true);
});

test('a level needs mostly unaided first answers, and new book keys match the original expression', () => {
  assert.equal(lessonPassed(6, 10), false);
  assert.equal(lessonPassed(7, 10), true);
  assert.equal(lessonPassed(0, 0), false);
  assert.ok(extraBookExercises.length >= 30);
  for (const [id, origin] of Object.entries(solutionOrigins)) {
    const question = bookExercises.find(item => item.question.id === id)!.question;
    assert.equal(equivalentAlgebra(String(question.answer), origin), true, id);
    assert.equal(grade(question, question.answer, question.exclusions).correct, true, id);
    if (question.requiredForm === 'factored' || question.requiredForm === 'linearFactors') {
      assert.equal(isFactored(String(question.answer)), true, id);
      assert.equal(isFactored(origin), false, id);
    }
    if (question.requiredForm === 'linearFactors') assert.equal(isLinearFactorization(String(question.answer)), true, id);
    if (question.requiredForm === 'expanded') assert.equal(/[()]/.test(String(question.answer)), false, id);
  }
  const arithmetic = extraBookExercises.find(item => item.question.id.includes('6l'))!.question;
  assert.equal(grade(arithmetic, '-18').correct, true);
  assert.equal(3 * 2 + 2 * 18 - 5 * 12, -18);
  assert.equal(Math.pow(256, 3), 16777216);
});

test('every catalog exercise is in the study tour once, and weeks 5 and 6 stay open for later material', () => {
  for (const course of ['precalculo', 'discreta'] as const) {
    const tour = studyTour(course);
    assert.equal(tour.length, bookCatalog[course].length);
    assert.equal(new Set(tour.map(problem => problem.id)).size, tour.length);
    assert.deepEqual(missingCourseWeeks(course), ['S5', 'S6']);
    const next = nextStudyProblem(tour, () => 'identified');
    assert.equal(next?.id, tour[0].id);
  }
  for (const lesson of lessons) {
    const problems = bookProblemsForLesson(lesson);
    assert.ok(problems.length > 0, lesson.title);
    assert.ok(problems.every(problem => problem.course === lesson.course), lesson.title);
  }
});
