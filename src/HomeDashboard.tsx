import type { Lesson, Progress } from './types';
import { LearningPath } from './LearningPath';

export function HomeDashboard({ progress, path, onLesson }: { progress: Progress; path: Lesson[]; onLesson: (lesson: Lesson) => void }) {
  return (
    <div className="home-dashboard">
      <LearningPath key={progress.course} path={path} progress={progress} onStart={onLesson}/>
    </div>
  );
}
