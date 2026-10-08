import type { Lesson, Progress } from './types';
import type { Session } from './sessions';
import { LearningPath } from './LearningPath';
import { ArrowRight, X } from 'lucide-react';

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
    {pending&&<div className="resume-strip resume-mini"><button aria-label="Retomar sesión" onClick={onResume}><span>CONTINUAR</span><b>{pending.session.title}</b><small>{Math.max(1,pending.index+1)}/{pending.session.items.length}</small><ArrowRight size={17}/></button><button className="resume-discard" aria-label="Descartar sesión guardada" onClick={onDiscard}><X size={17}/></button></div>}
    <LearningPath key={progress.course} path={path} progress={progress} onStart={onLesson} onFavorite={onFavorite}/>
  </div>;
}
