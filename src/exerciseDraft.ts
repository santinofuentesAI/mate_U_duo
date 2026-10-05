import type { Question } from './types';
export interface ExerciseDraft {value:string|string[];exclusions:string;hint:number;retried:boolean;feedback:{correct:boolean;error?:string}|null;}
export function initialAnswer(q:Question):ExerciseDraft {return {value:['table','synthetic'].includes(q.type)?(q.answer as string[]).map(()=> ''):['order','set','venn'].includes(q.type)?[]:'',exclusions:'',hint:0,retried:false,feedback:null};}
export function loadAnswerDraft(q:Question,key?:string):ExerciseDraft {
  const fresh=initialAnswer(q);if(!key)return fresh;
  try {
    const raw=localStorage.getItem(key);if(!raw||raw.length>30000)return fresh;const r=JSON.parse(raw) as ExerciseDraft;
    const array=Array.isArray(fresh.value);
    if(array? !Array.isArray(r.value)||r.value.length>64||r.value.some(s=>typeof s!=='string'||s.length>5000):typeof r.value!=='string'||r.value.length>5000)return fresh;
    if(typeof r.exclusions!=='string'||r.exclusions.length>5000||!Number.isInteger(r.hint)||r.hint<0||r.hint>2||typeof r.retried!=='boolean')return fresh;
    if(['table','synthetic'].includes(q.type)&&(r.value as string[]).length!==(q.answer as string[]).length)return fresh;
    if(r.feedback!==null&&(!r.feedback||typeof r.feedback.correct!=='boolean'||(r.feedback.error!==undefined&&(typeof r.feedback.error!=='string'||r.feedback.error.length>5000))))return fresh;
    return r;
  }catch{return fresh;}
}
