import { useState, type CSSProperties } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import katex from 'katex';
import type { Lesson } from './types';
import { TopicIcon } from './TopicIcon';
import { weekHeading } from './weekGroups';
import { levelBrief } from './levelBrief';
import { workedExample } from './workedExamples';

type SlideKind = 'what' | 'formula' | 'sample' | 'step' | 'how';

interface Slide {
  kind: SlideKind;
  title: string;
  body: string;
  formulas?: string[];
}

function slideEyebrow(kind: SlideKind): string {
  switch (kind) {
    case 'what': return 'EN PALABRAS';
    case 'formula': return 'LA FÓRMULA';
    case 'sample': return 'EJEMPLO HECHO';
    case 'step': return 'PASO A PASO';
    case 'how': return 'QUÉ VAS A RESPONDER';
    default: {
      const never: never = kind;
      return never;
    }
  }
}

function Formula({ value }: { value: string }) {
  return <div className="math" dangerouslySetInnerHTML={{ __html: katex.renderToString(value, { throwOnError: false, strict: false, displayMode: true }) }} />;
}

export function LessonStory({lesson,onStart}:{lesson:Lesson;onStart:()=>void}) {
  const [page,setPage]=useState(0);
  const what=levelBrief(lesson.title);
  const done=workedExample(lesson.title);
  const steps=lesson.example.steps.filter(step=>step.trim());
  const slides: Slide[]=[
    {kind:'what',title:lesson.title,body:what[0]||'Este nivel se resuelve con el ejemplo de la pantalla siguiente.'},
    ...(lesson.formulas.length?[{kind:'formula' as const,title:'Esta es la regla escrita',body:'Leé la fórmula y después el ejemplo. Cada símbolo de acá vuelve a aparecer en los pasos.',formulas:lesson.formulas}]:[]),
    ...(done?[{kind:'sample' as const,title:'Mirá un caso ya resuelto',body:done}]:[]),
    ...steps.map((step,index)=>({kind:'step' as const,title:steps.length>1?`Paso ${index+1} de ${steps.length}`:'Cómo se hace',body:step})),
    {kind:'how',title:'Qué vas a responder',body:what[1]||'La pantalla dice si hay que tocar una opción o escribir un resultado.'},
  ];
  const current=slides[page];
  if(!current)return <button className="primary" onClick={onStart}>Practicar<ArrowRight size={18}/></button>;
  return <section className="lesson-story" aria-label="Lección paso a paso">
    <div className="lesson-story-top"><span>{weekHeading(lesson.unit)}</span><b>{page+1} de {slides.length}</b></div>
    <div className="lesson-story-track" role="progressbar" aria-label="Lectura de la lección" aria-valuemin={1} aria-valuemax={slides.length} aria-valuenow={page+1}><span style={{'--progress':String((page+1)/slides.length)} as CSSProperties}/></div>
    <article key={page} className="lesson-story-card motion-in"><span className="lesson-story-icon"><TopicIcon name={lesson.icon} topic={lesson.title} size={37}/></span><small>{slideEyebrow(current.kind)}</small><h1>{current.title}</h1>{current.body&&<p>{current.body}</p>}{current.formulas&&current.formulas.length>0&&<div className="lesson-story-formulas">{current.formulas.map(formula=><Formula key={formula} value={formula}/>)}</div>}</article>
    <div className="lesson-story-actions">{page>0&&<button className="secondary" onClick={()=>setPage(page-1)}><ArrowLeft size={17}/>Anterior</button>}<button className="primary" onClick={()=>page+1<slides.length?setPage(page+1):onStart()}>{page+1<slides.length?'Continuar':`Empezar ${lesson.questions.length} ejercicios`}<ArrowRight size={18}/></button></div>
    {page+1===slides.length&&<p className="lesson-story-rule">El nivel queda marcado si acertás al menos {Math.ceil(lesson.questions.length*0.7)} de {lesson.questions.length} al primer intento, sin pista.</p>}
    {page<slides.length-1&&<button className="lesson-story-skip" onClick={onStart}>Ir a los {lesson.questions.length} ejercicios</button>}
  </section>;
}
