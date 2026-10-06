import { Fragment, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Delete, Keyboard, Undo2, ArrowDown } from 'lucide-react';
import { canonicalMath, mathParts, replaceMathSelection } from './mathNotation';

const keys=['x','y','a','b','(',')','7','8','9','+','−','power','4','5','6','*','/','.','1','2','3','0',',','='];
export function AlgebraInput({value,onChange,label,disabled=false,compact=false,onNextLine}:{value:string;onChange:(value:string)=>void;label:string;disabled?:boolean;compact?:boolean;onNextLine?:()=>void}) {
  const id=useId(),field=useRef<HTMLDivElement>(null),nativeInput=useRef<HTMLInputElement>(null),pending=useRef<number|null>(null);
  const [native,setNative]=useState(false),[expanded,setExpanded]=useState(!compact),[selection,setSelection]=useState({start:value.length,end:value.length}),[undo,setUndo]=useState<{value:string;start:number;end:number}[]>([]);
  useEffect(()=>{pending.current=null;setSelection({start:0,end:0});setUndo([]);},[label]);
  const cursor=Math.min(selection.start,value.length),end=Math.min(selection.end,value.length),parts=mathParts(value);
  function focus(){(native?nativeInput.current:field.current)?.focus({preventScroll:true});}
  useLayoutEffect(()=>{if(pending.current!==null){const pos=pending.current;setSelection({start:pos,end:pos});nativeInput.current?.setSelectionRange(pos,pos);pending.current=null;focus();}},[value,native]);
  function positions(){return native?{start:nativeInput.current?.selectionStart??cursor,end:nativeInput.current?.selectionEnd??end}:{start:cursor,end};}
  function commit(next:string,pos:number){
    if(disabled)return;setUndo(history=>[...history.slice(-29),{value,start:cursor,end}]);pending.current=pos;onChange(next);
    if(next===value){setSelection({start:pos,end:pos});pending.current=null;focus();}
  }
  function insert(token:string,inside?:number){const p=positions(),next=replaceMathSelection(value,p.start,p.end,token,inside);commit(next.value,next.cursor);}
  function move(delta:number){const p=positions(),pos=Math.max(0,Math.min(value.length,(delta<0?p.start:p.end)+delta));setSelection({start:pos,end:pos});nativeInput.current?.setSelectionRange(pos,pos);focus();}
  function remove(forward=false){const p=positions();if(p.start!==p.end)commit(value.slice(0,p.start)+value.slice(p.end),p.start);else if(forward&&p.start<value.length)commit(value.slice(0,p.start)+value.slice(p.start+1),p.start);else if(!forward&&p.start){const previous=value[p.start-2]==='^'?p.start-2:p.start-1;commit(value.slice(0,previous)+value.slice(p.start),previous);}}
  function restore(){const previous=undo.at(-1);if(!previous||disabled)return;setUndo(h=>h.slice(0,-1));pending.current=previous.start;onChange(previous.value);setSelection({start:previous.start,end:previous.end});focus();}
  function tap(e:React.PointerEvent<HTMLDivElement>){
    if(disabled)return;const token=(e.target as HTMLElement).closest<HTMLElement>('[data-math-start]');
    if(token){const rect=token.getBoundingClientRect(),pos=Number(e.clientX<rect.left+rect.width/2?token.dataset.mathStart:token.dataset.mathEnd);setSelection({start:pos,end:pos});}
    else setSelection({start:value.length,end:value.length});focus();
  }
  function character(text:string,start:number,to:number){return <span key={start} data-math-start={start} data-math-end={to} className={start>=cursor&&to<=end&&end>cursor?'math-selected':''}>{text}</span>;}
  const caret=<i className="math-caret" aria-hidden="true"/>;
  function renderPart(p:typeof parts[number]) {
    if(!p.power)return <Fragment key={p.start}>{cursor===p.start&&end===cursor&&caret}{character(p.text,p.start,p.end)}</Fragment>;
    const chars=[...p.text];return <sup key={p.start} className={p.text==='□'?'power-placeholder':''}>{cursor===p.start&&end===cursor&&caret}{chars.map((c,j)=><Fragment key={j}>{cursor===p.start+1+j&&end===cursor&&caret}{character(c,p.text==='□'?p.start:p.start+1+j,p.text==='□'?p.end:p.start+2+j)}</Fragment>)}</sup>;
  }
  return <div className="symbol-editor algebra-editor"><span id={id} className="math-field-label">{label}</span>
    {native?<input ref={nativeInput} aria-label={label} value={value} disabled={disabled} inputMode="text" autoComplete="off" autoCapitalize="off" spellCheck={false} onChange={e=>{const next=canonicalMath(e.target.value);commit(next,canonicalMath(e.target.value.slice(0,e.target.selectionStart??e.target.value.length)).length);}} onKeyDown={e=>{if(e.key==='Enter'&&onNextLine&&!e.nativeEvent.isComposing){e.preventDefault();onNextLine();}}} onSelect={e=>setSelection({start:e.currentTarget.selectionStart??0,end:e.currentTarget.selectionEnd??0})}/>:<div ref={field} className={`math-field ${disabled?'is-locked':''}`} role="textbox" aria-labelledby={id} aria-readonly={disabled} aria-multiline="false" tabIndex={disabled?-1:0} data-value={value} onFocus={()=>setExpanded(true)} onBlur={e=>{if(compact&&!e.currentTarget.parentElement?.contains(e.relatedTarget as Node))setExpanded(false);}} onPointerUp={tap} onPaste={e=>{e.preventDefault();if(!disabled)insert(e.clipboardData.getData('text/plain'));}} onCopy={e=>{if(end>cursor){e.preventDefault();e.clipboardData.setData('text/plain',value.slice(cursor,end));}}} onKeyDown={e=>{
      if(disabled)return;if(e.key==='Enter'&&onNextLine&&!e.nativeEvent.isComposing){e.preventDefault();onNextLine();return;}if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='a'){e.preventDefault();setSelection({start:0,end:value.length});return;}
      if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'){e.preventDefault();restore();return;}if(e.ctrlKey||e.metaKey||e.altKey)return;
      if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();move(e.key==='ArrowLeft'?-1:1);}
      else if(e.key==='Home'||e.key==='End'){e.preventDefault();const p=e.key==='Home'?0:value.length;setSelection({start:p,end:p});}
      else if(e.key==='Backspace'||e.key==='Delete'){e.preventDefault();remove(e.key==='Delete');}
      else if(e.key.length===1){e.preventDefault();insert(e.key);}
    }}>{value?parts.map(renderPart):<span className="math-placeholder">Tocá una variable o un número…</span>}{cursor===value.length&&end===cursor&&caret}</div>}
    {!disabled&&expanded&&<><div className="math-templates" role="group" aria-label="Atajos matemáticos"><button onPointerDown={e=>e.preventDefault()} onClick={()=>insert('^2')} aria-label="Elevar al cuadrado">□<sup>2</sup><small>Cuadrado</small></button><button onPointerDown={e=>e.preventDefault()} onClick={()=>insert('^3')} aria-label="Elevar al cubo">□<sup>3</sup><small>Cubo</small></button><button onPointerDown={e=>e.preventDefault()} onClick={()=>insert('()',1)} aria-label="Insertar paréntesis">(□)<small>Agrupar</small></button><button onPointerDown={e=>e.preventDefault()} onClick={()=>insert('()/()',1)} aria-label="Insertar fracción"><span className="fraction-key"><span>□</span><span>□</span></span><small>Fracción</small></button></div>
      <div className="symbol-keys" aria-label="Teclado de álgebra">{keys.map(k=><button key={k} type="button" onPointerDown={e=>e.preventDefault()} onClick={()=>insert(k==='power'?'^':k)} aria-label={k==='power'?'Potencia':k==='*'?'Multiplicar':k==='/'?'Dividir':k}>{k==='power'?<span>x<sup>n</sup></span>:k==='*'?'×':k==='/'?'÷':k}</button>)}</div>
      <div className="editor-actions"><button onPointerDown={e=>e.preventDefault()} onClick={()=>move(-1)} aria-label="Mover cursor a la izquierda"><ChevronLeft size={18}/></button><button onPointerDown={e=>e.preventDefault()} onClick={()=>move(1)} aria-label="Mover cursor a la derecha"><ChevronRight size={18}/></button><button onPointerDown={e=>e.preventDefault()} onClick={()=>remove()} aria-label="Borrar símbolo"><Delete size={18}/></button><button disabled={!undo.length} onPointerDown={e=>e.preventDefault()} onClick={restore} aria-label="Deshacer edición"><Undo2 size={17}/></button><button onPointerDown={e=>e.preventDefault()} onClick={()=>commit('',0)}>Limpiar</button>{onNextLine&&<button onPointerDown={e=>e.preventDefault()} onClick={onNextLine} aria-label="Bajar línea"><ArrowDown size={18}/><span>Bajar</span></button>}<button onPointerDown={e=>e.preventDefault()} onClick={()=>setNative(!native)} aria-pressed={native}><Keyboard size={16}/>{native?'Volver a símbolos':'Teclado del teléfono'}</button></div>
      <small>Para elevar: base → potencia → número. Tocá un término para editarlo; + o − vuelve a la línea principal.</small></>}
    {compact&&!expanded&&!disabled&&<small>Tocá la expresión para abrir el teclado.</small>}
  </div>;
}
