import { Fragment } from 'react';
import { mathParts } from './mathNotation';
export function MathExpression({value}:{value:string}) {
  return <span className="math-expression">{mathParts(value).map(p=>p.power?<sup key={p.start}>{p.text}</sup>:<Fragment key={p.start}>{p.text}</Fragment>)}</span>;
}
