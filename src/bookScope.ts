import type { Course, Lesson } from './types';
// Keep legacy route IDs stable for saved exams; displayed weekly claims use evidence.
export function lessonWeekLabel(lesson:Lesson) {
  if(lesson.course==='precalculo')return ['Raíces racionales y factores','División sintética','Factorización completa','Fracciones y dominio','Operar fracciones algebraicas','Radicales y racionalización'].includes(lesson.title)?'S4 · material de clase':`${lesson.unit.split(' · ')[0]} · semana por confirmar`;
  return ['Introducción y razonamiento lógico','Formas normales','Métodos de demostración','Inferencias cuantificadas'].includes(lesson.title)?'Complemento del libro · semana por confirmar':`${lesson.unit.split(' · ')[0]} · material de clase`;
}
export const bookScope:Record<Course,{lastPage:number;printedEnd:number;label:string;explanation:string}>={
  precalculo:{lastPage:63,printedEnd:63,label:'PDF 1–63',explanation:'Alcance solicitado: números reales, polinomios, factorización, fracciones y ecuaciones. El material S4 confirma división sintética, fracciones y racionalización; las semanas de los demás bloques están por confirmar. La práctica de aplicaciones de PDF 64 queda fuera.'},
  discreta:{lastPage:152,printedEnd:150,label:'PDF 1–152 · impresa 150',explanation:'S1: conectivas y leyes; S2: inferencias; S3: cuantificadores; S4: conjuntos, operaciones y Venn. Introducción, formas normales, demostraciones y conjuntos numéricos son complementos del alcance. Cardinalidad está dentro del corte solicitado; su semana está por confirmar.'},
};
