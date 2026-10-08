import type { Question } from './types';

// Parsers deliberately do not use eval or dynamically execute user input.
type Node = { op: string; a?: Node; b?: Node; value?: string };
export function parseLogic(input: string): Node {
  const raw = input.replace(/<->/g, '↔').replace(/->/g, '→').replace(/[!~]/g, '¬').replace(/\&/g, '∧').replace(/\|/g, '∨').replace(/\^/g, '⊻').replace(/\s/g, '').toUpperCase();
  const tokens = raw.match(/[A-Z01]|[¬∧∨→↔⊻()]/g) || [];
  if (tokens.join('') !== raw || !tokens.length || tokens.length > 150) throw new Error('Usá letras P, Q… y los símbolos del teclado.');
  let at = 0;
  function atom(): Node {
    const t = tokens[at++];
    if (t === '¬') return { op: 'not', a: atom() };
    if (t === '(') { const n = bicond(); if (tokens[at++] !== ')') throw new Error('Falta cerrar un paréntesis.'); return n; }
    if (t && /^[A-Z01]$/.test(t)) return { op: 'var', value: t };
    throw new Error('La expresión está incompleta.');
  }
  function and(): Node { let n = atom(); while (tokens[at] === '∧') { at++; n = { op: '∧', a: n, b: atom() }; } return n; }
  function or(): Node { let n = and(); while (['∨', '⊻'].includes(tokens[at])) { const op = tokens[at++]; n = { op, a: n, b: and() }; } return n; }
  function imp(): Node { const n = or(); if (tokens[at] === '→') { at++; return { op: '→', a: n, b: imp() }; } return n; }
  function bicond(): Node { let n = imp(); while (tokens[at] === '↔') { at++; n = { op: '↔', a: n, b: imp() }; } return n; }
  const result = bicond(); if (at !== tokens.length) throw new Error('Revisá los conectores y paréntesis.'); return result;
}
export function evaluateLogic(n: Node, values: Record<string, boolean>): boolean {
  if (n.op === 'var') return n.value === '1' ? true : n.value === '0' ? false : !!values[n.value!];
  const a = evaluateLogic(n.a!, values); if (n.op === 'not') return !a;
  const b = evaluateLogic(n.b!, values);
  switch (n.op) { case '∧': return a && b; case '∨': return a || b; case '⊻': return a !== b; case '→': return !a || b; case '↔': return a === b; default: throw new Error('Operador desconocido.'); }
}
export function truthRows(expr: string, variables?: string[]) {
  const n = parseLogic(expr);
  const vars = variables || [...new Set(expr.toUpperCase().match(/[A-Z]/g) || [])].sort();
  if (vars.length > 8) throw new Error('Máximo 8 variables.');
  return Array.from({ length: 2 ** vars.length }, (_, i) => {
    const values = Object.fromEntries(vars.map((v, j) => [v, !(i & (1 << (vars.length - j - 1)))]));
    return { values, result: evaluateLogic(n, values) };
  });
}
export function equivalentLogic(a: string, b: string) {
  const vars = [...new Set((a + b).toUpperCase().match(/[A-Z]/g) || [])].sort();
  const aa = truthRows(a, vars), bb = truthRows(b, vars);
  return aa.every((r, i) => r.result === bb[i].result);
}
export function classify(expr: string) {
  const rows = truthRows(expr); return rows.every(r => r.result) ? 'Tautología' : rows.every(r => !r.result) ? 'Contradicción' : 'Contingencia';
}

type Poly = Map<string, number>;
type Rational = { num: Poly; den: Poly };
const one = () => new Map([['', 1]]);
function keyProduct(a: string, b: string) { return (a + b).split('').sort().join(''); }
function add(a: Poly, b: Poly, sign = 1) { const p = new Map(a); b.forEach((v, k) => p.set(k, (p.get(k) || 0) + sign * v)); return clean(p); }
function clean(p: Poly) { for (const [k, v] of p) { if (Math.abs(v) < 1e-10) p.delete(k); if (!Number.isFinite(v) || Math.abs(v) > 1e12 || k.length > 30) throw new Error('La expresión supera el tamaño permitido.'); } if (p.size > 300) throw new Error('Simplificá la expresión antes de ingresarla.'); return p; }
function mul(a: Poly, b: Poly) { const p: Poly = new Map(); for (const [ak, av] of a) for (const [bk, bv] of b) { const k = keyProduct(ak, bk); p.set(k, (p.get(k) || 0) + av * bv); } return clean(p); }
function combine(a: Rational, b: Rational, op: string): Rational {
  if (op === '*') return { num: mul(a.num, b.num), den: mul(a.den, b.den) };
  if (op === '/') { if (!b.num.size) throw new Error('No se puede dividir por cero.'); return { num: mul(a.num, b.den), den: mul(a.den, b.num) }; }
  return { num: add(mul(a.num, b.den), mul(b.num, a.den), op === '-' ? -1 : 1), den: mul(a.den, b.den) };
}
export function parseAlgebra(input: string): Rational {
  let raw = input.trim().toLowerCase().replace(/[−–]/g, '-').replace(/[×·]/g, '*').replace(/[÷]/g, '/').replace(/\s+/g, '');
  if (raw.length > 180) throw new Error('La respuesta es demasiado larga.');
  const tokens = raw.match(/\d+(?:\.\d+)?|[a-z]|[()+*/^\-]/g) || [];
  if (tokens.join('') !== raw || !tokens.length) throw new Error('Usá x, números, paréntesis y + − * / ^.');
  const expanded: string[] = [];
  tokens.forEach((t, i) => { const prev = tokens[i - 1]; if (prev && /^(\d+(\.\d+)?|[a-z]|\))$/.test(prev) && /^(\d+(\.\d+)?|[a-z]|\()$/.test(t)) expanded.push('*'); expanded.push(t); });
  let at = 0;
  function atom(): Rational {
    const t = expanded[at++];
    if (t === '(') { const n = sum(); if (expanded[at++] !== ')') throw new Error('Falta cerrar un paréntesis.'); return n; }
    if (/^\d+(\.\d+)?$/.test(t || '')) return { num: clean(new Map([['', Number(t)]])), den: one() };
    if (/^[a-z]$/.test(t || '')) return { num: new Map([[t, 1]]), den: one() };
    throw new Error('Revisá la expresión algebraica.');
  }
  function power(): Rational { let n = atom(); if (expanded[at] === '^') { at++; const exponent = expanded[at++]; if (!/^\d$/.test(exponent || '') || Number(exponent) > 8) throw new Error('Usá exponentes enteros entre 0 y 8.'); const original = n; n = { num: one(), den: one() }; for (let i = 0; i < Number(exponent); i++) n = combine(n, original, '*'); } return n; }
  function unary(): Rational { if (expanded[at] === '-') { at++; const n = unary(); return { num: mul(new Map([['', -1]]), n.num), den: n.den }; } if (expanded[at] === '+') { at++; return unary(); } return power(); }
  function product(): Rational { let n = unary(); while (['*', '/'].includes(expanded[at])) { const op = expanded[at++]; n = combine(n, unary(), op); } return n; }
  function sum(): Rational { let n = product(); while (['+', '-'].includes(expanded[at])) { const op = expanded[at++]; n = combine(n, product(), op); } return n; }
  const result = sum(); if (at !== expanded.length || !result.den.size) throw new Error('La expresión no es válida.'); return result;
}
export function equivalentAlgebra(a: string, b: string) { const aa = parseAlgebra(a), bb = parseAlgebra(b); return !add(mul(aa.num, bb.den), mul(bb.num, aa.den), -1).size; }
export function hasVariableDenominator(input: string) { return [...parseAlgebra(input).den.keys()].some(key => key.length > 0); }
// Equivalence alone would also accept the unchanged, unfactored problem.
export function isFactored(input: string) {
  let raw=input.toLowerCase().replace(/\s/g,'').replace(/[×·]/g,'*').replace(/[−–]/g,'-');
  function unwrap(s:string):string {
    if(s[0]!=='('||s.at(-1)!==')')return s;
    let depth=0;for(let i=0;i<s.length-1;i++){if(s[i]==='(')depth++;if(s[i]===')')depth--;if(depth===0)return s;}
    return unwrap(s.slice(1,-1));
  }
  raw=unwrap(raw).replace(/([a-z0-9)])\(/g,'$1*(').replace(/\)([a-z])/g,')*$1');
  let depth=0,start=0;const factors:string[]=[];
  for(let i=0;i<raw.length;i++){if(raw[i]==='(')depth++;if(raw[i]===')')depth--;if(raw[i]==='*'&&depth===0){factors.push(raw.slice(start,i));start=i+1;}}
  factors.push(raw.slice(start));let count=0;
  for(const factor of factors){const p=parseAlgebra(factor);if((([...p.num.keys()].some(k=>k.length)) || (factors.length>1 && [...p.num.values()].some(v=>Math.abs(v)>1))) && [...p.den.keys()].every(k=>!k.length)){
    const power=unwrap(factor).match(/^\((.+)\)\^([2-8])$/);
    count+=power&&/[+-]/.test(power[1].slice(1))?Number(power[2]):1;
  }}
  return count>=2;
}
export function synthetic(coefficients: number[], root: number) { const result = [coefficients[0]]; for (let i = 1; i < coefficients.length; i++) result.push(coefficients[i] + root * result[i - 1]); return result; }
export function normalize(s: string) { return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase().replace(/\s+/g, ' ').replace(/[−–]/g, '-'); }
function elements(s: string | string[]) { return [...new Set((Array.isArray(s) ? s : s.replace(/[{}]/g, '').split(/[;,]/)).map(x => normalize(x)).filter(Boolean))].sort(); }
export function sameSet(a: string | string[], b: string | string[]) { return JSON.stringify(elements(a)) === JSON.stringify(elements(b)); }
export function grade(q: Question, value: string | string[], exclusions: string[] = []): { correct: boolean; error?: string } {
  try {
    if (q.type === 'logic') return { correct: equivalentLogic(String(value), String(q.answer)) };
    if (q.type === 'algebra') { const equivalent = equivalentAlgebra(String(value), String(q.answer)); const domains = sameSet(exclusions, q.exclusions || []); const form=q.requiredForm==='factored'?isFactored(String(value)):q.requiredForm==='expanded'?!/[()]/.test(String(value)):true; return { correct: equivalent && domains && form, error: equivalent && !domains ? 'La expresión es equivalente, pero revisá las restricciones del dominio original.' : equivalent&&!form?q.requiredForm==='expanded'?'Es equivalente, pero falta desarrollarla: escribí el polinomio sin paréntesis.':'Es equivalente, pero falta escribirla como producto de factores. Consultá las reglas de factorización.':undefined }; }
    if (q.type === 'set' || q.type === 'venn') return { correct: sameSet(value, q.answer) };
    if (q.type === 'order' || q.type === 'table' || q.type === 'synthetic') return { correct: JSON.stringify((value as string[]).map(normalize)) === JSON.stringify((q.answer as string[]).map(normalize)) };
    return { correct: normalize(String(value)) === normalize(String(q.answer)) };
  } catch (e) { return { correct: false, error: e instanceof Error ? e.message : 'Revisá tu respuesta.' }; }
}
export function shuffle<T>(items: T[]): T[] { const a = [...items]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
