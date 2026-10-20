import type { Course, Lesson, Progress, Question } from './types';
import { dayKey } from './progress';
import { bookExercises } from './bookExercises';
import { caseExercises } from './caseStudies';
export interface PracticeItem { lesson: Lesson; question: Question; }
export type PracticeIntensity = 'easy' | 'medium' | 'hard' | 'exam';
export function dailyTitle(id: PracticeIntensity): string {
  switch (id) {
    case 'easy': return 'Práctica fácil · 20';
    case 'medium': return 'Práctica media · 20';
    case 'hard': return 'Práctica difícil · 20';
    case 'exam': return 'Práctica tipo examen · 20';
    default: {
      const never: never = id;
      return never;
    }
  }
}
function attachExtras(path: Lesson[], extras: { course: Course; lessonTitle: string; question: Question }[], course: Course): PracticeItem[] {
  return extras.filter(e => e.course === course).flatMap(e => {
    const lesson = path.find(l => l.title === e.lessonTitle);
    return lesson ? [{ lesson, question: e.question }] : [];
  });
}
export const bank = (lessons: Lesson[], course: Course): PracticeItem[] => {
  const path=lessons.filter(l=>l.course===course);
  return [...path.flatMap(lesson=>lesson.questions.map(question=>({lesson,question}))),
    ...attachExtras(path, bookExercises, course),
    ...attachExtras(path, caseExercises, course)];
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
/** A level counts when most answers were right on the first try, without hints or the revealed solution. */
export function lessonPassed(clean:number,total:number){return total>0&&clean>=Math.ceil(total*0.7);}
export function weekToken(item: PracticeItem): string {
  return item.lesson.unit.split(' · ')[0] || item.lesson.title;
}
function dailySnappy(question: Question): boolean {
  return question.type !== 'guidedproof' && question.type !== 'examproof';
}
export function practiceTargets(intensity: PracticeIntensity, count: number): Record<1 | 2 | 3, number> {
  switch (intensity) {
    case 'easy':
      return { 1: count, 2: 0, 3: 0 };
    case 'medium':
      return { 1: 0, 2: count, 3: 0 };
    case 'hard':
      return { 1: 0, 2: 0, 3: count };
    case 'exam': {
      const easy = Math.round(count * 0.4);
      const hard = Math.max(1, Math.round(count * 0.25));
      return { 1: easy, 2: Math.max(0, count - easy - hard), 3: hard };
    }
    default: {
      const never: never = intensity;
      return never;
    }
  }
}
function topicBoost(item: PracticeItem): number {
  const title = item.lesson.title;
  if (/sintética|Factor|Simplific|fracción|Fracciones|Trinomio|cubos|Tabla|Equivalenc|Venn|Cardinal|Potencia/i.test(title)) return 12;
  return 0;
}
function takeMixed(pool: PracticeItem[], n: number, seed: string, used: Set<string>): PracticeItem[] {
  const ranked = pool.filter(item => !used.has(item.question.id));
  const byWeek = new Map<string, PracticeItem[]>();
  for (const item of ranked) {
    const week = weekToken(item);
    const list = byWeek.get(week) || [];
    list.push(item);
    byWeek.set(week, list);
  }
  for (const list of byWeek.values()) {
    list.sort((a, b) => topicBoost(b) - topicBoost(a) || seedNumber(`${seed}-${a.question.id}`) - seedNumber(`${seed}-${b.question.id}`));
  }
  const weeks = [...byWeek.keys()].sort((a, b) => seedNumber(seed + a) - seedNumber(seed + b));
  const chosen: PracticeItem[] = [];
  let guard = 0;
  while (chosen.length < n && guard < n * 30) {
    let added = false;
    for (const week of weeks) {
      const next = byWeek.get(week)?.shift();
      if (!next) continue;
      chosen.push(next);
      used.add(next.question.id);
      added = true;
      if (chosen.length >= n) break;
    }
    if (!added) break;
    guard += 1;
  }
  return chosen;
}
/** Twenty mixed exercises for the study day: several weeks, easy to hard. */
export function mixedPractice(items: PracticeItem[], progress: Progress, intensity: PracticeIntensity, count = 20, now = new Date()): PracticeItem[] {
  const last = latestAttempts(progress);
  const time = now.getTime();
  const seed = `${dayKey(now)}-${intensity}-${count}`;
  const usable = items.filter(item => dailySnappy(item.question));
  const buckets: Record<1 | 2 | 3, PracticeItem[]> = { 1: [], 2: [], 3: [] };
  for (const item of usable) buckets[item.question.difficulty].push(item);
  const weighted = (pool: PracticeItem[]) => [...pool].sort((a, b) => {
    const score = (item: PracticeItem) => {
      const skill = progress.skills[item.question.id];
      const attempt = last.get(item.question.id);
      const due = skill && Date.parse(skill.due) <= time ? 20 : 0;
      const missed = attempt && (!attempt.correct || attempt.assisted) ? 12 : 0;
      const unseen = attempt ? 0 : 6;
      return due + missed + unseen + topicBoost(item);
    };
    return score(b) - score(a) || seedNumber(`${seed}-${a.question.id}`) - seedNumber(`${seed}-${b.question.id}`);
  });
  const targets = practiceTargets(intensity, count);
  const used = new Set<string>();
  const picked: PracticeItem[] = [];
  for (const difficulty of [1, 2, 3] as const) {
    picked.push(...takeMixed(weighted(buckets[difficulty]), targets[difficulty], seed, used));
  }
  if (picked.length < count) picked.push(...takeMixed(weighted(usable), count - picked.length, seed, used));
  return picked.sort((a, b) => a.question.difficulty - b.question.difficulty || seedNumber(`${seed}-order-${a.question.id}`) - seedNumber(`${seed}-order-${b.question.id}`));
}
export function sessionSummary(p:Progress,items:PracticeItem[],started:string) {
  const ids=new Set(items.map(i=>i.question.id)),first=new Map<string,Progress['attempts'][number]>(),attempts=p.attempts.filter(a=>ids.has(a.questionId)&&Date.parse(a.date)>=Date.parse(started));
  for(const a of attempts)if(!first.has(a.questionId))first.set(a.questionId,a);
  return {clean:[...first.values()].filter(a=>a.correct&&!a.assisted).length,retries:attempts.filter(a=>!a.correct).length,helped:new Set(attempts.filter(a=>a.assisted).map(a=>a.questionId)).size};
}
