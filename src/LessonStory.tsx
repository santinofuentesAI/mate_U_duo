import { useState, type CSSProperties } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { Lesson } from './types';
import { TopicIcon } from './TopicIcon';
import { weekHeading } from './weekGroups';
import { levelBrief } from './levelBrief';
import { workedExample } from './workedExamples';

type SlideKind = 'what' | 'sample' | 'how';

function slideEyebrow(kind: SlideKind): string {
  switch (kind) {
    case 'what': return 'EN PALABRAS';
    case 'sample': return 'EJEMPLO HECHO';
    case 'how': return 'QUÉ VAS A RESPONDER';
    default: {
      const never: never = kind;
      return never;
    }
  }
}

export function LessonStory({lesson,onStart}:{lesson:Lesson;onStart:()=>void}) {
  const [page,setPage]=useState(0);
  const what=levelBrief(lesson.title);
  const done=workedExample(lesson.title);
  const slides=[
    {kind:'what' as const,title:lesson.title,body:what[0]||'Este nivel se resuelve con el ejemplo de la pantalla siguiente.'},
    ...(done?[{kind:'sample' as const,title:'Mirá un caso ya resuelto',body:done}]:[]),
    {kind:'how' as const,title:'Qué vas a responder',body:what[1]||'La pantalla dice si hay que tocar una opción o escribir un resultado.'},
  ];
  const current=slides[page];
  if(!current)return <button className="primary" onClick={onStart}>Practicar<ArrowRight size={18}/></button>;
  return <section className="lesson-story" aria-label="Lección paso a paso">
    <div className="lesson-story-top"><span>{weekHeading(lesson.unit)}</span><b>{page+1} de {slides.length}</b></div>
    <div className="lesson-story-track" role="progressbar" aria-label="Lectura de la lección" aria-valuemin={1} aria-valuemax={slides.length} aria-valuenow={page+1}><span style={{'--progress':String((page+1)/slides.length)} as CSSProperties}/></div>
    <article key={page} className="lesson-story-card motion-in"><span className="lesson-story-icon"><TopicIcon name={lesson.icon} topic={lesson.title} size={37}/></span><small>{slideEyebrow(current.kind)}</small><h1>{current.title}</h1><p>{current.body}</p></article>
    <div className="lesson-story-actions">{page>0&&<button className="secondary" onClick={()=>setPage(page-1)}><ArrowLeft size={17}/>Anterior</button>}<button className="primary" onClick={()=>page+1<slides.length?setPage(page+1):onStart()}>{page+1<slides.length?'Continuar':`Empezar ${lesson.questions.length} ejercicios`}<ArrowRight size={18}/></button></div>
    {page+1===slides.length&&<p className="lesson-story-rule">El nivel queda marcado si acertás al menos {Math.ceil(lesson.questions.length*0.7)} de {lesson.questions.length} al primer intento, sin pista.</p>}
    {page<slides.length-1&&<button className="lesson-story-skip" onClick={onStart}>Ir a los {lesson.questions.length} ejercicios</button>}
  </section>;
}
