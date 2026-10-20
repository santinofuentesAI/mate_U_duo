import type { Lesson, Progress } from './types';
import type { Session } from './sessions';
import { LearningPath } from './LearningPath';
import { ArrowRight, X } from 'lucide-react';

interface Props {
  progress: Progress;
  path: Lesson[];
  pending: { session: Session; index: number } | null;
  onLesson: (lesson: Lesson) => void;
  onResume: () => void;
  onDiscard: () => void;
}

export function HomeDashboard({ progress, path, pending, onLesson, onDiscard, onResume }: Props) {
  return (
    <div className="home-dashboard">
      {pending && (
        <div className="resume-center">
          <small>{pending.session.title} · {Math.max(1, pending.index + 1)}/{pending.session.items.length}</small>
          <button className="primary" aria-label="Retomar sesión" onClick={onResume}>Continuar <ArrowRight size={18}/></button>
          <button className="text-button" type="button" aria-label="Descartar sesión guardada" onClick={onDiscard}><X size={16}/> Descartar</button>
        </div>
      )}
      <LearningPath key={progress.course} path={path} progress={progress} onStart={onLesson}/>
    </div>
  );
}
