import { useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';
import { lessons } from './content';
import type { Lesson, Progress } from './types';
import { bank, latestAttempts, practicePlan, type PracticeItem } from './learning';
import { BookPractice } from './BookPractice';
import { BookExam } from './BookExam';
import { ExamLobby } from './ExamLobby';
import type { SavedSession } from './sessions';

interface Props { progress:Progress; pending:SavedSession|null; onResume:()=>void; onStart:(items:PracticeItem[],title:string,mode:string)=>void; onExam:(units:string[])=>void; onLesson:(l:Lesson)=>void; onRead:(page:number)=>void; initialBookProblem?:string; }
type Screen = 'home'|'book'|'reviewed'|'errors';
export function PracticeHub({progress:p,pending,onResume,onStart,onExam,onRead,initialBookProblem}:Props) {
  const [screen,setScreen]=useState<Screen>(initialBookProblem?'book':'home');
  const [topic,setTopic]=useState('all'),[length,setLength]=useState(3),[examOpen,setExamOpen]=useState(false);
  const items=bank(lessons,p.course),bookItems=items.filter(i=>i.question.bookSource);
  const units=[...new Set(items.map(i=>i.lesson.unit))];
  const pool=items.filter(i=>topic==='all'||i.lesson.unit===topic);
  const plan=practicePlan(pool,p,length);
  const last=latestAttempts(p);
  const errors=items.filter(i=>{const a=last.get(i.question.id);return a&&(!a.correct||a.assisted);});
  function open(next:Screen){setScreen(next);window.scrollTo(0,0);}
  if(screen==='book')return <div className="simple-flow"><button className="text-button" onClick={()=>open('home')}><ArrowLeft size={17}/> Volver a Practicar</button><BookExam key={p.course} course={p.course} items={bookItems} progress={p} onStart={onStart} onRead={onRead} initialProblem={initialBookProblem}/></div>;
  if(screen==='reviewed')return <div className="simple-flow"><button className="text-button" onClick={()=>open('home')}><ArrowLeft size={17}/> Volver a Practicar</button><h1>Prácticas corregidas</h1><p>Estos ejercicios sí tienen respuesta y explicación comprobadas.</p><BookPractice items={bookItems} progress={p} count={3} onStart={onStart}/></div>;
  if(screen==='errors')return <div className="simple-flow"><button className="text-button" onClick={()=>open('home')}><ArrowLeft size={17}/> Volver a Practicar</button><h1>Volver a intentar</h1><p>{errors.length?`${errors.length} ejercicios para afianzar. Resolvelos de nuevo sin mirar la respuesta.`:'No tenés ejercicios pendientes por error.'}</p>{errors.length>0&&<button className="primary" onClick={()=>onStart(practicePlan(errors,p,Math.min(3,errors.length)),'Volver a intentar','errors')}>Practicar ahora <ArrowRight size={18}/></button>}</div>;
  return <div className="simple-flow practice-simple"><h1>Practicar</h1><p>Un ejercicio a la vez. Tus avances se guardan.</p>
    {pending&&<section className="simple-feature"><div><b>Tu sesión está pausada</b><p>{pending.session.title} · {pending.session.items[0].lesson.course==='precalculo'?'Precálculo':'Discreta'} · {Math.max(1,pending.index+1)} de {pending.session.items.length}</p></div><button className="primary" onClick={onResume}>Continuar <ArrowRight size={18}/></button></section>}
    <section className="simple-feature"><div><h2>Práctica rápida</h2><p>{length} ejercicios con respuesta y explicación.</p></div><button className="primary" disabled={!plan.length} onClick={()=>onStart(plan,'Práctica rápida','adaptive')}>Empezar <ArrowRight size={18}/></button><details className="practice-options"><summary>Elegir tema y cantidad</summary><div className="simple-controls"><label>Tema<select value={topic} onChange={e=>setTopic(e.target.value)}><option value="all">Todos los temas</option>{units.map(u=><option key={u}>{u}</option>)}</select></label><label>Cantidad<select value={length} onChange={e=>setLength(Number(e.target.value))}><option value={3}>3 ejercicios</option><option value={8}>8 ejercicios</option></select></label></div></details></section>
    <button className="simple-link" onClick={()=>open('book')}><BookOpen size={22}/><span><b>Ejercicios del libro</b><small>Resolver y comprobar cuando hay solución revisada</small></span><ArrowRight size={18}/></button>
    <details className="simple-more"><summary>Otras formas de practicar</summary><div className="simple-link-list"><button onClick={()=>open('reviewed')}><b>Prácticas corregidas</b><span>Respuesta y explicación comprobadas</span></button><button onClick={()=>open('errors')}><b>Volver a intentar</b><span>{errors.length} ejercicios para repasar</span></button><button onClick={()=>setExamOpen(true)}><b>Simulacro</b><span>35 desafíos de las lecciones</span></button></div></details>
    {examOpen&&<ExamLobby units={units} defaultUnits={units} onClose={()=>setExamOpen(false)} onStart={selected=>{setExamOpen(false);onExam(selected);}}/>}
  </div>;
}
