import { useState, type CSSProperties } from 'react';
import { ArrowRight, BookOpen, Check, Coins, Lightbulb, ListTree, RotateCcw } from 'lucide-react';
import type { AnswerDetails, Course, Question } from './types';
import { equivalentLogic } from './engine';
import { SymbolInput } from './Keyboard';
import { Laws } from './Workbench';
import { AnswerFeedback } from './AnswerFeedback';
import { AnswerReveal } from './AnswerReveal';

export function GuidedProofExercise({question:q,course,coins,onSpend,onAttempt,onNext,rewardAvailable=false,sealed=false}:{question:Question;course:Course;coins:number;onSpend:(n:number)=>void;onAttempt:(correct:boolean,assisted:boolean,details:AnswerDetails)=>void;onNext:()=>void;rewardAvailable?:boolean;sealed?:boolean}) {
  const steps=q.guidedSteps||[],rules=q.options||[];
  const [at,setAt]=useState(0),[expression,setExpression]=useState(''),[rule,setRule]=useState(''),[message,setMessage]=useState(''),[help,setHelp]=useState(0),[complete,setComplete]=useState(false),[mistakes,setMistakes]=useState(0),[showLaws,setShowLaws]=useState(false),[revealedAnswer,setRevealedAnswer]=useState(false),[showAnswer,setShowAnswer]=useState(false);
  const step=steps[at],assisted=help>0;
  function check() {
    if(!step)return;
    let matches=false;
    try { matches=equivalentLogic(expression,step.expression); } catch { setMessage('Revisá la sintaxis: usá ¬, ∧, ∨, → y paréntesis desde el teclado.'); return; }
    if(!matches){if(sealed){onAttempt(false,false,{answer:expression});onNext();return;}setMistakes(n=>n+1);setMessage('La conclusión todavía no es la siguiente línea de esta demostración. Mirá las premisas y probá una transformación a la vez.');return;}
    if(rule!==step.rule){if(sealed){onAttempt(false,false,{answer:`${expression} · ${rule}`});onNext();return;}setMistakes(n=>n+1);setMessage('La expresión es correcta, pero elegí la regla que justifica exactamente este paso.');return;}
    if(at===steps.length-1){setComplete(true);onAttempt(true,assisted||mistakes>0||revealedAnswer,{answer:steps.map(s=>`${s.expression} · ${s.rule}`)});if(sealed){onNext();return;}setMessage('Demostración completa. Cada línea quedó justificada.');return;}
    setAt(n=>n+1);setExpression('');setRule('');setHelp(0);setMessage(sealed?'Línea anotada.':'¡Paso verificado! Seguimos con la nueva conclusión.');
  }
  function reveal(kind:1|2) { if(kind===2){if(coins<5)return;onSpend(5);} setHelp(kind); }
  function reset(){setAt(0);setExpression('');setRule('');setHelp(0);setRevealedAnswer(false);setShowAnswer(false);setMessage('Empezamos otra vez desde las premisas.');setComplete(false);setMistakes(0);}
  return <section className="exercise guided-proof"><div className="row"><span className="eyebrow">DEMOSTRÁ PASO A PASO</span>{!sealed&&<button className="text-button" onClick={()=>setShowLaws(true)}><BookOpen size={16}/>Ver leyes lógicas</button>}</div>
    <h2>{q.prompt}</h2>{sealed?<p className="notice">Examen: sin pistas ni respuesta. Si la línea no cierra, ese punto se pierde.</p>:<p className="guided-intro"><ListTree size={18}/> No adivinés la cadena: escribí una línea, elegí su razón y comprobala antes de continuar.</p>}
    <section className="proof-premises" aria-label="Premisas de la demostración"><b>Premisas</b>{q.premises?.map((p,i)=><code key={p}>{i+1}. {p}</code>)}</section>
    <div className="proof-progress" aria-label={`Paso ${Math.min(at+1,steps.length)} de ${steps.length}`}><span style={{'--progress':String(complete?1:at/steps.length)} as CSSProperties}/><small>{complete?'Demostración terminada':`Paso ${at+1} de ${steps.length}`}</small></div>
    <div className="proof-lines" aria-label="Líneas verificadas">{steps.slice(0,at).map((s,i)=><div className="proof-line" key={s.expression}><span>{i+1}</span><code>{s.expression}</code><small><Check size={14}/>{s.rule}</small></div>)}{!complete&&<div className="proof-line current"><span>{at+1}</span><code>{expression||'Tu siguiente conclusión'}</code><small>{rule||'Elegí una regla'}</small></div>}</div>
    {!complete&&<><SymbolInput value={expression} onChange={v=>{setExpression(v);setMessage('');}} mode="logic" label="Nueva línea de la demostración" onNextLine={()=>{if(expression.trim()&&rule)check();else setMessage('Escribí una conclusión y elegí su regla antes de bajar.');}}/>
      <fieldset className="proof-rules"><legend>¿Qué regla aplicaste?</legend><div>{rules.map(r=><button type="button" key={r} aria-pressed={rule===r} className={rule===r?'selected':''} onClick={()=>{setRule(r);setMessage('');}}>{r}</button>)}</div></fieldset>
      {!sealed&&<div className="help-row"><button className="secondary" disabled={help>=1} onClick={()=>reveal(1)}><Lightbulb size={17}/>Pista del paso</button><button className="secondary" disabled={help>=2||coins<5} onClick={()=>reveal(2)}><Coins size={17}/>Mostrar línea · 5</button><small>{coins} monedas ficticias · intentos ∞</small></div>}
      {help>0&&<aside className="hint" role="status"><b>{help===1?'Pensá primero en esto':'La línea que buscamos'}</b><p>{help===1?step.hint:<><code>{step.expression}</code> mediante <b>{step.rule}</b>.</>}</p></aside>}
      {message&&<p className="notice" role="status">{message}</p>}<button className="primary wide" disabled={!expression||!rule} onClick={check}>{sealed?'Entregar':'Comprobar este paso'}<ArrowRight size={18}/></button></>}
    {complete&&!sealed&&<><AnswerFeedback correct error={message||q.explanation} explanation={q.explanation} xp={rewardAvailable?(assisted||mistakes>0?5:10):0} celebrate/><div className="guided-next"><button className="secondary wide" onClick={reset}><RotateCcw size={16}/>Resolver de nuevo</button><button className="primary wide" onClick={onNext}>Continuar<ArrowRight size={18}/></button></div></>}
    {!sealed&&<AnswerReveal question={q} open={showAnswer} completed={complete} onToggle={()=>{const next=!showAnswer;setShowAnswer(next);if(next)setRevealedAnswer(true);}}/>}
    {showLaws&&<Laws mode={course==='precalculo'?'algebra':'logic'} onClose={()=>setShowLaws(false)}/>}</section>;
}
