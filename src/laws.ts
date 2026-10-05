import { parseLogic } from './engine';
type AST = ReturnType<typeof parseLogic>;
export const laws = [
  { name:'Doble negación', patterns:[['¬¬P','P']], text:'Negar dos veces recupera la proposición.' },
  { name:'De Morgan', patterns:[['¬(P∧Q)','¬P∨¬Q'],['¬(P∨Q)','¬P∧¬Q']], text:'Negá cada parte y cambiá el conector.' },
  { name:'Implicación', patterns:[['P→Q','¬P∨Q']], text:'Negá el antecedente o afirmá el consecuente.' },
  { name:'Contraposición', patterns:[['P→Q','¬Q→¬P']], text:'Invertí el orden y negá ambas partes.' },
  { name:'Bicondicional', patterns:[['P↔Q','(P→Q)∧(Q→P)']], text:'Equivale a las dos implicaciones.' },
  { name:'Conmutatividad', patterns:[['P∧Q','Q∧P'],['P∨Q','Q∨P']], text:'El orden no afecta ∧ ni ∨.' },
  { name:'Asociatividad', patterns:[['(P∧Q)∧R','P∧(Q∧R)'],['(P∨Q)∨R','P∨(Q∨R)']], text:'Reagrupá un mismo conector.' },
  { name:'Distributividad', patterns:[['P∧(Q∨R)','(P∧Q)∨(P∧R)'],['P∨(Q∧R)','(P∨Q)∧(P∨R)'],['(P∧R)∨(Q∧R)','(P∨Q)∧R']], text:'Distribuí o extraé un factor común.' },
  { name:'Idempotencia', patterns:[['P∧P','P'],['P∨P','P']], text:'Repetir la proposición no cambia su valor.' },
  { name:'Neutro', patterns:[['P∧1','P'],['P∨0','P'],['1∧P','P'],['0∨P','P']], text:'1 representa V; 0 representa F.' },
  { name:'Complemento', patterns:[['P∨¬P','1'],['P∧¬P','0']], text:'Una proposición y su negación cubren todos los casos o ninguno.' },
  { name:'Dominación', patterns:[['P∨1','1'],['P∧0','0']], text:'V domina ∨; F domina ∧.' },
  { name:'Absorción', patterns:[['P∨(P∧Q)','P'],['P∧(P∨Q)','P']], text:'La rama más específica no añade casos.' },
  { name:'Exportación', patterns:[['(P∧Q)→R','P→(Q→R)']], text:'Separá dos condiciones en implicaciones anidadas.' },
];
export const inference = [['Modus ponens','P → Q; P ⊢ Q'],['Modus tollens','P → Q; ¬Q ⊢ ¬P'],['Simplificación','P ∧ Q ⊢ P (o Q)'],['Adjunción','P; Q ⊢ P ∧ Q'],['Adición','P ⊢ P ∨ Q'],['Silogismo disyuntivo','P ∨ Q; ¬P ⊢ Q'],['Silogismo hipotético','P → Q; Q → R ⊢ P → R'],['Dilema constructivo','P → Q; R → S; P ∨ R ⊢ Q ∨ S'],['Dilema destructivo','P → Q; R → S; ¬Q ∨ ¬S ⊢ ¬P ∨ ¬R'],['Ley de casos','P → R; Q → R; P ∨ Q ⊢ R']];
const equal = (a: AST, b: AST): boolean => a.op === b.op && a.value === b.value && (!a.a || !!b.a && equal(a.a,b.a)) && (!a.b || !!b.b && equal(a.b,b.b));
function match(p: AST, n: AST, env: Record<string,AST>): boolean {
  if(p.op==='var' && /^[A-Z]$/.test(p.value!)) { const k=p.value!; if(env[k]) return equal(env[k],n); env[k]=n; return true; }
  return p.op===n.op && p.value===n.value && (!p.a || !!n.a && match(p.a,n.a,env)) && (!p.b || !!n.b && match(p.b,n.b,env));
}
function sub(n: AST, env: Record<string,AST>): AST { return n.op==='var' && env[n.value!] ? env[n.value!] : {...n, a:n.a&&sub(n.a,env), b:n.b&&sub(n.b,env)}; }
function rewrite(a: AST, b: AST, p: AST, r: AST): boolean {
  const env: Record<string,AST> = {};
  if(match(p,a,env) && equal(sub(r,env),b)) return true;
  if(a.op!==b.op || a.value!==b.value) return false;
  return !!(a.a && b.a && (!a.b || !!b.b && equal(a.b,b.b)) && rewrite(a.a,b.a,p,r)) || !!(a.b && b.b && a.a && b.a && equal(a.a,b.a) && rewrite(a.b,b.b,p,r));
}
export function checkLaw(from: string,to: string,name: string) {
  try { const l=laws.find(x=>x.name===name); if(!l) return false; const a=parseLogic(from),b=parseLogic(to); return l.patterns.some(([p,r])=>rewrite(a,b,parseLogic(p),parseLogic(r))||rewrite(a,b,parseLogic(r),parseLogic(p))); } catch { return false; }
}
const inferencePatterns: Record<string,string[][]> = {
  'Modus ponens':[['P→Q','P','Q']], 'Modus tollens':[['P→Q','¬Q','¬P']],
  'Simplificación':[['P∧Q','P'],['P∧Q','Q']], 'Adjunción':[['P','Q','P∧Q']],
  'Adición':[['P','P∨Q'],['P','Q∨P']],
  'Silogismo disyuntivo':[['P∨Q','¬P','Q'],['P∨Q','¬Q','P']],
  'Silogismo hipotético':[['P→Q','Q→R','P→R']],
  'Dilema constructivo':[['P→Q','R→S','P∨R','Q∨S']],
  'Dilema destructivo':[['P→Q','R→S','¬Q∨¬S','¬P∨¬R']],
  'Ley de casos':[['P→R','Q→R','P∨Q','R']],
};
function permutations<T>(a:T[]):T[][] {return a.length<=1?[a]:a.flatMap((x,i)=>permutations(a.filter((_,j)=>j!==i)).map(rest=>[x,...rest]));}
export function checkInference(premises:string[],conclusion:string,name:string) {
  try {if(!premises.length||premises.length>3)return false;const nodes=premises.map(parseLogic),target=parseLogic(conclusion);return (inferencePatterns[name]||[]).some(pattern=>pattern.length===nodes.length+1&&permutations(nodes).some(order=>{const env:Record<string,AST>={};return pattern.slice(0,-1).every((p,i)=>match(parseLogic(p),order[i],env))&&match(parseLogic(pattern.at(-1)!),target,env);}));}catch{return false;}
}
