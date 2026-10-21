import type { Course, Lesson, Question } from './types';
import { evaluateLogic, parseLogic, synthetic } from './engine';
import { seedNumber, type PracticeItem } from './learning';

export type DrillId =
  | 'simplify'
  | 'factor'
  | 'synthetic'
  | 'equations'
  | 'inequalities'
  | 'powers'
  | 'notables'
  | 'rationalize'
  | 'tables'
  | 'equivalences'
  | 'sets'
  | 'cardinality'
  | 'connectives'
  | 'implication'
  | 'inference'
  | 'quantifiers'
  | 'venn';

export interface TopicDrill {
  id: DrillId;
  label: string;
  hint: string;
  course: Course;
}

export const DRILL_COUNTS = [5, 10, 15, 20, 30] as const;
export const DRILL_MIN = 1;
export const DRILL_MAX = 40;

const CATALOG: TopicDrill[] = [
  { id: 'simplify', course: 'precalculo', label: 'Simplificar', hint: 'Potencias, fracciones y cancelar factores. Conservá lo excluido del original.' },
  { id: 'factor', course: 'precalculo', label: 'Factorizar', hint: 'Común, diferencia de cuadrados, trinomios y cubos. Respuesta como producto.' },
  { id: 'synthetic', course: 'precalculo', label: 'División sintética', hint: 'Pensá la fila y elegí el cociente con su resto. No hay que copiar una tabla ya hecha.' },
  { id: 'equations', course: 'precalculo', label: 'Ecuaciones', hint: 'Lineales y cuadráticas que se resuelven factorizando o despejando.' },
  { id: 'inequalities', course: 'precalculo', label: 'Inecuaciones', hint: 'Lineales, polinomiales y racionales. El conjunto solución es un intervalo, no un punto.' },
  { id: 'powers', course: 'precalculo', label: 'Potencias', hint: 'Elegí la potencia simplificada. Sumá, restá o multiplicá exponentes según la operación.' },
  { id: 'notables', course: 'precalculo', label: 'Productos notables', hint: 'Elegí el desarrollo. El doble producto no se pierde.' },
  { id: 'rationalize', course: 'precalculo', label: 'Racionalizar', hint: 'Elegí la forma sin radical en el denominador.' },
  { id: 'tables', course: 'discreta', label: 'Tablas de verdad', hint: 'Llená vos cada fila. No hay columna ya hecha para copiar.' },
  { id: 'equivalences', course: 'discreta', label: 'Equivalencias', hint: 'De Morgan, absorción, complemento. Escribí la forma más corta.' },
  { id: 'sets', course: 'discreta', label: 'Conjuntos', hint: 'Unión, intersección y diferencia, eligiendo los elementos.' },
  { id: 'cardinality', course: 'discreta', label: 'Cardinalidad', hint: 'Cuentas de unión, potencia y producto. Un número, sin adivinar.' },
  { id: 'connectives', course: 'discreta', label: 'Conectores', hint: 'Elegí el valor. Con P y Q dados, pensá el conector antes de tocar.' },
  { id: 'implication', course: 'discreta', label: 'Implicación', hint: 'La única fila falsa es antecedente verdadero y consecuente falso.' },
  { id: 'inference', course: 'discreta', label: 'Inferencias', hint: 'Elegí qué se concluye de verdad. Una premisa no alcanza si la regla no aplica.' },
  { id: 'quantifiers', course: 'discreta', label: 'Cuantificadores', hint: 'Elegí la negación o la lectura. ∀ y ∃ se intercambian al negar.' },
  { id: 'venn', course: 'discreta', label: 'Regiones de Venn', hint: 'Elegí la región. Solo A no incluye la intersección.' },
];

export function drillsFor(course: Course): TopicDrill[] {
  return CATALOG.filter(item => item.course === course);
}

export function clampDrillCount(value: number): number {
  if (!Number.isFinite(value)) return 10;
  return Math.min(DRILL_MAX, Math.max(DRILL_MIN, Math.round(value)));
}

const raised = (n: number) => String(n).replace(/\d/g, d => '⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(d)]);

function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) [a, b] = [b, a % b];
  return a || 1;
}

function formatPoly(coefficients: number[]): string {
  const degree = coefficients.length - 1;
  const parts: string[] = [];
  coefficients.forEach((coef, index) => {
    if (coef === 0) return;
    const power = degree - index;
    const abs = Math.abs(coef);
    let body = '';
    if (power === 0) body = String(abs);
    else if (power === 1) body = abs === 1 ? 'x' : `${abs}x`;
    else body = abs === 1 ? `x${raised(power)}` : `${abs}x${raised(power)}`;
    if (!parts.length) parts.push(coef < 0 ? `−${body}` : body);
    else parts.push(coef < 0 ? `− ${body}` : `+ ${body}`);
  });
  return parts.join(' ') || '0';
}

function signed(n: number): string {
  return n < 0 ? String(n) : `+${n}`;
}

function linear(variable: string, n: number): string {
  if (n === 0) return variable;
  return `(${variable}${signed(n)})`;
}

function tableRows(expression: string, variables: string[]): string[] {
  const node = parseLogic(expression);
  return Array.from({ length: 2 ** variables.length }, (_, i) => {
    const values = Object.fromEntries(variables.map((name, j) => [name, !(i & (1 << (variables.length - 1 - j)))]));
    return evaluateLogic(node, values) ? 'V' : 'F';
  });
}

function uniqueOptions(answer: string, extras: string[]): string[] {
  const options = [answer];
  for (const extra of extras) if (extra !== answer && !options.includes(extra)) options.push(extra);
  let n = 2;
  while (options.length < 4) {
    const filler = `Otra forma · ${n}`;
    if (!options.includes(filler)) options.push(filler);
    n += 1;
  }
  return options.slice(0, 4);
}

function ask(id: string, type: Question['type'], prompt: string, answer: Question['answer'], explanation: string, extra: Partial<Question> = {}): Question {
  return {
    id,
    type,
    prompt,
    answer,
    explanation,
    hints: ['Identificá la regla y aplicála una vez. Comprobá el resultado.', explanation],
    tag: extra.tag || 'Práctica de un tema',
    difficulty: extra.difficulty ?? 2,
    ...extra,
  };
}

function lessonFor(path: Lesson[], titles: string[]): Lesson {
  for (const title of titles) {
    const hit = path.find(lesson => lesson.title === title);
    if (hit) return hit;
  }
  return path[0];
}

function matchesTopic(item: PracticeItem, topic: DrillId): boolean {
  const question = item.question;
  if (question.bookSource) return false;
  if (question.type === 'guidedproof' || question.type === 'examproof') return false;
  const blob = `${question.prompt} ${item.lesson.title} ${question.tag}`;
  switch (topic) {
    case 'synthetic':
    case 'powers':
    case 'notables':
    case 'rationalize':
    case 'connectives':
    case 'implication':
    case 'inference':
    case 'quantifiers':
    case 'venn':
      return false;
    case 'factor':
      return question.requiredForm === 'factored' || question.requiredForm === 'linearFactors' || /^Factorizá/i.test(question.prompt);
    case 'simplify':
      return /^Simplificá/i.test(question.prompt) || question.requiredForm === 'irreducibleFraction';
    case 'equations':
      return /Resolvé |soluciones reales|ecuación/i.test(question.prompt) && question.type !== 'synthetic' && !/inecuaci|desigualdad/i.test(blob);
    case 'inequalities':
      return /inecuaci|desigualdad/i.test(blob) || item.lesson.title.startsWith('Inecuaciones') || /conjunto solución.*[<>≤≥]|[<>≤≥].*conjunto solución|¿Cuál es S para/i.test(blob);
    case 'tables':
      return question.type === 'table';
    case 'equivalences':
      return question.type === 'logic' && /Simplificá|De Morgan|equival/i.test(blob);
    case 'sets':
      return question.type === 'set';
    case 'cardinality':
      return question.type === 'text' && /\|A|P\(A\)|subconjuntos|unión|al menos|ningun/i.test(blob);
    default: {
      const never: never = topic;
      return never;
    }
  }
}

function makeGenerated(topic: DrillId, variant: number, id: string): { question: Question; titles: string[] } {
  const difficulty = (1 + (variant % 3)) as 1 | 2 | 3;
  switch (topic) {
    case 'simplify':
      return simplifyDrill(variant, id, difficulty);
    case 'factor':
      return factorDrill(variant, id, difficulty);
    case 'synthetic':
      return syntheticDrill(variant, id, difficulty);
    case 'equations':
      return equationDrill(variant, id, difficulty);
    case 'inequalities':
      return inequalityDrill(variant, id, difficulty);
    case 'powers':
      return powerDrill(variant, id, difficulty);
    case 'notables':
      return notableDrill(variant, id, difficulty);
    case 'rationalize':
      return rationalizeDrill(variant, id, difficulty);
    case 'tables':
      return tableDrill(variant, id, difficulty);
    case 'equivalences':
      return equivalenceDrill(variant, id, difficulty);
    case 'sets':
      return setDrill(variant, id, difficulty);
    case 'cardinality':
      return cardinalityDrill(variant, id, difficulty);
    case 'connectives':
      return connectiveDrill(variant, id, difficulty);
    case 'implication':
      return implicationDrill(variant, id, difficulty);
    case 'inference':
      return inferenceDrill(variant, id, difficulty);
    case 'quantifiers':
      return quantifierDrill(variant, id, difficulty);
    case 'venn':
      return vennDrill(variant, id, difficulty);
    default: {
      const never: never = topic;
      return never;
    }
  }
}

function simplifyDrill(variant: number, id: string, difficulty: 1 | 2 | 3): { question: Question; titles: string[] } {
  const kind = variant % 6;
  const seq = Math.floor(variant / 6);
  const titles = ['Leyes de potencias', 'Fracciones y dominio', 'Fracciones numéricas', 'Operar fracciones algebraicas'];
  if (kind === 0) {
    const a = 2 + seq % 4, b = 2 + Math.floor(seq / 4) % 4, c = 1 + seq % 3, exp = a + b - c;
    return { titles, question: ask(id, 'algebra', `Simplificá x${raised(a)} · x${raised(b)} / x${raised(c)}, con x ≠ 0. Escribí la potencia positiva.`, `x^${exp}`, `Sumá los exponentes del producto y restá el del denominador: ${a}+${b}−${c}=${exp}.`, { difficulty }) };
  }
  if (kind === 1) {
    const a = 2 + seq % 5;
    const b = 3 + Math.floor(seq / 5) % 5 === a ? 3 + Math.floor(seq / 5) % 5 + 1 : 3 + Math.floor(seq / 5) % 5;
    const num = a * a + b * b, den = a * b, g = gcd(num, den);
    return { titles, question: ask(id, 'algebra', `Calculá ${a}/${b} + ${b}/${a}. Escribí una sola fracción irreducible.`, `${num / g}/${den / g}`, `Denominador común ${den}; numerador ${num}. Simplificá por ${g}.`, { difficulty, requiredForm: 'irreducibleFraction' }) };
  }
  if (kind === 2) {
    const a = 2 + seq % 7;
    return { titles, question: ask(id, 'algebra', `Simplificá (x² − ${a * a})/(x − ${a}). Indicá el valor excluido.`, `x+${a}`, `Diferencia de cuadrados: (x − ${a})(x + ${a}). Cancelá, pero x = ${a} sigue fuera.`, { difficulty, exclusions: [String(a)] }) };
  }
  if (kind === 3) {
    const a = 2 + seq % 6, b = 3 + Math.floor(seq / 6) % 6;
    const mid = b - a, term = mid === 0 ? '' : mid > 0 ? ` + ${mid}x` : ` − ${-mid}x`;
    return { titles, question: ask(id, 'algebra', `Simplificá (x²${term} − ${a * b})/(x − ${a}). Indicá el valor excluido.`, `x+${b}`, `El numerador es (x − ${a})(x + ${b}). Cancelá el factor común; x = ${a} queda excluido.`, { difficulty, exclusions: [String(a)] }) };
  }
  if (kind === 4) {
    const a = 4 + seq % 4, b = 1 + seq % 2, exp = a - b;
    return { titles, question: ask(id, 'algebra', `Simplificá x${raised(a)} / x${raised(b)}, con x ≠ 0.`, `x^${exp}`, `Restá exponentes: ${a}−${b}=${exp}.`, { difficulty }) };
  }
  const a = 2 + seq % 5;
  return { titles, question: ask(id, 'algebra', `Simplificá (x³ − ${a ** 3})/(x − ${a}). Indicá el valor excluido.`, `x^2+${a}x+${a * a}`, `x³ − a³ = (x − a)(x² + ax + a²) con a = ${a}. x = ${a} permanece excluido.`, { difficulty, exclusions: [String(a)] }) };
}

function factorDrill(variant: number, id: string, difficulty: 1 | 2 | 3): { question: Question; titles: string[] } {
  const kind = variant % 6;
  const seq = Math.floor(variant / 6);
  const titles = ['Trinomios y diferencias de cuadrados', 'Suma y diferencia de cubos', 'Factor común y agrupación', 'Factorización completa'];
  if (kind === 0) {
    const a = 1 + seq % 4, b = 2 + seq % 6;
    const left = a === 1 ? 'x' : `${a}x`;
    return { titles, question: ask(id, 'algebra', `Factorizá ${a * a}x² − ${b * b} como producto de binomios.`, `(${left}-${b})*(${left}+${b})`, `Diferencia de cuadrados: (${left})² − ${b}².`, { difficulty, requiredForm: 'factored' }) };
  }
  if (kind === 1) {
    const values = [-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6];
    const p = values[seq % values.length];
    const q = values[(seq + 3) % values.length] === p ? values[(seq + 4) % values.length] : values[(seq + 3) % values.length];
    const sum = p + q, prod = p * q;
    const middle = sum === 0 ? '' : sum > 0 ? ` + ${sum}x` : ` − ${-sum}x`;
    const constant = prod < 0 ? ` − ${-prod}` : ` + ${prod}`;
    return { titles, question: ask(id, 'algebra', `Factorizá x²${middle}${constant}.`, `${linear('x', p)}*${linear('x', q)}`, `Buscá dos números que sumen ${sum} y multipliquen ${prod}: ${p} y ${q}.`, { difficulty, requiredForm: 'factored' }) };
  }
  if (kind === 2) {
    const a = 1 + seq % 3, b = 2 + seq % 5;
    const left = a === 1 ? 'x' : `${a}x`;
    return { titles, question: ask(id, 'algebra', `Factorizá ${a ** 3}x³ − ${b ** 3}; escribí el producto completo.`, `(${left}-${b})*(${a * a}x^2+${a * b}x+${b * b})`, `Diferencia de cubos: u³ − v³ = (u − v)(u² + uv + v²) con u = ${left} y v = ${b}.`, { difficulty, requiredForm: 'factored' }) };
  }
  if (kind === 3) {
    const a = 1 + seq % 3, b = 2 + Math.floor(seq / 3) % 4;
    const left = a === 1 ? 'x' : `${a}x`;
    return { titles, question: ask(id, 'algebra', `Factorizá ${a ** 3}x³ + ${b ** 3}; escribí el producto completo.`, `(${left}+${b})*(${a * a}x^2-${a * b}x+${b * b})`, `Suma de cubos: u³ + v³ = (u + v)(u² − uv + v²) con u = ${left} y v = ${b}.`, { difficulty, requiredForm: 'factored' }) };
  }
  if (kind === 4) {
    const c = 2 + seq % 4, k = 1 + seq % 6;
    return { titles, question: ask(id, 'algebra', `Factorizá ${c}x² + ${c * k}x.`, `${c}x*(x+${k})`, `Factor común ${c}x: cada término se divide entre ${c}x.`, { difficulty, requiredForm: 'factored' }) };
  }
  const a = 2 + seq % 3, b = 1 + seq % 4, c = 2 + Math.floor(seq / 3) % 4;
  const sum = a * c + b, prod = b * c;
  return { titles, question: ask(id, 'algebra', `Factorizá ${a}x² + ${sum}x + ${prod}.`, `(${a}x+${b})*(x+${c})`, `Los factores (${a}x + ${b})(x + ${c}) expanden a ese trinomio.`, { difficulty, requiredForm: 'factored' }) };
}

function divisionLabel(coefficients: number[], root: number): string {
  const bottom = synthetic(coefficients, root);
  return `Cociente ${formatPoly(bottom.slice(0, -1))}, resto ${bottom.at(-1)}`;
}

function syntheticDrill(variant: number, id: string, difficulty: 1 | 2 | 3): { question: Question; titles: string[] } {
  const titles = ['División sintética', 'Raíces racionales y factores'];
  const roots = [-4, -3, -2, -1, 1, 2, 3, 4];
  const r = roots[variant % roots.length];
  const a = 1 + Math.floor(variant / 8) % 3;
  const b = (Math.floor(variant / 2) % 5) - 2;
  const c = (Math.floor(variant / 5) % 5) - 1;
  const d = (variant % 5) - 2;
  const coefficients = [a, b, c, d];
  const answer = divisionLabel(coefficients, r);
  const extras = [
    divisionLabel(coefficients, r > 0 ? -r : r + 1),
    divisionLabel([a, b, c, d + (d >= 3 ? -1 : 1)], r),
    divisionLabel([a, b + (b >= 2 ? -1 : 1), c, d], r),
    divisionLabel(coefficients, r + (r >= 3 ? -2 : 2)),
    divisionLabel([a, c, b, d], r),
    divisionLabel(coefficients, r === -4 ? -1 : r - 1),
  ];
  return { titles, question: ask(id, 'choice', `Dividí ${formatPoly(coefficients)} entre x − (${r}). Elegí el cociente y el resto.`, answer, `Con r = ${r}, la fila final da ${answer}. El último número es el resto.`, { difficulty, options: uniqueOptions(answer, extras) }) };
}

function equationDrill(variant: number, id: string, difficulty: 1 | 2 | 3): { question: Question; titles: string[] } {
  const titles = ['Ecuaciones cuadráticas', 'Ecuaciones lineales y equivalencia', 'Ecuaciones de grado superior'];
  const kind = variant % 4;
  const seq = Math.floor(variant / 4);
  if (kind === 0) {
    const a = 2 + seq % 6, b = 2 + Math.floor(seq / 6) % 6;
    const mid = b - a, term = mid === 0 ? '' : mid > 0 ? ` + ${mid}x` : ` − ${-mid}x`;
    return { titles, question: ask(id, 'set', `Seleccioná todas las soluciones reales de x²${term} − ${a * b} = 0.`, [String(a), String(-b)], `Factorizá (x − ${a})(x + ${b}) = 0.`, { difficulty, universe: [String(-b - 1), String(-b), '0', String(a), String(a + 1)] }) };
  }
  if (kind === 1) {
    const p = 2 + seq % 5, q = 3 + Math.floor(seq / 5) % 5;
    return { titles, question: ask(id, 'text', `Resolvé ${p}(x − ${q}) = ${p - 1}x + ${q}. Escribí el valor de x.`, String(p * q + q), `Distribuí: ${p}x − ${p * q} = ${p - 1}x + ${q}. Despejá x.`, { difficulty }) };
  }
  if (kind === 2) {
    const a = 1 + seq % 4, b = 2 + seq % 5;
    return { titles, question: ask(id, 'set', `Resolvé ${a}x² − ${a * b * b} = 0 en ℝ.`, [String(-b), String(b)], `${a}(x² − ${b * b}) = 0 → x = ±${b}.`, { difficulty, universe: [String(-b - 1), String(-b), '0', String(b), String(b + 1)] }) };
  }
  const k = 2 + seq % 5;
    return { titles, question: ask(id, 'set', `Resolvé x³ − ${k * k}x = 0.`, [String(-k), '0', String(k)], `x(x − ${k})(x + ${k}) = 0. No perdás la raíz cero.`, { difficulty, universe: [...new Set([String(-k), '-1', '0', String(k), String(k + 1)])] }) };
}

function inequalityDrill(variant: number, id: string, difficulty: 1 | 2 | 3): { question: Question; titles: string[] } {
  const titles = ['Inecuaciones lineales', 'Inecuaciones polinomiales', 'Inecuaciones racionales'];
  const kind = variant % 5;
  const seq = Math.floor(variant / 5);
  const p = 1 + seq % 6;
  const q = p + 2 + Math.floor(seq / 6) % 4;
  if (kind === 0) {
    const a = 2 + seq % 4;
    return { titles, question: ask(id, 'choice', `¿Cuál es S para ${a}x ≥ ${a * q}?`, `x ≥ ${q}`, `Dividí por ${a} > 0: x ≥ ${q}.`, { difficulty, options: [`x ≥ ${q}`, `x ≤ ${q}`, `x > ${p}`, 'ℝ'] }) };
  }
  if (kind === 1) {
    return { titles, question: ask(id, 'choice', `¿Cuál es S para −x < ${p}?`, `x > ${-p}`, `Multiplicá por −1 e invertí: x > ${-p}.`, { difficulty, options: [`x > ${-p}`, `x < ${-p}`, `x ≥ ${p}`, '∅'] }) };
  }
  if (kind === 2) {
    return { titles, question: ask(id, 'choice', `¿Cuál es S para (x − ${p})(x − ${q}) > 0?`, `]−∞, ${p}[ ∪ ]${q}, ∞)`, `El producto es positivo fuera de ${p} y ${q}.`, { difficulty, options: [`]−∞, ${p}[ ∪ ]${q}, ∞)`, `]${p}, ${q}[`, `[${p}, ${q}]`, 'ℝ'] }) };
  }
  if (kind === 3) {
    return { titles, question: ask(id, 'choice', `¿Cuál es S para (x − ${p})(x − ${q}) ≤ 0?`, `[${p}, ${q}]`, `El producto es no positivo entre las raíces ${p} y ${q}.`, { difficulty, options: [`[${p}, ${q}]`, `]−∞, ${p}] ∪ [${q}, ∞)`, `]${p}, ${q}[`, '∅'] }) };
  }
  return { titles, question: ask(id, 'choice', `¿Cuál es S para (x − ${q})/(x − ${p}) ≥ 0?`, `x < ${p} o x ≥ ${q}`, `${p} anula el denominador; ${q} entra.`, { difficulty, options: [`x < ${p} o x ≥ ${q}`, `x ≤ ${p} o x ≥ ${q}`, `${p} ≤ x ≤ ${q}`, '∅'] }) };
}

function tableDrill(variant: number, id: string, difficulty: 1 | 2 | 3): { question: Question; titles: string[] } {
  const titles = ['Tablas de verdad', 'Circuitos lógicos'];
  const two = ['P→Q', 'P∧Q', 'P∨Q', 'P↔Q', 'P⊻Q', '¬P∨Q', '¬(P∧Q)', '¬(P∨Q)', 'P∧¬Q', '(P∨Q)∧¬P'];
  const three = ['(P∧Q)∨R', '(P∨Q)∧R', 'P∧(Q∨R)', 'P∨(Q∧R)', '(P→Q)∧R', '(P↔Q)∨¬R', '¬P∨(Q∧R)', '(P∨Q)∧¬R', '(P∧¬Q)∨R', 'P∨(Q∧¬R)', '¬(P∨Q)→R', '(P∧R)↔Q', '(P⊻Q)∧R', '(P→Q)∨R', '¬(P∧Q)∨R', '(P∨¬Q)∧R', 'P∧(Q↔R)', '(P∨R)→Q', '¬P∧(Q∨R)', '(P↔Q)∧R'];
  const useThree = variant % 3 !== 0;
  const expression = useThree ? three[variant % three.length] : two[variant % two.length];
  const variables = useThree ? ['P', 'Q', 'R'] : ['P', 'Q'];
  const rows = tableRows(expression, variables);
  return { titles, question: ask(id, 'table', `Completá todas las filas de la tabla de ${expression}.`, rows, `Evaluá primero negaciones y paréntesis, después el conector principal de ${expression}.`, { difficulty, expression, variables }) };
}

function equivalenceDrill(variant: number, id: string, difficulty: 1 | 2 | 3): { question: Question; titles: string[] } {
  const titles = ['Equivalencias y simplificación', 'Proposiciones y conectores'];
  const bank: Array<[string, string, string]> = [
    ['Aplicá De Morgan a ¬(P ∨ Q).', '¬P∧¬Q', 'La negación de una disyunción es la conjunción de las negaciones.'],
    ['Aplicá De Morgan a ¬(P ∧ Q).', '¬P∨¬Q', 'La negación de una conjunción es la disyunción de las negaciones.'],
    ['Simplificá P ∨ (P ∧ Q).', 'P', 'Absorción: el segundo término no agrega casos.'],
    ['Simplificá P ∧ (P ∨ Q).', 'P', 'Absorción: P ∧ (P ∨ Q) ≡ P.'],
    ['Simplificá ¬¬P.', 'P', 'Doble negación.'],
    ['Simplificá P ∨ ¬P.', '1', 'Complemento: una variable o su negación cubre todos los casos.'],
    ['Simplificá P ∧ ¬P.', '0', 'Complemento: P y ¬P nunca son simultáneamente verdaderas.'],
    ['Simplificá P ∨ [(Q ∧ R) ∨ (¬Q ∧ R)].', 'P∨R', 'Factorizá R y usá Q ∨ ¬Q ≡ V.'],
    ['Simplificá P ∧ (Q ∨ ¬Q).', 'P', 'Q ∨ ¬Q es tautología; queda P.'],
    ['Simplificá P ∨ (Q ∧ ¬Q).', 'P', 'Q ∧ ¬Q es contradicción; queda P.'],
    ['Escribí P → Q usando solo ¬ y ∨.', '¬P∨Q', 'La implicación material es ¬P ∨ Q.'],
    ['Aplicá De Morgan a ¬(P ∨ ¬Q).', '¬P∧Q', '¬(P ∨ ¬Q) ≡ ¬P ∧ ¬¬Q ≡ ¬P ∧ Q.'],
    ['Simplificá (P ∧ Q) ∨ (P ∧ ¬Q).', 'P', 'Distribuí P: P ∧ (Q ∨ ¬Q) ≡ P.'],
    ['Simplificá ¬(¬P ∧ ¬Q).', 'P∨Q', 'De Morgan y doble negación recuperan la disyunción.'],
    ['Simplificá P ∨ P.', 'P', 'Idempotencia de la disyunción.'],
    ['Simplificá P ∧ P.', 'P', 'Idempotencia de la conjunción.'],
    ['Simplificá (P ∨ Q) ∧ (P ∨ ¬Q).', 'P', 'Distribuí P: P ∨ (Q ∧ ¬Q) ≡ P.'],
    ['Aplicá De Morgan a ¬(¬P ∨ Q).', 'P∧¬Q', '¬¬P ∧ ¬Q ≡ P ∧ ¬Q. Es la negación de P → Q.'],
    ['Simplificá P ∧ (P ∧ Q).', 'P∧Q', 'Asociativa e idempotencia dejan P ∧ Q.'],
    ['Simplificá P ∨ (P ∨ Q).', 'P∨Q', 'Asociativa e idempotencia dejan P ∨ Q.'],
    ['Simplificá ¬(P ∧ ¬P).', '1', 'P ∧ ¬P es F; su negación es tautología.'],
    ['Simplificá ¬(P ∨ ¬P).', '0', 'P ∨ ¬P es V; su negación es contradicción.'],
    ['Escribí ¬(P → Q) sin usar implicación.', 'P∧¬Q', 'Negar P → Q afirma P y niega Q.'],
    ['Simplificá (P ∧ Q) ∨ P.', 'P', 'Absorción, con los términos en otro orden.'],
    ['Simplificá P ∧ (Q ∨ P).', 'P', 'Absorción: P ∧ (Q ∨ P) ≡ P.'],
    ['Aplicá De Morgan a ¬(¬P ∧ Q).', 'P∨¬Q', '¬¬P ∨ ¬Q ≡ P ∨ ¬Q.'],
    ['Simplificá (P ∨ R) ∧ (Q ∨ R) ∧ ¬R.', 'P∧Q∧¬R', 'Con ¬R, cada (X ∨ R) se vuelve X. Queda P ∧ Q ∧ ¬R.'],
    ['Simplificá P ↔ P.', '1', 'Una proposición es equivalente a sí misma.'],
    ['Simplificá P ⊻ P.', '0', 'La disyunción exclusiva de una fórmula consigo misma es falsa.'],
    ['Simplificá ¬P ∨ (P ∧ Q).', '¬P∨Q', 'Distribuí: (¬P ∨ P) ∧ (¬P ∨ Q) ≡ ¬P ∨ Q.'],
  ];
  const [prompt, answer, explanation] = bank[variant % bank.length];
  return { titles, question: ask(id, 'logic', prompt, answer, explanation, { difficulty }) };
}

function setDrill(variant: number, id: string, difficulty: 1 | 2 | 3): { question: Question; titles: string[] } {
  const titles = ['Operaciones con conjuntos', 'Pertenencia e inclusión'];
  const start = 1 + (variant % 12);
  const left = [String(start), String(start + 2), String(start + 5)];
  const right = [String(start + 2), String(start + 4), String(start + 7)];
  const universe = [...new Set([...left, ...right, String(start + 1), String(start + 8)])];
  const kind = Math.floor(variant / 12) % 3;
  const union = [...new Set([...left, ...right])];
  const inter = left.filter(x => right.includes(x));
  const diff = left.filter(x => !right.includes(x));
  if (kind === 0) return { titles, question: ask(id, 'set', `Sean A={${left.join(', ')}} y B={${right.join(', ')}}. Seleccioná A ∪ B.`, union, 'La unión reúne los elementos sin repetirlos.', { difficulty, universe }) };
  if (kind === 1) return { titles, question: ask(id, 'set', `Sean A={${left.join(', ')}} y B={${right.join(', ')}}. Seleccioná A ∩ B.`, inter, 'La intersección conserva solo los elementos comunes.', { difficulty, universe }) };
  return { titles, question: ask(id, 'set', `Sean A={${left.join(', ')}} y B={${right.join(', ')}}. Seleccioná A − B.`, diff, 'La diferencia conserva los de A que no están en B.', { difficulty, universe }) };
}

function cardinalityDrill(variant: number, id: string, difficulty: 1 | 2 | 3): { question: Question; titles: string[] } {
  const titles = ['Cardinalidad y conteo', 'Aplicaciones e inclusión-exclusión', 'Conjunto potencia y producto'];
  const kind = variant % 5;
  const seq = Math.floor(variant / 5);
  const a = 8 + seq, b = 5 + Math.floor(seq / 2), both = 2 + seq % 4, union = a + b - both;
  if (kind === 0) return { titles, question: ask(id, 'text', `|A|=${a}, |B|=${b} y |A ∩ B|=${both}. Calculá |A ∪ B|.`, String(union), `${a}+${b}−${both}=${union}.`, { difficulty }) };
  if (kind === 1) {
    const total = union + 3 + seq % 5;
    return { titles, question: ask(id, 'text', `En un grupo de ${total}, |A|=${a}, |B|=${b} y |A ∩ B|=${both}. ¿Cuántos no están en A ∪ B?`, String(total - union), `La unión es ${union}; el exterior es ${total}−${union}=${total - union}.`, { difficulty }) };
  }
  if (kind === 2) {
    const n = 3 + seq % 5;
    return { titles, question: ask(id, 'text', `Un conjunto tiene ${n} elementos. Calculá |P(A)|.`, String(2 ** n), `|P(A)|=2^${n}=${2 ** n}.`, { difficulty }) };
  }
  if (kind === 3) {
    const n = 3 + seq % 4, m = 2 + seq % 5;
    return { titles, question: ask(id, 'text', `Si |A|=${n} y |B|=${m}, calculá |A × B|.`, String(n * m), `La regla del producto da ${n}·${m}=${n * m}.`, { difficulty }) };
  }
  return { titles, question: ask(id, 'text', `|A|=${a} y |A ∩ B|=${both}. Calculá cuántos elementos hay solo en A.`, String(a - both), `Solo A es ${a}−${both}=${a - both}.`, { difficulty }) };
}

function powerDrill(variant: number, id: string, difficulty: 1 | 2 | 3): { question: Question; titles: string[] } {
  const titles = ['Leyes de potencias'];
  const kind = variant % 4;
  const seq = Math.floor(variant / 4);
  const a = 2 + seq % 5;
  const b = 2 + Math.floor(seq / 5) % 4;
  const c = 1 + seq % 3;
  if (kind === 0) {
    const exp = a + b - c;
    const answer = `x${raised(exp)}`;
    return { titles, question: ask(id, 'choice', `Simplificá x${raised(a)} · x${raised(b)} / x${raised(c)}, con x ≠ 0.`, answer, `Sumá ${a}+${b} y restá ${c}: queda ${answer}.`, { difficulty, options: uniqueOptions(answer, [`x${raised(a + b + c)}`, `x${raised(Math.abs(a * b - c))}`, `x${raised(a + b)}`]) }) };
  }
  if (kind === 1) {
    const exp = a * b;
    const answer = `x${raised(exp)}`;
    return { titles, question: ask(id, 'choice', `Simplificá (x${raised(a)})${raised(b)}.`, answer, `Multiplicá los exponentes: ${a}·${b}=${exp}.`, { difficulty, options: uniqueOptions(answer, [`x${raised(a + b)}`, `x${raised(a)}`, `${b}x${raised(a)}`]) }) };
  }
  if (kind === 2) {
    const answer = `1/x${raised(a)}`;
    return { titles, question: ask(id, 'choice', `Escribí x${raised(-a)} con exponente positivo. x ≠ 0.`, answer, `El exponente negativo pasa la potencia al denominador.`, { difficulty, options: [answer, `−x${raised(a)}`, `x${raised(a)}`, `−1/x${raised(a)}`] }) };
  }
  const answer = '1';
  return { titles, question: ask(id, 'choice', `Calculá (${3 + seq % 6})⁰. La base no es cero.`, answer, 'Una base distinta de cero elevada a cero es 1.', { difficulty, options: [answer, '0', String(3 + seq % 6), 'No está definido'] }) };
}

function notableDrill(variant: number, id: string, difficulty: 1 | 2 | 3): { question: Question; titles: string[] } {
  const titles = ['Productos notables', 'Trinomios y diferencias de cuadrados'];
  const a = 1 + variant % 4;
  const b = 2 + Math.floor(variant / 4) % 5;
  const kind = Math.floor(variant / 20) % 3;
  const left = a === 1 ? 'x' : `${a}x`;
  if (kind === 0) {
    const answer = `${a * a}x² + ${2 * a * b}x + ${b * b}`;
    return { titles, question: ask(id, 'choice', `Desarrollá (${left} + ${b})².`, answer, `Cuadrado del primero, doble producto y cuadrado del segundo.`, { difficulty, options: [answer, `${a * a}x² + ${b * b}`, `${a * a}x² − ${2 * a * b}x + ${b * b}`, `${a * a}x² + ${a * b}x + ${b * b}`] }) };
  }
  if (kind === 1) {
    const answer = `${a * a}x² − ${b * b}`;
    return { titles, question: ask(id, 'choice', `Desarrollá (${left} + ${b})(${left} − ${b}).`, answer, 'Suma por diferencia: se cancelan los términos del medio.', { difficulty, options: [answer, `${a * a}x² + ${b * b}`, `${a * a}x² − ${2 * a * b}x + ${b * b}`, `${a * a}x² − ${a * b}x − ${b * b}`] }) };
  }
  const answer = `${a * a * a}x³ + ${3 * a * a * b}x² + ${3 * a * b * b}x + ${b * b * b}`;
  return { titles, question: ask(id, 'choice', `Desarrollá (${left} + ${b})³.`, answer, 'Los coeficientes del cubo de una suma son 1, 3, 3, 1.', { difficulty, options: [answer, `${a * a * a}x³ + ${b * b * b}`, `${a * a * a}x³ + ${3 * a * b}x + ${b * b * b}`, `${a * a * a}x³ + ${a * a * b}x² + ${a * b * b}x + ${b * b * b}`] }) };
}

function rationalizeDrill(variant: number, id: string, difficulty: 1 | 2 | 3): { question: Question; titles: string[] } {
  const titles = ['Radicales y racionalización'];
  const n = 2 + variant % 11;
  const kind = Math.floor(variant / 11) % 3;
  if (kind === 0) {
    const answer = `√${n}/${n}`;
    return { titles, question: ask(id, 'choice', `Racionalizá 1/√${n}.`, answer, `Multiplicá numerador y denominador por √${n}.`, { difficulty, options: [answer, `1/${n}`, `√${n}`, `${n}/√${n}`] }) };
  }
  if (kind === 1) {
    const a = 2 + variant % 5;
    const b = a + 1 + Math.floor(variant / 5) % 3;
    const answer = `√${a} + √${b}`;
    return { titles, question: ask(id, 'choice', `¿Cuál es el conjugado de √${a} − √${b}?`, answer, 'El conjugado cambia el signo de en medio y deja las raíces.', { difficulty, options: [answer, `√${a} − √${b}`, `−√${a} − √${b}`, `√${b} − √${a}`] }) };
  }
  const a = 2 + variant % 6;
  const answer = `(√${a} − 1)/(${a} − 1)`;
  return { titles, question: ask(id, 'choice', `Racionalizá 1/(√${a} + 1).`, answer, `Multiplicá por el conjugado √${a} − 1. El denominador queda ${a} − 1.`, { difficulty, options: [answer, `1/(${a} + 1)`, `(√${a} + 1)/(${a} − 1)`, `√${a} − 1`] }) };
}

function connectiveDrill(variant: number, id: string, difficulty: 1 | 2 | 3): { question: Question; titles: string[] } {
  const titles = ['Proposiciones y conectores'];
  const pairs: Array<[boolean, boolean]> = [[true, true], [true, false], [false, true], [false, false]];
  const formulas: Array<{ name: string; value: (p: boolean, q: boolean) => boolean }> = [
    { name: 'P ∧ Q', value: (p, q) => p && q },
    { name: 'P ∨ Q', value: (p, q) => p || q },
    { name: 'P ⊻ Q', value: (p, q) => p !== q },
    { name: '¬P', value: (p) => !p },
    { name: '¬Q', value: (_p, q) => !q },
    { name: '¬P ∧ Q', value: (p, q) => !p && q },
    { name: 'P ∧ ¬Q', value: (p, q) => p && !q },
    { name: '¬(P ∧ Q)', value: (p, q) => !(p && q) },
    { name: '¬(P ∨ Q)', value: (p, q) => !(p || q) },
  ];
  const [p, q] = pairs[variant % pairs.length];
  const formula = formulas[Math.floor(variant / pairs.length) % formulas.length];
  const answer = formula.value(p, q) ? 'Verdadero' : 'Falso';
  const state = `P es ${p ? 'verdadera' : 'falsa'} y Q es ${q ? 'verdadera' : 'falsa'}`;
  return { titles, question: ask(id, 'choice', `${state}. ¿Qué valor tiene ${formula.name}?`, answer, `${formula.name} con esos valores es ${answer.toLowerCase()}.`, { difficulty, options: ['Verdadero', 'Falso'] }) };
}

function implicationDrill(variant: number, id: string, difficulty: 1 | 2 | 3): { question: Question; titles: string[] } {
  const titles = ['Implicación y bicondicional'];
  const pairs: Array<[boolean, boolean]> = [[true, true], [true, false], [false, true], [false, false]];
  const formulas: Array<{ name: string; value: (p: boolean, q: boolean) => boolean; why: string }> = [
    { name: 'P → Q', value: (p, q) => !p || q, why: 'La implicación solo es falsa cuando P es verdadera y Q es falsa.' },
    { name: 'P ↔ Q', value: (p, q) => p === q, why: 'El bicondicional es verdadero cuando P y Q coinciden.' },
    { name: 'Q → P', value: (p, q) => !q || p, why: 'Q → P es falsa solo cuando Q es verdadera y P es falsa.' },
    { name: '¬P → Q', value: (p, q) => p || q, why: 'El antecedente es ¬P. Falla solo si ¬P es verdadera y Q es falsa.' },
    { name: 'P → ¬Q', value: (p, q) => !p || !q, why: 'El consecuente es ¬Q. Falla solo si P es verdadera y ¬Q es falsa.' },
    { name: '¬(P → Q)', value: (p, q) => p && !q, why: 'Negar P → Q afirma P y niega Q.' },
    { name: '¬P ↔ Q', value: (p, q) => (!p) === q, why: 'El bicondicional es verdadero cuando ¬P y Q coinciden.' },
    { name: '(P → Q) ∧ (Q → P)', value: (p, q) => p === q, why: 'Las dos implicaciones juntas equivalen a P ↔ Q.' },
  ];
  const [p, q] = pairs[variant % pairs.length];
  const formula = formulas[Math.floor(variant / pairs.length) % formulas.length];
  const answer = formula.value(p, q) ? 'Verdadero' : 'Falso';
  return { titles, question: ask(id, 'choice', `P es ${p ? 'verdadera' : 'falsa'} y Q es ${q ? 'verdadera' : 'falsa'}. ¿Qué valor tiene ${formula.name}?`, answer, formula.why, { difficulty, options: ['Verdadero', 'Falso'] }) };
}

function inferenceDrill(variant: number, id: string, difficulty: 1 | 2 | 3): { question: Question; titles: string[] } {
  const titles = ['Reglas de inferencia'];
  const letters: Array<[string, string, string]> = [['P', 'Q', 'R'], ['A', 'B', 'C'], ['M', 'N', 'O'], ['R', 'S', 'T']];
  const [x, y, z] = letters[Math.floor(variant / 8) % letters.length];
  const bank: Array<[string, string, string, string[]]> = [
    [`De ${x} → ${y} y ${x}, ¿qué se concluye?`, y, 'Modus ponens: el antecedente está afirmado.', [y, `¬${y}`, `${x} ∧ ¬${y}`, 'Nada necesario']],
    [`De ${x} → ${y} y ¬${y}, ¿qué se concluye?`, `¬${x}`, 'Modus tollens: el consecuente está negado.', [`¬${x}`, y, x, 'Nada necesario']],
    [`De ${x} ∧ ${y}, ¿qué se concluye?`, x, 'Simplificación: de una conjunción se obtiene cualquiera de las dos.', [x, `¬${x}`, z, 'Nada necesario']],
    [`De ${x} ∨ ${y} y ¬${x}, ¿qué se concluye?`, y, 'Silogismo disyuntivo: queda el otro disyunto.', [y, `¬${y}`, `${x} ∧ ${y}`, 'Nada necesario']],
    [`De ${x} → ${y} y ${y} → ${z}, ¿qué se concluye?`, `${x} → ${z}`, 'Silogismo hipotético.', [`${x} → ${z}`, `${z} → ${x}`, `¬${x}`, 'Nada necesario']],
    [`De solo ${x} → ${y}, sin otra premisa, ¿qué se concluye sobre ${y}?`, 'Nada necesario', 'Falta afirmar el antecedente o negar el consecuente.', ['Nada necesario', y, `¬${y}`, x]],
    [`De ${x}, ¿se puede concluir ${x} ∨ ${y}?`, 'Sí, por adición', `De ${x} se obtiene ${x} ∨ ${y}.`, ['Sí, por adición', `No: falta ${y}`, `Solo si ${y} es verdadera`, `Se concluye ¬${y}`]],
    [`De ${x} → ${y} y ¬${x}, ¿qué se concluye sobre ${y}?`, 'Nada necesario', 'Negar el antecedente no permite negar el consecuente.', ['Nada necesario', `¬${y}`, y, `${x} ∧ ${y}`]],
  ];
  const [prompt, answer, explanation, options] = bank[variant % bank.length];
  return { titles, question: ask(id, 'choice', prompt, answer, explanation, { difficulty, options }) };
}

function quantifierDrill(variant: number, id: string, difficulty: 1 | 2 | 3): { question: Question; titles: string[] } {
  const titles = ['Universal y existencial', 'Negar y distribuir', 'Cuantificadores anidados'];
  const bank: Array<[string, string, string, string[]]> = [
    ['Negá ∀x P(x).', '∃x ¬P(x)', 'Al negar, el universal pasa a existencial y se niega el predicado.', ['∃x ¬P(x)', '∀x ¬P(x)', '∃x P(x)', '¬∀x ¬P(x)']],
    ['Negá ∃x P(x).', '∀x ¬P(x)', 'Al negar, el existencial pasa a universal y se niega el predicado.', ['∀x ¬P(x)', '∃x ¬P(x)', '∀x P(x)', '¬∃x ¬P(x)']],
    ['Leé ∀x ∈ ℕ, x + 0 = x.', 'Para todo natural, sumarle cero no lo cambia', 'ℕ incluye 0 en esta app.', ['Para todo natural, sumarle cero no lo cambia', 'Existe un natural que no cambia al sumarle cero', 'Ningún natural cumple x + 0 = x', 'Solo el cero cumple la igualdad']],
    ['Leé ∃x ∈ ℤ, x² = 2.', 'Falsa: 2 no es cuadrado de un entero', '1² = 1 y 2² = 4. No hay entero en el medio.', ['Falsa: 2 no es cuadrado de un entero', 'Verdadera, x = √2', 'Verdadera, x = 1', 'Falsa porque ℤ no tiene positivos']],
    ['Negá ∀x ∃y P(x, y).', '∃x ∀y ¬P(x, y)', 'Cada cuantificador se invierte y la negación llega al predicado.', ['∃x ∀y ¬P(x, y)', '∀x ∀y ¬P(x, y)', '∃x ∃y ¬P(x, y)', '∀x ∃y ¬P(x, y)']],
    ['¿∀x P(x) implica ∃x P(x) si el universo no es vacío?', 'Sí', 'Si todos cumplen, alguno cumple.', ['Sí', 'No', 'Solo si P es una tautología', 'Solo en ℕ']],
    ['Negá ∀x (x > 0).', '∃x ¬(x > 0)', 'El universal pasa a existencial y se niega el predicado.', ['∃x ¬(x > 0)', '∀x (x ≤ 0)', '∃x (x > 0)', '∀x ¬(x > 0)']],
    ['Negá ∃x (x² < 0).', '∀x ¬(x² < 0)', 'El existencial pasa a universal.', ['∀x ¬(x² < 0)', '∃x (x² ≥ 0)', '∀x (x² < 0)', '∃x ¬(x² < 0)']],
    ['¿∀x ∈ ℝ, x² ≥ 0?', 'Verdadera', 'El cuadrado de un real nunca es negativo.', ['Verdadera', 'Falsa, porque x = −1', 'Falsa, porque x = 0', 'Solo para enteros']],
    ['¿∃x ∈ ℝ, x² = −1?', 'Falsa', 'Ningún real tiene cuadrado negativo.', ['Falsa', 'Verdadera, x = −1', 'Verdadera, x = i', 'Verdadera, x = 1']],
    ['¿∃x ∈ ℕ, x + 1 = 0?', 'Falsa', 'ℕ incluye 0 y los positivos. −1 no es natural.', ['Falsa', 'Verdadera, x = −1', 'Verdadera, x = 0', 'Verdadera, x = 1']],
    ['¿∀x ∈ ℕ, x + 1 > x?', 'Verdadera', 'Sumar uno aumenta cualquier natural.', ['Verdadera', 'Falsa en x = 0', 'Falsa porque ℕ es infinito', 'Solo para x > 0']],
    ['Negá ∀x ∃y (y = x + 1).', '∃x ∀y (y ≠ x + 1)', 'Se invierten los dos cuantificadores y se niega la igualdad.', ['∃x ∀y (y ≠ x + 1)', '∀x ∀y (y ≠ x + 1)', '∃x ∃y (y ≠ x + 1)', '∀x ∃y (y ≠ x + 1)']],
    ['Leé ∃x ∀y (x + y = y).', 'Existe un número que, sumado a cualquiera, no lo cambia', 'Ese número es el cero.', ['Existe un número que, sumado a cualquiera, no lo cambia', 'Todo número cumple x + y = y', 'Ningún número deja quieto a y', 'Solo y = 0 cumple la igualdad']],
    ['¿∀x P(x) ∨ ∀x Q(x) equivale a ∀x (P(x) ∨ Q(x))?', 'No', 'La disyunción dentro del universal es más débil: cada elemento elige un predicado.', ['No', 'Sí', 'Solo si P y Q son el mismo', 'Solo en un universo finito']],
    ['¿∃x (P(x) ∧ Q(x)) implica ∃x P(x) ∧ ∃x Q(x)?', 'Sí', 'El mismo elemento que cumple ambos sirve para cada existencial.', ['Sí', 'No', 'Solo si el universo es ℕ', 'Solo si P implica Q']],
    ['¿∃x P(x) ∧ ∃x Q(x) implica ∃x (P(x) ∧ Q(x))?', 'No', 'Los dos existenciales pueden ser elementos distintos.', ['No', 'Sí', 'Sí, por simplificación', 'Solo si el universo tiene un elemento']],
    ['Negá ∃x ∀y P(x, y).', '∀x ∃y ¬P(x, y)', 'El existencial pasa a universal, el universal a existencial, y se niega P.', ['∀x ∃y ¬P(x, y)', '∃x ∀y ¬P(x, y)', '∀x ∀y ¬P(x, y)', '∃x ∃y ¬P(x, y)']],
    ['Leé ∀x ∈ ℤ ∃y ∈ ℤ (y = −x).', 'Todo entero tiene opuesto entero', 'El opuesto de n es −n, y sigue en ℤ.', ['Todo entero tiene opuesto entero', 'Existe un entero que es opuesto de todos', 'Ningún entero tiene opuesto', 'Solo los positivos tienen opuesto']],
    ['¿∀x ∈ ℤ, x² > 0?', 'Falsa, porque 0² = 0', 'El cero es entero y su cuadrado no es positivo.', ['Falsa, porque 0² = 0', 'Verdadera', 'Falsa, porque (−1)² = −1', 'Falsa, porque ℤ no tiene cuadrados']],
    ['Si A es el conjunto vacío, ¿qué valor tiene ∀x ∈ A, P(x)?', 'Verdadera: no hay contraejemplo', 'Un universal sobre el vacío no tiene elemento que lo falsee.', ['Verdadera: no hay contraejemplo', 'Falsa: A no tiene elementos', 'Depende de P', 'No está definida']],
    ['Negá ∀x ∈ A, P(x).', '∃x ∈ A, ¬P(x)', 'La negación busca un elemento de A que no cumpla P.', ['∃x ∈ A, ¬P(x)', '∀x ∈ A, ¬P(x)', '∃x ∉ A, ¬P(x)', '¬∃x ∈ A, P(x)']],
    ['¿∃x ∈ ∅, P(x)?', 'Falsa', 'No hay elemento del vacío que cumpla P.', ['Falsa', 'Verdadera', 'Verdadera si P es una tautología', 'Depende de P']],
    ['De ∀x (P(x) → Q(x)) y ∀x P(x), ¿qué se concluye?', '∀x Q(x)', 'Modus ponens dentro del universal.', ['∀x Q(x)', '∃x Q(x) y nada más', '∀x ¬Q(x)', 'Nada necesario']],
    ['De ∀x (P(x) → Q(x)) y ∃x P(x), ¿qué se concluye?', '∃x Q(x)', 'El mismo elemento que cumple P cumple Q.', ['∃x Q(x)', '∀x Q(x)', '∃x ¬Q(x)', 'Nada necesario']],
    ['De ∀x (P(x) → Q(x)) y ∃x ¬Q(x), ¿qué se concluye?', '∃x ¬P(x)', 'Modus tollens sobre ese elemento.', ['∃x ¬P(x)', '∀x ¬P(x)', '∃x Q(x)', 'Nada necesario']],
    ['Leé ∃x ∈ ℕ (x · 0 = 0).', 'Verdadera', 'Cualquier natural sirve; en particular 0.', ['Verdadera', 'Falsa, porque x = 0 no cuenta', 'Falsa, porque el producto no es cero', 'Solo x = 1']],
    ['¿∀x ∈ ℝ ∃y ∈ ℝ (y > x)?', 'Verdadera', 'Para cada real hay otro más grande, por ejemplo x + 1.', ['Verdadera', 'Falsa: ℝ tiene máximo', 'Falsa: y tendría que ser el mismo para todos', 'Solo para x positivo']],
    ['¿∃y ∈ ℝ ∀x ∈ ℝ (y > x)?', 'Falsa', 'Ningún real es mayor que todos los reales.', ['Falsa', 'Verdadera, y muy grande', 'Verdadera, y = 0', 'Verdadera si se excluye y']],
    ['Negá ∃x ∃y (x ≠ y).', '∀x ∀y (x = y)', 'Negar que existan dos distintos es decir que todos son iguales.', ['∀x ∀y (x = y)', '∀x ∃y (x = y)', '∃x ∀y (x ≠ y)', '∀x ∀y (x ≠ y)']],
    ['Leé ∀x ∈ ℕ ∃y ∈ ℕ (y = x + 1).', 'Todo natural tiene sucesor natural', 'El sucesor de n es n + 1, y sigue en ℕ.', ['Todo natural tiene sucesor natural', 'Existe un natural que es sucesor de todos', 'Ningún natural tiene sucesor', 'Solo el cero tiene sucesor']],
    ['¿∃x ∈ ℤ (2x = 1)?', 'Falsa', '1/2 no es entero.', ['Falsa', 'Verdadera, x = 1/2', 'Verdadera, x = 1', 'Verdadera, x = 0']],
  ];
  const [prompt, answer, explanation, options] = bank[variant % bank.length];
  return { titles, question: ask(id, 'choice', prompt, answer, explanation, { difficulty, options }) };
}

function vennDrill(variant: number, id: string, difficulty: 1 | 2 | 3): { question: Question; titles: string[] } {
  const titles = ['Regiones de Venn', 'Venn y leyes de conjuntos'];
  const start = 1 + (variant % 15);
  const a = [start, start + 1, start + 2];
  const b = [start + 2, start + 3];
  const onlyA = `${a[0]} y ${a[1]}`;
  const both = String(a[2]);
  const onlyB = String(b[1]);
  const union = `${a.join(', ')} y ${b[1]}`;
  const kind = Math.floor(variant / 15) % 3;
  const prompt = `A = {${a.join(', ')}} y B = {${b.join(', ')}}.`;
  if (kind === 0) return { titles, question: ask(id, 'choice', `${prompt} ¿Qué números están solo en A?`, onlyA, 'Solo A quita la intersección.', { difficulty, options: [onlyA, both, onlyB, union] }) };
  if (kind === 1) return { titles, question: ask(id, 'choice', `${prompt} ¿Qué número está en A ∩ B?`, both, 'La intersección es el elemento común.', { difficulty, options: [both, onlyA, onlyB, 'Ninguno'] }) };
  return { titles, question: ask(id, 'choice', `${prompt} ¿Qué número está solo en B?`, onlyB, 'Solo B es lo de B que no está en A.', { difficulty, options: [onlyB, both, onlyA, union] }) };
}

export function topicTitle(topic: DrillId, count: number): string {
  const spec = CATALOG.find(item => item.id === topic);
  return `${spec?.label ?? 'Tema'} · ${count}`;
}

export function topicPractice(course: Course, topic: DrillId, count: number, seed: string, catalog: PracticeItem[], path: Lesson[]): PracticeItem[] {
  const spec = CATALOG.find(item => item.id === topic);
  if (!spec || spec.course !== course) throw new Error('Elegí un tema de este curso.');
  const n = clampDrillCount(count);
  const coursePath = path.filter(lesson => lesson.course === course);
  const used = new Set<string>();
  const picked: PracticeItem[] = [];
  const ranked = catalog
    .filter(item => item.lesson.course === course && matchesTopic(item, topic))
    .sort((a, b) => seedNumber(`${seed}-cat-${a.question.id}`) - seedNumber(`${seed}-cat-${b.question.id}`));
  for (const item of ranked) {
    if (picked.length >= n) break;
    if (used.has(item.question.prompt)) continue;
    used.add(item.question.prompt);
    picked.push(item);
  }
  let variant = seedNumber(`${seed}-${topic}`) % 97;
  let guard = 0;
  while (picked.length < n && guard < n * 40) {
    const id = `drill-${topic}-${seed}-${variant}`;
    const made = makeGenerated(topic, variant, id);
    variant += 1;
    guard += 1;
    if (used.has(made.question.prompt)) continue;
    used.add(made.question.prompt);
    const lesson = lessonFor(coursePath, made.titles);
    picked.push({ lesson, question: { ...made.question, tag: spec.label } });
  }
  if (picked.length < n) throw new Error('No se pudo armar esa tira de ejercicios.');
  return picked;
}
