import type { Course, Lesson } from './types';
// Keep legacy route IDs stable for saved exams; displayed weekly claims use evidence.
export function lessonWeekLabel(lesson:Lesson) {
  const code=lesson.unit.split(' · ')[0];
  if(lesson.course==='precalculo'){
    if(['Raíces racionales y factores','División sintética','Factorización completa','Fracciones y dominio','Operar fracciones algebraicas','Radicales y racionalización'].includes(lesson.title))return 'S4 · material de clase';
    if(code==='S5'||code==='S6')return `${code} · material de clase`;
    return `${code} · semana por confirmar`;
  }
  return ['Introducción y razonamiento lógico','Formas normales','Métodos de demostración','Inferencias cuantificadas'].includes(lesson.title)?'Complemento del libro · semana por confirmar':`${code} · material de clase`;
}
export const bookScope:Record<Course,{lastPage:number;printedEnd:number;label:string;explanation:string}>={
  precalculo:{lastPage:63,printedEnd:63,label:'PDF 1–63 · clase S5–S6',explanation:'Alcance solicitado: números reales, polinomios, factorización, fracciones, ecuaciones e inecuaciones. S4 confirma división sintética, fracciones y racionalización. S5 confirma ecuaciones (práctica 4.6: 1c, 1g, 1h, 2h). S6 es inecuaciones del material de clase; la tarea 2, 3, 5, 11, 14 y 17 es el Ejercicio 4, impresa 86. La práctica de aplicaciones de PDF 64 queda fuera.'},
  discreta:{lastPage:152,printedEnd:150,label:'PDF 1–152 · impresa 150 · clase S5–S6',explanation:'S1: conectivas y leyes; S2: inferencias; S3: cuantificadores; S4: conjuntos, operaciones y Venn. S5: diagramas de Venn y leyes de conjuntos del material de clase. S6: conjunto potencia, producto cartesiano y cardinalidad, incluido el capítulo 2.5 del libro. Introducción, formas normales, demostraciones y conjuntos numéricos son complementos del alcance.'},
};
