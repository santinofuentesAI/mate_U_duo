import type { Lesson, Progress } from './types';
import type { Session } from './sessions';
import { LearningPath } from './LearningPath';
import { ArrowRight, X, Flame, Star, Trophy, Target } from 'lucide-react';
import { dailyGoalProgress, streak } from './progress';

interface Props {
  progress:Progress;
  path:Lesson[];
  pending:{session:Session;index:number}|null;
  onLesson:(lesson:Lesson)=>void;
  onResume:()=>void;
  onDiscard:()=>void;
  onFavorite:(id:string)=>void;
  onStartDailyPractice:()=>void;
}

export function HomeDashboard({progress,path,pending,onLesson,onDiscard,onResume,onFavorite,onStartDailyPractice}:Props) {
  const goalData = dailyGoalProgress(progress);
  const currentStreak = streak(progress);
  const completed = path.filter(l=>progress.completed.includes(l.id)).length;
  const percent = Math.min(100, Math.round((goalData.current / goalData.target) * 100));
  
  return <div className="home-dashboard">
    {pending&&<div className="resume-strip"><button onClick={onResume}><span>CONTINUAR</span><b>{pending.session.items[0].lesson.course!==progress.course?`${pending.session.items[0].lesson.course==='precalculo'?'Precálculo':'Discreta'} · `:''}{pending.session.title}</b><small>{Math.max(1,pending.index+1)}/{pending.session.items.length}</small></button><button className="resume-discard" aria-label="Descartar sesión" onClick={onDiscard}><X size={17}/></button></div>}
    
    <div className="home-welcome">
      <div>
        <h1>¡Hola de nuevo!</h1>
        <p>Seguí practicando para mantener tu racha de aprendizaje</p>
      </div>
      {currentStreak > 0 && <div className="home-streak">
        <Flame size={21}/>
        <b>{currentStreak}</b>
        <small>{currentStreak === 1 ? 'día' : 'días'}</small>
      </div>}
    </div>

    <div className="daily-goal-hero">
      <div className="daily-goal-content">
        <div className="daily-goal-header">
          <Target size={22}/>
          <div>
            <span className="eyebrow">META DE HOY</span>
            <h2>{progress.dailyGoalType === 'exercises' ? 'Completá ejercicios' : 'Ganá XP'}</h2>
          </div>
        </div>
        <div className="daily-goal-ring" style={{background: `conic-gradient(var(--button-accent) ${percent * 3.6}deg, var(--border) 0deg)`}}>
          <div>
            <b>{goalData.current}</b>
            <span>de {goalData.target}</span>
          </div>
        </div>
        <p>{goalData.met ? '¡Meta cumplida hoy! 🎉' : `Te faltan ${goalData.target - goalData.current} para completar tu meta`}</p>
        <button className="primary daily-practice-btn" onClick={onStartDailyPractice}>
          {goalData.met ? 'Practicar más' : 'Empezar práctica'}
          <ArrowRight size={19}/>
        </button>
      </div>
    </div>

    <div className="home-progress">
      <article className="home-progress-main">
        <div className="home-progress-icon"><Trophy size={19}/></div>
        <div>
          <small>Lecciones completadas</small>
          <b>{completed} / {path.length}</b>
        </div>
        <span className="home-progress-percent">{Math.round((completed/path.length)*100)}%</span>
        <div className="home-progress-track">
          <span style={{width: `${(completed/path.length)*100}%`}}/>
        </div>
      </article>
      <article>
        <div className="home-stat-icon"><Star size={18}/></div>
        <div>
          <small>Experiencia</small>
          <b>{progress.xp} XP</b>
        </div>
      </article>
      <article>
        <div className="home-stat-icon"><Flame size={18}/></div>
        <div>
          <small>Racha actual</small>
          <b>{currentStreak} {currentStreak === 1 ? 'día' : 'días'}</b>
        </div>
      </article>
    </div>

    <details className="route-disclosure">
      <summary>
        <span>
          <Trophy size={19}/>
          <b>Explorar lecciones</b>
        </span>
        <small>{path.length} lecciones</small>
      </summary>
      <LearningPath key={progress.course} path={path} progress={progress} onStart={onLesson} onFavorite={onFavorite}/>
    </details>
  </div>;
}
