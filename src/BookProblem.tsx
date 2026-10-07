import { useRef, useState } from 'react';
import { ArrowRight, BookOpen, Check, PencilLine } from 'lucide-react';
import type { Course, BookSource } from './types';
import type { PracticeItem } from './learning';
import { BookOriginal } from './BookOriginal';
import { Workbench } from './Workbench';

export interface OpenBookProblem { id:string;course:Course;week:string;section:string;page:number;number:number;part:string;text:string;instruction?:string; }
const symbols:Record<Course,string[]>={precalculo:['x','y','√','²','^','/','(',')','+','−','=','≠','∈'],discreta:['P','Q','R','¬','∧','∨','→','↔','∀','∃','∈','∪','∩']};
export function BookProblem({problem,verified,onVerified,onDone,onNext}:{problem:OpenBookProblem;verified?:PracticeItem;onVerified:()=>void;onDone:()=>void;onNext:()=>void}) {
  const key=`mate-book-answer-${problem.id}`;
  const [answer,setAnswer]=useState(()=>{try{return localStorage.getItem(key)||'';}catch{return '';}}),[saved,setSaved]=useState(false),[error,setError]=useState('');
  const input=useRef<HTMLTextAreaElement>(null);
  const source:BookSource={course:problem.course,page:problem.page,printedPage:problem.page-(problem.course==='discreta'?2:0),section:problem.section,exercise:`${problem.number}${problem.part}`,crop:{x:0,y:0,width:1,height:1}};
  function edit(value:string){setAnswer(value);setSaved(false);try{localStorage.setItem(key,value);}catch{setError('No se pudo guardar esta respuesta en el navegador.');}}
  function insert(value:string){const element=input.current;const start=element?.selectionStart??answer.length,end=element?.selectionEnd??start;edit(answer.slice(0,start)+value+answer.slice(end));requestAnimationFrame(()=>{element?.focus();element?.setSelectionRange(start+value.length,start+value.length);});}
  function finish(){if(!answer.trim()){setError('Escribí al menos una idea o un paso antes de marcarlo como hecho.');input.current?.focus();return;}setError('');setSaved(true);onDone();}
  return <article className="book-problem card"><span className="eyebrow">BOOK EXAM · {problem.week} · {problem.section}</span><h3>Ejercicio {problem.number}{problem.part} <small>· PDF {problem.page}</small></h3>
    {problem.instruction&&<p><b>Consigna:</b> {problem.instruction}</p>}
    <pre className="book-problem-text">{problem.text}</pre><small>Texto de apoyo extraído del PDF. Para símbolos, fracciones, tablas o diagramas, revisá la página original de abajo.</small>
    <details className="book-problem-original"><summary><BookOpen size={18}/> Ver enunciado visual exacto</summary><BookOriginal source={source}/></details>
    {verified&&<button className="secondary" onClick={onVerified}><Check size={17}/>Resolver con corrección y explicación</button>}
    <label className="book-problem-answer">Mi desarrollo<textarea ref={input} value={answer} onChange={e=>edit(e.target.value)} rows={7} spellCheck={false} placeholder="Escribí tus pasos. Enter agrega otra línea; también podés usar los símbolos de abajo."/></label>
    <div className="book-problem-symbols" role="group" aria-label="Símbolos matemáticos">{symbols[problem.course].map(symbol=><button key={symbol} type="button" onClick={()=>insert(symbol)}>{symbol}</button>)}</div>
    <details className="book-problem-workbench"><summary><PencilLine size={18}/> Abrir cuaderno interactivo para comprobar pasos</summary><Workbench compact draftPrefix={`mate-book-problem-${problem.id}`} initialMode={problem.course==='precalculo'?'algebra':'logic'}/></details>
    {error&&<p role="alert" className="notice">{error}</p>}
    <div className="row wrap"><button className="secondary" onClick={finish}><Check size={17}/>{saved?'Hecho por mí · guardado':'Marcar como hecho por mí'}</button><button className="primary" onClick={onNext}>Siguiente problema<ArrowRight size={17}/></button></div>
    <small>«Hecho por mí» registra tu trabajo; no significa que la respuesta haya sido corregida. Los incisos con corrección muestran sus soluciones en la práctica digitalizada.</small>
  </article>;
}
