import { useEffect, useState } from 'react';
import { ArrowDown, ArrowRight, BookOpen, Check, Lightbulb, ListTree } from 'lucide-react';
import type { AnswerDetails, Question } from './types';
import { equivalentLogic } from './engine';
import { SymbolInput } from './Keyboard';
import { Laws } from './Workbench';
import { AnswerReveal } from './AnswerReveal';
import { AnswerFeedback } from './AnswerFeedback';

type Draft={at:number;expression:string;rule:string;mistakes:number;revealed:boolean;complete:boolean;translated:string;earned:number;};
function restore(key:string|undefined,steps:number):Draft{
  const empty={at:-1,expression:'',rule:'',mistakes:0,revealed:false,complete:false,translated:'',earned:0};
  try {const data=key?JSON.parse(localStorage.getItem(key)||'null'):null;if(!data||!Number.isInteger(data.at)||data.at<-1||data.at>=steps||typeof data.expression!=='string'||data.expression.length>150||typeof data.rule!=='string'||typeof data.translated!=='string')return empty;return {...empty,...data};} catch{return empty;}
}
export function ExamReasoningExercise({question:q,onAttempt,onNext,draftKey,rewardAvailable=false}:{question:Question;onAttempt:(correct:boolean,assisted:boolean,details:AnswerDetails)=>void;onNext:()=>void;draftKey?:string;rewardAvailable?:boolean}){
  const steps=q.guidedSteps||[];
  const [initial]=useState(()=>restore(draftKey,steps.length));
  const [at,setAt]=useState(initial.at),[expression,setExpression]=useState(initial.expression),[rule,setRule]=useState(initial.rule),[mistakes,setMistakes]=useState(initial.mistakes),[revealed,setRevealed]=useState(initial.revealed),[complete,setComplete]=useState(initial.complete),[translated,setTranslated]=useState(initial.translated);
  const [showAnswer,setShowAnswer]=useState(initial.revealed),[laws,setLaws]=useState(false),[hint,setHint]=useState(false),[notice,setNotice]=useState(''),[earned,setEarned]=useState(initial.earned);
  useEffect(()=>{if(!draftKey)return;try{localStorage.setItem(draftKey,JSON.stringify({at,expression,rule,mistakes,revealed,complete,translated,earned}));}catch{}},[draftKey,at,expression,rule,mistakes,revealed,complete,translated,earned]);
  function check(){
    let matches=false;try{matches=equivalentLogic(expression,at<0?q.translation!:steps[at].expression);}catch{setNotice('La expresión está incompleta. Revisá símbolos y paréntesis.');return;}
    if(!matches){setMistakes(n=>n+1);setNotice(at<0?'Revisá la traducción: deben estar todas las premisas y sus conectores.':'Esa línea no corresponde a la siguiente conclusión. Usá las premisas y las líneas verificadas.');return;}
    if(at<0){setTranslated(expression);setAt(0);setExpression('');setNotice('¡Traducción correcta! Ahora derivá una línea por vez.');return;}
    if(rule!==steps[at].rule){setMistakes(n=>n+1);setNotice('La expresión funciona, pero la regla elegida no justifica este paso.');return;}
    if(at===steps.length-1){setComplete(true);setEarned(rewardAvailable?(mistakes>0||revealed||hint?5:10):0);setNotice('Demostración terminada: llegaste a T con cada paso justificado.');onAttempt(true,mistakes>0||revealed||hint,{answer:[translated,...steps.map(s=>`${s.expression} · ${s.rule}`)]});return;}
    setAt(n=>n+1);setExpression('');setRule('');setNotice('Paso comprobado. La nueva conclusión quedó anotada abajo.');
  }
  return <section className="exercise exam-reasoning"><div className="row"><span className="eyebrow">DESAFÍO DE RAZONAMIENTO</span><button className="text-button" onClick={()=>setLaws(true)}><BookOpen size={17}/>Ver leyes lógicas</button></div><h2>{q.prompt}</h2>
    {at>=0&&<div className="exam-premises"><b>Premisas que tradujiste</b>{q.premises?.map((line,i)=><code key={`${i}-${line}`}>{i+1}. {line}</code>)}</div>}
    <div className="exam-step-timeline"><div className="exam-step-done"><span className={at<0?'current':'done'}>{at<0?'1':<Check size={16}/>}</span><div><b>Traducí el párrafo</b>{at>=0?<code>{translated}</code>:<small>Construí una expresión que reúna todas las premisas.</small>}</div></div>{steps.map((step,i)=><div className="exam-step-done" key={`${i}-${step.expression}`}><span className={complete||i<at?'done':i===at?'current':''}>{complete||i<at?<Check size={16}/>:i+2}</span><div><b>{i===steps.length-1?'Conclusión T':`Deducción ${i+1}`}</b>{complete||i<at?<small><code>{step.expression}</code> · {step.rule}</small>:<small>{i===at?'Escribí la siguiente línea y elegí la ley.':'Se habilita al comprobar el paso anterior.'}</small>}</div></div>)}</div>
    {!complete&&<><div className="exam-answer-layout"><div><label className="exam-input-label">{at<0?'Tu traducción':'Nueva línea de la demostración'} <ArrowDown size={15}/></label><SymbolInput value={expression} onChange={v=>{setExpression(v);setNotice('');}} mode="logic" label={at<0?'Traducción del párrafo':'Nueva línea de la demostración'} onNextLine={()=>{if(expression.trim()&&(at<0||rule))check();else setNotice(at<0?'Escribí la traducción antes de continuar.':'Escribí la conclusión y elegí su regla antes de bajar.');}}/></div>{at>=0&&<fieldset className="exam-rule-choices"><legend>¿Qué ley aplicaste?</legend>{q.options?.map(option=><button key={option} type="button" className={rule===option?'selected':''} aria-pressed={rule===option} onClick={()=>{setRule(option);setNotice('');}}>{option}</button>)}</fieldset>}</div><div className="help-row"><button className="secondary" onClick={()=>setHint(!hint)}><Lightbulb size={17}/>{hint?'Ocultar pista':'Pista gratis'}</button><small>Enter comprueba y baja · sin cronómetro</small></div>{hint&&<p className="notice">{at<0?'Traducí primero cada premisa simbólica y unilas con ∧.':steps[at].hint}</p>}{notice&&<p className="notice" role="status">{notice}</p>}<button className="primary wide" disabled={!expression.trim()||(at>=0&&!rule)} onClick={check}>{at<0?'Comprobar traducción':at===steps.length-1?'Comprobar conclusión':'Añadir y comprobar línea'}<ArrowRight size={18}/></button></>}
    {complete&&<><AnswerFeedback correct error={notice} explanation={q.explanation} xp={earned} celebrate/><button className="primary wide" onClick={onNext}>Siguiente pregunta<ArrowRight size={18}/></button></>}
    <AnswerReveal question={q} open={showAnswer} completed={complete} onToggle={()=>{setShowAnswer(!showAnswer);if(!showAnswer)setRevealed(true);}}/>
    {laws&&<Laws mode="logic" onClose={()=>setLaws(false)}/>}</section>;
}
