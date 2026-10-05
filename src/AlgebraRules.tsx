import { useState } from 'react';
import katex from 'katex';
import { algebraRules } from './algebraRules';
function Formula({value}:{value:string}) {return <div className="rule-formula" dangerouslySetInnerHTML={{__html:katex.renderToString(value,{throwOnError:false,strict:false,displayMode:true})}}/>;}
export function AlgebraRules() {
  const [category,setCategory]=useState('powers');const group=algebraRules.find(g=>g.id===category)!;
  return <div className="algebra-rules"><p>Elegí la familia de reglas que necesitás. Cada fórmula tiene un ejemplo y sus condiciones.</p><div className="rule-categories" role="group" aria-label="Familias de reglas de Precálculo">{algebraRules.map(g=><button key={g.id} aria-pressed={category===g.id} className={category===g.id?'selected':''} onClick={()=>setCategory(g.id)}>{g.title}</button>)}</div><h3>{group.title}</h3>{category==='powers'&&<p>Acá m y n son enteros. Usá bases para las que todas las expresiones estén definidas.</p>}{group.rules.map(rule=><article className="algebra-rule" key={rule.name}><h4>{rule.name}</h4><Formula value={rule.formula}/><p>{rule.why}</p>{rule.condition&&<small className="rule-condition">Condición: {rule.condition}</small>}<details><summary>Ver un ejemplo</summary><Formula value={rule.example}/></details></article>)}</div>;
}
