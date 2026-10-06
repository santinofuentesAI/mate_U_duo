import { Eye, EyeOff } from 'lucide-react';
import type { Question } from './types';
import { truthRows } from './engine';
import { MathExpression } from './MathExpression';

function answerLines(question:Question):string[] {
  const answer=Array.isArray(question.answer)?question.answer:[question.answer];
  if(question.type==='table')return answer.map((value,index)=>{const values=truthRows(question.expression!,question.variables)[index]?.values;return `Fila ${index+1} (${Object.entries(values||{}).map(([name,truth])=>`${name}=${truth?'V':'F'}`).join(', ')}): ${value}`;});
  if(question.type==='synthetic')return [`Coeficientes en orden: ${answer.join(', ')}`];
  if(question.type==='order')return answer.map((value,index)=>`${index+1}. ${value}`);
  if(question.type==='set')return [answer.length?`{${answer.join(', ')}}`:'∅'];
  if(question.type==='venn')return [`Regiones: ${answer.join(', ')}`];
  return answer;
}

export function AnswerReveal({question,open,onToggle}:{question:Question;open:boolean;onToggle:()=>void}) {
  const lines=answerLines(question);
  return <section className="answer-reveal">
    <button type="button" className="secondary answer-reveal-trigger" aria-expanded={open} onClick={onToggle}>
      {open?<EyeOff size={17}/>:<Eye size={17}/>} {open?'Ocultar respuesta':'Ver respuesta'}
    </button>
    {open&&<div className="answer-reveal-panel" role="region" aria-label="Respuesta explicada">
      <b>Respuesta</b>
      {question.type==='order'?<ol>{lines.map((line,index)=><li key={`${index}-${line}`}>{line.slice(line.indexOf('. ')+2)}</li>)}</ol>:<p className="answer-reveal-value">{lines.map((line,index)=><code key={`${index}-${line}`}>{question.type==='algebra'?<MathExpression value={line}/>:line}</code>)}</p>}
      {question.exclusions?.length?<p className="answer-reveal-domains"><b>Restricciones:</b> {question.exclusions.join(', ')}</p>:null}
      <p>{question.explanation}</p>
      {question.guidedSteps?.length? <ol>{question.guidedSteps.map((step,index)=><li key={`${index}-${step.expression}`}><code>{step.expression}</code> — {step.rule}</li>)}</ol>:null}
      <small>Al revelar la respuesta, el acierto se registra con ayuda y vuelve a aparecer en tus repasos.</small>
    </div>}
  </section>;
}
