import rawCatalog from './bookProblemCatalog.json';
import inventory from './bookInventory.json';
import type { BookSource, Course, Progress } from './types';
import type { PracticeItem } from './learning';
import { hasCheckedFinal, hasWrittenFinal } from './bookVerification';
export interface OpenBookProblem {
  id:string;course:Course;week:string;section:string;sectionCode:string;page:number;printedPage:number;number:number;part:string;
  text:string;instruction?:string;math?:string|null;contextMath?:string;mathLines?:string[];
  review:'reviewed'|'auxiliary';assignment:'confirmed'|'support'|'unconfirmed';inventoryReviewed:boolean;classAssigned?:boolean;
  visuals:{page:number;crop:BookSource['crop']}[];sourcePages:number[];
  table?:{headers:string[];rows:string[][]};
}
export const bookCatalog=rawCatalog as Record<Course,OpenBookProblem[]>;
export const pageInventory=inventory;
export function reviewedActivities(problem:OpenBookProblem,items:PracticeItem[]) {
  return items.filter(({question})=>{
    const source=question.bookSource;
    return source?.course===problem.course&&source.page===problem.page&&source.exercise.replace('-tabla','')===`${problem.number}${problem.part}`;
  });
}
export function responseStatus(problem:OpenBookProblem,items:PracticeItem[],progress:Progress,submitted:boolean) {
  const reviewed=reviewedActivities(problem,items);
  if(hasCheckedFinal(problem.id,reviewed))return 'validated';
  if(hasWrittenFinal(problem.id,reviewed))return 'submitted';
  const ids=new Set(reviewed.map(a=>a.question.id));
  const last=new Map<string,boolean>();for(const a of progress.attempts)if(ids.has(a.questionId))last.set(a.questionId,a.correct);
  return ids.size>0&&[...ids].every(id=>last.get(id)===true)?'validated':submitted?'submitted':'identified';
}
export const statusLabels={identified:'Ejercicio identificado',submitted:'Respuesta guardada · sin corregir',validated:'Resultado comprobado'};
export function assignmentLabel(week:string){return week==='Apoyo'?'Complemento del alcance':week==='Por confirmar'?'Semana por confirmar':week.startsWith('B')?`${week} · semana por confirmar`:`${week} · material de clase`;}
export function readBookPosition(course:Course) {
  try { const v=JSON.parse(localStorage.getItem(`mate-book-position-${course}`)||'null');return v&&typeof v.id==='string'&&bookCatalog[course].some(p=>p.id===v.id)?v as {id:string}:null; } catch {return null;}
}
