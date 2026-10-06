import { lessons } from './content';
import type { Lesson } from './types';
import { bank, type PracticeItem } from './learning';
import { generateExam } from './exam';
import type { Course } from './types';
export interface Session { id:string; title:string; items:PracticeItem[]; lesson?:Lesson; mode:string; started:string; startingXP:number; examSeed?:string;examUnits?:string[];examCourse?:Course;examVersion?:1|2; }
export interface SavedSession { session:Session; index:number; }
export const SESSION_KEY='mate-u-duo.session.v1';
export function makeSession(title:string,items:PracticeItem[],mode:string,xp:number,lesson?:Lesson):Session {
  return {id:crypto.randomUUID(),title,items,mode,lesson,started:new Date().toISOString(),startingXP:xp};
}
export function decodeSession(raw:unknown):SavedSession|null {
  if(!raw||typeof raw!=='object')return null;
  const r=raw as Record<string,unknown>;
  if(typeof r.id!=='string'||!/^[a-f0-9-]{36}$/.test(r.id)||typeof r.title!=='string'||r.title.length>200||typeof r.mode!=='string'||r.mode.length>50||typeof r.started!=='string'||!Number.isFinite(Date.parse(r.started))||!Number.isFinite(r.startingXP)||Number(r.startingXP)<0||!Number.isInteger(r.index)||!Array.isArray(r.ids)||r.ids.length<1||r.ids.length>100||new Set(r.ids).size!==r.ids.length)return null;
  let items:(PracticeItem|undefined)[];
  if(r.mode==='exam'){
    if(typeof r.examSeed!=='string'||!/^[a-f0-9-]{36}$/.test(r.examSeed)||!['discreta','precalculo'].includes(String(r.examCourse))||!Array.isArray(r.examUnits)||r.examUnits.length<1||r.examUnits.length>5||r.examUnits.some(u=>typeof u!=='string'||u.length>100)||r.ids.length!==35)return null;
    if(r.examVersion!==undefined&&r.examVersion!==1&&r.examVersion!==2)return null;
    try{items=generateExam(r.examCourse as Course,r.examUnits as string[],r.examSeed,lessons,35,r.examVersion===2?2:1);}
    catch{return null;}
    if(JSON.stringify(items.map(i=>i!.question.id))!==JSON.stringify(r.ids))return null;
  }else{
    const questions=new Map([...bank(lessons,'discreta'),...bank(lessons,'precalculo')].map(item=>[item.question.id,item] as const));
    items=r.ids.map(id=>questions.get(String(id)));
  }
  if(items.some(x=>!x)||new Set(items.map(i=>i!.lesson.course)).size!==1)return null;
  const lesson=r.mode==='lesson'?lessons.find(l=>l.id===r.lessonId):undefined,index=Number(r.index);
  if(r.lessonId!==undefined&&!lesson)return null;
  if(index< (lesson?-1:0)||index>=items.length)return null;
  if(r.mode==='lesson'&&(!lesson||lesson.questions.length!==items.length||lesson.questions.some((q,i)=>q.id!==items[i]!.question.id)))return null;
  return {session:{id:r.id,title:r.title,mode:r.mode,started:r.started,startingXP:Number(r.startingXP),lesson,items:items as PracticeItem[],...(r.mode==='exam'?{examSeed:String(r.examSeed),examUnits:r.examUnits as string[],examCourse:r.examCourse as Course,examVersion:r.examVersion===2?2:1}:{})},index};
}
export function loadSession(){try{const text=localStorage.getItem(SESSION_KEY);return text?decodeSession(JSON.parse(text)):null;}catch{return null;}}
export function saveSession(s:Session,index:number){localStorage.setItem(SESSION_KEY,JSON.stringify({id:s.id,title:s.title,mode:s.mode,started:s.started,startingXP:s.startingXP,lessonId:s.lesson?.id,ids:s.items.map(i=>i.question.id),index,examSeed:s.examSeed,examUnits:s.examUnits,examCourse:s.examCourse,examVersion:s.examVersion}));}
