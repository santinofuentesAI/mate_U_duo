import type { Course, Lesson, Question } from './types';
import type { PracticeItem } from './learning';
import { evaluateLogic, parseLogic, synthetic } from './engine';
import { seedNumber } from './learning';

// Deterministic variants of topics taught by the lessons. Every answer is calculated
// here or follows from the listed premises, so saved exams can be reconstructed.
const situations=[
  ['estudio el capítulo','entiendo la regla','me distraigo','resuelvo el examen'],
  ['analizo el circuito','identifico la salida','omito una conexión','termino la prueba'],
  ['reviso la tabla','encuentro el patrón','cambio una fila','obtengo la conclusión'],
  ['ordeno las premisas','reconozco la implicación','olvido una premisa','demuestro la tesis'],
  ['leo el enunciado','formulo la proposición','confundo el conector','valido el resultado'],
  ['separo los conjuntos','encuentro la intersección','repito un elemento','describo la unión'],
  ['simplifico la expresión','aplico la regla correcta','invierto un signo','llego a la solución'],
];
const raised=(n:number)=>String(n).replace(/\d/g,d=>'⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(d)]);
function random(seed:string){let x=seedNumber(seed)||1;return (min:number,max:number)=>{x^=x<<13;x^=x>>>17;x^=x<<5;return min+(x>>>0)%(max-min+1);};}
function question(id:string,type:Question['type'],prompt:string,answer:string|string[],explanation:string,extras:Partial<Question>={}):Question {
  return {id,type,prompt,answer,explanation,hints:['Separá los datos y escribí la primera transformación.','Usá la ley correspondiente y comprobá cada paso.'],tag:'Examen · variante original',difficulty:3,...extras};
}
function discrete(unit:string,variant:number,id:string,pick:(a:number,b:number)=>number):{q:Question;topic:string} {
  const [p,q,r,t]=situations[variant%situations.length];
  const kind=variant%5;
  if(unit.startsWith('S1')){
    if(kind===0){const formula='(P∧¬R)∧(P→Q)∧(Q→T)';return {topic:'Reglas de inferencia',q:question(id,'examproof',`Leé el caso: “${p.charAt(0).toUpperCase()+p.slice(1)} y no ${r}; si ${p}, entonces ${q}; si ${q}, entonces ${t}”. Tomá P=“${p}”, Q=“${q}”, R=“${r}” y T=“${t}”. Traducí las tres premisas y luego demostrá T.`, 'T', 'Primero obtenés P por simplificación; dos aplicaciones de modus ponens llevan de P a Q y de Q a T.',{translation:formula,premises:['P∧¬R','P→Q','Q→T'],guidedSteps:[{expression:'P',rule:'Simplificación',hint:'La primera premisa contiene P como primer término.'},{expression:'Q',rule:'Modus ponens',hint:'Combiná P con P→Q.'},{expression:'T',rule:'Modus ponens',hint:'Combiná Q con Q→T.'}],options:['Simplificación','Modus ponens','Silogismo disyuntivo','De Morgan','Doble negación']})};}
    if(kind===1){const formula='(P∨Q)∧¬P∧(Q→T)';return {topic:'Reglas de inferencia',q:question(id,'examproof',`“${p.charAt(0).toUpperCase()+p.slice(1)} o ${q}; no ${p}; si ${q}, entonces ${t}”. Tomá P=“${p}”, Q=“${q}” y T=“${t}”. Traducí el argumento y demostrá T.`, 'T','De P∨Q y ¬P obtenés Q por silogismo disyuntivo; Q y Q→T producen T por modus ponens.',{translation:formula,premises:['P∨Q','¬P','Q→T'],guidedSteps:[{expression:'Q',rule:'Silogismo disyuntivo',hint:'Descartá P de la disyunción.'},{expression:'T',rule:'Modus ponens',hint:'Aplicá Q→T a la conclusión anterior.'}],options:['Silogismo disyuntivo','Modus ponens','De Morgan','Conjunción']})};}
    if(kind===2){const formula='¬(P∨R)∧(¬P→Q)∧(Q→T)';return {topic:'Equivalencias y simplificación',q:question(id,'examproof',`“No ocurre que ${p} o ${r}; si no ${p}, entonces ${q}; si ${q}, entonces ${t}”. Tomá P=“${p}”, R=“${r}”, Q=“${q}” y T=“${t}”. Traducí el argumento y justificá cada línea hasta obtener T.`, 'T','De Morgan transforma ¬(P∨R) en ¬P∧¬R; simplificá ¬P y aplicá modus ponens dos veces.',{translation:formula,premises:['¬(P∨R)','¬P→Q','Q→T'],guidedSteps:[{expression:'¬P∧¬R',rule:'De Morgan',hint:'Negá cada alternativa y unilas con ∧.'},{expression:'¬P',rule:'Simplificación',hint:'Extraé el primer término de la conjunción.'},{expression:'Q',rule:'Modus ponens',hint:'Usá ¬P→Q.'},{expression:'T',rule:'Modus ponens',hint:'Usá Q→T.'}],options:['De Morgan','Simplificación','Modus ponens','Doble negación']})};}
    if(kind===3){const formulas=['¬(P∧Q)∨R','(P∨Q)→R','(P∧¬Q)∨R','(P→Q)∧¬R','(P↔Q)∨R','¬P∧(Q∨R)','(P⊻Q)→R'];const f=formulas[Math.floor(variant/5)%formulas.length];return {topic:'Tablas de verdad',q:question(id,'table',`Completá todas las filas de la tabla de ${f}. La tabla debe quedar justificada por el valor de cada conector.`,parseRows(f),'Evaluá primero la negación y la conjunción, luego la disyunción o implicación. Cada fila usa los valores de P, Q y R.',{expression:f,variables:['P','Q','R']})};}
    const formulas=['P∧(Q∨R)','¬P∨(Q∧R)','(P→Q)∧R','(P↔Q)∨¬R','(P⊻Q)∧R','¬(P∨Q)→R','(P∧R)↔Q'];const f=formulas[Math.floor(variant/5)%formulas.length],values={P:variant%2===0,Q:variant%3===0,R:variant%4===0};const result=evaluateLogic(parseLogic(f),values)?'V':'F';return {topic:'Proposiciones y conectores',q:question(id,'choice',`Si P=${values.P?'V':'F'}, Q=${values.Q?'V':'F'} y R=${values.R?'V':'F'}, ¿cuál es el valor de ${f}?`,result,`Sustituí P, Q y R en ${f}; el resultado final es ${result}.`,{options:['V','F']})};
  }
  if(unit.startsWith('S2')){
    if(kind<2){const formulas=kind===0?['(P∧Q)∨R','(P∧R)∨Q','P∧(Q∨R)','(P∨Q)∧R','(P∨R)∧Q','(P∧Q)∨¬R','¬P∨(Q∧R)']:['(P∨Q)∧¬R','(P∨R)∧¬Q','(Q∨R)∧¬P','(P∧¬Q)∨R','P∨(Q∧¬R)','¬P∧(Q∨R)','(P∨¬Q)∧R'];const f=formulas[Math.floor(variant/5)%formulas.length];return {topic:'Circuitos lógicos',q:question(id,'table',`Una salida del circuito se modela con ${f}. Completá su tabla de verdad para las ocho entradas.`,parseRows(f),'En serie se usa ∧; en paralelo se usa ∨. Evaluá la negación antes de combinar entradas.',{expression:f,variables:['P','Q','R']})};}
    const result=discrete('S1',variant*5+(kind-2),id,pick);result.q.prompt=`Inferencia del bloque de circuitos: ${result.q.prompt}`;return result;
  }
  if(unit.startsWith('S3')){
    const n=5+variant,even=Array.from({length:n},(_,i)=>i+1).filter(x=>x%2===0);
    if(kind%2===0)return {topic:'Universal y existencial',q:question(id,'choice',`En U={1,…,${n}}, P(x): “x es par”. ¿Cuál afirmación es verdadera?`,even.length?'∃x P(x)':'¬∃x P(x)',`Los testigos pares son ${even.join(', ')||'ninguno'}; el existencial es ${even.length?'verdadero':'falso'}.`,{options:['∃x P(x)','∀x P(x)','¬∃x P(x)']})};
    const symbolic=kind===1?'¬∀x P(x)':'¬∃x P(x)',answer=kind===1?'∃x ¬P(x)':'∀x ¬P(x)';return {topic:'Negar y distribuir',q:question(id,'choice',`Reescribí ${symbolic} con la negación dentro del cuantificador (U tiene ${n} elementos).`,answer,'Al pasar la negación al interior, se intercambia ∀ con ∃ y se niega el predicado.',{options:['∃x ¬P(x)','∀x ¬P(x)','∀x P(x)','∃x P(x)']})};
  }
  const left=[String(variant+1),String(variant+5)],right=[left[1],String(variant+9)],operation=kind%3,answer=operation===0?[...new Set([...left,...right])]:operation===1?left.filter(x=>right.includes(x)):left.filter(x=>!right.includes(x));const op=['∪','∩','−'][operation];return {topic:'Operaciones con conjuntos',q:question(id,'set',`Sean A={${left.join(', ')}} y B={${right.join(', ')}}. Seleccioná los elementos de A ${op} B.`,answer,op==='∪'?'La unión reúne los elementos sin repetirlos.':op==='∩'?'La intersección conserva solo los elementos comunes.':'La diferencia conserva los elementos de A que no están en B.',{universe:[...new Set([...left,...right])]})};
}
function parseRows(expression:string):string[]{const variables=['P','Q','R'];return Array.from({length:8},(_,i)=>evaluateLogic(parseLogic(expression),Object.fromEntries(variables.map((v,j)=>[v,!(i&(1<<(2-j)))])))?'V':'F');}
function precalc(unit:string,variant:number,id:string,pick:(a:number,b:number)=>number):{q:Question;topic:string}{
  const kind=variant%5;
  if(unit.startsWith('B1')){
    if(kind<3){const seq=Math.floor(variant/5)*3+kind,a=3+seq%3,b=2+Math.floor(seq/3)%3,c=1+Math.floor(seq/9)%3,result=a+b-c;return {topic:'Leyes de potencias',q:question(id,'algebra',`Simplificá x${raised(a)} · x${raised(b)} / x${raised(c)}, con x≠0. Escribí la respuesta con exponente positivo.`,`x^${result}`,`Sumá ${a}+${b} y restá ${c}: x${raised(result)}. Se conserva x≠0 en la expresión original.`)};}
    const seq=Math.floor(variant/5)*2+kind-3,a=2+seq%6,b=3+Math.floor(seq/6)%5;return {topic:'Fracciones numéricas',q:question(id,'algebra',`Calculá ${a}/${b}+${b}/${a}. Escribí una sola fracción simplificada o equivalente.`,`${a*a+b*b}/${a*b}`,`El denominador común es ${a*b}; sumá ${a*a}+${b*b} sobre ese denominador.`)};
  }
  if(unit.startsWith('B2')){
    const a=1+Math.floor(variant/6),b=2+variant%6;
    if(kind%2===0)return {topic:'Productos notables',q:question(id,'algebra',`Desarrollá (${a}x+${b})² como polinomio sin paréntesis.`,`${a*a}x^2+${2*a*b}x+${b*b}`,`(u+v)²=u²+2uv+v²; con u=${a}x y v=${b} obtenés ${a*a}x²+${2*a*b}x+${b*b}.`,{requiredForm:'expanded'})};
    return {topic:'Trinomios y diferencias de cuadrados',q:question(id,'algebra',`Factorizá ${a*a}x²−${b*b} como producto de binomios.`,`(${a}x-${b})*(${a}x+${b})`,`Diferencia de cuadrados: (${a}x)²−${b}²=(${a}x−${b})(${a}x+${b}).`,{requiredForm:'factored'})};
  }
  if(unit.startsWith('B3')){
    if(kind<3){const seq=Math.floor(variant/5)*3+kind,a=1+Math.floor(seq/7)%3,b=2+seq%7;return {topic:'Suma y diferencia de cubos',q:question(id,'algebra',`Factorizá ${a*a*a}x³−${b*b*b}; escribí el producto completo.`,`(${a}x-${b})*(${a*a}x^2+${a*b}x+${b*b})`,`Diferencia de cubos: u³−v³=(u−v)(u²+uv+v²), con u=${a}x y v=${b}.`,{requiredForm:'factored'})};}
    const seq=Math.floor(variant/5)*2+kind-3,root=2+seq%5,coefficients=[1,seq%7-3,Math.floor(seq/7)-3,seq+1];return {topic:'División sintética',q:question(id,'synthetic',`Dividí sintéticamente el polinomio de coeficientes ${coefficients.join(', ')} entre x−(${root}). Completá la fila final.`,synthetic(coefficients,root).map(String),`Bajá el primer coeficiente; multiplicá cada resultado por ${root} y sumalo al siguiente. El último es el resto.`,{root,coefficients})};
  }
  if(unit.startsWith('B4')){
    const a=2+variant%7,b=2+Math.floor(variant/7)%7,middle=b-a,term=middle>=0?`+${middle}x`:`−${-middle}x`;return {topic:'Fracciones y dominio',q:question(id,'algebra',`Simplificá (x²${term}−${a*b})/(x−${a}) e indicá el valor excluido del dominio original.`,`x+${b}`,`Factorizá (x−${a})(x+${b}) y cancelá, pero x=${a} sigue excluido.`,{exclusions:[String(a)]})};
  }
  const a=2+variant%7,b=2+Math.floor(variant/7)%7,middle=b-a,term=middle>=0?`+${middle}x`:`−${-middle}x`;return {topic:'Ecuaciones cuadráticas',q:question(id,'set',`Seleccioná todas las soluciones reales de x²${term}−${a*b}=0.`,[String(a),String(-b)],`Factorizá (x−${a})(x+${b})=0: las dos raíces son ${a} y −${b}.`,{universe:[String(-b-1),String(-b),'0',String(a),String(a+1)]})};
}
export function generateExam(course:Course,selectedUnits:string[],seed:string,allLessons:Lesson[],count=35):PracticeItem[]{
  const courseLessons=allLessons.filter(l=>l.course===course),validUnits=[...new Set(selectedUnits)].filter(u=>courseLessons.some(l=>l.unit===u));
  if(!validUnits.length)throw new Error('Elegí al menos un tema para el examen.');
  const pick=random(seed),items:PracticeItem[]=[];
  for(let i=0;i<count;i++){
    const unit=validUnits[i%validUnits.length],variant=Math.floor(i/validUnits.length),id=`exam-${seed}-${i}`;
    const {q,topic}=course==='discreta'?discrete(unit,variant,id,pick):precalc(unit,variant,id,pick);
    const candidates=courseLessons.filter(l=>l.unit===unit),lesson=candidates.find(l=>l.title===topic)||candidates[variant%candidates.length];
    items.push({lesson,question:{...q,tag:`Examen · ${unit}`,hints:[`Pensá en ${topic.toLowerCase()} antes de completar la respuesta.`,q.explanation]}});
  }
  return items;
}
