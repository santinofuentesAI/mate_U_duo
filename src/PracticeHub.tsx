import { useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, FlaskConical } from 'lucide-react';
import { Explorers } from './Explorers';
import { lessons } from './content';
import type { Lesson, Progress } from './types';
import { bank, latestAttempts, practicePlan, type PracticeItem } from './learning';
import { bookCatalog, responseStatus } from './bookCatalog';
import { classWeekTour, missingCourseWeeks, nextStudyProblem, readWorkedIds, studyTour } from './bookStudy';
import { BookPractice } from './BookPractice';
import { BookExam } from './BookExam';
import { ExamLobby } from './ExamLobby';
import type { SavedSession } from './sessions';

interface Props { progress:Progress; pending:SavedSession|null; onResume:()=>void; onStart:(items:PracticeItem[],title:string,mode:string)=>void; onExam:(units:string[])=>void; onLesson:(l:Lesson)=>void; onRead:(page:number)=>void; initialBookProblem?:string; }
type Screen = 'home'|'book'|'reviewed'|'errors'|'explore';
export function PracticeHub({progress:p,pending,onResume,onStart,onExam,onRead,initialBookProblem}:Props) {
  const [screen,setScreen]=useState<Screen>(initialBookProblem?'book':'home');
  const [focus,setFocus]=useState(initialBookProblem);
  const [topic,setTopic]=useState('all'),[length,setLength]=useState(3),[examOpen,setExamOpen]=useState(false);
  const items=bank(lessons,p.course),bookItems=items.filter(i=>i.question.bookSource);
  const units=[...new Set(items.map(i=>i.lesson.unit))];
  const pool=items.filter(i=>topic==='all'||i.lesson.unit===topic);
  const plan=practicePlan(pool,p,length);
  const last=latestAttempts(p);
  const errors=items.filter(i=>{const a=last.get(i.question.id);return a&&(!a.correct||a.assisted);});
  function open(next:Screen){setScreen(next);window.scrollTo(0,0);}
  if(screen==='book')return <div className="simple-flow"><button className="text-button" onClick={()=>open('home')}><ArrowLeft size={17}/> Volver a Practicar</button><BookExam key={`${p.course}-${focus||'saved'}`} course={p.course} items={bookItems} progress={p} onStart={onStart} onRead={onRead} initialProblem={focus}/></div>;
  if(screen==='reviewed')return <div className="simple-flow"><button className="text-button" onClick={()=>open('home')}><ArrowLeft size={17}/> Volver a Practicar</button><h1>Prácticas corregidas</h1><p>Estos ejercicios sí tienen respuesta y explicación comprobadas.</p><BookPractice items={bookItems} progress={p} count={3} onStart={onStart}/></div>;
  if(screen==='errors')return <div className="simple-flow"><button className="text-button" onClick={()=>open('home')}><ArrowLeft size={17}/> Volver a Practicar</button><h1>Volver a intentar</h1><p>{errors.length?`${errors.length} ejercicios para afianzar. Resolvelos de nuevo sin mirar la respuesta.`:'No tenés ejercicios pendientes por error.'}</p>{errors.length>0&&<button className="primary" onClick={()=>onStart(practicePlan(errors,p,Math.min(3,errors.length)),'Volver a intentar','errors')}>Practicar ahora <ArrowRight size={18}/></button>}</div>;
  if(screen==='explore')return <div className="simple-flow"><button className="text-button" onClick={()=>open('home')}><ArrowLeft size={17}/> Volver a Practicar</button><Explorers course={p.course}/></div>;
  const tour=studyTour(p.course);
  const worked=new Set(readWorkedIds(p.course));
  const bookStatus=(problem:typeof tour[number])=>responseStatus(problem,items,p,worked.has(problem.id));
  const touched=tour.filter(problem=>bookStatus(problem)!=='identified').length;
  const nextBook=nextStudyProblem(tour,bookStatus);
  const pendingWeeks=missingCourseWeeks(p.course);
  const classS5=classWeekTour(p.course,'S5');
  const classS6=classWeekTour(p.course,'S6');
  const openClass=(week:typeof classS5)=>{const next=nextStudyProblem(week,bookStatus);if(!next)return;setFocus(next.id);open('book');};
  return <div className="simple-flow practice-simple"><h1>Practicar</h1><p>Dos caminos. La práctica rápida siempre se corrige. En el libro, «Resultado correcto» está calificado y «Guardado · sin corregir» no tiene clave automática.</p>
    {pending&&<section className="simple-feature"><div><b>Tu sesión está pausada</b><p>{pending.session.title} · {pending.session.items[0].lesson.course==='precalculo'?'Precálculo':'Discreta'} · {Math.max(1,pending.index+1)} de {pending.session.items.length}</p></div><button className="primary" onClick={onResume}>Continuar <ArrowRight size={18}/></button></section>}
    <section className="simple-feature motion-in"><div><h2>Todos los ejercicios del libro</h2><p>{touched} de {bookCatalog[p.course].length} con trabajo guardado o corrección. Solo se califica si hay clave revisada. El resto conserva tus pasos.{pendingWeeks.length?` Semanas ${pendingWeeks.join(' y ')}: se suman cuando pases el material.` :''}</p></div><button className="primary" disabled={!nextBook} onClick={()=>{if(!nextBook)return;setFocus(nextBook.id);open('book');}}>{bookStatus(nextBook)==='identified'?'Siguiente del libro':'Continuar el guardado'} <ArrowRight size={18}/></button></section>
    {p.course==='discreta'&&(classS5.length>0||classS6.length>0)&&<section className="simple-feature motion-in class-week-jump"><div><h2>Material de clase S5 y S6</h2><p>Saltá al paquete de Venn/leyes o al de potencia y cardinalidad, sin pasar por la página 37 del libro.</p></div><div className="class-week-actions">{classS5.length>0&&<button className="primary" onClick={()=>openClass(classS5)}>Clase S5</button>}{classS6.length>0&&<button className="secondary" onClick={()=>openClass(classS6)}>Clase S6</button>}</div></section>}
    <section className="simple-feature motion-in"><div><h2>Práctica rápida</h2><p>{length} ejercicios con respuesta y explicación. Prioriza lo que vence, lo que fallaste y lo que todavía no viste. Sirve para llegar a 7 de 10 sin ayuda.</p></div><button className="primary" disabled={!plan.length} onClick={()=>onStart(plan,'Práctica rápida','adaptive')}>Empezar <ArrowRight size={18}/></button><details className="practice-options"><summary>Elegir tema y cantidad</summary><div className="simple-controls"><label>Tema<select value={topic} onChange={e=>setTopic(e.target.value)}><option value="all">Todos los temas</option>{units.map(u=><option key={u}>{u}</option>)}</select></label><label>Cantidad<select value={length} onChange={e=>setLength(Number(e.target.value))}><option value={3}>3 ejercicios</option><option value={8}>8 ejercicios</option><option value={15}>15 ejercicios</option></select></label></div></details></section>
    <button className="simple-link" onClick={()=>open('book')}><BookOpen size={22}/><span><b>Elegir semana o número</b><small>El recorrido completo del libro, un ejercicio a la vez</small></span><ArrowRight size={18}/></button>
    <button className="simple-link" onClick={()=>open('explore')}><FlaskConical size={22}/><span><b>Abrir explorador</b><small>Lógica, conjuntos o ecuaciones en vivo, sin nota</small></span><ArrowRight size={18}/></button>
    <details className="simple-more"><summary>Otras formas de practicar</summary><div className="simple-link-list"><button onClick={()=>open('reviewed')}><b>Prácticas corregidas</b><span>Respuesta y explicación comprobadas</span></button><button onClick={()=>open('errors')}><b>Volver a intentar</b><span>{errors.length} ejercicios para repasar</span></button><button onClick={()=>setExamOpen(true)}><b>Simulacro</b><span>35 desafíos de las lecciones</span></button></div></details>
    {examOpen&&<ExamLobby units={units} defaultUnits={units} onClose={()=>setExamOpen(false)} onStart={selected=>{setExamOpen(false);onExam(selected);}}/>}
  </div>;
}
