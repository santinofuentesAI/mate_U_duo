import { lazy, Suspense, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Search } from 'lucide-react';
import katex from 'katex';
import { lessons } from './content';
import type { Course, Lesson } from './types';
import { TopicIcon } from './TopicIcon';
import { lessonWeekLabel } from './bookScope';
import { MathExpression } from './MathExpression';
const TechnicalBooks=lazy(()=>import('./TechnicalBooks').then(m=>({default:m.TechnicalBooks})));
const normalize=(s:string)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
export function Library({course,onPractice,onRead,onProblem}:{course:Course;onPractice:(l:Lesson)=>void;onRead:(page:number)=>void;onProblem:(id:string)=>void}) {
  const [search,setSearch]=useState(''),[selected,setSelected]=useState<string|null>(null),[technical,setTechnical]=useState(false);
  const path=lessons.filter(l=>l.course===course),reading=path.find(l=>l.id===selected);
  const filtered=path.filter(l=>normalize(`${l.title} ${l.theory.join(' ')}`).includes(normalize(search)));
  if(technical)return <Suspense fallback={<p role="status">Preparando Técnica…</p>}><TechnicalBooks course={course} onRead={onRead} onProblem={onProblem} onBack={()=>setTechnical(false)}/></Suspense>;
  return <div className="simple-flow reading-library"><h1>Biblioteca</h1><p>Buscá una idea, seguí un ejemplo y practicá.</p>
    {reading?<article className="card reading-article"><button className="text-button" onClick={()=>setSelected(null)}><ArrowLeft size={17}/> Volver a los temas</button><small>{lessonWeekLabel(reading)}</small><h2><TopicIcon name={reading.icon} size={22}/> {reading.title}</h2>{reading.theory.map(t=><p key={t}>{t}</p>)}<div className="formula-box">{reading.formulas.map(f=><div className="math" key={f} dangerouslySetInnerHTML={{__html:katex.renderToString(f,{throwOnError:false,strict:false,displayMode:true})}}/>)}</div><h3>Ejemplo paso a paso</h3><div className="example">{reading.example.steps.map((s,i)=><div key={i}><span>{i+1}</span><p>{s}</p></div>)}</div><details className="simple-more"><summary>Ver ejercicios explicados ({reading.questions.length})</summary>{reading.questions.map((q,i)=><details className="solved-question" key={q.id}><summary>Ejercicio {i+1} · {q.prompt}</summary><p><b>Respuesta:</b> {Array.isArray(q.answer)?q.answer.join(' · '):q.type==='algebra'?<MathExpression value={q.answer}/>:q.answer}</p>{q.exclusions&&<p><b>Restricciones:</b> {q.exclusions.join(', ')}</p>}<p>{q.explanation}</p></details>)}</details><button className="primary" onClick={()=>onPractice(reading)}>Practicar este tema <ArrowRight size={18}/></button><small className="source-note">{reading.source} · páginas {reading.pages} · explicación adaptada</small></article>:<>
      <label className="simple-search"><Search size={18}/><input aria-label="Buscar en la biblioteca" placeholder="Buscar tema o concepto…" value={search} onChange={e=>setSearch(e.target.value)}/></label>
      <button className="simple-link" onClick={()=>setTechnical(true)}><BookOpen size={22}/><span><b>Técnica · texto del libro</b><small>Buscar por página y abrir el original</small></span><ArrowRight size={18}/></button>
      <div className="simple-link-list">{filtered.map(l=><button key={l.id} onClick={()=>{setSelected(l.id);window.scrollTo(0,0);}}><b>{l.title}</b><span>{lessonWeekLabel(l)} · ejemplo resuelto</span></button>)}</div>{!filtered.length&&<p className="notice">No encontré ese concepto. Probá otra palabra.</p>}
    </>}
  </div>;
}
