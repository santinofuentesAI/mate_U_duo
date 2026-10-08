import { ArrowRight, Check, Play } from 'lucide-react';
import type { Lesson, Progress } from './types';
import { TopicIcon } from './TopicIcon';

export function LearningPath({path,progress:p,onStart}:{path:Lesson[];progress:Progress;onStart:(l:Lesson)=>void;onFavorite:(id:string)=>void}) {
  const next=path.find(lesson=>!p.completed.includes(lesson.id))||path[0];
  if(!next)return null;
  const units=[...new Set(path.map(lesson=>lesson.unit))];
  const done=path.filter(lesson=>p.completed.includes(lesson.id)).length;

  return <section className="learning-route journey-route" aria-label="Ruta de lecciones">
    <header className="journey-heading"><div><span className="eyebrow">TU RUTA</span><h1>Aprender</h1></div><span>{done} / {path.length} niveles</span></header>
    <nav className="journey-jumps" aria-label="Saltar a una unidad">{units.map((unit,i)=><button key={unit} onClick={()=>document.getElementById(`journey-unit-${i}`)?.scrollIntoView({behavior:'smooth',block:'start'})}>Unidad {i+1}</button>)}</nav>
    {units.map((unit,unitIndex)=><section className="journey-unit" id={`journey-unit-${unitIndex}`} key={unit} aria-label={`Unidad ${unitIndex+1}: ${unit}`}>
      <div className="journey-unit-banner"><span>UNIDAD {unitIndex+1}</span><h2>{unit.split(' · ')[1]||unit}</h2><small>{unit.split(' · ')[0]}</small></div>
      <div className="journey-levels">{path.filter(lesson=>lesson.unit===unit).map(lesson=>{
        const level=path.indexOf(lesson)+1,completed=p.completed.includes(lesson.id),current=lesson.id===next.id;
        return <button key={lesson.id} className={`journey-level ${current?'is-current':''} ${completed?'is-done':''}`} onClick={()=>onStart(lesson)} aria-label={`Nivel ${level}: ${lesson.title}${completed?', completado':current?', siguiente':''}`}>
          <span className="journey-orb">{completed?<Check size={27} strokeWidth={3}/>:<TopicIcon name={lesson.icon} topic={lesson.title} size={29}/>}</span>
          <span className="journey-level-copy"><small>{current?<><Play size={12} fill="currentColor"/> SIGUIENTE</>:completed?'COMPLETADO':`NIVEL ${level}`}</small><b>{lesson.title}</b></span>
          <ArrowRight className="journey-level-arrow" size={17}/>
        </button>;
      })}</div>
    </section>)}
  </section>;
}
