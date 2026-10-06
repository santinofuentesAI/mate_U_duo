import type { Lesson, Progress } from './types';
import type { Session } from './sessions';
import { LearningPath } from './LearningPath';

interface Props {
  progress:Progress;
  path:Lesson[];
  pending:{session:Session;index:number}|null;
  onLesson:(lesson:Lesson)=>void;
  onResume:()=>void;
  onDiscard:()=>void;
  onFavorite:(id:string)=>void;
}

export function HomeDashboard({progress,path,pending,onLesson,onDiscard,onResume,onFavorite}:Props) {
  return <div className="home-dashboard">
    {pending&&<div className="resume-strip"><button aria-label="Retomar sesión" onClick={onResume}><span>SESIÓN GUARDADA</span><b>Retomar {pending.session.title}</b><small>Ejercicio {Math.max(1,pending.index+1)} de {pending.session.items.length}</small></button><button className="resume-discard" aria-label="Descartar sesión guardada" onClick={onDiscard}>✕</button></div>}
    <LearningPath key={progress.course} path={path} progress={progress} onStart={onLesson} onFavorite={onFavorite}/>
  </div>;
}
