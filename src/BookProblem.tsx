import { lazy, Suspense, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, CornerDownLeft, Delete, Undo2, Redo2 } from 'lucide-react';
import type { BookSource, Course } from './types';
import type { PracticeItem } from './learning';
import type { OpenBookProblem } from './bookCatalog';
import { statusLabels } from './bookCatalog';
import { canCheckFinal, checkBookFinal, clearFinalCheck, finalExample, finalLabel, hasCheckedFinal, readFinalAnswers, saveFinalAnswers, saveFinalCheck, type FinalAnswers } from './bookVerification';
import { BookFormula } from './BookFormula';

const BookOriginal=lazy(()=>import('./BookOriginal').then(m=>({default:m.BookOriginal})));
export type { OpenBookProblem } from './bookCatalog';
const symbols:Record<Course,string[]>={precalculo:['x','y','√()','^2','^3','^()','()/()','(',')','+','−','×','=','≠','±','≤','≥','∈','ℝ'],discreta:['P','Q','R','¬','∧','∨','→','↔','∀','∃','∄','∈','∉','⊆','∪','∩','△','∅','(',')','{','}','∴']};

export function BookProblem({problem,verified,responseState,onVerified,onDone,onEdited,onChecked,onNext,onPrevious}:{problem:OpenBookProblem;verified:PracticeItem[];responseState:'identified'|'submitted'|'validated';onVerified:(item:PracticeItem)=>void;onDone:()=>boolean;onEdited:()=>void;onChecked:()=>void;onNext:()=>void;onPrevious:()=>void}) {
  const key=`mate-book-answer-${problem.id}`;
  const [answer,setAnswer]=useState(()=>{try{return localStorage.getItem(key)||'';}catch{return '';}}),[saveState,setSaveState]=useState(''),[error,setError]=useState('');
  const [history,setHistory]=useState<string[]>([]),[future,setFuture]=useState<string[]>([]),[originalOpen,setOriginalOpen]=useState(false);
  const [finalAnswers,setFinalAnswers]=useState<FinalAnswers>(()=>readFinalAnswers(problem.id));
  const [checks,setChecks]=useState<ReturnType<typeof checkBookFinal>|null>(null);
  const input=useRef<HTMLTextAreaElement>(null),cursor=useRef({start:answer.length,end:answer.length});
  const finalInput=useRef<HTMLInputElement|null>(null),finalId=useRef('');
  const checkable=verified.filter(x=>canCheckFinal(x.question));
  const guided=verified.filter(x=>!canCheckFinal(x.question));
  const quick=problem.course==='precalculo'?['^2','^3','/','(',')','−']:checkable.some(x=>x.question.type==='table')?['V','F',',']:checkable.some(x=>x.question.type==='set'||x.question.type==='venn')?['{','}',',','∅','(',')']:['¬','∧','∨','→','↔'];

  function save(value:string){try{localStorage.setItem(key,value);setSaveState('Guardado en este dispositivo');setError('');return true;}catch{setSaveState('');setError('No se pudo guardar. Copiá tus pasos antes de salir.');return false;}}
  function edit(value:string){setHistory(h=>[...h.slice(-49),answer]);setFuture([]);setAnswer(value);save(value);onEdited();}
  function selection(){const el=input.current;if(el)cursor.current={start:el.selectionStart,end:el.selectionEnd};}
  function insert(token:string){selection();const {start,end}=cursor.current;const template=token.indexOf('()');edit(answer.slice(0,start)+token+answer.slice(end));const next=start+(template>=0?template+1:token.length);cursor.current={start:next,end:next};requestAnimationFrame(()=>{input.current?.focus({preventScroll:true});input.current?.setSelectionRange(next,next);});}
  function erase(){selection();let {start,end}=cursor.current;if(start===end&&start>0)start--;edit(answer.slice(0,start)+answer.slice(end));cursor.current={start,end:start};requestAnimationFrame(()=>{input.current?.focus({preventScroll:true});input.current?.setSelectionRange(start,start);});}
  function restore(redo=false){const list=redo?future:history,value=list.at(-1);if(value===undefined)return;if(redo){setFuture(list.slice(0,-1));setHistory(h=>[...h,answer]);}else{setHistory(list.slice(0,-1));setFuture(h=>[...h,answer]);}setAnswer(value);save(value);onEdited();cursor.current={start:value.length,end:value.length};}
  function finish(){if(!answer.trim()){setError('Escribí una idea o un paso antes de marcarlo.');input.current?.focus();return;}if(save(answer)&&onDone())setSaveState('Trabajado · sin corregir');}
  function updateFinal(id:string,value:string){const next={...finalAnswers,[id]:value};setFinalAnswers(next);setChecks(null);try{saveFinalAnswers(problem.id,next);clearFinalCheck(problem.id);onChecked();setError('');}catch{setError('No se pudo guardar la respuesta final. Revisá el espacio del dispositivo.');}}
  function insertFinal(token:string){const id=finalId.current||checkable[0]?.question.id;if(!id)return;const el=finalInput.current,value=finalAnswers[id]||'',start=el?.selectionStart??value.length,end=el?.selectionEnd??start;updateFinal(id,value.slice(0,start)+token+value.slice(end));const next=start+token.length;requestAnimationFrame(()=>{el?.focus({preventScroll:true});el?.setSelectionRange(next,next);});}
  function checkFinalAnswer(){const results=checkBookFinal(verified,finalAnswers);setChecks(results);if(!results.length)return;try{saveFinalAnswers(problem.id,finalAnswers);if(results.every(x=>x.result.correct))saveFinalCheck(problem.id,verified,finalAnswers);else clearFinalCheck(problem.id);onDone();onChecked();setError('');}catch{setError('No se pudo guardar la comprobación. Revisá el espacio disponible.');}}
  const makeSource=(visual:OpenBookProblem['visuals'][number]):BookSource=>({course:problem.course,page:visual.page,printedPage:visual.page-(problem.course==='discreta'?2:0),section:problem.section,exercise:`${problem.number}${problem.part}`,crop:visual.crop});
  const state=responseState==='validated'?(hasCheckedFinal(problem.id,verified)?'Resultado correcto · pasos sin revisar':'Práctica guiada aprobada · pasos libres sin revisar'):responseState==='submitted'?'Guardado · sin corregir':statusLabels.identified;

  return <article className="book-problem book-problem-focus">
    <header><span className="eyebrow">SECCIÓN {problem.sectionCode} · PDF {problem.page}</span><h3>Ejercicio {problem.number}{problem.part}</h3><p className={`response-state ${responseState}`} role="status">{state}</p></header>
    <div className="book-problem-layout"><div className="book-enunciation">
      {problem.instruction&&<p>{problem.instruction}</p>}{problem.contextMath&&<BookFormula math={problem.contextMath}/>}{problem.text&&problem.text.trim()!==problem.instruction?.trim()&&<p className="book-problem-text">{problem.text}</p>}{problem.math&&<BookFormula math={problem.math}/>}{problem.mathLines?.map((math,i)=><BookFormula key={i} math={math}/>)}
      {problem.table&&<div className="book-table-scroll"><table className="book-given-table"><thead><tr>{problem.table.headers.map(h=><th key={h}>{h}</th>)}</tr></thead><tbody>{problem.table.rows.map((row,i)=><tr key={i}>{problem.table!.headers.map((h,j)=><td key={h}>{row[j]||'□'}</td>)}</tr>)}</tbody></table></div>}
      {problem.review!=='reviewed'&&<p className="transcription-note auxiliary">Texto auxiliar: puede perder símbolos. Comprobá el enunciado en la página original.</p>}
      <details className="book-problem-original" onToggle={e=>setOriginalOpen(e.currentTarget.open)}><summary><BookOpen size={18}/> Ver página original</summary><small>PDF {problem.page} · impresa {problem.printedPage}{problem.sourcePages.length>1?` · continúa en PDF ${problem.sourcePages.join(', ')}`:''}</small>{originalOpen&&problem.visuals.map((visual,i)=><Suspense key={`${visual.page}-${i}`} fallback={<p role="status">Preparando la página…</p>}><BookOriginal source={makeSource(visual)}/></Suspense>)}</details>
    </div><div className="book-thinking">
      {checkable.length>0&&<section className="book-final-check" aria-label="Comprobar resultado"><h4>Tu respuesta</h4>{checkable.map(({question})=>{const result=checks?.find(x=>x.item.question.id===question.id)?.result;return <div className="book-final-item" key={question.id}><label htmlFor={`final-${question.id}`}>{checkable.length>1?finalLabel(question):'Resultado final'}<input id={`final-${question.id}`} value={finalAnswers[question.id]||''} onFocus={e=>{finalInput.current=e.currentTarget;finalId.current=question.id;}} onChange={e=>updateFinal(question.id,e.target.value)} placeholder={finalExample(question)} autoCapitalize="off" autoComplete="off" spellCheck={false}/></label>{result&&<p className={`book-check-feedback ${result.correct?'right':'wrong'}`} role="status"><b>{result.correct?'¡Correcto!':'Revisá tu respuesta'}</b><span>{result.correct?question.explanation:result.error||question.hints[0]||'Intentá de nuevo.'}</span></p>}</div>;})}
        <div className="book-final-keys" role="group" aria-label="Símbolos para la respuesta">{quick.map((token,i)=><button type="button" key={`${token}-${i}`} onPointerDown={e=>e.preventDefault()} onClick={()=>insertFinal(token)}>{token}</button>)}</div>
        <button className="primary wide" onClick={checkFinalAnswer} disabled={checkable.some(x=>!finalAnswers[x.question.id]?.trim())}><CheckCircle2 size={18}/>Comprobar</button><small>Se comprueba el resultado. Tus pasos son tuyos para revisar.</small>
      </section>}
      {guided.length>0&&<div className="book-guided-check"><p>Esta demostración se revisa paso a paso.</p>{guided.map(item=><button className="primary wide" key={item.question.id} onClick={()=>onVerified(item)}>Resolver con corrección<ArrowRight size={18}/></button>)}</div>}
      {!verified.length&&<p className="book-unchecked">Todavía no hay clave revisada. Podés resolverlo y guardar tus pasos.</p>}
      <details className="book-steps" open={!checkable.length}><summary>{checkable.length?'Escribir mis pasos':'Mis pasos'}</summary><label className="book-problem-answer">Desarrollo<textarea ref={input} value={answer} onChange={e=>{edit(e.target.value);cursor.current={start:e.target.selectionStart,end:e.target.selectionEnd};}} onSelect={selection} onKeyUp={selection} onPointerUp={selection} rows={5} spellCheck={false} autoCapitalize="off" placeholder="Una idea por línea. Enter agrega otra línea."/></label><small role="status">{saveState||'Se guarda mientras escribís.'}</small>
        <details className="book-step-tools"><summary>Teclado y edición</summary><div className="book-editor-tools" role="group" aria-label="Edición de pasos"><button type="button" onPointerDown={e=>e.preventDefault()} onClick={()=>insert('\n')}><CornerDownLeft size={17}/>Línea</button><button type="button" onPointerDown={e=>e.preventDefault()} onClick={erase}><Delete size={17}/>Borrar</button><button type="button" disabled={!history.length} onClick={()=>restore()}><Undo2 size={17}/>Deshacer</button><button type="button" disabled={!future.length} onClick={()=>restore(true)}><Redo2 size={17}/>Rehacer</button></div><div className="book-problem-symbols" role="group" aria-label="Símbolos matemáticos">{symbols[problem.course].map(symbol=><button key={symbol} type="button" onPointerDown={e=>e.preventDefault()} onClick={()=>insert(symbol)}>{symbol}</button>)}</div></details>
        {!checkable.length&&<button className="secondary book-mark-worked" onClick={finish}>Marcar como trabajado</button>}
      </details>
      {error&&<p role="alert" className="notice">{error}</p>}
      {checkable.length>0&&<details className="reviewed-answer-panel"><summary>Necesito una pista</summary>{verified.map(item=><button className="secondary" key={item.question.id} onClick={()=>onVerified(item)}>Ver práctica explicada · {finalLabel(item.question)}</button>)}</details>}
      <nav className="book-problem-navigation" aria-label="Problemas del libro"><button className="secondary" onClick={onPrevious}><ArrowLeft size={17}/>Anterior</button><button className="primary" onClick={onNext}>Siguiente<ArrowRight size={17}/></button></nav>
    </div></div>
  </article>;
}
