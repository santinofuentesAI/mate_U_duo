import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lessons } from '../src/content';
import { generateExam } from '../src/exam';
import { equivalentLogic, grade, truthRows } from '../src/engine';
import { decodeSession } from '../src/sessions';
import { bank } from '../src/learning';

for(const course of ['discreta','precalculo'] as const){
  test(`examen ${course}: 35 variantes comprobables y reanudables`,()=>{
    const units=[...new Set(lessons.filter(l=>l.course===course).map(l=>l.unit))];
    const existing=new Set(bank(lessons,course).map(i=>i.question.prompt));
    for(const selected of [...units.map(u=>[u]),units]){
      const seed='b8a41724-8ab6-478b-924a-5872723561c1';
      const items=generateExam(course,selected,seed,lessons);
      assert.equal(items.length,35);assert.equal(new Set(items.map(i=>i.question.id)).size,35);
      assert.equal(new Set(items.map(i=>i.question.prompt)).size,35,'no duplicate problem statements in the exam');
      assert.deepEqual(generateExam(course,selected,seed,lessons),items,'resume regenerates the same questions and answers');
      assert(items.every(i=>selected.includes(i.lesson.unit)),'no out-of-syllabus lesson');
      assert(items.every(i=>!existing.has(i.question.prompt)),'no existing book or lesson question copied as a new variant');
      for(const {question:q} of items){
        if(q.type==='examproof'){assert(q.translation&&q.guidedSteps?.length);assert.equal(q.guidedSteps.at(-1)?.expression,'T');const premise=(q.premises||[]).map(s=>`(${s})`).join('∧');for(const step of q.guidedSteps){assert(truthRows(`(${premise})→(${step.expression})`).every(r=>r.result),`unsound deduction: ${step.expression}`);}continue;}
        assert(grade(q,q.answer,q.exclusions).correct,`invalid answer ${q.id}: ${q.prompt}`);
        if(q.type==='choice')assert(q.options?.includes(String(q.answer)));
        if(q.type==='set')assert((q.answer as string[]).every(a=>q.universe?.includes(a)));
      }
      const raw={id:seed,title:'Examen',mode:'exam',started:new Date().toISOString(),startingXP:0,index:0,ids:items.map(i=>i.question.id),examSeed:seed,examUnits:selected,examCourse:course};
      assert.equal(decodeSession(raw)?.session.items.length,35);
      assert.equal(decodeSession({...raw,ids:[...raw.ids.slice(1),raw.ids[0]]}),null,'tampered order cannot resume');
    }
  });
}
