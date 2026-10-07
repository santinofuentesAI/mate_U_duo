import { useState } from 'react';
import { ArrowRight, BookOpenCheck, Check, ChevronRight, FileText, LockKeyhole, PencilLine } from 'lucide-react';
import type { Course, Progress } from './types';
import type { PracticeItem } from './learning';
import { latestAttempts } from './learning';
import { bookExamBlocks } from './bookExam';
import rawCatalog from './bookProblemCatalog.json';
import { BookProblem, type OpenBookProblem } from './BookProblem';

interface Props {
  course:Course; items:PracticeItem[]; progress:Progress;
  onStart:(items:PracticeItem[],title:string,mode:string)=>void;
  onRead:(page:number)=>void;
}
export function BookExam({course,items,progress,onStart,onRead}:Props) {
  const blocks=bookExamBlocks(course,items),last=latestAttempts(progress);
  const [week,setWeek]=useState(blocks[0]?.week||'');
  const [visited,setVisited]=useState<number[]>(()=>{
    try { const value=JSON.parse(localStorage.getItem(`mate-book-exam-pages-${course}`)||'[]');return Array.isArray(value)?value.filter(Number.isInteger):[]; } catch{return [];}
  });
  const [done,setDone]=useState<string[]>(()=>{try{const value=JSON.parse(localStorage.getItem(`mate-book-exam-done-${course}`)||'[]');return Array.isArray(value)?value.filter((id):id is string=>typeof id==='string'):[];}catch{return [];}});
  const [selected,setSelected]=useState<string|null>(null);
  const block=blocks.find(b=>b.week===week)||blocks[0];
  const catalog=(rawCatalog[course] as OpenBookProblem[]).filter(problem=>problem.week===block.week);
  const current=catalog.find(problem=>problem.id===selected);
  const openDone=catalog.filter(problem=>done.includes(problem.id)).length;
  const solved=block.items.filter(i=>last.get(i.question.id)?.correct).length;
  const pending=block.items.filter(i=>!last.get(i.question.id)?.correct);
  function openPage(page:number) {
    const updated=[...new Set([...visited,page])];setVisited(updated);
    try {localStorage.setItem(`mate-book-exam-pages-${course}`,JSON.stringify(updated));} catch {/* The PDF reader still works without local storage. */}
    onRead(page);
  }
  function choose(id:string){setSelected(id);requestAnimationFrame(()=>document.getElementById('book-exam-current')?.scrollIntoView({behavior:'smooth',block:'start'}));}
  function markDone(){if(!selected)return;const updated=[...new Set([...done,selected])];setDone(updated);try{localStorage.setItem(`mate-book-exam-done-${course}`,JSON.stringify(updated));}catch{/* The response remains visible in this tab. */}}
  function nextProblem(){if(!catalog.length)return;const index=catalog.findIndex(problem=>problem.id===selected);choose(catalog[(index+1)%catalog.length].id);}
  const currentVerified=current?items.find(item=>{const source=item.question.bookSource!;return source.page===current.page&&`${source.exercise}`.replace('-tabla','')===`${current.number}${current.part}`;}):undefined;
  return <section className="book-exam card" aria-label="Modo Book Exam">
    <header className="book-exam-title"><span className="book-exam-emblem"><BookOpenCheck size={31}/></span><div><span className="eyebrow">LOS DOS LIBROS · A TU RITMO</span><h2>Book Exam</h2><p>Seguí los ejercicios originales en orden, desde tu celular.</p></div></header>
    <div className="book-exam-count"><b>{solved}/{block.items.length}</b><span>incisos digitalizados resueltos en {block.week}</span></div>
    <div className="progress-track" role="progressbar" aria-label="Avance de incisos digitalizados" aria-valuemin={0} aria-valuemax={block.items.length} aria-valuenow={solved}><div style={{width:`${block.items.length?solved/block.items.length*100:0}%`}}/></div>
    <div className="book-exam-weeks" role="group" aria-label="Bloque del libro">{blocks.map(b=><button key={b.week} aria-pressed={week===b.week} className={week===b.week?'active':''} onClick={()=>{setWeek(b.week);setSelected(null);}}>{b.week}<small>{(rawCatalog[course] as OpenBookProblem[]).filter(item=>item.week===b.week).length} problemas</small></button>)}</div>
    <div className="book-exam-count"><b>{openDone}/{catalog.length}</b><span>problemas trabajados por vos · respuesta libre</span></div>
    <div className="progress-track" role="progressbar" aria-label="Problemas trabajados por vos" aria-valuemin={0} aria-valuemax={catalog.length} aria-valuenow={openDone}><div style={{width:`${catalog.length?openDone/catalog.length*100:0}%`}}/></div>
    <p className="book-exam-note"><LockKeyhole size={18}/>Este bloque tiene {catalog.length} problemas identificados para resolver por tu cuenta y {block.items.length} actividades revisadas con corrección. El texto extraído de fórmulas puede perder formato; abrí el enunciado visual exacto antes de resolverlo.</p>
    <div className="book-exam-actions"><button className="primary" disabled={!catalog.length} onClick={()=>choose((catalog.find(problem=>!done.includes(problem.id))||catalog[0]).id)}>Resolver problema por problema<ArrowRight size={18}/></button><span>{catalog.length} problemas identificados en estas páginas. Cada respuesta libre queda guardada en este dispositivo.</span></div>
    {current&&<div id="book-exam-current"><BookProblem key={current.id} problem={current} verified={currentVerified} onVerified={()=>currentVerified&&onStart([currentVerified],`Book Exam · ${current.section} · ${current.number}${current.part}`,'book-exam')} onDone={markDone} onNext={nextProblem}/></div>}
    <details className="book-exam-list"><summary><PencilLine size={20}/> Todos los problemas, en orden <ChevronRight size={18}/></summary><div>{catalog.map((problem,n)=><button key={problem.id} onClick={()=>choose(problem.id)}><span className={done.includes(problem.id)?'done':''}>{done.includes(problem.id)?<Check size={17}/>:n+1}</span><span><b>Ejercicio {problem.number}{problem.part} · {problem.section}</b><small>PDF {problem.page} · {problem.text.replace(/\s+/g,' ').slice(0,88)}…</small></span><ChevronRight size={17}/></button>)}</div></details>
    <div className="book-exam-actions"><button className="primary" disabled={!block.items.length} onClick={()=>onStart(pending.length?pending:block.items,`Book Exam · ${block.week}`,'book-exam')}>{pending.length?'Continuar en orden':'Repetir el bloque'}<ArrowRight size={18}/></button><span>PDF {block.pages[0]}–{block.pages.at(-1)} · {block.pages.length} páginas de ejercicios</span></div>
    <details className="book-exam-list"><summary><BookOpenCheck size={20}/> Incisos digitalizados, uno por uno <ChevronRight size={18}/></summary><div>{block.items.map((item,n)=>{const source=item.question.bookSource!,done=last.get(item.question.id)?.correct;return <button key={item.question.id} onClick={()=>onStart([item],`Book Exam · ${source.section} · ${source.exercise}`,'book-exam')}><span className={done?'done':''}>{done?<Check size={17}/>:n+1}</span><span><b>{source.section} · {source.exercise.replace('-tabla',' · tabla')}</b><small>{item.lesson.title} · PDF {source.page}{source.adaptation?' · versión guiada':''}</small></span><ChevronRight size={17}/></button>;})}</div></details>
    <details className="book-exam-list"><summary><FileText size={20}/> Todas las páginas de práctica del bloque <ChevronRight size={18}/></summary><div>{block.sections.map(section=><div className="book-exam-section" key={section.title}><b>{section.title}</b><small>PDF {section.page}–{section.end} · impresa {section.printed}</small><div>{block.pages.filter(page=>page>=section.page&&page<=section.end).map(page=><button key={page} onClick={()=>openPage(page)}><FileText size={17}/>Página {page}{visited.includes(page)?' · abierta':''}<ChevronRight size={16}/></button>)}</div></div>)}</div></details>
    <small>La lectura de una página solo registra que la abriste. No la cuenta como ejercicio resuelto. Tu PDF se carga una vez en este navegador y permanece privado en el dispositivo.</small>
  </section>;
}
