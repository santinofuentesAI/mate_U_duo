import { lazy, Suspense, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, CornerDownLeft, Delete, PencilLine, Save, Undo2, Redo2, CheckCircle2 } from 'lucide-react';
import type { BookSource, Course } from './types';
import type { PracticeItem } from './learning';
import type { OpenBookProblem } from './bookCatalog';
import { assignmentLabel, statusLabels } from './bookCatalog';
import { canCheckFinal, checkBookFinal, clearFinalCheck, finalExample, finalLabel, hasCheckedFinal, readFinalAnswers, saveFinalAnswers, saveFinalCheck, type FinalAnswers } from './bookVerification';
const BookOriginal=lazy(()=>import('./BookOriginal').then(m=>({default:m.BookOriginal})));
import { BookFormula } from './BookFormula';
export type { OpenBookProblem } from './bookCatalog';
const symbols:Record<Course,string[]>={precalculo:['x','y','√()','^2','^3','^()','()/()','(',')','+','−','×','=','≠','±','≤','≥','∈','ℝ'],discreta:['P','Q','R','¬','∧','∨','→','↔','∀','∃','∄','∈','∉','⊆','∪','∩','△','∅','(',')','{','}','∴']};
export function BookProblem({problem,verified,responseState,onVerified,onDone,onEdited,onChecked,onNext,onPrevious}:{problem:OpenBookProblem;verified:PracticeItem[];responseState:'identified'|'submitted'|'validated';onVerified:(item:PracticeItem)=>void;onDone:()=>boolean;onEdited:()=>void;onChecked:()=>void;onNext:()=>void;onPrevious:()=>void}) {
  const key=`mate-book-answer-${problem.id}`;
  const [answer,setAnswer]=useState(()=>{try{return localStorage.getItem(key)||'';}catch{return '';}}),[saveState,setSaveState]=useState(''),[error,setError]=useState('');
  const [history,setHistory]=useState<string[]>([]),[future,setFuture]=useState<string[]>([]),[originalOpen,setOriginalOpen]=useState(false);
  const [finalAnswers,setFinalAnswers]=useState<FinalAnswers>(()=>readFinalAnswers(problem.id));
  const [checks,setChecks]=useState<ReturnType<typeof checkBookFinal>|null>(null);
  const input=useRef<HTMLTextAreaElement>(null),cursor=useRef({start:answer.length,end:answer.length});
  function save(value:string){try{localStorage.setItem(key,value);setSaveState('Borrador guardado en este dispositivo');setError('');return true;}catch{setSaveState('');setError('No se pudo guardar. Copiá tus pasos antes de salir.');return false;}}
  function edit(value:string){setHistory(h=>[...h.slice(-49),answer]);setFuture([]);setAnswer(value);save(value);onEdited();}
  function selection(){const el=input.current;if(el)cursor.current={start:el.selectionStart,end:el.selectionEnd};}
  function insert(token:string){selection();const {start,end}=cursor.current;const template=token.indexOf('()');edit(answer.slice(0,start)+token+answer.slice(end));const next=start+(template>=0?template+1:token.length);cursor.current={start:next,end:next};requestAnimationFrame(()=>{input.current?.focus({preventScroll:true});input.current?.setSelectionRange(next,next);});}
  function erase(){selection();let {start,end}=cursor.current;if(start===end&&start>0)start--;edit(answer.slice(0,start)+answer.slice(end));cursor.current={start,end:start};requestAnimationFrame(()=>{input.current?.focus({preventScroll:true});input.current?.setSelectionRange(start,start);});}
  function restore(redo=false){const list=redo?future:history,value=list.at(-1);if(value===undefined)return;if(redo){setFuture(list.slice(0,-1));setHistory(h=>[...h,answer]);}else{setHistory(list.slice(0,-1));setFuture(h=>[...h,answer]);}setAnswer(value);save(value);onEdited();cursor.current={start:value.length,end:value.length};}
  function finish(){if(!answer.trim()){setError('Escribí al menos una idea o un paso.');input.current?.focus();return;}if(save(answer)&&onDone())setSaveState('Respuesta hecha por mí · guardada sin corregir');}
  function updateFinal(id:string,value:string){
    const next={...finalAnswers,[id]:value};setFinalAnswers(next);setChecks(null);
    try{saveFinalAnswers(problem.id,next);clearFinalCheck(problem.id);onChecked();setError('');}
    catch{setError('No se pudo guardar la respuesta final. Liberá espacio del dispositivo e intentá otra vez.');}
  }
  function checkFinalAnswer(){
    const results=checkBookFinal(verified,finalAnswers);setChecks(results);
    if(!results.length)return;
    try{
      saveFinalAnswers(problem.id,finalAnswers);
      if(results.every(x=>x.result.correct))saveFinalCheck(problem.id,verified,finalAnswers);
      else clearFinalCheck(problem.id);
      onDone();onChecked();setError('');
    }catch{setError('No se pudo guardar la comprobación. Revisá el espacio disponible.');}
  }
  const checkable=verified.filter(x=>canCheckFinal(x.question));
  const guided=verified.filter(x=>!canCheckFinal(x.question));
  const makeSource=(visual:OpenBookProblem['visuals'][number]):BookSource=>({course:problem.course,page:visual.page,printedPage:visual.page-(problem.course==='discreta'?2:0),section:problem.section,exercise:`${problem.number}${problem.part}`,crop:visual.crop});
  return <article className="book-problem"><header><span className="eyebrow">{assignmentLabel(problem.week)} · SECCIÓN {problem.sectionCode}</span><h3>Ejercicio {problem.number}{problem.part}</h3><small>PDF {problem.page} · impresa {problem.printedPage}{problem.sourcePages.length>1?` · datos en PDF ${problem.sourcePages.join(', ')}`:''}</small>{problem.classAssigned&&<p className="notice">Asignado expresamente en el material de clase.</p>}<p className={`response-state ${responseState}`} role="status">{responseState==='validated'&&hasCheckedFinal(problem.id,verified)?'Resultado final correcto · pasos sin revisar':statusLabels[responseState]}</p></header>
    <div className="book-problem-layout"><div className="book-enunciation"><h4>Enunciado</h4>{problem.instruction&&<p>{problem.instruction}</p>}{problem.contextMath&&<BookFormula math={problem.contextMath}/>}{problem.text&&problem.text.trim()!==problem.instruction?.trim()&&<p className="book-problem-text">{problem.text}</p>}{problem.math&&<BookFormula math={problem.math}/>}{problem.mathLines?.map((math,i)=><BookFormula key={i} math={math}/>)}
      {problem.table&&<div className="book-table-scroll"><table className="book-given-table"><thead><tr>{problem.table.headers.map(h=><th key={h}>{h}</th>)}</tr></thead><tbody>{problem.table.rows.map((row,i)=><tr key={i}>{problem.table!.headers.map((h,j)=><td key={h}>{row[j]||'□'}</td>)}</tr>)}</tbody></table><small>Completá cada fila en tu desarrollo; □ es una casilla por resolver.</small></div>}
      <p className={`transcription-note ${problem.review}`}>{problem.review==='reviewed'?'Transcripción revisada contra la página.':'Texto auxiliar: la extracción puede perder símbolos o disposición. Consultá el original antes de resolver.'}</p>
      <details className="book-problem-original" onToggle={e=>setOriginalOpen(e.currentTarget.open)}><summary><BookOpen size={18}/> Ver original dentro de la app</summary>{originalOpen&&problem.visuals.map((visual,i)=><Suspense key={`${visual.page}-${i}`} fallback={<p role="status">Preparando la vista original…</p>}><BookOriginal key={`${visual.page}-${i}`} source={makeSource(visual)}/></Suspense>)}</details>
    </div><div className="book-thinking"><label className="book-problem-answer">Mi desarrollo<textarea ref={input} value={answer} onChange={e=>{edit(e.target.value);cursor.current={start:e.target.selectionStart,end:e.target.selectionEnd};}} onSelect={selection} onKeyUp={selection} onPointerUp={selection} rows={9} spellCheck={false} autoCapitalize="off" placeholder="Una idea por línea. Enter baja de línea. Podés editar cualquier paso."/></label>
      <div className="book-editor-tools" role="group" aria-label="Edición de pasos"><button type="button" onPointerDown={e=>e.preventDefault()} onClick={()=>insert('\n')}><CornerDownLeft size={17}/>Nueva línea</button><button type="button" onPointerDown={e=>e.preventDefault()} onClick={erase}><Delete size={17}/>Borrar</button><button type="button" disabled={!history.length} onClick={()=>restore()}><Undo2 size={17}/>Deshacer</button><button type="button" disabled={!future.length} onClick={()=>restore(true)}><Redo2 size={17}/>Rehacer</button></div>
      <details className="simple-more"><summary>Insertar símbolos</summary><div className="book-problem-symbols" role="group" aria-label="Símbolos matemáticos">{symbols[problem.course].map(symbol=><button key={symbol} type="button" onPointerDown={e=>e.preventDefault()} onClick={()=>insert(symbol)}>{symbol}</button>)}</div></details>
      <small role="status">{saveState||'Tus pasos se guardan al escribir. Enter agrega otra línea.'}</small>{error&&<p role="alert" className="notice">{error}</p>}
      <div className="row wrap book-save-actions"><button className="secondary" onClick={()=>save(answer)}><Save size={17}/>Guardar borrador</button><button className="secondary" onClick={finish}><PencilLine size={17}/>Hecho por mí · sin corregir</button></div>
      {checkable.length>0&&<section className="book-final-check" aria-label="Comprobar resultado"><h4>Comprobá tu respuesta</h4><p>Escribí el resultado final aquí. Tus pasos de arriba se guardan, pero esta comprobación evalúa solo el resultado.</p>{checkable.map(({question})=>{
        const result=checks?.find(x=>x.item.question.id===question.id)?.result;
        return <div className="book-final-item" key={question.id}><label htmlFor={`final-${question.id}`}>{finalLabel(question)}<input id={`final-${question.id}`} value={finalAnswers[question.id]||''} onChange={e=>updateFinal(question.id,e.target.value)} placeholder={finalExample(question)} autoCapitalize="off" autoComplete="off" spellCheck={false}/></label>{question.type==='table'&&<small>Escribí V o F para cada fila, de arriba hacia abajo.</small>}{result&&<p className={`book-check-feedback ${result.correct?'right':'wrong'}`} role="status"><b>{result.correct?'Resultado correcto':'Todavía no coincide'}</b>{result.correct?<>. {question.explanation}</>:<>. {result.error||question.hints[0]||'Revisá el enunciado y volvé a intentar.'}</>}</p>}</div>;
      })}<button className="primary wide" onClick={checkFinalAnswer} disabled={checkable.some(x=>!finalAnswers[x.question.id]?.trim())}><CheckCircle2 size={18}/>Comprobar respuesta</button>{checks?.length&&checks.every(x=>x.result.correct)?<p className="book-check-scope" role="status">Resultado final comprobado. Revisá tus pasos con la explicación; el desarrollo libre no se calificó.</p>:null}</section>}
      {guided.length>0&&<div className="book-guided-check"><p>Este razonamiento necesita revisar los pasos uno por uno.</p>{guided.map(item=><button className="secondary" key={item.question.id} onClick={()=>onVerified(item)}>Comprobar demostración guiada</button>)}</div>}
      {!verified.length&&<p className="notice">Este inciso aún no tiene una solución comprobada. Podés practicar y guardar tus pasos, pero no lo calificamos.</p>}
      {verified.length>0&&<details className="reviewed-answer-panel"><summary>Más ayuda y práctica guiada</summary><p>Una pista o explicación puede ayudarte a revisar el desarrollo.</p>{verified.map(item=><button className="secondary" key={item.question.id} onClick={()=>onVerified(item)}>{item.question.type==='table'?'Practicar tabla paso a paso':'Abrir práctica revisada'}</button>)}</details>}
      <nav className="book-problem-navigation" aria-label="Problemas del libro"><button className="secondary" onClick={onPrevious}><ArrowLeft size={17}/>Anterior</button><button className="primary" onClick={onNext}>Siguiente problema<ArrowRight size={17}/></button></nav>
    </div></div>
  </article>;
}
