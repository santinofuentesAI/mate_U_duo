import { test } from 'node:test';
import assert from 'node:assert/strict';
import { classify, equivalentLogic, equivalentAlgebra, grade, synthetic, truthRows } from '../src/engine';
import { lessons } from '../src/content';
import { checkLaw, checkInference } from '../src/laws';
import { dayKey, freshProgress, lessonMastery, recordAttempt, streak, validateProgress } from '../src/progress';
test('logic: all four implication rows, precedence, counterexamples and invalid input',()=>{
  assert.deepEqual(truthRows('P→Q').map(r=>r.result),[true,false,true,true]);
  assert.equal(classify('P∨¬P'),'Tautología');assert.equal(classify('P∧¬P'),'Contradicción');
  assert.equal(classify('(¬P∧Q)→(¬Q∨P)'),'Contingencia');
  assert.equal(equivalentLogic('P→Q','¬P∨Q'),true);
  assert.equal(equivalentLogic('(Q→R)∧(¬Q→S)','R∨S'),false);
  assert.equal(equivalentLogic('P∧Q∨R','(P∧Q)∨R'),true);
  assert.equal(equivalentLogic('P→Q→R','P→(Q→R)'),true);
  assert.throws(()=>truthRows('alert(P)'));assert.throws(()=>truthRows('(P∧Q'));
});
test('algebra: symbolic identities, domain restrictions, negative powers rejected',()=>{
  assert.equal(equivalentAlgebra('(x+1)(x-1)','x^2-1'),true);
  assert.equal(equivalentAlgebra('(9x-x^3)/(x^3-6x^2+9x)','-(x+3)/(x-3)'),true);
  assert.equal(equivalentAlgebra('(x+3y)/(3xy)+(x^2y-4xy^2)/(5x^2y^2)','(8x+3y)/(15xy)'),true);
  assert.equal(equivalentAlgebra('-x^2','(-x)^2'),false);
  assert.equal(equivalentAlgebra('x+1','x-1'),false);
  assert.throws(()=>equivalentAlgebra('x/0','x'));assert.throws(()=>equivalentAlgebra('x^-2','x'));
  const q=lessons.flatMap(l=>l.questions).find(q=>q.exclusions?.length===2)!;
  assert.equal(grade(q,String(q.answer),[]).correct,false);
  assert.equal(grade(q,String(q.answer),q.exclusions).correct,true);
});
test('named law validation distinguishes correct rule and verifies subexpressions',()=>{
  assert.equal(checkLaw('¬(P∧Q)','¬P∨¬Q','De Morgan'),true);
  assert.equal(checkLaw('R∨¬(P∧Q)','R∨(¬P∨¬Q)','De Morgan'),true);
  assert.equal(checkLaw('¬(P∧Q)','¬P∨¬Q','Doble negación'),false);
  assert.equal(checkLaw('¬(P∧Q)','¬P∧¬Q','De Morgan'),false);
  assert.equal(checkLaw('¬¬R','R','Doble negación'),true);
});
test('curriculum integrity: unique ids, valid choice keys, every saved answer grades correctly',()=>{
  assert.equal(lessons.length,24);const ids=new Set<string>();
  for(const l of lessons){assert.ok(!ids.has(l.id));ids.add(l.id);assert.ok(l.questions.length>=3);for(const q of l.questions){assert.ok(!ids.has(q.id));ids.add(q.id);assert.equal(grade(q,q.answer,q.exclusions).correct,true, q.id);if(q.type==='choice')assert.ok(q.options?.includes(String(q.answer)));if(q.type==='synthetic')assert.deepEqual(synthetic(q.coefficients!,q.root!).map(String),q.answer);if(q.type==='table')assert.deepEqual(truthRows(q.expression!,q.variables).map(r=>r.result?'V':'F'),q.answer);}}
  assert.equal(ids.size,96);
});
test('inference checker verifies cited premises and rejects common fallacies',()=>{
  assert.equal(checkInference(['P','P→Q'],'Q','Modus ponens'),true);
  assert.equal(checkInference(['P→Q','Q'],'P','Modus ponens'),false);
  assert.equal(checkInference(['P→Q','¬Q'],'¬P','Modus tollens'),true);
  assert.equal(checkInference(['P∨Q','¬P'],'Q','Silogismo disyuntivo'),true);
  assert.equal(checkInference(['R'],'R∨(P∧Q)','Adición'),true);
  assert.equal(checkInference(['P→Q','R→S','P∨R'],'Q∨S','Dilema constructivo'),true);
  assert.equal(checkInference(['P→Q','R→Q','P∨R'],'Q','Ley de casos'),true);
});
test('progress: hints never count as mastery, delayed recall required, XP not farmed',()=>{
  const l=lessons[0],q=l.questions[0],day1=new Date('2026-10-05T12:00:00Z');let p=freshProgress();
  p=recordAttempt(p,l,q,true,false,day1);assert.equal(p.xp,10);assert.equal(p.skills[q.id].stage,0);
  const plannedDue=p.skills[q.id].due;p=recordAttempt(p,l,q,true,false,new Date('2026-10-05T16:00:00Z'));assert.equal(p.skills[q.id].due,plannedDue,'early practice does not postpone scheduled recall');
  p=recordAttempt(p,l,q,true,false,day1);assert.equal(p.xp,10);assert.equal(lessonMastery(p,l),0);
  const day2=new Date('2026-10-06T12:00:01Z');p=recordAttempt(p,l,q,true,false,day2);assert.equal(p.skills[q.id].stage,1);assert.equal(lessonMastery(p,l),33);assert.equal(streak(p,day2),2);
  p=recordAttempt(p,l,q,true,true,day2);assert.equal(p.skills[q.id].stage,0);assert.equal(lessonMastery(p,l),0);
  assert.equal(dayKey(new Date('2026-10-05T02:00:00Z')),'2026-10-04');
  assert.throws(()=>validateProgress({...p,spentCoins:-5}));assert.throws(()=>validateProgress({version:0}));assert.equal(validateProgress(p).xp,10);
});
