import { test } from 'node:test';
import assert from 'node:assert/strict';
import katex from 'katex';
import { canonicalMath, mathParts, replaceMathSelection } from '../src/mathNotation';
import { algebraRules } from '../src/algebraRules';
import { equivalentAlgebra } from '../src/engine';
import { initialAnswer, loadAnswerDraft } from '../src/exerciseDraft';
import { lessons } from '../src/content';
test('raised power notation preserves source positions, incomplete powers and grouped exponents',()=>{
  const p=mathParts('x^3+2^3');assert.equal(p.map(x=>x.text).join(''),'x3+23');
  assert.deepEqual(p.filter(x=>x.power).map(x=>[x.start,x.end,x.text]),[[1,3,'3'],[5,7,'3']]);
  assert.equal(mathParts('x^').at(-1)?.text,'□');assert.equal(mathParts('x^(-2)').at(-1)?.text,'(-2)');
  assert.equal(mathParts('(a+b)^2').at(-1)?.text,'2');assert.equal(mathParts('<script>').map(x=>x.text).join(''),'<script>');
  assert.equal(canonicalMath('x² × y³ ÷ 2'),'x^2 * y^3 / 2');
});
test('touch insertion replaces only the selected exponent and retains algebraic meaning',()=>{
  assert.deepEqual(replaceMathSelection('x^3+2',2,3,'2'),{value:'x^2+2',cursor:3});
  assert.deepEqual(replaceMathSelection('xy',1,1,'^3'),{value:'x^3y',cursor:3});
  assert.equal(equivalentAlgebra(replaceMathSelection('x',1,1,'^2').value,'x*x'),true);
});
test('precalculus reference formulas render and do not confuse squares of sums with sums of squares',()=>{
  assert.equal(algebraRules.length,6);assert.equal(algebraRules.flatMap(g=>g.rules).length,32);
  for(const rule of algebraRules.flatMap(g=>g.rules))for(const text of [rule.formula,rule.example])assert.doesNotThrow(()=>katex.renderToString(text,{throwOnError:true,strict:false}));
  assert.equal(equivalentAlgebra('(a+b)^2','a^2+2*a*b+b^2'),true);
  assert.equal(equivalentAlgebra('(a+b)^2','a^2+b^2'),false);
  assert.equal(equivalentAlgebra('x^3-8','(x-2)*(x^2+2*x+4)'),true);
});
test('saved mobile working lines restore the final answer and reject corrupted drafts',()=>{
  const question=lessons.flatMap(l=>l.questions).find(q=>q.type==='algebra')!;
  const previous=globalThis.localStorage;
  try{
    const data=new Map<string,string>();
    Object.defineProperty(globalThis,'localStorage',{configurable:true,value:{getItem:(key:string)=>data.get(key)||null}});
    const draft={...initialAnswer(question),value:'x^6',steps:['x^5*x^2/x','x^7/x','x^6']};
    data.set('working',JSON.stringify(draft));assert.deepEqual(loadAnswerDraft(question,'working').steps,draft.steps);
    data.set('working',JSON.stringify({...draft,value:'x^5'}));assert.deepEqual(loadAnswerDraft(question,'working'),initialAnswer(question));
    assert.equal(equivalentAlgebra('x^5*x^2/x','x^6'),true);
    assert.equal(equivalentAlgebra('x^5*x^2/x','x^5'),false);
  }finally{if(previous===undefined)delete (globalThis as {localStorage?:Storage}).localStorage;else Object.defineProperty(globalThis,'localStorage',{configurable:true,value:previous});}
});
