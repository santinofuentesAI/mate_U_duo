import type { Course } from './types';
import type { PracticeItem } from './learning';
import { bookRoutes } from './bookIndex';

export function orderedBookItems(items: PracticeItem[]) {
  return items.filter(item => item.question.bookSource).sort((a,b) => {
    const left=a.question.bookSource!, right=b.question.bookSource!;
    return left.page-right.page || left.crop.y-right.crop.y || left.crop.x-right.crop.x || left.exercise.localeCompare(right.exercise, 'es', {numeric:true});
  });
}

export function bookExamBlocks(course:Course,items:PracticeItem[]) {
  const routes=bookRoutes[course];
  const weeks=[...new Set(routes.map(route=>route.week))].sort((a,b)=>Number(a.slice(1))-Number(b.slice(1)));
  return weeks.map(week=>{
    const sections=routes.filter(route=>route.week===week).sort((a,b)=>a.page-b.page);
    const pages=[...new Set(sections.flatMap(route=>Array.from({length:route.end-route.page+1},(_,i)=>route.page+i)))].sort((a,b)=>a-b);
    const selected=orderedBookItems(items.filter(item=>pages.includes(item.question.bookSource?.page ?? -1)));
    return {week,sections,pages,items:selected};
  });
}
