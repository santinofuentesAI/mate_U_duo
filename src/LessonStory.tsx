import { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import katex from 'katex';
import type { Lesson } from './types';
import { lessonWeekLabel } from './bookScope';
import { TopicIcon } from './TopicIcon';

export function LessonStory({lesson,onStart}:{lesson:Lesson;onStart:()=>void}) {
  const [page,setPage]=useState(0);
  const slides=[
    ...lesson.theory.map((body,i)=>({kind:'concept' as const,title:i===0?lesson.title:'Una idea más',body})),
    ...(lesson.formulas.length?[{kind:'formula' as const,title:'La fórmula',body:''}]:[]),
    ...lesson.example.steps.map((body,i)=>({kind:'step' as const,title:lesson.example.title,body,number:i+1})),
  ];
  const current=slides[page];
  if(!current)return <button className="primary" onClick={onStart}>Practicar<ArrowRight size={18}/></button>;
  return <section className="lesson-story" aria-label="Lección paso a paso">
    <div className="lesson-story-top"><span>{lessonWeekLabel(lesson)}</span><b>{page+1} de {slides.length}</b></div>
    <div className="lesson-story-track" role="progressbar" aria-label="Lectura de la lección" aria-valuemin={1} aria-valuemax={slides.length} aria-valuenow={page+1}><span style={{width:`${((page+1)/slides.length)*100}%`}}/></div>
    <article className="lesson-story-card"><span className="lesson-story-icon"><TopicIcon name={lesson.icon} topic={lesson.title} size={37}/></span><small>{current.kind==='step'?`EJEMPLO · PASO ${current.number}`:current.kind==='formula'?'PARA RECORDAR':'APRENDAMOS'}</small><h1>{current.title}</h1>
      {current.kind==='formula'?<div className="lesson-story-formulas">{lesson.formulas.map(f=><div className="math" key={f} dangerouslySetInnerHTML={{__html:katex.renderToString(f,{throwOnError:false,strict:false,displayMode:true})}}/>)}</div>:<p>{current.body}</p>}
    </article>
    <div className="lesson-story-actions">{page>0&&<button className="secondary" onClick={()=>setPage(page-1)}><ArrowLeft size={17}/>Anterior</button>}<button className="primary" onClick={()=>page+1<slides.length?setPage(page+1):onStart()}>{page+1<slides.length?'Continuar':'Ahora practico'}<ArrowRight size={18}/></button></div>
    {page<slides.length-1&&<button className="lesson-story-skip" onClick={onStart}>Ir a los ejercicios</button>}
  </section>;
}
