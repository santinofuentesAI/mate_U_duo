import { useRef, useState } from 'react';
import { Delete, ChevronLeft, ChevronRight, Keyboard as KeyboardIcon } from 'lucide-react';
const logic = [['P','Q','R','S','T','U'],['¬','∧','∨','⊻','→','↔'],['(',')','1','0','∀','∃']];
const algebra = [['x','y','a','b','(',')'],['7','8','9','+','−','^'],['4','5','6','*','/','.'],['1','2','3','0',',','=']];
const sets = [['A','B','C','Ω','∅','ᶜ'],['∪','∩','−','△','∈','⊆'],['{','}','(',')','[',']']];
export function SymbolInput({ value, onChange, mode='logic', label='Tu respuesta', disabled=false }: {value:string;onChange:(s:string)=>void;mode?:'logic'|'algebra'|'sets';label?:string;disabled?:boolean}) {
  const input=useRef<HTMLInputElement>(null); const [native,setNative]=useState(false); const [cursor,setCursor]=useState(value.length);
  const rows=mode==='logic'?logic:mode==='sets'?sets:algebra;
  function insert(token:string) { const el=input.current; const start=el?.selectionStart??cursor, end=el?.selectionEnd??start; const next=value.slice(0,start)+token+value.slice(end); onChange(next); const pos=start+token.length; setCursor(pos); requestAnimationFrame(()=>{el?.focus();el?.setSelectionRange(pos,pos);}); }
  function move(delta:number) { const pos=Math.max(0,Math.min(value.length,(input.current?.selectionStart??cursor)+delta)); setCursor(pos); input.current?.focus();input.current?.setSelectionRange(pos,pos); }
  function remove() { const el=input.current;const start=el?.selectionStart??cursor,end=el?.selectionEnd??start; if(start!==end){onChange(value.slice(0,start)+value.slice(end));setCursor(start);}else if(start){onChange(value.slice(0,start-1)+value.slice(start));setCursor(start-1);requestAnimationFrame(()=>{el?.focus();el?.setSelectionRange(start-1,start-1);});} }
  return <div className="symbol-editor"><label>{label}<input ref={input} aria-label={label} value={value} disabled={disabled} inputMode={native?'text':'none'} autoComplete="off" autoCapitalize="off" spellCheck={false} onChange={e=>onChange(e.target.value)} onSelect={e=>setCursor(e.currentTarget.selectionStart??0)} placeholder="Tocá los símbolos de abajo…"/></label>
    <div className="symbol-keys" aria-label="Teclado matemático">{rows.flat().map(k=><button type="button" key={k} disabled={disabled} onMouseDown={e=>e.preventDefault()} onClick={()=>insert(k)} aria-label={({ '¬':'Negación','∧':'Conjunción','∨':'Disyunción','→':'Implicación','↔':'Bicondicional','⊻':'Disyunción exclusiva' } as Record<string,string>)[k]||k}>{k}</button>)}</div>
    <div className="editor-actions"><button type="button" disabled={disabled} onMouseDown={e=>e.preventDefault()} onClick={()=>move(-1)} aria-label="Mover cursor a la izquierda"><ChevronLeft size={18}/></button><button type="button" disabled={disabled} onMouseDown={e=>e.preventDefault()} onClick={()=>move(1)} aria-label="Mover cursor a la derecha"><ChevronRight size={18}/></button><button type="button" disabled={disabled} onMouseDown={e=>e.preventDefault()} onClick={remove} aria-label="Borrar símbolo"><Delete size={18}/></button><button type="button" disabled={disabled} onClick={()=>onChange('')}>Limpiar</button><button type="button" onClick={()=>setNative(!native)} aria-pressed={native}><KeyboardIcon size={16}/>{native?'Teclado táctil':'Teclado del teléfono'}</button></div>
    {mode==='logic'&&<small>¬ no · ∧ y · ∨ o · → si… entonces · 1 verdadero · 0 falso</small>}
  </div>;
}
