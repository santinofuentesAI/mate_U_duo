import { test } from 'node:test';
import assert from 'node:assert/strict';
import katex from 'katex';
import { bookExercises } from '../src/bookExercises';
import { lessons } from '../src/content';
import { bank, mistakeJournal } from '../src/learning';
import { grade, equivalentLogic, truthRows } from '../src/engine';
import { freshProgress, recordAttempt } from '../src/progress';
import { decodeSession } from '../src/sessions';
import { checkInference, checkLaw } from '../src/laws';
import { matchesBook } from '../src/bookEditions';
const question=(id:string)=>bookExercises.find(e=>e.question.id===id)!.question;
test('selected book incisos have valid references, crop bounds and independently checked logical answers',()=>{
  assert.equal(bookExercises.length,59);assert.equal(bank(lessons,'precalculo').length,105);assert.equal(bank(lessons,'discreta').length,95);
  const ids=new Set(lessons.flatMap(l=>l.questions.map(q=>q.id)));
  for(const e of bookExercises){
    const q=e.question,s=q.bookSource!,c=s.crop;
    assert.ok(lessons.some(l=>l.title===e.lessonTitle&&l.course===e.course));assert.equal(s.course,e.course);
    assert.ok(!ids.has(q.id));ids.add(q.id);assert.ok(s.page>=1&&s.page<=(e.course==='precalculo'?63:152));
    assert.equal(s.printedPage,s.page-(e.course==='discreta'?2:0));
    assert.ok(c.x>=0&&c.y>=0&&c.width>0&&c.height>0&&c.x+c.width<=1&&c.y+c.height<=1);
    assert.ok(grade(q,q.answer,q.exclusions).correct,q.id);
    if(q.math)assert.doesNotThrow(()=>katex.renderToString(q.math!,{throwOnError:true,strict:false}),q.id);
    if(q.type==='logic')assert.ok(equivalentLogic(q.expression!,String(q.answer)),q.id);
    if(q.type==='table')assert.deepEqual(q.answer,truthRows(q.expression!,q.variables).map(r=>r.result?'V':'F'));
    if(q.type==='choice')assert.ok(q.options?.includes(String(q.answer)));
  }
  // The book's 2c is a contingency; P=F,Q=V disproves the tempting tautology.
  assert.equal(question('discreta-libro-56-2c').answer,'Contingencia');
  assert.equal(grade(question('discreta-libro-56-2c-tabla'),['V','V','V','V']).correct,false);
});
test('complement bars in the PDF must not be lost when converting original set problems',()=>{
  const U=['a','b','c','d','e','f'],A=['a','b','e'],B=['c','e','f'],C=['b','e','f'];
  const difference=A.filter(x=>!B.includes(x));const union=[...new Set([...difference,...C])];
  const symmetric=[...new Set([...B,...C])].filter(x=>B.includes(x)!==C.includes(x));
  const complement=U.filter(x=>!symmetric.includes(x));
  const result=[...new Set([...union.filter(x=>complement.includes(x)),'d'])];
  assert.ok(grade(question('discreta-libro-123-2'),result).correct);
  assert.equal(grade(question('discreta-libro-123-2'),['b','d']).correct,false);
  assert.ok(grade(question('discreta-libro-124-6b'),['1','2','3','4','5','6','7']).correct);
  assert.equal(grade(question('discreta-libro-124-6b'),['8','9']).correct,false);
});
test('book factorization requires a product and equation tasks reject extraneous roots',()=>{
  const q=question('precalculo-libro-42-1e');
  assert.equal(grade(q,'8-y^3').correct,false);assert.equal(grade(q,'1*(8-y^3)').correct,false);
  assert.ok(grade(q,'(2-y)(y^2+2y+4)').correct);assert.ok(grade(q,'(y-2)*(-y^2-2y-4)').correct);
  assert.equal(grade(q,'(2-y)(y^2-2y+4)').correct,false);
  assert.ok(grade(question('precalculo-libro-42-1i'),'(2x-y)^3').correct);
  assert.equal(grade(question('precalculo-libro-63-1h'),['2','-1']).correct,false);
  assert.equal(grade(question('precalculo-libro-63-2a'),['2','18']).correct,false);
  assert.equal(grade(question('precalculo-libro-63-2c'),['4','12']).correct,false);
  assert.ok(grade(question('precalculo-libro-19-6p'),'2/120').correct);
});
test('original cardinality problems distinguish intersections from exactly-one or exactly-two regions',()=>{
  assert.equal(Number(question('discreta-libro-149-3a').answer),70+83+74-50-38-41+27);
  assert.equal(Number(question('discreta-libro-149-3b').answer),(50-27)+(38-27)+(41-27));
  const frenchRussian=65+45+42-20-15+8-100;
  assert.equal(Number(question('discreta-libro-150-6a').answer),frenchRussian);
  assert.equal(Number(question('discreta-libro-150-6c').answer),(65-20-frenchRussian+8)+(45-20-15+8)+(42-frenchRussian-15+8));
  assert.notEqual(question('discreta-libro-151-8a').answer,question('discreta-libro-151-8b').answer);
});
test('guided original proofs have a valid dependency chain and book sessions survive reload into review',()=>{
  assert.ok(checkInference(['Q→¬R','Q'],'¬R','Modus ponens'));assert.ok(checkInference(['P∨R','¬R'],'P','Silogismo disyuntivo'));
  assert.ok(checkInference(['R→T','¬T'],'¬R','Modus tollens'));assert.ok(checkInference(['¬R'],'¬R∨¬S','Adición'));
  assert.ok(checkLaw('¬R∨¬S','¬(R∧S)','De Morgan'));assert.ok(checkInference(['(¬P∨¬Q)→(R∧S)','¬(R∧S)'],'¬(¬P∨¬Q)','Modus tollens'));
  const item=bank(lessons,'precalculo').find(i=>i.question.id==='precalculo-libro-42-1e')!;
  const saved=decodeSession({id:'12345678-1234-1234-1234-123456789012',mode:'book',title:'Libro',ids:[item.question.id],index:0,started:'2026-10-05T12:00:00Z',startingXP:0});
  assert.equal(saved?.session.items[0].question.bookSource?.page,42);
  const p=recordAttempt(freshProgress(),item.lesson,item.question,false,false,new Date(),{answer:'8-y^3'});
  assert.equal(mistakeJournal(bank(lessons,'precalculo'),p)[0].attempt.answer,'8-y^3');
});
test('unrelated PDFs are not displayed as original textbook excerpts',async()=>{
  const unrelated=new TextEncoder().encode('%PDF-1.4 unrelated book').buffer;
  assert.equal(await matchesBook(unrelated,'precalculo'),false);assert.equal(await matchesBook(unrelated,'discreta'),false);
});
