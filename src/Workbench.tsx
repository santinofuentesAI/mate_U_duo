import { useEffect, useRef, useState } from 'react';
import { BookOpen, Check, Plus, RotateCcw } from 'lucide-react';
import { SymbolInput } from './Keyboard';
import { checkLaw, laws, inference } from './laws';
import { equivalentAlgebra, classify, truthRows } from './engine';
import { useDraft, validText } from './drafts';
import { AlgebraRules } from './AlgebraRules';
import { MathExpression } from './MathExpression';
export function Laws({onClose,mode='logic'}:{onClose:()=>void;mode?:'logic'|'algebra'}) {
  const modal=useRef<HTMLElement>(null),close=useRef(onClose);close.current=onClose;
  useEffect(()=>{
    const previous=document.activeElement as HTMLElement|null,overflow=document.body.style.overflow;
    document.body.style.overflow='hidden';modal.current?.querySelector<HTMLButtonElement>('button')?.focus();
    const keyboard=(e:KeyboardEvent)=>{
      if(e.key==='Escape'){e.preventDefault();close.current();}
      if(e.key==='Tab'){
        const buttons=modal.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)');if(!buttons?.length)return;
        const first=buttons[0],last=buttons[buttons.length-1];
        if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
        else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
      }
    };
    document.addEventListener('keydown',keyboard);return()=>{document.removeEventListener('keydown',keyboard);document.body.style.overflow=overflow;previous?.focus();};
  },[]);
  return <div className="modal-backdrop" onClick={onClose}><section ref={modal} className="modal" role="dialog" aria-modal="true" aria-label={mode==='algebra'?'Reglas de Precálculo':'Leyes y reglas'} onClick={e=>e.stopPropagation()}><div className="row"><h2>{mode==='algebra'?'Tus fórmulas de Precálculo':'Tu caja de herramientas'}</h2><button onClick={onClose} aria-label="Cerrar leyes">✕</button></div>{mode==='algebra'?<AlgebraRules/>:<><p>Las leyes transforman expresiones equivalentes. Las inferencias derivan conclusiones desde premisas.</p><h3>Leyes lógicas</h3>{laws.map(l=><div className="law" key={l.name}><b>{l.name}</b>{l.patterns.map(([a,b])=><code key={a}>{a} ≡ {b}</code>)}<small>{l.text}</small></div>)}<h3>Reglas de inferencia</h3>{inference.map(([name,pattern])=><div className="law" key={name}><b>{name}</b><code>{pattern}</code></div>)}</>}<button className="primary" onClick={onClose}>Volver al ejercicio</button></section></div>;
}
export function Workbench({compact=false,initialMode:mode='logic',draftPrefix='mate-draft',onUseLine}:{compact?:boolean;initialMode?:'logic'|'algebra';draftPrefix?:string;onUseLine?:(line:string,reason:string)=>void}) {
  const [start,setStart,draftError]=useDraft(`${draftPrefix}-start`,'',validText);const [lines,setLines]=useDraft<{expr:string;law:string}[]>(`${draftPrefix}-lines`,[],v=>Array.isArray(v)&&v.length<200&&v.every(x=>x&&validText(x.expr)&&validText(x.law)));const [next,setNext]=useDraft(`${draftPrefix}-next`,'',validText);const [law,setLaw]=useState('De Morgan');const [message,setMessage]=useState('');const [showLaws,setShowLaws]=useState(false);const [table,setTable]=useState(false);
  const current=lines.at(-1)?.expr||start;
  function add() { try { const ok=mode==='logic'?checkLaw(current,next,law):equivalentAlgebra(current,next); if(!ok){setMessage(mode==='logic'?'Ese paso no coincide con la ley elegida. Puede requerir otra ley, otro orden o más de un paso.':'Las dos expresiones no son equivalentes como identidad. Revisá signos, factores y dominio.');return;}setLines([...lines,{expr:next,law:mode==='logic'?law:'Identidad algebraica'}]);setNext('');setMessage('Paso comprobado. Podés seguir o copiarlo a tu desarrollo.'); }catch(e){setMessage(String(e instanceof Error?e.message:e));} }
  function example(){setStart(mode==='logic'?'¬(P∧Q)':'x^2-1');setNext(mode==='logic'?'¬P∨¬Q':'(x-1)*(x+1)');setLaw('De Morgan');setMessage('Ejemplo cargado. Tocá «Comprobar paso» para ver qué verifica esta herramienta.');}
  let rows: ReturnType<typeof truthRows>=[],error=''; if(table)try{rows=truthRows(current);if(rows.length>16){rows=[];error='Para esta vista usá hasta cuatro variables.';}}catch(e){error=e instanceof Error?e.message:'';}
  return <section className={`card workbench ${compact?'compact':''}`}><div className="row"><div><span className="eyebrow">{mode==='logic'?'EQUIVALENCIAS LÓGICAS':'TRANSFORMACIONES ALGEBRAICAS'}</span><h2>Un paso. Una razón.</h2></div><button className="secondary" onClick={()=>setShowLaws(true)}><BookOpen size={16}/>{mode==='logic'?'Ver leyes':'Ver fórmulas'}</button></div>
    <ol className="workbench-guide"><li>Escribí la expresión de partida.</li><li>Proponé una expresión equivalente{mode==='logic'?' y elegí la ley que usaste':''}.</li><li>Comprobá el paso; si falla, podés editarlo y volver a intentar.</li></ol>
    <p className="workbench-scope">{mode==='logic'?'Comprueba una ley de equivalencia por paso. Para derivar una conclusión desde premisas, abrí «Inferencias».':'Comprueba una identidad algebraica. Anotá aparte las restricciones del dominio; este control no certifica la solución completa.'}</p>
    {draftError&&<p role="alert">{draftError}</p>}<small>Tu trabajo se guarda en este dispositivo.</small>{!lines.length&&<button type="button" className="text-button" onClick={example}>Probar con un ejemplo explicado</button>}
    {lines.length===0?<SymbolInput compact={compact} value={start} onChange={setStart} mode={mode} label="Expresión inicial"/>:<div className="proof-line"><span>0</span><code>{mode==="algebra"?<MathExpression value={start}/>:start}</code><small>Inicio</small></div>}
    {lines.map((l,i)=><div className="proof-line" key={i}><span>{i+1}</span><code>{mode==="algebra"?<MathExpression value={l.expr}/>:l.expr}</code><small><Check size={14}/>{l.law}</small></div>)}
    <SymbolInput value={next} onChange={setNext} mode={mode} label="Siguiente paso" onNextLine={()=>{if(next.trim())add();else setMessage('Escribí el siguiente paso antes de bajar.');}}/>{mode==='logic'&&<label>Ley aplicada<select value={law} onChange={e=>setLaw(e.target.value)}>{laws.map(l=><option key={l.name}>{l.name}</option>)}</select></label>}
    <div className="row wrap"><button className="primary" disabled={!next.trim()||!start.trim()} onClick={add}><Plus size={18}/>Comprobar paso</button>{lines.length>0&&<button className="secondary" onClick={()=>{const last=lines.at(-1)!;setLines(lines.slice(0,-1));setNext(last.expr);setMessage('Último paso listo para corregir.');}}>Corregir último paso</button>}<button className="secondary" onClick={()=>{setLines([]);setStart('');setNext('');setTable(false);setMessage('Cuaderno despejado. Podés empezar otra transformación.');}}><RotateCcw size={16}/>Empezar de cero</button>{mode==='logic'&&<button className="secondary" aria-expanded={table} onClick={()=>setTable(!table)}>{table?'Ocultar tabla':'Ver tabla de verdad'}</button>}</div><p role="status" className="notice">{message}</p>
    {onUseLine&&lines.length>0&&<button type="button" className="secondary workbench-copy" onClick={()=>onUseLine(lines.at(-1)!.expr,lines.at(-1)!.law)}>Copiar último paso comprobado a mi desarrollo</button>}
    {mode==='algebra'&&<small>Compara identidad algebraica; no comprueba el método ni el dominio. Conservá tus restricciones en el ejercicio.</small>}
    {table&&<div className="table-scroll">{error?<p>{error}</p>:<><p>{classify(current)}</p><table><thead><tr>{Object.keys(rows[0]?.values||{}).map(v=><th key={v}>{v}</th>)}<th>{current}</th></tr></thead><tbody>{rows.map((r,i)=><tr key={i}>{Object.values(r.values).map((v,j)=><td key={j}>{v?'V':'F'}</td>)}<td>{r.result?'V':'F'}</td></tr>)}</tbody></table></>}</div>}{showLaws&&<Laws mode={mode} onClose={()=>setShowLaws(false)}/>}</section>;
}
