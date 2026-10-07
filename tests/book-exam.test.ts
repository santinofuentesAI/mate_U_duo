import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lessons } from '../src/content';
import { bank } from '../src/learning';
import { bookExamBlocks } from '../src/bookExam';
import { bookScope } from '../src/bookScope';
import catalog from '../src/bookProblemCatalog.json';

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
  assert.equal(catalog.precalculo.length,156);
  assert.equal(catalog.discreta.length,352);
  for(const course of ['precalculo','discreta'] as const){
    const ids=new Set<string>();
    for(const problem of catalog[course]){
      assert.ok(!ids.has(problem.id),problem.id);ids.add(problem.id);
      assert.ok(problem.page<=bookScope[course].lastPage);
      assert.ok(problem.text.trim().length>0);
    }
  }
  assert.ok(catalog.precalculo.some(p=>p.page===63&&p.number===1&&p.part==='ñ'));
  assert.ok(catalog.discreta.some(p=>p.page===73&&p.number===1&&p.part==='a'));
});
