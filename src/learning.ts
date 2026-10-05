import type { Course, Lesson, Progress, Question } from './types';
import { dayKey } from './progress';
import { bookExercises } from './bookExercises';
export interface PracticeItem { lesson: Lesson; question: Question; }
export const bank = (lessons: Lesson[], course: Course): PracticeItem[] => {
  const path=lessons.filter(l=>l.course===course);
  return [...path.flatMap(lesson=>lesson.questions.map(question=>({lesson,question}))),
    ...bookExercises.filter(e=>e.course===course).flatMap(e=>{
      const lesson=path.find(l=>l.title===e.lessonTitle);
      return lesson?[{lesson,question:e.question}]:[];
    })];
};
export function seedNumber(value:string) { let n=2166136261;for(const c of value)n=Math.imul(n^c.charCodeAt(0),16777619);return n>>>0; }
export function dailyChallenge(items:PracticeItem[], course:Course, now=new Date()) {
  const seed=`${dayKey(now)}-${course}`;
  return [...items].sort((a,b)=>seedNumber(`${seed}-${a.question.id}`)-seedNumber(`${seed}-${b.question.id}`)).slice(0,5);
}
export function latestAttempts(p:Progress){const map=new Map<string,Progress['attempts'][number]>();for(const a of p.attempts)map.set(a.questionId,a);return map;}
export function practicePlan(items:PracticeItem[],p:Progress,count=8,now=new Date()) {
  const last=latestAttempts(p),time=now.getTime();
  const seed=dayKey(now);
  function priority(item:PracticeItem) {
    const q=item.question,s=p.skills[q.id],a=last.get(q.id);
    if(s&&Date.parse(s.due)<=time)return 100;
    if(a&&(!a.correct||a.assisted))return 80;
    if(!a)return 60;
    return s&&s.stage>=1?10:40;
  }
  return [...items].sort((a,b)=>priority(b)-priority(a)||seedNumber(`${seed}${a.question.id}`)-seedNumber(`${seed}${b.question.id}`)).slice(0,count);
}
export function mistakeJournal(items:PracticeItem[],p:Progress) {
  const last=latestAttempts(p),wrong=new Map<string,Progress['attempts'][number]>();
  for(const a of p.attempts)if(!a.correct)wrong.set(a.questionId,a);
  return items.filter(i=>wrong.has(i.question.id)).map(i=>({...i,attempt:wrong.get(i.question.id)!,resolved:!!last.get(i.question.id)?.correct&&!last.get(i.question.id)?.assisted}))
    .sort((a,b)=>Date.parse(b.attempt.date)-Date.parse(a.attempt.date));
}
export function sessionSummary(p:Progress,items:PracticeItem[],started:string) {
  const ids=new Set(items.map(i=>i.question.id)),first=new Map<string,Progress['attempts'][number]>(),attempts=p.attempts.filter(a=>ids.has(a.questionId)&&Date.parse(a.date)>=Date.parse(started));
  for(const a of attempts)if(!first.has(a.questionId))first.set(a.questionId,a);
  return {clean:[...first.values()].filter(a=>a.correct&&!a.assisted).length,retries:attempts.filter(a=>!a.correct).length,helped:new Set(attempts.filter(a=>a.assisted).map(a=>a.questionId)).size};
}
