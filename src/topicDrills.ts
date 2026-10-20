import type { Course, Lesson, Question } from './types';
import { evaluateLogic, parseLogic, synthetic } from './engine';
import { seedNumber, type PracticeItem } from './learning';

export type DrillId =
  | 'simplify'
  | 'factor'
  | 'synthetic'
  | 'equations'
  | 'inequalities'
  | 'tables'
  | 'equivalences'
  | 'sets'
  | 'cardinality';

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
  { id: 'synthetic', course: 'precalculo', label: 'División sintética', hint: 'Completá la fila de abajo. El último número es el resto.' },
  { id: 'equations', course: 'precalculo', label: 'Ecuaciones', hint: 'Lineales y cuadráticas que se resuelven factorizando o despejando.' },
  { id: 'inequalities', course: 'precalculo', label: 'Inecuaciones', hint: 'Lineales, polinomiales y racionales. El conjunto solución es un intervalo, no un punto.' },
  { id: 'tables', course: 'discreta', label: 'Tablas de verdad', hint: 'Llená vos cada fila. No hay columna ya hecha para copiar.' },
  { id: 'equivalences', course: 'discreta', label: 'Equivalencias', hint: 'De Morgan, absorción, complemento. Escribí la forma más corta.' },
  { id: 'sets', course: 'discreta', label: 'Conjuntos', hint: 'Unión, intersección y diferencia, eligiendo los elementos.' },
  { id: 'cardinality', course: 'discreta', label: 'Cardinalidad', hint: 'Cuentas de unión, potencia y producto. Un número, sin adivinar.' },
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
      return question.type === 'synthetic';
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
    case 'tables':
      return tableDrill(variant, id, difficulty);
    case 'equivalences':
      return equivalenceDrill(variant, id, difficulty);
    case 'sets':
      return setDrill(variant, id, difficulty);
    case 'cardinality':
      return cardinalityDrill(variant, id, difficulty);
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

function syntheticDrill(variant: number, id: string, difficulty: 1 | 2 | 3): { question: Question; titles: string[] } {
  const titles = ['División sintética', 'Raíces racionales y factores'];
  const roots = [-3, -2, -1, 1, 2, 3];
  const r = roots[variant % roots.length];
  if (variant % 2 === 0) {
    const a = 1 + Math.floor(variant / 2) % 3;
    const b = (Math.floor(variant / 6) % 7) - 3;
    const c = (Math.floor(variant / 14) % 7) - 3;
    const coefficients = [a, b - r * a, c - r * b, -r * c];
    const bottom = synthetic(coefficients, r);
    return { titles, question: ask(id, 'synthetic', `Dividí sintéticamente ${formatPoly(coefficients)} entre x − (${r}). Completá la fila final.`, bottom.map(String), `El divisor x − (${r}) usa r = ${r}. El último número es el resto (acá ${bottom.at(-1)}).`, { difficulty, root: r, coefficients }) };
  }
  const coefficients = [1 + variant % 3, (variant % 7) - 3, Math.floor(variant / 3) % 7 - 3, (variant % 11) - 5];
  const bottom = synthetic(coefficients, r);
  return { titles, question: ask(id, 'synthetic', `Dividí sintéticamente ${formatPoly(coefficients)} entre x − (${r}). Completá la fila final.`, bottom.map(String), `Bajá ${coefficients[0]}; multiplicá cada resultado por ${r} y sumalo al siguiente coeficiente.`, { difficulty, root: r, coefficients }) };
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
