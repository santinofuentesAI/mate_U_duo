import type { Course, Lesson, Question } from './types';
import { buildExpandedContent } from './expandedContent';
const choice = (prompt: string, options: string[], answer: string, explanation: string): Question => ({ id: '', type: 'choice', prompt, options, answer, explanation, hints: ['Identificá primero la definición o regla que aplica.', explanation], tag: '', difficulty: 1 });
const input = (type: Question['type'], prompt: string, answer: Question['answer'], explanation: string, extra: Partial<Question> = {}): Question => ({ id: '', type, prompt, answer, explanation, hints: ['Separá el problema en pasos y revisá los casos extremos.', explanation], tag: '', difficulty: 2, ...extra });
function lesson(course: Course, unit: string, title: string, icon: string, pages: string, theory: string[], formulas: string[], steps: string[], questions: Question[]): Lesson {
  const id = `${course}-${title.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  return { id, course, unit, title, icon, description: theory[0], source: course === 'precalculo' ? 'Precálculo · Semana 4' : `Matemática Discreta · ${unit.split(' · ')[0]}`, pages, minutes: 6, theory, formulas, example: { title: 'Un ejemplo, paso a paso', steps }, questions: questions.map((q, i) => ({ ...q, id: `${id}-q${i + 1}`, tag: title })) };
}
const D = (u: string, t: string, i: string, p: string, th: string[], f: string[], s: string[], q: Question[]) => lesson('discreta', u, t, i, p, th, f, s, q);
const P = (t: string, i: string, p: string, th: string[], f: string[], s: string[], q: Question[]) => lesson('precalculo', 'S4 · Álgebra', t, i, p, th, f, s, q);
export const lessons: Lesson[] = [
  D('S1 · Lógica proposicional', 'Proposiciones y conectores', '💬', '1–3',
    ['Una proposición es un enunciado al que podemos asignar verdadero o falso.', 'Una pregunta o una orden no es una proposición. Las proposiciones atómicas no contienen conectores; las compuestas sí.', '“O” inclusiva admite ambas alternativas. La disyunción exclusiva exige exactamente una.'],
    ['\\neg P', 'P\\land Q', 'P\\lor Q', 'P\\oplus Q'],
    ['P: “estudio”; Q: “practico”.', '“Estudio y practico” se escribe P ∧ Q.', '“Estudio o practico, pero no ambas” se escribe P ⊻ Q.'], [
      choice('¿Cuál es una proposición?', ['¿Cuánto es 2 + 2?', 'Cerrá la puerta.', '2 + 2 = 4'], '2 + 2 = 4', 'La igualdad tiene un valor de verdad: es verdadera.'),
      input('logic', 'P: estudio. Q: practico. Escribí “estudio y no practico”.', 'P∧¬Q', '“Y” es ∧; “no practico” es ¬Q.'),
      choice('Si P y Q son verdaderas, ¿cuánto vale P ⊻ Q?', ['V', 'F'], 'F', 'La disyunción exclusiva es falsa cuando ambas son verdaderas.')]),
  D('S1 · Lógica proposicional', 'Implicación y bicondicional', '🔗', '2–4',
    ['P → Q solo es falsa cuando P es verdadera y Q es falsa.', 'La implicación no afirma causalidad. Si el antecedente es falso, la implicación material es verdadera.', 'P ↔ Q es verdadera cuando ambos valores coinciden. La recíproca Q → P no equivale en general a P → Q.'], ['P\\to Q\\equiv\\neg P\\lor Q', 'P\\leftrightarrow Q\\equiv(P\\to Q)\\land(Q\\to P)'],
    ['“Si llueve, llevo paraguas”: P → Q.', 'Llueve y no llevo paraguas: la promesa se incumple; F.', 'No llueve: no hay incumplimiento de esa condición; V.'], [
      choice('Una implicación es falsa. ¿Qué valores tienen P y Q?', ['P = V, Q = F', 'P = F, Q = V', 'P = V, Q = V'], 'P = V, Q = F', 'Es la única fila falsa de P → Q.'),
      input('logic', 'Escribí P → Q usando solo ¬ y ∨.', '¬P∨Q', 'Negá el antecedente y unilo al consecuente con ∨.'),
      choice('P = F y Q = F. ¿Cuánto vale P ↔ Q?', ['V', 'F'], 'V', 'Los valores coinciden; por eso el bicondicional es verdadero.')]),
  D('S1 · Lógica proposicional', 'Tablas de verdad', '▦', '3–6',
    ['Con n variables distintas hay 2ⁿ combinaciones de valores.', 'Calculá primero negaciones y paréntesis; luego completá la columna de la fórmula.', 'Una tautología tiene solo V; una contradicción solo F; una contingencia tiene ambas.'], ['2^n\\text{ filas}', 'P\\lor\\neg P\\equiv 1'],
    ['Para (¬P ∧ Q) → (¬Q ∨ P), usá VV, VF, FV, FF.', 'Solo en FV el antecedente es V y el consecuente F.', 'La columna final es V, V, F, V: contingencia.'], [
      input('table', 'Completá P → Q en orden VV, VF, FV, FF.', ['V','F','V','V'], 'La única fila falsa es VF: antecedente V y consecuente F.', { expression: 'P→Q', variables: ['P','Q'] }),
      choice('¿Cómo se clasifica P ∧ ¬P?', ['Tautología','Contradicción','Contingencia'], 'Contradicción', 'P y su negación nunca son simultáneamente verdaderas.'),
      choice('¿Cuántas filas necesita una tabla con P, Q y R?', ['6','8','9'], '8', 'Son 2³ = 8, no el número de premisas.')]),
  D('S1 · Lógica proposicional', 'Equivalencias y simplificación', '✨', '6–10',
    ['Dos fórmulas equivalen si sus columnas de verdad coinciden en todas las asignaciones.', 'De Morgan cambia ∧ por ∨, o ∨ por ∧, y niega cada componente.', 'Usá distributividad, complemento, neutro y absorción. Cada paso debe conservar equivalencia.'], ['\\neg(P\\land Q)\\equiv\\neg P\\lor\\neg Q', 'P\\lor(P\\land Q)\\equiv P'],
    ['P ∨ [(Q ∧ R) ∨ (¬Q ∧ R)].', 'Factorizá R: P ∨ [(Q ∨ ¬Q) ∧ R].', 'Q ∨ ¬Q = V, así que queda P ∨ R.'], [
      input('logic', 'Aplicá De Morgan a ¬(P ∨ Q).', '¬P∧¬Q', 'La negación de una disyunción es la conjunción de las negaciones.'),
      input('logic', 'Simplificá P ∨ (P ∧ Q).', 'P', 'Por absorción, la segunda parte no añade casos verdaderos.'),
      input('logic', 'Simplificá P ∨ [(Q ∧ R) ∨ (¬Q ∧ R)].', 'P∨R', 'Distribuí R y usá Q ∨ ¬Q = V.')]),
  D('S1 · Lógica proposicional', 'Traducción y contraejemplos', '🔎', '11–13',
    ['Traducí el sentido de la oración, no solo el orden de las palabras.', '“P solo si Q” significa P → Q: Q es necesaria para P.', 'Para refutar una equivalencia basta una asignación que dé resultados distintos.'], ['P\\text{ solo si }Q\\quad\\rightsquigarrow\\quad P\\to Q', '\\neg(P\\to Q)\\equiv P\\land\\neg Q'],
    ['Se propone (Q → R) ∧ (¬Q → S) ≡ R ∨ S.', 'Elegí Q = V, R = F, S = V.', 'La izquierda es F y la derecha V. No son equivalentes; el enunciado del material requiere revisión.'], [
      input('logic', 'P: apruebo. Q: estudio. Traducí “apruebo solo si estudio”.', 'P→Q', 'Estudiar es condición necesaria para aprobar.'),
      input('logic', 'Negá “si estudio, apruebo” (P → Q).', 'P∧¬Q', 'Para negar una implicación se afirma el antecedente y se niega el consecuente.'),
      choice('¿Cuántos contraejemplos bastan para refutar una equivalencia?', ['Uno','Todas las filas','Ninguno'], 'Uno', 'Una sola fila diferente prueba que no coinciden siempre.')]),
  D('S2 · Circuitos e inferencia', 'Circuitos lógicos', '⚡', '1–3',
    ['Interruptores en serie corresponden a AND; en paralelo, a OR.', 'En esta app 1 significa conduce y 0 no conduce. Es una convención lógica explícita.', 'La descripción abierto/cerrado del PDF es inconsistente con la convención física habitual; no memorices esa inversión.'], ['\\text{serie}:P\\land Q', '\\text{paralelo}:P\\lor Q'],
    ['Una rama contiene P y Q en serie.', 'Otra rama contiene R. Las dos ramas están en paralelo.', 'La salida es (P ∧ Q) ∨ R; R por sí sola puede activarla.'], [
      input('logic', 'Dos interruptores P y Q en serie. Escribí la salida.', 'P∧Q', 'Los dos deben conducir.'),
      input('logic', 'P y Q en serie, en paralelo con R. Escribí la salida.', '(P∧Q)∨R', 'La rama de R es una alternativa a la rama P y Q.'),
      choice('En (P ∧ Q) ∨ R, con P = F, Q = V, R = V, ¿hay salida?', ['Sí','No'], 'Sí', 'R activa la salida aunque la rama en serie no conduzca.')]),
  D('S2 · Circuitos e inferencia', 'Reglas de inferencia', '🧩', '3–5',
    ['Modus ponens: P → Q y P permiten concluir Q.', 'Modus tollens: P → Q y ¬Q permiten concluir ¬P.', 'Simplificación extrae una parte de ∧. Adjunción reúne dos hechos. Silogismo disyuntivo elimina una alternativa negada.'], ['P\\to Q,\\ P\\ \\vdash Q', 'P\\to Q,\\ \\neg Q\\ \\vdash\\neg P', 'P\\lor Q,\\ \\neg P\\ \\vdash Q'],
    ['P ∨ Q; Q → R; P → T; ¬T.', 'P → T y ¬T dan ¬P por modus tollens.', 'P ∨ Q y ¬P dan Q; Q → R da R.'], [
      choice('P → Q y P. ¿Qué conclusión está justificada?', ['Q','¬Q','¬P'], 'Q', 'Es modus ponens.'),
      choice('P → Q y ¬Q. ¿Qué conclusión está justificada?', ['¬P','P','Q'], '¬P', 'Es modus tollens, la contraposición de la implicación.'),
      choice('P ∨ Q y ¬P. ¿Qué regla da Q?', ['Silogismo disyuntivo','Adjunción','Afirmación del consecuente'], 'Silogismo disyuntivo', 'Se elimina P, dejando Q.')]),
  D('S2 · Circuitos e inferencia', 'Demostraciones y falacias', '🏛️', '5–10',
    ['Una demostración enumera premisas y deriva líneas con reglas válidas.', 'El argumento es válido si no existe un caso con todas las premisas V y la conclusión F.', 'Afirmar el consecuente o negar el antecedente no es válido en general.'], ['P\\to Q,\\ Q\\ \\not\\vdash P'],
    ['Premisas: (P ∨ Q) → R; (R ∨ S) → T; S ∨ P; ¬S.', 'De S ∨ P y ¬S obtené P. Añadí Q: P ∨ Q.', 'Obtené R, luego R ∨ S y finalmente T.'], [
      input('order', 'Ordená las conclusiones para demostrar T desde esas cuatro premisas.', ['P','P ∨ Q','R','R ∨ S','T'], 'Primero silogismo disyuntivo; después adición, MP, adición y MP.', { options: ['R','T','P ∨ Q','P','R ∨ S'] }),
      choice('Si llueve, la calle se moja. La calle está mojada. Entonces llueve. ¿Es válido?', ['No','Sí'], 'No', 'Puede mojarse por otra causa. Es afirmación del consecuente.'),
      choice('¿Qué refuta un argumento?', ['Premisas V y conclusión F','Premisas F y conclusión V','Premisas V y conclusión V'], 'Premisas V y conclusión F', 'Es exactamente el caso que una inferencia válida debe excluir.')]),
  D('S3 · Predicados y cuantificadores', 'Predicados y universos', '🌐', '1–3',
    ['Un predicado P(x) depende del valor de x. Al sustituir x, obtenés una proposición.', 'Siempre especificá el universo: una afirmación puede cambiar al pasar de enteros a reales.', 'En esta app ℕ = {0,1,2,…}; si un ejercicio adopta otra convención, se indica.'], ['P(x):x^2>x'],
    ['En ℝ, P(2) es V porque 4 > 2.', 'P(0) es F porque 0 no es mayor que 0.', 'Por eso “para todo real x, x² > x” es falso.'], [
      choice('P(x): x² > x. ¿Cuánto vale P(0)?', ['V','F'], 'F', '0² = 0 y la desigualdad es estricta.'),
      choice('¿Qué falta en “para todo x, x² ≥ 0” para fijar el contexto?', ['El universo','Otro conector','Una pregunta'], 'El universo', 'Debés indicar qué valores puede tomar x.'),
      choice('P(n): n³ + 1 es par, n entero. ¿Cuál es un testigo verdadero?', ['n = 1','n = 2','n = 4'], 'n = 1', '1³ + 1 = 2, que es par.')]),
  D('S3 · Predicados y cuantificadores', 'Universal y existencial', '∀', '2–5',
    ['∀x P(x) exige que todos los valores del universo cumplan P.', '∃x P(x) exige al menos un testigo; no significa exactamente uno.', 'En un universo finito, ∀ se expande con ∧ y ∃ con ∨.'], ['\\forall x\\in\\{a,b\\}:P(x)\\equiv P(a)\\land P(b)', '\\exists x\\in\\{a,b\\}:P(x)\\equiv P(a)\\lor P(b)'],
    ['En U = {1,2,3}, P(x): x es par.', 'P(1) = F, P(2) = V, P(3) = F.', '∃x P(x) es V; ∀x P(x) es F.'], [
      choice('U = {1,2,3}. ¿Es verdadero ∃x ∈ U: x es par?', ['V','F'], 'V', 'x = 2 es un testigo suficiente.'),
      choice('U = {1,2,3}. ¿Es verdadero ∀x ∈ U: x es par?', ['V','F'], 'F', 'x = 1 es un contraejemplo.'),
      input('logic', 'En U = {a,b}, P significa P(a) y Q significa P(b). Expandí ∀x P(x).', 'P∧Q', 'El universal requiere que ambos casos sean verdaderos.')]),
  D('S3 · Predicados y cuantificadores', 'Negar y distribuir', '↔', '5–7',
    ['Negar un cuantificador lo cambia por el otro y niega el predicado.', '∀ distribuye sobre ∧; ∃ distribuye sobre ∨.', 'No intercambies esas leyes: “todos hacen A o B” no exige que todos hagan lo mismo.'], ['\\neg\\forall x P(x)\\equiv\\exists x\\neg P(x)', '\\neg\\exists x P(x)\\equiv\\forall x\\neg P(x)'],
    ['“Todos los gatos toman leche” es ∀x L(x).', 'Su negación: “hay un gato que no toma leche”.', 'No equivale a “ningún gato toma leche”, que es mucho más fuerte.'], [
      choice('Negá “todos aprueban”.', ['Alguien no aprueba','Nadie aprueba','Alguien aprueba'], 'Alguien no aprueba', 'Se necesita un solo contraejemplo al universal.'),
      choice('Negá “existe un número par en A”.', ['Ningún elemento de A es par','Todos son pares','Existe un impar en A'], 'Ningún elemento de A es par', '¬∃ se transforma en ∀¬.'),
      choice('¿Cuál distribución es válida?', ['∃x(P(x) ∨ Q(x)) ≡ (∃x P(x)) ∨ (∃x Q(x))','∀x(P(x) ∨ Q(x)) ≡ (∀x P(x)) ∨ (∀x Q(x))'], '∃x(P(x) ∨ Q(x)) ≡ (∃x P(x)) ∨ (∃x Q(x))', 'Un testigo para alguna alternativa basta; el universal no exige una alternativa común.')]),
  D('S3 · Predicados y cuantificadores', 'Cuantificadores anidados', '🪆', '7–8',
    ['El orden importa: ∀x ∃y permite elegir y según x; ∃y ∀x exige un y fijo.', 'Para demostrar un existencial exhibí un testigo; para refutar un universal exhibí un contraejemplo.', 'Al negar varios cuantificadores, cambiá cada uno sin alterar el orden.'], ['\\forall x\\in\\mathbb R\\ \\exists y\\in\\mathbb R:x+y=0', '\\neg\\forall x\\exists y P(x,y)\\equiv\\exists x\\forall y\\neg P(x,y)'],
    ['∀x ∃y: x + y = 0 es verdadero en ℝ.', 'Para cada x elegí y = −x.', '∃y ∀x: x + y = 0 es falso: un y fijo no anula todos los x.'], [
      choice('En ℝ, ¿es verdadero ∀x ∃y: x + y = 0?', ['V','F'], 'V', 'Elegí y = −x para cada x.'),
      choice('En ℝ, ¿es verdadero ∃y ∀x: x + y = 0?', ['V','F'], 'F', 'Para x = 0 se exige y = 0; para x = 1 se exige y = −1.'),
      choice('¿Qué x hace verdadero ∃x ∀y: xy = y en ℝ?', ['x = 1','x = 0','x = −1'], 'x = 1', '1 multiplicado por cualquier y devuelve y.')]),
  D('S3 · Predicados y cuantificadores', 'Matrices y patrones', '🔢', '9–10',
    ['Una matriz permite evaluar predicados sobre filas, columnas y entradas.', 'En A[m][n] = (m + 1) + 3(n + 1), m va de 0 a 9 y n de 0 a 19.', 'Distinguí “cada fila contiene” de “existe una fila que contiene”. No confundas índices con valores.'], ['A_{m,n}=m+3n+4'],
    ['A[0][0] = 4; A[9][19] = 70.', 'Moverse una columna suma 3; mover una fila suma 1.', 'A[0][1] = A[3][0] = 7: hay repeticiones entre filas no consecutivas.'], [
      input('text', 'Calculá A[9][19].', '70', '10 + 3·20 = 70.'),
      input('text', '¿Cuánto aumenta A al avanzar una columna?', '3', 'n aumenta en 1, por lo que 3(n + 1) aumenta en 3.'),
      choice('¿Todos los valores de la matriz son distintos?', ['No','Sí'], 'No', 'A[0][1] y A[3][0] valen 7.')]),
  D('S4 · Conjuntos', 'Pertenencia e inclusión', '📦', '1–4',
    ['a ∈ A habla de un elemento. B ⊆ A habla de un conjunto cuyos elementos están en A.', '∅ es subconjunto de todo conjunto; eso no implica que ∅ sea un elemento de todos.', 'En conjuntos anidados, {2} y 2 son objetos distintos. ⊂ indica inclusión estricta en esta app.'], ['A=\\{1,3,\\{2\\}\\}', '\\varnothing\\subseteq A'],
    ['A contiene tres elementos: 1, 3 y {2}.', '2 ∉ A, pero {2} ∈ A.', '{1,3} ⊆ A, porque 1 y 3 sí pertenecen a A.'], [
      choice('A = {1,3,{2}}. ¿Es 2 ∈ A?', ['No','Sí'], 'No', 'El elemento es el conjunto {2}, no el número 2.'),
      choice('A = {1,3,{2}}. ¿Es {1,3} ⊆ A?', ['Sí','No'], 'Sí', 'Sus dos elementos pertenecen a A.'),
      choice('¿Cuál afirmación es siempre verdadera?', ['∅ ⊆ A','∅ ∈ A','A = ∅'], '∅ ⊆ A', 'El conjunto vacío no tiene elementos que puedan violar la inclusión.')]),
  D('S4 · Conjuntos', 'Operaciones con conjuntos', '∪', '4–8',
    ['Unión reúne; intersección conserva lo común; A − B conserva lo de A que no está en B.', 'La diferencia simétrica conserva lo que pertenece exactamente a uno de los conjuntos.', 'El complemento siempre depende del universo Ω.'], ['A\\triangle B=(A-B)\\cup(B-A)', 'A^c=\\Omega-A'],
    ['Ω = {0,2,4,6,8,9}; A = {0,2,8}; C = {0,4,8,9}.', 'A ∩ C = {0,8}; A ∪ C = {0,2,4,8,9}.', 'A △ C = {2,4,9}; Aᶜ = {4,6,9}.'], [
      input('set', 'A = {0,2,8}; C = {0,4,8,9}. Seleccioná A ∩ C.', ['0','8'], 'Solo 0 y 8 pertenecen a ambos.', { universe:['0','2','4','6','8','9'] }),
      input('set', 'Con los mismos A y C, seleccioná A △ C.', ['2','4','9'], 'Quitá de la unión los elementos comunes 0 y 8.', { universe:['0','2','4','6','8','9'] }),
      input('set', 'Ω = {0,2,4,6,8,9}; A = {0,2,8}. Seleccioná Aᶜ.', ['4','6','9'], 'El complemento contiene lo del universo que no pertenece a A.', { universe:['0','2','4','6','8','9'] })]),
  D('S4 · Conjuntos', 'Intervalos y fronteras', '📏', '6–9',
    ['Un corchete incluye el extremo; un paréntesis lo excluye.', 'La intersección exige ambas condiciones. En una diferencia, el punto frontera puede cambiar de incluido a excluido.', '∞ nunca es un elemento real; siempre lleva paréntesis.'], ['A=[3,\\infty),\\quad B=(1,5]'],
    ['A ∩ B = [3,5], porque ambos extremos pertenecen a los dos.', 'A ∪ B = (1,∞).', 'A − B = (5,∞); B − A = (1,3).'], [
      choice('A = [3,∞), B = (1,5]. ¿Cuál es A ∩ B?', ['[3,5]','(3,5)','[1,∞)'], '[3,5]', '3 y 5 están en ambos conjuntos.'),
      choice('¿Cuál es A − B?', ['(5,∞)','[5,∞)','[3,5]'], '(5,∞)', '5 se elimina porque pertenece a B.'),
      choice('¿Cuál es B − A?', ['(1,3)','(1,3]','[1,3)'], '(1,3)', '1 no pertenece a B; 3 se elimina por pertenecer a A.')]),
  D('S4 · Conjuntos', 'Venn y leyes de conjuntos', '◉', '8–11',
    ['Un diagrama de tres conjuntos tiene ocho regiones, incluida la región exterior.', 'Para sombrear una expresión, decidí región por región si cumple la condición.', 'De Morgan y las leyes de complemento son paralelas a las leyes proposicionales.'], ['(A\\cup B)^c=A^c\\cap B^c', 'A\\cup A^c=\\Omega', 'A\\cap A^c=\\varnothing'],
    ['Para (A − B) ∪ (B ∩ C), primero marcá las regiones de A que no están en B.', 'Añadí todas las regiones compartidas por B y C, incluida la triple.', 'En el ejercicio numérico [(A △ C) − B] ∪ (B ∩ C), el resultado es {6,9}.'], [
      input('venn', 'Seleccioná las regiones de (A − B) ∪ (B ∩ C). Cada código indica pertenencia a A, B, C (1 = sí).', ['100','101','011','111'], 'A sin B: 100 y 101. B con C: 011 y 111.', { universe:['000','100','010','001','110','101','011','111'] }),
      choice('¿Qué unión da siempre Ω?', ['A ∪ Aᶜ','A ∪ A','A ∩ Aᶜ'], 'A ∪ Aᶜ', 'El complemento aporta exactamente lo que falta en A. El PDF tiene un error tipográfico aquí.'),
      input('set', 'A={1,2,4,6}, B={4,6,7,8}, C={1,2,6,9}. Calculá [(A △ C) − B] ∪ (B ∩ C).', ['6','9'], 'A △ C = {4,9}; al quitar B queda {9}. B ∩ C = {6}.', { universe:['1','2','4','6','7','8','9'] })]),
  D('S4 · Conjuntos', 'Aplicaciones e inclusión-exclusión', '👥', '11–18',
    ['Para contar una unión sumá tamaños y restá la intersección que contaste dos veces.', 'Con tres conjuntos, restá las intersecciones de a pares y añadí la triple.', '“Solo A” excluye los otros conjuntos. “Ninguno” se calcula desde el total del universo.'], ['|A\\cup B|=|A|+|B|-|A\\cap B|', '|A\\cup B\\cup C|=|A|+|B|+|C|-|A\\cap B|-|A\\cap C|-|B\\cap C|+|A\\cap B\\cap C|'],
    ['30 personas: 18 usan Drive, 15 usan LMS, 8 usan ambos.', 'Usan al menos uno: 18 + 15 − 8 = 25.', 'Solo Drive: 18 − 8 = 10. Ninguno: 30 − 25 = 5.'], [
      input('text', '18 usan Drive, 15 LMS, 8 ambos. ¿Cuántos usan al menos uno?', '25', '18 + 15 − 8 = 25.'),
      input('text', 'De 30 personas, 25 usan al menos una herramienta. ¿Cuántas ninguna?', '5', 'El exterior de la unión tiene 30 − 25 = 5.'),
      input('text', '|A|=10, |B|=9, |C|=8; intersecciones por pares 4,3,2; triple 1. Hallá la unión.', '19', '10 + 9 + 8 − 4 − 3 − 2 + 1 = 19.')]),
  P('Raíces racionales y factores', '🌱', '1–2',
    ['Si p/q es raíz racional en forma irreducible, p divide el término independiente y q el coeficiente principal.', 'Son candidatos, no raíces garantizadas. Probá cada uno con sustitución o división sintética.', 'Antes de buscar raíces, extraé un factor común. Un resto cero confirma un factor x − r.'], ['p\\mid a_0,\\quad q\\mid a_n', 'P(r)=0\\iff(x-r)\\text{ divide a }P(x)'],
    ['2x⁴ − 7x³ + 2x² + 3x tiene factor común x.', 'Para 2x³ − 7x² + 2x + 3, los candidatos son ±1, ±3, ±1/2, ±3/2.', 'Las raíces 1, −1/2 y 3 dan x(x − 1)(2x + 1)(x − 3).'], [
      input('set', 'Seleccioná los candidatos racionales de 2x³ − 7x² + 2x + 3.', ['1','-1','3','-3','1/2','-1/2','3/2','-3/2'], 'Numerador divide 3; denominador divide 2.', { universe:['1','-1','2','-2','3','-3','1/2','-1/2','3/2','-3/2'] }),
      choice('Si P(3)=0, ¿qué factor corresponde?', ['x − 3','x + 3','3x'], 'x − 3', 'La raíz r corresponde al factor x − r.'),
      input('algebra', 'Factorizá 2x⁴ − 7x³ + 2x² + 3x. Se aceptan expresiones algebraicamente equivalentes.', 'x*(x-1)*(2x+1)*(x-3)', 'Extraé x y encontrá las tres raíces del cúbico.')]),
  P('División sintética', '🧮', '1–3',
    ['Ordená el polinomio en potencias descendentes e incluí coeficientes cero para términos ausentes.', 'Bajá el primero; multiplicá por r y sumá al siguiente. Repetí.', 'El último número es el resto; los anteriores son coeficientes del cociente.'], ['P(x)=(x-r)Q(x)+P(r)'],
    ['Dividí 2x³ − 7x² + 2x + 3 por x − 1.', 'Coeficientes 2, −7, 2, 3; r = 1.', 'Fila final: 2, −5, −3, 0. Cociente 2x² − 5x − 3; resto 0.'], [
      input('synthetic', 'Completá la fila final al dividir por x − 1.', ['2','-5','-3','0'], 'Bajá 2; −7 + 2 = −5; 2 − 5 = −3; 3 − 3 = 0.', { coefficients:[2,-7,2,3],root:1 }),
      input('synthetic', 'Dividí x³ − 1 por x − 1. No omitas los ceros.', ['1','1','1','0'], 'Usá 1,0,0,−1. El cociente es x² + x + 1.', { coefficients:[1,0,0,-1],root:1 }),
      choice('¿Qué representa el último número de la fila?', ['El resto','La raíz','El coeficiente principal'], 'El resto', 'Por el teorema del resto, es P(r).')]),
  P('Factorización completa', '🧱', '2–3',
    ['Factorizar completamente depende del conjunto numérico: un cuadrático sin raíces reales es irreducible en ℝ.', 'Comprobá multiplicando los factores. No confundas una raíz repetida con una raíz nueva.', 'El discriminante b² − 4ac decide si un cuadrático tiene raíces reales.'], ['\\Delta=b^2-4ac', '2a^4-4a^2-6a-4=2(a+1)(a-2)(a^2+a+1)'],
    ['Extraé 2; probá a = −1 y a = 2.', 'El factor restante es a² + a + 1.', 'Δ = 1 − 4 = −3; este factor es irreducible sobre ℝ.'], [
      input('algebra', 'Factorizá 2a⁴ − 4a² − 6a − 4 (se acepta cualquier forma equivalente).', '2*(a+1)*(a-2)*(a^2+a+1)', 'El factor 2, las raíces −1 y 2 y el cuadrático irreducible producen la expresión original.'),
      input('text', 'Calculá el discriminante de a² + a + 1.', '-3', '1² − 4·1·1 = −3.'),
      choice('¿Tiene a² + a + 1 raíces reales?', ['No','Sí'], 'No', 'Su discriminante es negativo.')]),
  P('Fracciones y dominio', '🚧', '3–4',
    ['Las restricciones se obtienen del denominador ORIGINAL antes de cancelar.', 'Solo se cancelan factores, nunca términos de una suma.', 'Una expresión simplificada conserva los puntos excluidos del problema original.'], ['\\frac{9x-x^3}{x^3-6x^2+9x}=-\\frac{x+3}{x-3},\\quad x\\ne0,3'],
    ['Numerador: x(3 − x)(3 + x). Denominador: x(x − 3)².', 'Como 3 − x = −(x − 3), cancelá los factores comunes.', 'Resultado −(x + 3)/(x − 3), pero 0 y 3 siguen excluidos.'], [
      input('algebra', 'Simplificá (9x − x³)/(x³ − 6x² + 9x). Indicá valores excluidos de x separados por coma.', '-(x+3)/(x-3)', 'Se cancelan x y un factor x − 3; x ≠ 0 y x ≠ 3 se conservan.', { exclusions:['0','3'] }),
      input('algebra', 'Simplificá (x² − 1)/(x − 1). Indicá el valor excluido.', 'x+1', 'x² − 1 = (x − 1)(x + 1), pero x = 1 sigue fuera del dominio.', { exclusions:['1'] }),
      choice('¿Se puede cancelar x en (x + 2)/x?', ['No','Sí'], 'No', 'x no es factor de todo el numerador; solo de uno de sus términos.')]),
  P('Operar fracciones algebraicas', '➗', '4–5',
    ['Para sumar, factorizá denominadores y buscá el mínimo común denominador.', 'Para dividir, multiplicá por el recíproco y exigí que el divisor no sea cero.', 'Al final simplificá y conservá todas las restricciones originales.'], ['\\frac{x+3y}{3xy}+\\frac{x^2y-4xy^2}{5x^2y^2}=\\frac{8x+3y}{15xy}', '\\frac{3x-3}{2x+4}\\div\\frac{x^2-x}{x^2+4x+4}=\\frac{3(x+2)}{2x}'],
    ['En la división, los denominadores excluyen x = −2.', 'El divisor x(x − 1)/(x + 2)² debe ser no nulo: excluí 0 y 1.', 'Invertí, factorizá y cancelá: 3(x + 2)/(2x), x ≠ −2,0,1.'], [
      input('algebra', 'Sumá (x+3y)/(3xy) + (x²y−4xy²)/(5x²y²). Restricciones: escribí x=0,y=0.', '(8x+3y)/(15xy)', 'Tras reducir la segunda fracción, el MCD es 15xy; sumá 5(x+3y) + 3(x−4y).', { exclusions:['x=0','y=0'] }),
      input('algebra', 'Dividí (3x−3)/(2x+4) entre (x²−x)/(x²+4x+4). Indicá valores excluidos de x.', '3*(x+2)/(2*x)', 'El divisor no puede valer cero. Las exclusiones son −2, 0 y 1.', { exclusions:['-2','0','1'] }),
      choice('Al dividir por una fracción, ¿qué condición adicional se impone?', ['El divisor no puede ser cero','El numerador inicial es positivo','x debe ser entero'], 'El divisor no puede ser cero', 'Además de denominadores no nulos, está prohibida la división por cero.')]),
  P('Radicales y racionalización', '√', '5–7',
    ['Racionalizar elimina radicales del denominador multiplicando numerador y denominador por el mismo factor no nulo.', 'Para dos raíces cuadradas usá el conjugado. Para una raíz de índice n completá exponentes hasta múltiplos de n.', 'Para una suma de dos términos con raíz cúbica, usá (a + b)(a² − ab + b²) = a³ + b³.'], ['(a-b)(a+b)=a^2-b^2', '(a+b)(a^2-ab+b^2)=a^3+b^3'],
    ['(x² − 9)/(√(6x) − √(x² + 9)). Dominio: x ≥ 0 y x ≠ 3.', 'Multiplicá por √(6x) + √(x² + 9). Denominador: −(x − 3)².', 'Queda −(x + 3)(√(6x) + √(x² + 9))/(x − 3); mantené el dominio.'], [
      choice('¿Cuál es el conjugado de √(6x) − √(x² + 9)?', ['√(6x) + √(x² + 9)','−√(6x) − √(x² + 9)','√(6x) − √(x² + 9)'], '√(6x) + √(x² + 9)', 'Se cambia el signo entre los términos.'),
      input('algebra', 'Simplificá el denominador 6x − (x² + 9).', '-(x-3)^2', '6x − x² − 9 = −(x² − 6x + 9).'),
      choice('¿Qué factor racionaliza a + b cuando a es una raíz cúbica y a³ + b³ no contiene radicales?', ['a² − ab + b²','a − b','a² + ab + b²'], 'a² − ab + b²', 'El producto es a³ + b³, identidad de suma de cubos.')]),
];
for(const l of lessons.filter(l=>l.course==='precalculo'))l.unit=['Raíces racionales y factores','División sintética','Factorización completa'].includes(l.title)?'B3 · Factorización':'B4 · Fracciones algebraicas';
lessons.push(...buildExpandedContent(lesson));
const preferredOrder=['Introducción y razonamiento lógico','Proposiciones y conectores','Implicación y bicondicional','Tablas de verdad','Equivalencias y simplificación','Traducción y contraejemplos','Formas normales','Factor común y agrupación','Trinomios y diferencias de cuadrados','Suma y diferencia de cubos','Raíces racionales y factores','División sintética','Factorización completa'];
const priority=(l:Lesson)=>{const i=preferredOrder.indexOf(l.title);return i<0?100:i;};
lessons.sort((a,b)=>a.course.localeCompare(b.course)||Number(a.unit.match(/\d+/)?.[0]||0)-Number(b.unit.match(/\d+/)?.[0]||0)||priority(a)-priority(b));
export const courseInfo = {
  discreta: { name:'Matemática Discreta', subtitle:'Semanas 1–4 · Pensá, conectá, demostrá', emoji:'🧩', color:'#7556ef' },
  precalculo: { name:'Precálculo', subtitle:'Libro · páginas 1–63 · Desde las bases hasta ecuaciones', emoji:'🌱', color:'#168979' },
};
export const sourceNotes = [
  'Cobertura temática ampliada: Precálculo páginas 1–63; Discreta desde el inicio hasta ejercicios de cardinalidad, página impresa 150 / PDF 152. Los bloques de Precálculo organizan temas del libro, no asignan semanas del docente. El banco curado no es una transcripción de cada inciso.',
  'Discreta S1: una equivalencia propuesta no es válida; la lección de contraejemplos muestra una fila que la refuta.',
  'Discreta S2: la convención abierto/cerrado está invertida respecto de la física habitual. Se usa 1 = conduce. Algunas demostraciones requieren revisar premisas; no se inventaron premisas faltantes.',
  'Discreta S4: las leyes de complemento deben ser A ∪ Aᶜ = Ω y A ∩ Aᶜ = ∅. Hay ejercicios con C sin definir y expresiones ambiguas que no se autocorrigen aquí.',
  'Precálculo S4: los incisos del folio de problemas se pueden consultar ahora en el libro, páginas PDF 42–53. Aún no todos tienen corrección automática. Las respuestas de álgebra se comparan por equivalencia; no certifican que se haya usado el método pedido.',
  'Los PDF originales no se publican en este repositorio. Las páginas indicadas corresponden al orden del documento, no necesariamente a la numeración impresa.',
];
