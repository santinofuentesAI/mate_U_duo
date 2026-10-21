import { useState, type CSSProperties } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import katex from 'katex';
import type { Lesson } from './types';
import { TopicIcon } from './TopicIcon';
import { weekHeading } from './weekGroups';
import { levelBrief } from './levelBrief';

type SlideKind = 'what' | 'concept' | 'formula' | 'step';

function slideEyebrow(kind: SlideKind, number?: number): string {
  switch (kind) {
    case 'what': return 'QUÉ ES';
    case 'concept': return 'CÓMO SE USA';
    case 'formula': return 'PARA RECORDAR';
    case 'step': return `EJEMPLO · PASO ${number ?? 1}`;
    default: {
      const never: never = kind;
      return never;
    }
  }
}

export function LessonStory({lesson,onStart}:{lesson:Lesson;onStart:()=>void}) {
  const [page,setPage]=useState(0);
  const what=levelBrief(lesson.title);
  const slides=[
    ...what.map((body,i)=>({kind:'what' as const,title:i===0?lesson.title:'Cómo se reconoce',body})),
    ...lesson.theory.map((body,i)=>({kind:'concept' as const,title:i===0?'Cómo se trabaja':'Una idea más',body})),
    ...(lesson.formulas.length?[{kind:'formula' as const,title:'La fórmula',body:''}]:[]),
    ...lesson.example.steps.map((body,i)=>({kind:'step' as const,title:lesson.example.title,body,number:i+1})),
  ];
  const current=slides[page];
  if(!current)return <button className="primary" onClick={onStart}>Practicar<ArrowRight size={18}/></button>;
  return <section className="lesson-story" aria-label="Lección paso a paso">
    <div className="lesson-story-top"><span>{weekHeading(lesson.unit)}</span><b>{page+1} de {slides.length}</b></div>
    <div className="lesson-story-track" role="progressbar" aria-label="Lectura de la lección" aria-valuemin={1} aria-valuemax={slides.length} aria-valuenow={page+1}><span style={{'--progress':String((page+1)/slides.length)} as CSSProperties}/></div>
    <article key={page} className="lesson-story-card motion-in"><span className="lesson-story-icon"><TopicIcon name={lesson.icon} topic={lesson.title} size={37}/></span><small>{slideEyebrow(current.kind,current.kind==='step'?current.number:undefined)}</small><h1>{current.title}</h1>
      {current.kind==='formula'?<div className="lesson-story-formulas">{lesson.formulas.map(f=><div className="math" key={f} dangerouslySetInnerHTML={{__html:katex.renderToString(f,{throwOnError:false,strict:false,displayMode:true})}}/>)}</div>:<p>{current.body}</p>}
    </article>
    <div className="lesson-story-actions">{page>0&&<button className="secondary" onClick={()=>setPage(page-1)}><ArrowLeft size={17}/>Anterior</button>}<button className="primary" onClick={()=>page+1<slides.length?setPage(page+1):onStart()}>{page+1<slides.length?'Continuar':`Empezar ${lesson.questions.length} ejercicios`}<ArrowRight size={18}/></button></div>
    {page+1===slides.length&&<p className="lesson-story-rule">El nivel queda marcado si acertás al menos {Math.ceil(lesson.questions.length*0.7)} de {lesson.questions.length} al primer intento, sin pista.</p>}
    {page<slides.length-1&&<button className="lesson-story-skip" onClick={onStart}>Ir a los {lesson.questions.length} ejercicios</button>}
  </section>;
}
