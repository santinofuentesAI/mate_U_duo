import { useState } from 'react';
import { ArrowRight, BookOpenCheck, Check, ChevronRight, FileText, LockKeyhole } from 'lucide-react';
import type { Course, Progress } from './types';
import type { PracticeItem } from './learning';
import { latestAttempts } from './learning';
import { bookExamBlocks } from './bookExam';

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
  const block=blocks.find(b=>b.week===week)||blocks[0];
  const solved=block.items.filter(i=>last.get(i.question.id)?.correct).length;
  const pending=block.items.filter(i=>!last.get(i.question.id)?.correct);
  function openPage(page:number) {
    const updated=[...new Set([...visited,page])];setVisited(updated);
    try {localStorage.setItem(`mate-book-exam-pages-${course}`,JSON.stringify(updated));} catch {/* The PDF reader still works without local storage. */}
    onRead(page);
  }
  return <section className="book-exam card" aria-label="Modo Book Exam">
    <header className="book-exam-title"><span className="book-exam-emblem"><BookOpenCheck size={31}/></span><div><span className="eyebrow">LOS DOS LIBROS · A TU RITMO</span><h2>Book Exam</h2><p>Seguí los ejercicios originales en orden, desde tu celular.</p></div></header>
    <div className="book-exam-count"><b>{solved}/{block.items.length}</b><span>incisos digitalizados resueltos en {block.week}</span></div>
    <div className="progress-track" role="progressbar" aria-label="Avance de incisos digitalizados" aria-valuemin={0} aria-valuemax={block.items.length} aria-valuenow={solved}><div style={{width:`${block.items.length?solved/block.items.length*100:0}%`}}/></div>
    <div className="book-exam-weeks" role="group" aria-label="Bloque del libro">{blocks.map(b=><button key={b.week} aria-pressed={week===b.week} className={week===b.week?'active':''} onClick={()=>setWeek(b.week)}>{b.week}<small>{b.items.length} digitalizados</small></button>)}</div>
    <p className="book-exam-note"><LockKeyhole size={18}/>Los {block.items.length} incisos de abajo tienen respuesta y explicación. Las demás páginas del bloque se abren en «Mi libro» para resolver con el cuaderno; todavía no tienen todos sus incisos convertidos ni corrección automática.</p>
    <div className="book-exam-actions"><button className="primary" disabled={!block.items.length} onClick={()=>onStart(pending.length?pending:block.items,`Book Exam · ${block.week}`,'book-exam')}>{pending.length?'Continuar en orden':'Repetir el bloque'}<ArrowRight size={18}/></button><span>PDF {block.pages[0]}–{block.pages.at(-1)} · {block.pages.length} páginas de ejercicios</span></div>
    <details className="book-exam-list"><summary><BookOpenCheck size={20}/> Incisos digitalizados, uno por uno <ChevronRight size={18}/></summary><div>{block.items.map((item,n)=>{const source=item.question.bookSource!,done=last.get(item.question.id)?.correct;return <button key={item.question.id} onClick={()=>onStart([item],`Book Exam · ${source.section} · ${source.exercise}`,'book-exam')}><span className={done?'done':''}>{done?<Check size={17}/>:n+1}</span><span><b>{source.section} · {source.exercise.replace('-tabla',' · tabla')}</b><small>{item.lesson.title} · PDF {source.page}{source.adaptation?' · versión guiada':''}</small></span><ChevronRight size={17}/></button>;})}</div></details>
    <details className="book-exam-list"><summary><FileText size={20}/> Todas las páginas de práctica del bloque <ChevronRight size={18}/></summary><div>{block.sections.map(section=><div className="book-exam-section" key={section.title}><b>{section.title}</b><small>PDF {section.page}–{section.end} · impresa {section.printed}</small><div>{block.pages.filter(page=>page>=section.page&&page<=section.end).map(page=><button key={page} onClick={()=>openPage(page)}><FileText size={17}/>Página {page}{visited.includes(page)?' · abierta':''}<ChevronRight size={16}/></button>)}</div></div>)}</div></details>
    <small>La lectura de una página solo registra que la abriste. No la cuenta como ejercicio resuelto. Tu PDF se carga una vez en este navegador y permanece privado en el dispositivo.</small>
  </section>;
}
