import { ArrowRight, GraduationCap } from 'lucide-react';
import type { Progress } from './types';
import type { Session } from './sessions';

export function ExamResults({session,progress,onLeave}:{session:Session;progress:Progress;onLeave:()=>void}){
  const attempts=progress.attempts.filter(a=>Date.parse(a.date)>=Date.parse(session.started)&&session.items.some(i=>i.question.id===a.questionId));
  const first=new Map<string,typeof attempts[number]>();
  for(const attempt of attempts)if(!first.has(attempt.questionId))first.set(attempt.questionId,attempt);
  const clean=session.items.filter(item=>{const attempt=first.get(item.question.id);return attempt?.correct&&!attempt.assisted;}).length;
  return <section className="exam-results"><div className="exam-results-hero"><GraduationCap size={46}/><span className="eyebrow">NOTA</span><h1>{clean}/{session.items.length}</h1><p>Sin ayudas. Esta es la nota.</p><div className="exam-result-numbers"><span><b>+{progress.xp-session.startingXP}</b> XP</span></div></div><button className="primary" onClick={onLeave}>Volver a practicar<ArrowRight size={18}/></button></section>;
}
