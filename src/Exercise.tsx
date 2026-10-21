import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, BookOpen, Check, Lightbulb, Coins } from 'lucide-react';
import type { Question, AnswerDetails, Course } from './types';
import { loadAnswerDraft } from './exerciseDraft';
import { grade, shuffle } from './engine';
import { SymbolInput } from './Keyboard';
import { SyntheticPad } from './SyntheticPad';
import { TruthTablePad } from './TruthTablePad';
import { answerCue, inputModeFor } from './answerKind';
import { levelBrief } from './levelBrief';
import { VennScratch } from './VennScratch';
import { Laws } from './Workbench';
import { AnswerFeedback } from './AnswerFeedback';
import { GuidedProofExercise } from './GuidedProofExercise';
import { AnswerReveal } from './AnswerReveal';
import { ExamReasoningExercise } from './ExamReasoningExercise';
import { StepWorkspace } from './StepWorkspace';
import katex from 'katex';
export function Exercise({question:q,course,coins,onSpend,onAttempt,onNext,draftKey,rewardAvailable=false,sealed=false,guideTitle}:{question:Question;course:Course;coins:number;onSpend:(n:number)=>void;onAttempt:(correct:boolean,assisted:boolean,details:AnswerDetails)=>void;onNext:()=>void;draftKey?:string;rewardAvailable?:boolean;sealed?:boolean;guideTitle?:string}) {
  if(q.type==='guidedproof')return <GuidedProofExercise question={q} course={course} coins={coins} onSpend={onSpend} onAttempt={onAttempt} onNext={onNext} rewardAvailable={rewardAvailable} sealed={sealed}/>;
  if(q.type==='examproof')return <ExamReasoningExercise question={q} onAttempt={onAttempt} onNext={onNext} draftKey={draftKey} rewardAvailable={rewardAvailable} sealed={sealed}/>;
  const [restored]=useState(()=>loadAnswerDraft(q,draftKey));
  const [value,setValue]=useState<string|string[]>(restored.value);
  const [steps,setSteps]=useState<string[]>(restored.steps||[String(restored.value)]);
  const [exclusions,setExclusions]=useState(restored.exclusions);const [hint,setHint]=useState(restored.hint);const [feedback,setFeedback]=useState<{correct:boolean;error?:string}|null>(restored.feedback);const [rules,setRules]=useState(false);const [retried,setRetried]=useState(restored.retried);const [revealed,setRevealed]=useState(restored.revealed);const [showAnswer,setShowAnswer]=useState(restored.revealed);const [draftError,setDraftError]=useState('');
  const [earned,setEarned]=useState(0),[celebrate,setCelebrate]=useState(false);
  useEffect(()=>{if(!draftKey)return;try{localStorage.setItem(draftKey,JSON.stringify({value,exclusions,hint,feedback,retried,revealed,...(['logic','algebra'].includes(q.type)?{steps}:{})}));setDraftError('');}catch{setDraftError('No se pudo guardar el borrador de esta respuesta.');}},[draftKey,q.type,value,steps,exclusions,hint,feedback,retried,revealed]);
  const options=useMemo(()=>shuffle(q.options||[]),[q]); const selected=Array.isArray(value)?value:[];
  function toggle(s:string){setValue(selected.includes(s)?selected.filter(x=>x!==s):[...selected,s]);setFeedback(null);}
  function update(s:string){setValue(s);setFeedback(null);}
  const canCheck=Array.isArray(value)?(['table','synthetic'].includes(q.type)?value.every(s=>s.trim()!==''):q.type==='order'?value.length===q.options?.length:true):value.trim().length>0;
  function check(){const domains=exclusions.split(/[,;]/).map(s=>s.trim()).filter(Boolean);const result=grade(q,value,domains);if(sealed){onAttempt(result.correct,false,{answer:Array.isArray(value)?[...value]:value,exclusions:domains,error:result.error});onNext();return;}const assisted=hint>0||retried||revealed;setFeedback(result);setEarned(result.correct&&rewardAvailable?(assisted?5:10):0);setCelebrate(result.correct);onAttempt(result.correct,assisted,{answer:Array.isArray(value)?[...value]:value,exclusions:domains,error:result.error});if(!result.correct)setRetried(true);}
  const vennRegions=[{code:'100',x:86,y:89},{code:'010',x:222,y:89},{code:'001',x:155,y:207},{code:'110',x:155,y:77},{code:'101',x:111,y:156},{code:'011',x:200,y:156},{code:'111',x:155,y:129},{code:'000',x:280,y:235}];
  const meaning=!sealed?levelBrief(guideTitle||q.tag)[0]:'';
  return <section className="exercise"><span className="eyebrow">{({choice:'ELEGÍ',logic:'CONSTRUÍ',table:'COMPLETÁ',set:'SELECCIONÁ',order:'ORDENÁ',venn:'EXPLORÁ',algebra:'RESOLVÉ',synthetic:'CALCULÁ',text:'RESPONDÉ'} as Record<string,string>)[q.type]}</span><h2>{q.prompt}</h2>{meaning&&<aside className="level-help" aria-label="Qué significa este tema"><b>Qué significa</b><p>{meaning}</p></aside>}<p className="answer-cue">{answerCue(q)}</p>
    {q.math&&<div className="math exercise-formula" dangerouslySetInnerHTML={{__html:katex.renderToString(q.math,{throwOnError:false,strict:false,displayMode:true})}}/>}
    {q.type==='choice'&&<div className="choices">{options.map((o,i)=><button key={o} className={value===o?'selected':''} disabled={!!feedback?.correct} onClick={()=>update(o)}><span>{i+1}</span>{o}{value===o&&<Check size={18}/>}</button>)}</div>}
    {['logic','algebra'].includes(q.type)&&<StepWorkspace lines={steps} onChange={lines=>{setSteps(lines);update(lines.at(-1)||'');}} mode={inputModeFor(q,course)} disabled={!!feedback?.correct}/>}
    {q.type==='text'&&<SymbolInput value={String(value)} onChange={update} mode={inputModeFor(q,course)} disabled={!!feedback?.correct}/>}
    {(q.type==='venn'||q.tag==='Regiones de Venn')&&<VennScratch/>}
    {q.type==='algebra'&&q.exclusions&&<label>Restricciones del dominio<input value={exclusions} onChange={e=>{setExclusions(e.target.value);setFeedback(null);}} placeholder="Ej.: 0, 3 · o x=0, y=0 si se indica" disabled={!!feedback?.correct}/><small>Valores excluidos, separados por coma. Conservá los del problema original.</small></label>}
    {q.type==='set'&&<div className="set-options">{q.universe?.map(s=><button aria-pressed={selected.includes(s)} className={selected.includes(s)?'selected':''} key={s} onClick={()=>toggle(s)} disabled={!!feedback?.correct}>{s}</button>)}<p>Tu conjunto: {selected.length?<>{'{'}{selected.join(', ')}{'}'}</>:'∅'}</p></div>}
    {q.type==='venn'&&<><svg viewBox="0 0 310 260" className="venn" role="group" aria-label="Regiones del diagrama de Venn"><rect x="2" y="2" width="306" height="256" rx="14" fill="var(--bg)" stroke="var(--border)"/><circle cx="112" cy="103" r="77" fill="#7556ef15" stroke="#7556ef"/><circle cx="198" cy="103" r="77" fill="#16897915" stroke="#168979"/><circle cx="155" cy="174" r="77" fill="#e5a51915" stroke="#bd8412"/><text x="33" y="24">A</text><text x="273" y="24">B</text><text x="155" y="253">C</text>{vennRegions.map(r=><g role="button" tabIndex={0} aria-label={`Región ${r.code}`} aria-pressed={selected.includes(r.code)} key={r.code} onClick={()=>!feedback?.correct&&toggle(r.code)} onKeyDown={e=>{if(['Enter',' '].includes(e.key)){e.preventDefault();if(!feedback?.correct)toggle(r.code);}}}><rect x={r.x-23} y={r.y-18} width="46" height="36" rx="9" fill={selected.includes(r.code)?'#7556ef':'var(--surface)'} stroke="var(--border)"/><text x={r.x} y={r.y+5} textAnchor="middle" fill={selected.includes(r.code)?'#fff':'var(--text)'}>{r.code}</text></g>)}</svg><p className="notice">Tocá las etiquetas para seleccionar regiones. El código ABC indica si estás dentro (1) o fuera (0) de cada conjunto.</p></>}
    {q.type==='table'&&q.expression&&q.variables&&<TruthTablePad expression={q.expression} variables={q.variables} value={selected} onChange={next=>{setValue(next);setFeedback(null);}} disabled={!!feedback?.correct}/>}
    {q.type==='synthetic'&&q.coefficients&&q.root!==undefined&&<SyntheticPad coefficients={q.coefficients} root={q.root} value={selected} onChange={next=>{setValue(next);setFeedback(null);}} disabled={!!feedback?.correct}/>}
    {q.type==='order'&&<><div className="order-slots">{selected.length?selected.map((s,i)=><button key={s} disabled={!!feedback?.correct} onClick={()=>toggle(s)}><b>{i+1}</b>{s} <small>✕</small></button>):<p>Tocá cada paso en el orden correcto.</p>}</div><div className="set-options">{options.filter(s=>!selected.includes(s)).map(s=><button key={s} onClick={()=>toggle(s)}>{s}</button>)}</div></>}
    {!sealed&&!feedback?.correct&&<details className="exercise-help"><summary><Lightbulb size={17}/> Necesito ayuda</summary><div className="help-row"><button className="secondary" disabled={hint>=1} onClick={()=>setHint(1)}><Lightbulb size={17}/>Una pista</button><button className="secondary" disabled={hint>=2||coins<5} onClick={()=>{onSpend(5);setHint(2);}}><Coins size={17}/>Ayuda guiada · 5</button><button className="secondary" onClick={()=>setRules(true)}><BookOpen size={17}/>Ver leyes</button><small>{coins} monedas ficticias</small></div></details>}
    {!sealed&&hint>0&&<aside className="hint" role="status"><b>{hint===1?'Una pista para empezar':'Veámoslo paso a paso'}</b><p>{q.hints[hint-1]}</p><small>Con ayuda, este ejercicio queda pendiente de repaso sin pistas.</small></aside>}
    {!sealed&&<AnswerReveal question={q} open={showAnswer} completed={!!feedback?.correct} onToggle={()=>{const next=!showAnswer;setShowAnswer(next);if(next)setRevealed(true);}}/>}
    {!sealed&&feedback&&<AnswerFeedback correct={feedback.correct} error={feedback.error} explanation={q.explanation} xp={earned} celebrate={celebrate}/>}
    {draftError&&<p className="notice" role="alert">{draftError}</p>}{sealed&&<p className="notice">Examen: sin pistas ni respuesta. La nota aparece al terminar.</p>}<button className="primary wide" disabled={!canCheck} onClick={feedback?.correct?onNext:check}>{sealed?'Entregar':feedback?.correct?'Continuar':'Comprobar'}<ArrowRight size={18}/></button>{rules&&<Laws mode={course==='precalculo'?'algebra':'logic'} onClose={()=>setRules(false)}/>}</section>;
}
