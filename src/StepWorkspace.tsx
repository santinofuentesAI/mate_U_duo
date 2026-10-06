import { useState } from 'react';
import { ArrowDown, Check, Trash2 } from 'lucide-react';
import { SymbolInput } from './Keyboard';
import { MathExpression } from './MathExpression';
import { equivalentAlgebra } from './engine';

type Props={
  lines:string[];
  onChange:(lines:string[])=>void;
  mode:'logic'|'algebra';
  disabled?:boolean;
};

export function StepWorkspace({lines,onChange,mode,disabled=false}:Props){
  const [active,setActive]=useState(lines.length-1);
  const [notice,setNotice]=useState('');
  const [checked,setChecked]=useState<number|null>(null);
  const current=Math.min(active,lines.length-1);
  function update(value:string){onChange(lines.map((line,i)=>i===current?value:line));setNotice('');setChecked(null);}
  function descend(){
    if(disabled)return;
    if(!lines[current].trim()){setNotice('Escribí esta línea antes de bajar a la siguiente.');return;}
    if(lines.length>=24){setNotice('El cuaderno admite hasta 24 líneas por ejercicio. Podés borrar las que ya no necesités.');return;}
    const copy=[...lines];copy.splice(current+1,0,'');onChange(copy);setActive(current+1);setChecked(null);setNotice('Nueva línea lista. Probá el siguiente paso.');
  }
  function remove(index:number){if(disabled||lines.length===1)return;const copy=lines.filter((_,i)=>i!==index);onChange(copy);setActive(Math.min(index,copy.length-1));setChecked(null);setNotice('Línea eliminada. Podés seguir editando.');}
  function checkPrevious(){
    if(current<1||!lines[current-1]?.trim()||!lines[current]?.trim())return;
    try{const valid=equivalentAlgebra(lines[current-1],lines[current]);setChecked(current);setNotice(valid?'Estas dos expresiones son equivalentes. Conservá las restricciones del dominio.':'Estas dos expresiones no son equivalentes como identidades. Revisá factores, signos y dominio.');}
    catch{setChecked(current);setNotice('No pude interpretar una de las expresiones. Revisá paréntesis y exponentes.');}
  }
  return <section className="step-workspace" aria-label="Cuaderno de pasos del ejercicio">
    <div className="step-workspace-head"><div><span className="eyebrow">MI DESARROLLO</span><h3>Probá una línea a la vez</h3></div><span className="step-count">{lines.length} {lines.length===1?'línea':'líneas'}</span></div>
    <p>Enter o «Bajar línea» abre otro paso. Tocá uno anterior para cambiarlo. La última línea es la respuesta que se corrige.</p>
    <ol className="step-workspace-list">{lines.map((line,i)=><li key={i} className={i===current?'active':''}>
      <button type="button" className="step-workspace-line" aria-current={i===current?'step':undefined} onClick={()=>{setActive(i);setChecked(null);setNotice('');}}>
        <span className="step-workspace-number">{i+1}</span><span className="step-workspace-expression">{line?mode==='algebra'?<MathExpression value={line}/>:line:<em>{i===lines.length-1?'Tu respuesta va aquí':'Paso pendiente'}</em>}</span><small>{i===lines.length-1?'Respuesta':'Borrador'}</small>
      </button>
      {!disabled&&lines.length>1&&<button type="button" className="step-workspace-delete" aria-label={`Borrar línea ${i+1}`} onClick={()=>remove(i)}><Trash2 size={16}/></button>}
    </li>)}</ol>
    <div className="step-workspace-editor"><SymbolInput key={`${mode}-${current}`} value={lines[current]} onChange={update} mode={mode} label={`Editar línea ${current+1}`} disabled={disabled} onNextLine={descend}/>
      {!disabled&&<div className="step-workspace-actions"><button type="button" className="secondary" onClick={descend}><ArrowDown size={18}/>Bajar línea</button>{mode==='algebra'&&current>0&&<button type="button" className="secondary" disabled={!lines[current-1]?.trim()||!lines[current]?.trim()} onClick={checkPrevious}><Check size={17}/>¿Son equivalentes?</button>}</div>}
      {notice&&<p className={`step-workspace-notice ${checked===current?'checked':''}`} role="status">{notice}</p>}
    </div>
  </section>;
}
