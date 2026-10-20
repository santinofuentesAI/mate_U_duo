import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bank, dailyChallenge, mistakeJournal, mixedPractice, practicePlan, practiceTargets, sessionSummary } from '../src/learning';
import { caseExercises, caseStudies } from '../src/caseStudies';
import { grade } from '../src/engine';
import { lessons } from '../src/content';
import { freshProgress, recordAttempt, validateProgress } from '../src/progress';
import { decodeSession } from '../src/sessions';
import { realRoots } from '../src/Explorers';
test('adaptive plan prioritizes due recall and unresolved errors without duplicate questions',()=>{
  const items=bank(lessons,'discreta'),p=freshProgress(),now=new Date('2026-10-05T12:00:00Z');
  p.skills[items[3].question.id]={stage:1,successes:2,due:'2026-10-04T12:00:00Z',last:'2026-10-01T12:00:00Z'};
  p.attempts.push({questionId:items[4].question.id,lessonId:items[4].lesson.id,correct:false,assisted:false,date:now.toISOString()});
  const plan=practicePlan(items,p,8,now);assert.equal(plan[0].question.id,items[3].question.id);assert.equal(plan[1].question.id,items[4].question.id);assert.equal(new Set(plan.map(i=>i.question.id)).size,8);
});
test('daily challenge stays fixed through the Costa Rica study day and contains only this course',()=>{
  const items=bank(lessons,'precalculo'),ids=(d:Date)=>dailyChallenge(items,'precalculo',d).map(i=>i.question.id);
  assert.deepEqual(ids(new Date('2026-10-05T07:00:00Z')),ids(new Date('2026-10-06T05:59:59Z')));
  assert.notDeepEqual(ids(new Date('2026-10-06T05:59:59Z')),ids(new Date('2026-10-06T06:00:00Z')));
  assert.equal(ids(new Date()).length,5);assert.ok(dailyChallenge(items,'precalculo').every(i=>i.lesson.course==='precalculo'));
});
test('mistake journal preserves the submitted answer and separates assisted from independent recovery',()=>{
  const items=bank(lessons,'discreta'),i=items[0],now=new Date('2026-10-05T12:00:00Z');let p=recordAttempt(freshProgress(),i.lesson,i.question,false,false,now,{answer:'mi error'});
  p=recordAttempt(p,i.lesson,i.question,true,true,new Date(now.getTime()+1000),{answer:i.question.answer});
  let j=mistakeJournal(items,p);assert.equal(j[0].attempt.answer,'mi error');assert.equal(j[0].resolved,false);
  p=recordAttempt(p,i.lesson,i.question,true,false,new Date(now.getTime()+2000),{answer:i.question.answer});j=mistakeJournal(items,p);assert.equal(j[0].resolved,true);assert.equal(j[0].attempt.answer,'mi error');assert.equal(validateProgress(p).attempts[0].answer,'mi error');
  assert.throws(()=>validateProgress({...p,attempts:[{...p.attempts[0],answer:[3]}]}));
  const s=sessionSummary(p,[i],now.toISOString());assert.deepEqual(s,{clean:0,retries:1,helped:1});
});
test('session recovery rejects missing questions, duplicate IDs, cross-course items and invalid position',()=>{
  const l=lessons[0],raw={id:'12345678-1234-1234-1234-123456789012',title:l.title,mode:'lesson',started:'2026-10-05T12:00:00Z',startingXP:0,lessonId:l.id,ids:l.questions.map(q=>q.id),index:1};
  assert.equal(decodeSession(raw)?.session.items[1].question.id,l.questions[1].id);
  assert.equal(decodeSession({...raw,index:l.questions.length}),null);assert.equal(decodeSession({...raw,ids:['not-a-question']}),null);assert.equal(decodeSession({...raw,ids:[raw.ids[0],raw.ids[0]]}),null);
  const earlier=decodeSession({...raw,ids:l.questions.filter(q=>q.id.endsWith('-q1')||q.id.endsWith('-q2')||q.id.endsWith('-q3')).map(q=>q.id),index:1});
  assert.equal(earlier?.index,1);assert.equal(earlier?.session.items.length,10);
  assert.equal(new Set(earlier?.session.items.map(i=>i.question.id)).size,10);
  assert.equal(decodeSession({...raw,mode:'adaptive',lessonId:undefined,ids:[raw.ids[0],bank(lessons,'precalculo')[0].question.id],index:0}),null);
});
test('mixed daily practice of 20 covers several weeks, exam mixes difficulties, and stays unique',()=>{
  const items=bank(lessons,'precalculo'),p=freshProgress(),now=new Date('2026-10-20T18:00:00Z');
  p.course='precalculo';
  const exam=mixedPractice(items,p,'exam',20,now);
  assert.equal(exam.length,20);
  assert.equal(new Set(exam.map(i=>i.question.id)).size,20);
  assert.ok(exam.every(i=>i.lesson.course==='precalculo'));
  const diffs=exam.map(i=>i.question.difficulty);
  assert.ok(diffs.includes(1)&&diffs.includes(2)&&diffs.includes(3));
  assert.ok(exam.every((item,i)=>i===0||item.question.difficulty>=exam[i-1].question.difficulty));
  const weeks=new Set(exam.map(i=>i.lesson.unit.split(' · ')[0]));
  assert.ok(weeks.size>=2);
  assert.deepEqual(practiceTargets('easy',20),{1:20,2:0,3:0});
  const easy=mixedPractice(items,p,'easy',20,now);
  assert.ok(easy.every(i=>i.question.difficulty===1)||easy.length===20);
});
test('case studies attach honest keys that grade and stay off the lesson catalog count',()=>{
  const extras=caseExercises.filter(item=>lessons.some(l=>l.course===item.course&&l.title===item.lessonTitle));
  assert.equal(extras.length,caseStudies.length);
  const attached=bank(lessons,'discreta').filter(i=>i.question.tag==='Estudio de caso');
  assert.ok(attached.length>=8);
  for(const item of caseStudies)assert.equal(grade(item.question,item.question.answer,item.question.exclusions).correct,true,item.id);
});
test('equation explorer handles two roots, a double root, no real roots, a line and degenerate identities',()=>{
  assert.deepEqual(realRoots(1,-2,-3),[-1,3]);assert.deepEqual(realRoots(1,-4,4),[2]);assert.deepEqual(realRoots(1,0,2),[]);
  assert.deepEqual(realRoots(0,2,-4),[2]);assert.deepEqual(realRoots(0,0,3),[]);assert.equal(realRoots(0,0,0),'all');
  assert.deepEqual(realRoots(-1,0,4),[-2,2]);
});
