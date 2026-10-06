import { useLayoutEffect, useRef, useState } from 'react';
import { Delete, ChevronLeft, ChevronRight, Keyboard as KeyboardIcon, ArrowDown } from 'lucide-react';
import { AlgebraInput } from './AlgebraInput';
const logic = [['P','Q','R','S','T','U'],['¬','∧','∨','⊻','→','↔'],['(',')','1','0','∀','∃']];
const algebra = [['x','y','a','b','(',')'],['7','8','9','+','−','^'],['4','5','6','*','/','.'],['1','2','3','0',',','=']];
const sets = [['A','B','C','Ω','∅','ᶜ'],['∪','∩','−','△','∈','⊆'],['{','}','(',')','[',']']];
type SymbolProps={value:string;onChange:(s:string)=>void;mode?:'logic'|'algebra'|'sets';label?:string;disabled?:boolean;compact?:boolean;onNextLine?:()=>void};
export function SymbolInput({value,onChange,mode='logic',label='Tu respuesta',disabled=false,compact=false,onNextLine}:SymbolProps) {
  return mode==='algebra'?<AlgebraInput value={value} onChange={onChange} label={label} disabled={disabled} compact={compact} onNextLine={onNextLine}/>:<PlainSymbolInput value={value} onChange={onChange} mode={mode} label={label} disabled={disabled} compact={compact} onNextLine={onNextLine}/>;
}
function PlainSymbolInput({value,onChange,mode='logic',label='Tu respuesta',disabled=false,compact=false,onNextLine}:SymbolProps) {
  const input=useRef<HTMLInputElement>(null), pending=useRef<number|null>(null), cursor=useRef(value.length);
  const [native,setNative]=useState(false),[expanded,setExpanded]=useState(!compact), rows=mode==='logic'?logic:mode==='sets'?sets:algebra;
  function focus(pos:number) {cursor.current=pos;input.current?.focus({preventScroll:true});input.current?.setSelectionRange(pos,pos);}
  // Restore the caret after React updates the controlled value, before the next touch.
  useLayoutEffect(()=>{if(pending.current!==null){focus(pending.current);pending.current=null;}},[value]);
  function commit(next:string,pos:number) {pending.current=pos;onChange(next);if(next===value){focus(pos);pending.current=null;}}
  function insert(token:string) {
    const el=input.current,start=el?.selectionStart??cursor.current,end=el?.selectionEnd??start;
    commit(value.slice(0,start)+token+value.slice(end),start+token.length);
  }
  function move(delta:number) {focus(Math.max(0,Math.min(value.length,(input.current?.selectionStart??cursor.current)+delta)));}
  function remove() {
    const el=input.current,start=el?.selectionStart??cursor.current,end=el?.selectionEnd??start;
    if(start!==end)commit(value.slice(0,start)+value.slice(end),start);
    else if(start)commit(value.slice(0,start-1)+value.slice(start),start-1);
  }
  return <div className="symbol-editor"><label>{label}<input ref={input} aria-label={label} value={value} disabled={disabled} inputMode={native?'text':'none'} autoComplete="off" autoCapitalize="off" spellCheck={false} onFocus={()=>{if(compact)setExpanded(true);}} onBlur={()=>{if(compact)setExpanded(false);}} onChange={e=>onChange(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&onNextLine&&!e.nativeEvent.isComposing){e.preventDefault();onNextLine();}}} onSelect={e=>{cursor.current=e.currentTarget.selectionStart??0;}} placeholder="Tocá los símbolos de abajo…"/></label>
    {compact&&!expanded&&<small>Tocá la expresión para editarla con el teclado.</small>}{expanded&&!disabled&&<><div className="symbol-keys" aria-label="Teclado matemático">{rows.flat().map(k=><button type="button" key={k} disabled={disabled} onPointerDown={e=>e.preventDefault()} onClick={()=>insert(k)} aria-label={({ '¬':'Negación','∧':'Conjunción','∨':'Disyunción','→':'Implicación','↔':'Bicondicional','⊻':'Disyunción exclusiva' } as Record<string,string>)[k]||k}>{k}</button>)}</div>
    <div className="editor-actions"><button type="button" disabled={disabled} onPointerDown={e=>e.preventDefault()} onClick={()=>move(-1)} aria-label="Mover cursor a la izquierda"><ChevronLeft size={18}/></button><button type="button" disabled={disabled} onPointerDown={e=>e.preventDefault()} onClick={()=>move(1)} aria-label="Mover cursor a la derecha"><ChevronRight size={18}/></button><button type="button" disabled={disabled} onPointerDown={e=>e.preventDefault()} onClick={remove} aria-label="Borrar símbolo"><Delete size={18}/></button><button type="button" disabled={disabled} onPointerDown={e=>e.preventDefault()} onClick={()=>commit('',0)}>Limpiar</button>{onNextLine&&<button type="button" disabled={disabled} onPointerDown={e=>e.preventDefault()} onClick={onNextLine} aria-label="Bajar línea"><ArrowDown size={18}/><span>Bajar</span></button>}<button type="button" disabled={disabled} onPointerDown={e=>e.preventDefault()} onClick={()=>setNative(!native)} aria-pressed={native}><KeyboardIcon size={16}/>{native?'Teclado táctil':'Teclado del teléfono'}</button></div>
    {mode==='logic'&&<small>¬ no · ∧ y · ∨ o · → si… entonces · 1 verdadero · 0 falso</small>}</>}
  </div>;
}
