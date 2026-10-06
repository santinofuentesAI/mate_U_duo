import { ArrowRight, BookOpen, Check, Clock3, Compass, Flame, RotateCcw, Sparkles, Target, Trophy } from 'lucide-react';
import type { Lesson, Progress } from './types';
import type { Session } from './sessions';
import { LearningPath } from './LearningPath';

interface Props {
  progress:Progress; courseTitle:string; subtitle:string; path:Lesson[]; next:Lesson;
  mastered:number; today:number; streak:number; due:number; errors:number; pending:{session:Session;index:number}|null;
  onLesson:(lesson:Lesson)=>void; onPractice:(mode:string)=>void; onResume:()=>void; onExplore:()=>void; onBook:()=>void;
  onFavorite:(id:string)=>void;
}

export function HomeDashboard({progress,courseTitle,subtitle,path,next,mastered,today,streak,due,errors,pending,onLesson,onPractice,onResume,onExplore,onBook,onFavorite}:Props) {
  const goal=Math.min(today,progress.goal),mastery=Math.round(mastered/Math.max(1,path.length)*100);
  const recommendReview=!pending&&due>0,recommendError=!pending&&!recommendReview&&errors>0;
  const routeMastered=!pending&&!recommendReview&&!recommendError&&mastered===path.length;
  const title=pending?`Retomá ${pending.session.title}`:recommendReview?'Un repaso breve para que no se te olvide':recommendError?'Volvamos a una idea que costó':routeMastered?'¡Ya dominaste toda la ruta!':'Tu siguiente paso';
  const description=pending?`Te guardamos el ejercicio ${Math.max(1,pending.index+1)} de ${pending.session.items.length}.`:recommendReview?`${due} ${due===1?'respuesta está':'respuestas están'} listas para repasar.`:recommendError?`${errors} ${errors===1?'ejercicio necesita':'ejercicios necesitan'} un segundo intento, sin prisa.`:routeMastered?'Ahora podés mantenerla fresca con pequeños repasos y ejercicios nuevos.':`Avanzá con ${next.title}. Un concepto y unos ejercicios a la vez.`;
  const action=pending?'Retomar sesión':recommendReview?'Repasar ahora':recommendError?'Reforzar este tema':routeMastered?'Practicar para mantener':'Continuar mi ruta';
  function go(){if(pending)onResume();else if(recommendReview)onPractice('review');else if(recommendError)onPractice('errors');else if(routeMastered)onPractice('quick');else onLesson(next);}
  return <div className="home-dashboard">
    <header className="home-welcome"><div><span className="eyebrow">TU ESPACIO DE APRENDIZAJE</span><h1>Un paso claro a la vez.</h1><p>{courseTitle} · {subtitle}</p></div><div className="home-streak" title="Días de racha"><Flame size={20}/><b>{streak}</b><small>días de racha</small></div></header>
    <section className={`home-next card ${recommendReview?'is-review':''}`} aria-label="Tu siguiente paso"><div className="home-next-art"><span className="home-spark"><Sparkles size={19}/></span><Target size={42}/><span className="home-orbit"/></div><div className="home-next-copy"><span className="eyebrow">{pending?'SESIÓN GUARDADA':recommendReview?'REPASO ESPACIADO':recommendError?'REFUERZO PERSONALIZADO':'RECOMENDADO PARA VOS'}</span><h2>{title}</h2><p>{description}</p><button className="primary" onClick={go}>{action}<ArrowRight size={18}/></button></div></section>
    <section className="home-progress" aria-label="Resumen de aprendizaje"><article className="home-progress-main"><span className="home-progress-icon"><Trophy size={19}/></span><div><small>Dominio de la ruta</small><b>{mastered} de {path.length} temas</b></div><span className="home-progress-percent">{mastery}%</span><div className="home-progress-track" role="progressbar" aria-label="Temas dominados" aria-valuemin={0} aria-valuemax={100} aria-valuenow={mastery}><span style={{width:`${mastery}%`}}/></div></article><article><span className="home-stat-icon review"><RotateCcw size={18}/></span><div><small>Para repasar</small><b>{due}</b></div></article><article><span className="home-stat-icon today"><Check size={18}/></span><div><small>Meta de hoy</small><b>{goal}<em> / {progress.goal}</em></b></div></article></section>
    <div className="home-explain"><details><summary>¿Cuándo cuenta un tema como dominado?</summary><p>Cuando resolvés sus ejercicios sin pistas y volvés a recordarlos en sesiones separadas. Los XP motivan; el dominio mide lo que ya podés recordar.</p></details><span><Clock3 size={15}/> Sesiones cortas, progreso que se queda.</span></div>
    <section className="home-shortcuts" aria-label="Atajos de estudio"><button onClick={()=>onPractice('quick')}><span><RotateCcw size={19}/></span><b>Practicar 3 ejercicios</b><small>Una pausa de pocos minutos</small><ArrowRight size={17}/></button><button onClick={onExplore}><span><Compass size={19}/></span><b>Explorar visualmente</b><small>Probar cómo cambian las ideas</small><ArrowRight size={17}/></button><button onClick={onBook}><span><BookOpen size={19}/></span><b>Ir a mi libro</b><small>Leer o cargar el PDF</small><ArrowRight size={17}/></button></section>
    <details className="route-disclosure"><summary><span><Sparkles size={19}/><b>Explorar toda la ruta</b></span><small>{path.length} temas · {mastered} dominados</small></summary><LearningPath key={progress.course} path={path} progress={progress} onStart={onLesson} onFavorite={onFavorite}/></details>
  </div>;
}
