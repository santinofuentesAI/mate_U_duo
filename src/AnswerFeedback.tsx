import { useEffect, useRef, type CSSProperties } from 'react';
import { Check, RefreshCw, Sparkles, Star } from 'lucide-react';
export function AnswerFeedback({correct,error,explanation,xp,celebrate}:{correct:boolean;error?:string;explanation:string;xp:number;celebrate:boolean}) {
  const card=useRef<HTMLDivElement>(null);
  useEffect(()=>{const reduced=document.documentElement.dataset.motion==='reduce'||matchMedia('(prefers-reduced-motion: reduce)').matches;card.current?.scrollIntoView({block:'nearest',behavior:reduced?'instant':'smooth'});},[correct,error]);
  return <div ref={card} className={`feedback answer-feedback ${correct?'success':'retry'} ${celebrate?'just-earned':''}`} role="status">
    {correct&&celebrate&&<div className="answer-sparks" aria-hidden="true">{Array.from({length:12},(_,i)=><i key={i} style={{'--spark-angle':`${i*30}deg`,'--spark-color':['var(--purple)','#168979','#d29e25'][i%3]} as CSSProperties}/>)}</div>}
    <div className="feedback-heading"><span className="feedback-seal" aria-hidden="true">{correct?<Check size={27}/>:<RefreshCw size={24}/>}</span><div><span className="feedback-kicker">{correct?'UNA IDEA MÁS CONECTADA':'LOS ERRORES TAMBIÉN ENSEÑAN'}</span><h3>{correct?'¡Bien razonado!':'Todavía no. Probá otra vez.'}</h3></div></div>
    {correct&&<div className="earned-reward">{xp>0?<><Star size={18}/><b>+{xp} XP</b><span>{xp===5?'Con ayuda · después repasamos':'Lo resolviste sin ayuda'}</span></>:<><Sparkles size={18}/><b>Concepto reforzado</b><span>Este ejercicio ya había dado XP.</span></>}</div>}
    <p>{error||explanation}</p>{!correct&&<small>Revisá una regla o pedí una pista. Podés volver a intentar sin perder vidas.</small>}
  </div>;
}
