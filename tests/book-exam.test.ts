import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lessons } from '../src/content';
import { bank } from '../src/learning';
import { bookExamBlocks } from '../src/bookExam';
import { bookScope } from '../src/bookScope';
import catalog from '../src/bookProblemCatalog.json';
import { bookCatalog, pageInventory, responseStatus, reviewedActivities } from '../src/bookCatalog';
import { freshProgress } from '../src/progress';
import katex from 'katex';

test('Book Exam follows each source page in order and stays within the selected syllabus',()=>{
  for(const course of ['precalculo','discreta'] as const){
    const items=bank(lessons,course).filter(i=>i.question.bookSource);
    const blocks=bookExamBlocks(course,items);
    const covered=new Set<string>();
    for(const block of blocks){
      assert.deepEqual(block.pages,[...block.pages].sort((a,b)=>a-b));
      assert.ok(block.pages.every(page=>page>=1&&page<=bookScope[course].lastPage));
      const pages=block.items.map(i=>i.question.bookSource!.page);
      assert.deepEqual(pages,[...pages].sort((a,b)=>a-b));
      for(const item of block.items){
        assert.ok(block.pages.includes(item.question.bookSource!.page));
        assert.ok(!covered.has(item.question.id),item.question.id);
        covered.add(item.question.id);
      }
    }
    assert.equal(covered.size,items.length);
  }
});
test('the original practice pages have individual free-response entries',()=>{
  assert.equal(catalog.precalculo.length,164);
  assert.equal(catalog.discreta.length,362);
  for(const course of ['precalculo','discreta'] as const){
    const ids=new Set<string>();
    for(const problem of catalog[course]){
      assert.ok(!ids.has(problem.id),problem.id);ids.add(problem.id);
      assert.ok(problem.page<=bookScope[course].lastPage);
      assert.ok(problem.text.trim().length>0 || ('math' in problem && problem.math) || ('mathLines' in problem && problem.mathLines));
    }
  }
  assert.ok(catalog.precalculo.some(p=>p.page===63&&p.number===1&&p.part==='ñ'));
  assert.ok(catalog.discreta.some(p=>p.page===73&&p.number===1&&p.part==='a'));
});
test('each visually inventoried exercise page matches its ordered catalog, including Spanish ñ',()=>{
  // Counts recorded from original pages, before comparing the catalog.
  const expected:Record<string,Record<number,number>>={
    precalculo:{18:14,19:25,33:31,42:24,43:9,52:22,53:13,63:26},
    discreta:{37:2,38:4,39:10,40:7,41:5,42:5,43:3,44:1,45:6,55:2,56:13,57:11,58:7,63:16,73:13,74:9,75:6,76:5,77:6,78:0,82:9,93:6,94:13,95:15,96:13,97:7,100:7,110:15,123:5,124:14,125:11,126:17,127:12,128:1,133:10,134:9,137:6,138:4,142:11,148:3,149:8,150:9,151:14,152:12}
  };
  assert.equal(pageInventory.length,52);
  for(const course of ['precalculo','discreta'] as const){
    for(const [page,count] of Object.entries(expected[course])){
      const row=pageInventory.find(r=>r.course===course&&r.page===Number(page));assert.ok(row,`${course} PDF ${page}`);
      const entries=bookCatalog[course].filter(p=>p.page===Number(page));
      assert.equal(entries.length,count,`${course} PDF ${page}`);
      assert.deepEqual(entries.map(p=>`${p.number}${p.part}`),row.labels);
    }
    assert.ok(bookCatalog[course].every(p=>p.sourcePages.length&&p.visuals.length&&p.visuals.every(v=>v.page>=1&&v.page<=bookScope[course].lastPage)));
  }
  const prec=bookCatalog.precalculo.filter(p=>p.page===42&&p.number===1);
  assert.deepEqual(prec.map(p=>p.part),'abcdefghijklmnñopqrs'.split(''));
  assert.deepEqual(bookCatalog.discreta.filter(p=>p.sectionCode==='1.7').map(p=>`${p.number}${p.part}`),['1a','1b','1c','1d','2a','2b','2c']);
  assert.ok(bookCatalog.discreta.some(p=>p.sectionCode==='1.3'&&p.number===16));
  assert.equal(bookCatalog.discreta.filter(p=>p.sectionCode==='2.4').length,11);
});
test('formulas parse and common givens survive continuation and nested incisos',()=>{
  for(const p of [...bookCatalog.precalculo,...bookCatalog.discreta]){
    for(const math of [p.math,p.contextMath,...(p.mathLines||[])].filter(Boolean) as string[])assert.doesNotThrow(()=>katex.renderToString(math,{throwOnError:true,strict:false}),p.id);
    assert.ok(!/Capítulo \d|ULACIT|Prof\. Didier/.test(p.text),p.id);
  }
  assert.match(bookCatalog.precalculo.find(p=>p.page===33&&p.number===2&&p.part==='h')!.contextMath!,/p\(x\)/);
  assert.deepEqual(bookCatalog.precalculo.find(p=>p.page===53&&p.number===2)!.sourcePages,[52,53]);
  const survey=bookCatalog.discreta.find(p=>p.sectionCode==='1.6'&&p.part==='b.iv')!;
  assert.match(survey.instruction!,/Juan/);assert.match(survey.instruction!,/C\(x\)/);
  const axioms=bookCatalog.discreta.find(p=>p.sectionCode==='1.8'&&p.number===9)!;
  assert.match(axioms.contextMath!,/7\\notin A/);assert.match(axioms.math!,/\\lor/);
  assert.ok(bookCatalog.discreta.find(p=>p.sectionCode==='1.4'&&p.number===8)!.sourcePages.includes(72));
});
test('all 59 existing reviewed activities remain reachable; free response is never graded by submission',()=>{
  let count=0;
  for(const course of ['precalculo','discreta'] as const){
    const items=bank(lessons,course),reachable=new Set(bookCatalog[course].flatMap(p=>reviewedActivities(p,items)).map(p=>p.question.id));
    for(const item of items.filter(p=>p.question.bookSource))assert.ok(reachable.has(item.question.id));
    count+=reachable.size;
    const p=bookCatalog[course].find(p=>reviewedActivities(p,items).length)!;
    assert.equal(responseStatus(p,items,freshProgress(),false),'identified');
    assert.equal(responseStatus(p,items,freshProgress(),true),'submitted');
    const reviewed=reviewedActivities(p,items),progress=freshProgress();
    progress.attempts=reviewed.map(item=>({questionId:item.question.id,lessonId:item.lesson.id,correct:true,assisted:false,date:new Date().toISOString()}));
    assert.equal(responseStatus(p,items,progress,true),'validated');
    progress.attempts.push({...progress.attempts[0],correct:false});
    assert.equal(responseStatus(p,items,progress,true),'submitted');
  }
  assert.equal(count,59);
  assert.deepEqual(bookCatalog.precalculo.filter(p=>p.classAssigned).map(p=>`${p.number}${p.part}`),['1g','2f','2l','3k']);
  assert.equal(bookCatalog.discreta.find(p=>p.sectionCode==='2.1'&&p.number===20&&p.part==='a')!.week,'S3');
});
