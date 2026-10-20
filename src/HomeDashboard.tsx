import type { Lesson, Progress } from './types';
import type { Session } from './sessions';
import { LearningPath } from './LearningPath';
import { bookCatalog, responseStatus } from './bookCatalog';
import { bank } from './learning';
import { lessons } from './content';
import { classWeekTour, missingCourseWeeks, nextStudyProblem, readWorkedIds, studyTour } from './bookStudy';
import { ArrowRight, BookOpenCheck, X } from 'lucide-react';
import { StudyGuide } from './StudyGuide';

interface Props {
  progress:Progress;
  path:Lesson[];
  pending:{session:Session;index:number}|null;
  onLesson:(lesson:Lesson)=>void;
  onResume:()=>void;
  onBook:(id:string)=>void;
  onDiscard:()=>void;
  onFavorite:(id:string)=>void;
}

export function HomeDashboard({progress,path,pending,onLesson,onDiscard,onResume,onBook,onFavorite}:Props) {
  const tour=studyTour(progress.course);
  const worked=new Set(readWorkedIds(progress.course));
  const items=bank(lessons,progress.course);
  const status=(problem:typeof tour[number])=>responseStatus(problem,items,progress,worked.has(problem.id));
  const touched=tour.filter(problem=>status(problem)!=='identified').length;
  const next=nextStudyProblem(tour,status);
  const pendingWeeks=missingCourseWeeks(progress.course);
  const classS5=classWeekTour(progress.course,'S5');
  const classS6=classWeekTour(progress.course,'S6');
  const nextClass=(week:typeof classS5)=>nextStudyProblem(week,status);
  return <div className="home-dashboard">
    {pending&&<div className="resume-strip resume-mini"><button aria-label="Retomar sesión" onClick={onResume}><span>CONTINUAR</span><b>{pending.session.items[0].lesson.course!==progress.course?`${pending.session.items[0].lesson.course==='precalculo'?'Precálculo':'Discreta'} · `:''}{pending.session.title}</b><small>{Math.max(1,pending.index+1)}/{pending.session.items.length}</small><ArrowRight size={17}/></button><button className="resume-discard" aria-label="Descartar sesión guardada" onClick={onDiscard}><X size={17}/></button></div>}
    <StudyGuide/>
    <section className="simple-feature journey-book-next"><div><h2><BookOpenCheck size={18}/> Libro completo</h2><p>{touched} de {bookCatalog[progress.course].length} ejercicios ya tienen trabajo o corrección. «Resultado correcto» está calificado. «Guardado · sin corregir» conserva tus pasos, sin nota automática. {pendingWeeks.length?`Las semanas ${pendingWeeks.join(' y ')} entran acá cuando pases el material.`:'El material nuevo de la semana entra en este recorrido.'}</p></div>{next&&<button className="primary" onClick={()=>onBook(next.id)}>{status(next)==='identified'?'Siguiente ejercicio del libro':'Seguir el ejercicio guardado'} <ArrowRight size={18}/></button>}</section>
    {progress.course==='discreta'&&(classS5.length>0||classS6.length>0)&&<section className="simple-feature class-week-jump"><div><h2>Material de clase S5 y S6</h2><p>Venn, leyes, potencia, producto y cardinalidad. No es el PDF del libro de texto. El recorrido del libro arranca en la página 37; esto salta directo a la clase.</p></div><div className="class-week-actions">{classS5.length>0&&<button className="primary" onClick={()=>{const item=nextClass(classS5);if(item)onBook(item.id);}}>Clase S5 · Venn y leyes</button>}{classS6.length>0&&<button className="secondary" onClick={()=>{const item=nextClass(classS6);if(item)onBook(item.id);}}>Clase S6 · potencia y cardinalidad</button>}</div></section>}
    <LearningPath key={progress.course} path={path} progress={progress} onStart={onLesson} onFavorite={onFavorite}/>
  </div>;
}
