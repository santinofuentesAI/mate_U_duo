import type { Lesson, Progress } from './types';
import type { Session } from './sessions';
import { LearningPath } from './LearningPath';

interface Props {
  progress:Progress;
  path:Lesson[];
  pending:{session:Session;index:number}|null;
  onLesson:(lesson:Lesson)=>void;
  onResume:()=>void;
  onFavorite:(id:string)=>void;
}

export function HomeDashboard({progress,path,pending,onLesson,onResume,onFavorite}:Props) {
  return <div className="home-dashboard">
    {pending&&<button className="resume-strip" onClick={onResume}><span>SESIÓN GUARDADA</span><b>Retomar {pending.session.title}</b><small>Ejercicio {Math.max(1,pending.index+1)} de {pending.session.items.length}</small></button>}
    <LearningPath key={progress.course} path={path} progress={progress} onStart={onLesson} onFavorite={onFavorite}/>
  </div>;
}
