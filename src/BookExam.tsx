import { useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpenCheck } from 'lucide-react';
import type { Course, Progress } from './types';
import type { PracticeItem } from './learning';
import { BookProblem } from './BookProblem';
import { assignmentLabel, bookCatalog, readBookPosition, responseStatus, reviewedActivities } from './bookCatalog';

interface Props { course:Course; items:PracticeItem[]; progress:Progress; onStart:(items:PracticeItem[],title:string,mode:string)=>void; onRead:(page:number)=>void; initialProblem?:string; }

export function BookExam({course,items,progress,onStart,initialProblem}:Props) {
  const all=bookCatalog[course];
  const initial=all.find(p=>p.id===(initialProblem||readBookPosition(course)?.id));
  const [week,setWeek]=useState(initial?.week||(course==='discreta'?'S1':'S4'));
  const [section,setSection]=useState(initial?.sectionCode||'all');
  const [selected,setSelected]=useState<string|null>(initial?.id||null);
  const [lastPosition,setLastPosition]=useState(initial?.id||null);
  const [message,setMessage]=useState('');
  const [,refreshChecks]=useState(0);
  const [done,setDone]=useState<string[]>(()=>{try{const v=JSON.parse(localStorage.getItem(`mate-book-exam-done-${course}`)||'[]');return Array.isArray(v)?v.filter(id=>typeof id==='string'):[];}catch{return [];}});
  const weeks=[...new Set(all.map(p=>p.week))];
  const inWeek=all.filter(p=>week==='all'||p.week===week);
  const sections=[...new Map(inWeek.map(p=>[p.sectionCode,p.section])).entries()];
  const catalog=inWeek.filter(p=>section==='all'||p.sectionCode===section);
  const current=all.find(p=>p.id===selected);
  const status=(p:typeof all[number])=>responseStatus(p,items,progress,done.includes(p.id));
  const position=catalog.find(p=>p.id===lastPosition);
  const nextPending=catalog.find(p=>status(p)==='submitted')||catalog.find(p=>status(p)==='identified');
  const start=position&&status(position)!=='validated'?position:nextPending||position||catalog[0];
  const index=catalog.findIndex(p=>p.id===selected);

  function choose(id:string){
    setSelected(id);setLastPosition(id);setMessage('');
    try{localStorage.setItem(`mate-book-position-${course}`,JSON.stringify({id}));}
    catch{setMessage('No se pudo guardar tu posición en este dispositivo.');}
    requestAnimationFrame(()=>document.getElementById('book-exam-current')?.scrollIntoView({behavior:'smooth',block:'start'}));
  }
  function markDone(){if(!selected)return false;const updated=[...new Set([...done,selected])];try{localStorage.setItem(`mate-book-exam-done-${course}`,JSON.stringify(updated));setDone(updated);return true;}catch{setMessage('No se pudo guardar el estado. Tu respuesta sigue en pantalla.');return false;}}
  function edited(){
    if(!selected||!done.includes(selected))return;
    const updated=done.filter(id=>id!==selected);setDone(updated);
    try{localStorage.setItem(`mate-book-exam-done-${course}`,JSON.stringify(updated));}catch{setMessage('No se pudo actualizar el estado del ejercicio.');}
  }
  function move(delta:number){const next=catalog[index+delta];if(next)choose(next.id);else setMessage(delta===1?'Terminaste esta selección. Elegí otra semana o sección.':'Este es el primer ejercicio de la selección.');}
  function changeWeek(value:string){setWeek(value);setSection('all');setSelected(null);setMessage('');}
  function changeSection(value:string){setSection(value);setSelected(null);setMessage('');}

  return <section className="book-exam card book-journey" aria-label="Modo Book Exam">
    {!current?<>
      <header className="book-journey-intro"><span className="book-journey-icon"><BookOpenCheck size={26}/></span><h2>Ejercicios del libro</h2><p>Uno a la vez. Tu avance se guarda aquí.</p></header>
      <div className="book-journey-start"><label>Elegí la semana<select aria-label="Semana de Book Exam" value={week} onChange={e=>changeWeek(e.target.value)}><option value="all">Todo el alcance</option>{weeks.map(w=><option key={w} value={w}>{assignmentLabel(w)}</option>)}</select></label>
        <button className="primary wide" disabled={!start} onClick={()=>start&&choose(start.id)}>{position&&status(position)!=='validated'?'Continuar mi ejercicio':'Empezar a practicar'}<ArrowRight size={19}/></button>
        {start&&<small>{start.sectionCode} · ejercicio {start.number}{start.part} · PDF {start.page}{status(start)==='submitted'?' · borrador guardado':''}</small>}
      </div>
      <details className="book-journey-picker"><summary>Elegir otro ejercicio</summary><div><label>Sección<select aria-label="Sección de Book Exam" value={section} onChange={e=>changeSection(e.target.value)}><option value="all">Todas las secciones</option>{sections.map(([code,name])=><option key={code} value={code}>{code} · {name}</option>)}</select></label><label>Inciso<select aria-label="Problema de Book Exam" value="" onChange={e=>e.target.value&&choose(e.target.value)}><option value="">Elegí un inciso</option>{catalog.map(p=><option key={p.id} value={p.id}>{p.sectionCode} · {p.number}{p.part} · PDF {p.page}{status(p)==='validated'?' ✓':status(p)==='submitted'?' · guardado':''}</option>)}</select></label></div></details>
      <p className="book-journey-fineprint">Solo los ejercicios con solución revisada se comprueban automáticamente. En los demás podés guardar tus pasos.</p>
    </>:<>
      <div className="book-journey-top"><button className="text-button" onClick={()=>{setSelected(null);setMessage('');}}><ArrowLeft size={18}/> Elegir ejercicio</button><span>{index>=0?`${index+1} de ${catalog.length}`:'Ejercicio del libro'}</span></div>
      {index>=0&&<div className="book-journey-track" role="progressbar" aria-valuenow={index+1} aria-valuemin={1} aria-valuemax={catalog.length} aria-label="Avance en la selección"><span style={{width:`${((index+1)/catalog.length)*100}%`}}/></div>}
      <div id="book-exam-current"><BookProblem key={current.id} problem={current} verified={reviewedActivities(current,items)} responseState={status(current)} onVerified={item=>onStart([item],`Book Exam · ${current.sectionCode} · ${current.number}${current.part}`,'book-exam')} onDone={markDone} onEdited={edited} onChecked={()=>refreshChecks(n=>n+1)} onNext={()=>move(1)} onPrevious={()=>move(-1)}/></div>
    </>}
    {message&&<p role="status" className="notice">{message}</p>}
  </section>;
}
