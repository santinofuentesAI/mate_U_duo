import { useLayoutEffect, useRef, useState } from 'react';
import { Delete, ChevronLeft, ChevronRight, Keyboard as KeyboardIcon, ArrowDown } from 'lucide-react';
import { AlgebraInput, algebraKeyTokens } from './AlgebraInput';
export type KeyboardMode = 'logic' | 'algebra' | 'sets' | 'number' | 'cardinality' | 'quantifier' | 'inequality' | 'radical';
const logic = [['P','Q','R','S','T','U'],['¬','∧','∨','⊻','→','↔'],['(',')','1','0','∀','∃']];
const algebra = [['x','y','a','b','(',')'],['7','8','9','+','−','^'],['4','5','6','*','/','.'],['1','2','3','0',',','=']];
const sets = [['A','B','C','Ω','∅','ᶜ'],['∪','∩','−','△','∈','⊆'],['{','}','(',')','[',']'],['×','|','ℕ','P']];
const numbers = [['7','8','9'],['4','5','6'],['1','2','3'],['0',',','−']];
const cardinality = [['|','P','×','2^','∪','∩'],['⊆','∈','ℕ','∅','{','}'],['7','8','9','4','5','6'],['1','2','3','0',',','−']];
const quantifier = [['∀','∃','¬','∧','∨','→'],['↔','∈','∉','ℕ','ℤ','ℝ'],['P','Q','x','y','∅','(',')']];
const names: Record<string, string> = {
  '¬': 'Negación', '∧': 'Conjunción', '∨': 'Disyunción', '→': 'Implicación', '↔': 'Bicondicional', '⊻': 'Disyunción exclusiva',
  '|': 'Cardinal', '×': 'Producto', '2^': 'Dos elevado a', '∪': 'Unión', '∩': 'Intersección', '⊆': 'Subconjunto',
  '∈': 'Pertenece', '∉': 'No pertenece', 'ℕ': 'Naturales', 'ℤ': 'Enteros', 'ℝ': 'Reales', '∅': 'Conjunto vacío',
  '∀': 'Para todo', '∃': 'Existe', 'ᶜ': 'Complemento',
};
function keyRows(mode: KeyboardMode): string[][] {
  switch (mode) {
    case 'logic': return logic;
    case 'algebra':
    case 'inequality':
    case 'radical': return algebra;
    case 'sets': return sets;
    case 'number': return numbers;
    case 'cardinality': return cardinality;
    case 'quantifier': return quantifier;
    default: {
      const never: never = mode;
      return never;
    }
  }
}
/** Caracteres que el teclado inserta solos. 2ⁿ no cuenta como el dígito 2. */
export function typeableGlyphs(mode: KeyboardMode): string {
  switch (mode) {
    case 'algebra':
      return algebraKeyTokens.map(token => token === 'power' ? '^' : token).join('') + '√';
    case 'inequality':
      return algebraKeyTokens.map(token => token === 'power' ? '^' : token).join('') + '√≤≥<>∞∪∅';
    case 'radical':
      return algebraKeyTokens.map(token => token === 'power' ? '^' : token).join('') + '√∛|';
    case 'logic':
    case 'sets':
    case 'number':
    case 'cardinality':
    case 'quantifier':
      return keyRows(mode).flat().filter(token => token !== '2^').join('');
    default: {
      const never: never = mode;
      return never;
    }
  }
}

function padLabel(mode: KeyboardMode): string {
  switch (mode) {
    case 'number': return 'Teclado numérico';
    case 'cardinality': return 'Teclado de cardinalidad';
    case 'quantifier': return 'Teclado de cuantificadores';
    case 'sets': return 'Teclado de conjuntos';
    case 'logic':
    case 'algebra':
    case 'inequality':
    case 'radical': return 'Teclado matemático';
    default: {
      const never: never = mode;
      return never;
    }
  }
}
type SymbolProps={value:string;onChange:(s:string)=>void;mode?:KeyboardMode;label?:string;disabled?:boolean;compact?:boolean;onNextLine?:()=>void};
export function SymbolInput({value,onChange,mode='logic',label='Tu respuesta',disabled=false,compact=false,onNextLine}:SymbolProps) {
  if (mode === 'algebra' || mode === 'inequality' || mode === 'radical') return <AlgebraInput value={value} onChange={onChange} label={label} disabled={disabled} compact={compact} onNextLine={onNextLine} pad={mode}/>;
  return <PlainSymbolInput value={value} onChange={onChange} mode={mode} label={label} disabled={disabled} compact={compact} onNextLine={onNextLine}/>;
}
function PlainSymbolInput({value,onChange,mode='logic',label='Tu respuesta',disabled=false,compact=false,onNextLine}:SymbolProps) {
  const input=useRef<HTMLInputElement>(null), pending=useRef<number|null>(null), cursor=useRef(value.length);
  const [native,setNative]=useState(false),[expanded,setExpanded]=useState(!compact), rows=keyRows(mode);
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
  return <div className="symbol-editor"><label>{label}<input ref={input} aria-label={label} value={value} disabled={disabled} inputMode={native?(mode==='number'?'numeric':'text'):'none'} autoComplete="off" autoCapitalize="off" spellCheck={false} onFocus={()=>{if(compact)setExpanded(true);}} onBlur={()=>{if(compact)setExpanded(false);}} onChange={e=>onChange(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&onNextLine&&!e.nativeEvent.isComposing){e.preventDefault();onNextLine();}}} onSelect={e=>{cursor.current=e.currentTarget.selectionStart??0;}} placeholder={mode==='number'?'Tocá los números de abajo…':'Tocá los símbolos de abajo…'}/></label>
    {compact&&!expanded&&<small>Tocá la expresión para editarla con el teclado.</small>}{expanded&&!disabled&&<><div className={`symbol-keys${mode==='number'?' number-keys':''}`} aria-label={padLabel(mode)}>{rows.flat().map((k,i)=><button type="button" key={`${k}-${i}`} disabled={disabled} onPointerDown={e=>e.preventDefault()} onClick={()=>insert(k)} aria-label={names[k]||k}>{k==='2^'?<span>2<sup>n</sup></span>:k}</button>)}</div>
    <div className="editor-actions"><button type="button" disabled={disabled} onPointerDown={e=>e.preventDefault()} onClick={()=>move(-1)} aria-label="Mover cursor a la izquierda"><ChevronLeft size={18}/></button><button type="button" disabled={disabled} onPointerDown={e=>e.preventDefault()} onClick={()=>move(1)} aria-label="Mover cursor a la derecha"><ChevronRight size={18}/></button><button type="button" disabled={disabled} onPointerDown={e=>e.preventDefault()} onClick={remove} aria-label="Borrar símbolo"><Delete size={18}/></button><button type="button" disabled={disabled} onPointerDown={e=>e.preventDefault()} onClick={()=>commit('',0)}>Limpiar</button>{onNextLine&&<button type="button" disabled={disabled} onPointerDown={e=>e.preventDefault()} onClick={onNextLine} aria-label="Bajar línea"><ArrowDown size={18}/><span>Bajar</span></button>}<button type="button" disabled={disabled} onPointerDown={e=>e.preventDefault()} onClick={()=>setNative(!native)} aria-pressed={native}><KeyboardIcon size={16}/>{native?'Teclado táctil':'Teclado del teléfono'}</button></div>
    {mode==='logic'&&<small>¬ no · ∧ y · ∨ o · → si… entonces · 1 verdadero · 0 falso</small>}{mode==='number'&&<small>Escribí solo el número, sin unidades. La coma separa varios resultados.</small>}{mode==='cardinality'&&<small>|A| cuenta elementos. ∅ es el vacío: no tiene elementos y entra en P(A). P es el conjunto potencia y × el producto de pares. La respuesta que se corrige es el número; la coma separa varios.</small>}{mode==='quantifier'&&<small>∀ para todo · ∃ existe · ∈ pertenece. El universo de este curso incluye el 0 en ℕ.</small>}{mode==='sets'&&<small>∪ junta · ∩ lo común · − lo que sobra · × pares ordenados · | cardinal.</small>}</>}
  </div>;
}
