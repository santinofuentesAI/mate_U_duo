import type { Course, Question } from './types';
import { bookCatalog, type OpenBookProblem } from './bookCatalog';
import { isFactored, isLinearFactorization } from './engine';

export interface ExtraBookExercise { course: Course; lessonTitle: string; question: Question; }
export const solutionOrigins: Record<string, string> = {};

type Row = {
  catalogId: string; lesson: string; type: Question['type']; prompt: string;
  answer: string | string[]; explanation: string; hint: string;
  options?: string[]; universe?: string[]; difficulty?: 1 | 2 | 3;
  form?: 'product' | 'expanded'; origin?: string;
};

const rows: Row[] = [
  { catalogId: 'precalculo-18-1a', lesson: 'Conjuntos numéricos', type: 'choice', prompt: '¿La afirmación es verdadera?', answer: 'Verdadero', explanation: '∛27 = 3 y −3² = −9, así que el cociente es −1/3: racional y negativo.', hint: 'Calculá primero la raíz cúbica y recordá que −3² no es (−3)².', options: ['Verdadero', 'Falso'] },
  { catalogId: 'precalculo-18-1c', lesson: 'Conjuntos numéricos', type: 'choice', prompt: '¿La afirmación es verdadera?', answer: 'Falso', explanation: '2 + 2/π es positivo, y su cuadrado también. Además π impide que el resultado sea racional.', hint: 'Mirá el signo antes de discutir si es racional.', options: ['Verdadero', 'Falso'] },
  { catalogId: 'precalculo-33-1b', lesson: 'Monomios y términos semejantes', type: 'choice', prompt: 'Clasificá 3/x + 2.', answer: 'No es un polinomio', explanation: 'Un polinomio no tiene la variable en el denominador. 3/x es de grado negativo.', hint: 'Revisá si todos los exponentes de x son enteros no negativos.', options: ['No es un polinomio', 'Binomio · grado 1', 'Monomio · grado −1'] },
  { catalogId: 'precalculo-33-1d', lesson: 'Monomios y términos semejantes', type: 'choice', prompt: 'Clasificá (x⁵ + 2x² + x + 1)/3.', answer: 'Polinomio de 4 términos · grado 5', explanation: 'Dividir entre 3 no cambia el grado ni la cantidad de términos. El mayor exponente es 5.', hint: 'Un denominador constante no saca la expresión de los polinomios.', options: ['Polinomio de 4 términos · grado 5', 'Polinomio de 4 términos · grado 1', 'No es un polinomio'] },
  { catalogId: 'precalculo-33-1e', lesson: 'Monomios y términos semejantes', type: 'choice', prompt: 'Clasificá √x + 3x.', answer: 'No es un polinomio', explanation: '√x = x^(1/2). El exponente no es un entero no negativo.', hint: 'Escribí la raíz como exponente y comparalo con la definición de polinomio.', options: ['No es un polinomio', 'Binomio · grado 1', 'Binomio · grado 1/2'] },
  { catalogId: 'precalculo-33-1f', lesson: 'Monomios y términos semejantes', type: 'choice', prompt: 'Clasificá la constante 5.', answer: 'Monomio · grado 0', explanation: 'Una constante distinta de cero es un monomio. Su grado es 0, no «sin grado».', hint: '5 = 5x⁰.', options: ['Monomio · grado 0', 'No es un polinomio', 'Polinomio · grado 5'] },
  { catalogId: 'precalculo-18-6d', lesson: 'Signos y jerarquía de operaciones', type: 'text', prompt: 'Calculá (−5)² − [∛(−8) − (−17) + 5 + 1].', answer: '4', explanation: '25 − [−2 + 17 + 5 + 1] = 25 − 21 = 4.', hint: 'El cuadrado de −5 es 25. La raíz cúbica de −8 es −2.' },
  { catalogId: 'precalculo-18-6e', lesson: 'Signos y jerarquía de operaciones', type: 'text', prompt: 'Calculá 11 + √(2·10² − 4).', answer: '25', explanation: 'Dentro de la raíz: 200 − 4 = 196. √196 = 14 y 11 + 14 = 25.', hint: 'Resolvé la potencia y la resta antes de la raíz.' },
  { catalogId: 'precalculo-18-6g', lesson: 'Signos y jerarquía de operaciones', type: 'text', prompt: 'Calculá −3[−1 + √36 + (−3)²] ÷ (−7).', answer: '6', explanation: 'El corchete vale −1 + 6 + 9 = 14. −3·14 = −42 y −42/(−7) = 6.', hint: '√36 = 6 y (−3)² = 9. El signo de afuera multiplica todo el corchete.' },
  { catalogId: 'precalculo-18-6h', lesson: 'Signos y jerarquía de operaciones', type: 'text', prompt: 'Calculá (−12 ÷ 3) ÷ (−∛8) · (3³ ÷ 3²).', answer: '6', explanation: '(−4)/(−2) = 2 y 27/9 = 3. De izquierda a derecha, 2·3 = 6.', hint: 'División y multiplicación van de izquierda a derecha.' },
  { catalogId: 'precalculo-18-6i', lesson: 'Signos y jerarquía de operaciones', type: 'text', prompt: 'Calculá (3 + (−2))⁰ + (√4 − 3)².', answer: '2', explanation: '1⁰ = 1 y (2 − 3)² = 1. La suma es 2.', hint: 'Cualquier base no nula elevada a 0 vale 1.' },
  { catalogId: 'precalculo-18-6j', lesson: 'Signos y jerarquía de operaciones', type: 'text', prompt: 'Calculá (17 − 15)⁴ + (∜16 − ∜81) − (1 − 2)³.', answer: '16', explanation: '16 + (2 − 3) − (−1) = 16 − 1 + 1 = 16.', hint: '∜16 = 2 y ∜81 = 3. Un cubo negativo sigue siendo negativo.' },
  { catalogId: 'precalculo-18-6k', lesson: 'Signos y jerarquía de operaciones', type: 'text', prompt: 'Calculá (√25 ÷ 5) + 6²(√64 − 2³).', answer: '1', explanation: '5/5 = 1 y √64 − 8 = 0. 1 + 36·0 = 1.', hint: 'El segundo término se anula porque 8 − 8 = 0.' },
  { catalogId: 'precalculo-18-6l', lesson: 'Signos y jerarquía de operaciones', type: 'text', prompt: 'Calculá 3·⁸√256 + 2√324 − 5√144.', answer: '-18', explanation: '⁸√256 = 2, √324 = 18 y √144 = 12. 6 + 36 − 60 = −18.', hint: '256 = 2⁸ y 324 = 18².' },
  { catalogId: 'precalculo-18-6m', lesson: 'Signos y jerarquía de operaciones', type: 'text', prompt: 'Calculá (2·∜81 + 3·∜625) ÷ (−3√49).', answer: '-1', explanation: '∜81 = 3 y ∜625 = 5, así que el numerador es 21. El denominador es −21.', hint: '625 = 5⁴ y 49 = 7².' },
  { catalogId: 'precalculo-18-6n', lesson: 'Signos y jerarquía de operaciones', type: 'text', prompt: 'Calculá [(7³ − 5³) + (√49 + 7√25) − 4]³.', answer: '16777216', explanation: '343 − 125 = 218; 7 + 35 = 42; 218 + 42 − 4 = 256. 256³ = 16 777 216.', hint: 'Simplificá el corchete antes de elevar al cubo. 256 = 2⁸.' },
  { catalogId: 'precalculo-18-6ñ', lesson: 'Signos y jerarquía de operaciones', type: 'text', prompt: 'Calculá [4⁴ ÷ (√16)³] · 4 − 1.', answer: '15', explanation: '256/64 = 4 y 4·4 − 1 = 15.', hint: '(√16)³ = 4³ = 64.' },
  { catalogId: 'precalculo-19-6o', lesson: 'Signos y jerarquía de operaciones', type: 'text', prompt: 'Calculá 2{√(5² − 3²) + [2(−5 − 2)]²}.', answer: '400', explanation: '√16 = 4 y (−14)² = 196. 2(4 + 196) = 400.', hint: 'El cuadrado de afuera cubre todo el producto 2(−7).' },
  { catalogId: 'precalculo-33-6', lesson: 'Multiplicación y productos notables', type: 'choice', prompt: '¿Se cumple (x + y)² − (x − y)² = 4xy?', answer: 'Verdadero', explanation: 'Al desarrollar: (x² + 2xy + y²) − (x² − 2xy + y²) = 4xy.', hint: 'Desarrollá ambos cuadrados y restá término a término.', options: ['Verdadero', 'Falso'] },
  { catalogId: 'precalculo-33-7', lesson: 'División de polinomios', type: 'choice', prompt: 'Al dividir 2x³ − 12x + 1 entre −x + 3, ¿el residuo es 19?', answer: 'Verdadero', explanation: '−x + 3 = −(x − 3). La división sintética por 3 deja residuo 19, y ese residuo no cambia al multiplicar el divisor por −1.', hint: 'Reordená el dividendo como 2x³ + 0x² − 12x + 1 y probá la raíz del divisor.', options: ['Verdadero', 'Falso'] },
  { catalogId: 'precalculo-33-2c', lesson: 'Suma y resta de polinomios', type: 'algebra', prompt: 'Con p(x) = x³ + 3x² + 2x + 5 y q(x) = −3x³ − 3x² + 4x + 3, calculá p(x) + 5q(x).', answer: '-14*x^3-12*x^2+22*x+20', explanation: '5q aporta −15x³ − 15x² + 20x + 15. Al sumar p queda −14x³ − 12x² + 22x + 20.', hint: 'Multiplicá cada término de q por 5 antes de sumar.', form: 'expanded', origin: '(x^3+3*x^2+2*x+5)+5*(-3*x^3-3*x^2+4*x+3)' },
  { catalogId: 'precalculo-33-2d', lesson: 'Suma y resta de polinomios', type: 'algebra', prompt: 'Con los mismos p y q, calculá p(x) − 2q(x).', answer: '7*x^3+9*x^2-6*x-1', explanation: 'Restar 2q equivale a sumar 6x³ + 6x² − 8x − 6. El resultado es 7x³ + 9x² − 6x − 1.', hint: 'Cambiar el signo de 2q invierte cada término de q.', form: 'expanded', origin: '(x^3+3*x^2+2*x+5)-2*(-3*x^3-3*x^2+4*x+3)' },
  { catalogId: 'precalculo-33-2e', lesson: 'Multiplicación y productos notables', type: 'algebra', prompt: 'Con p(x) = x³ + 3x² + 2x + 5 y r(x) = x³ − 2x², calculá p(x)·r(x) desarrollado.', answer: 'x^6+x^5-4*x^4+x^3-10*x^2', explanation: 'r(x) = x²(x − 2). Al distribuir p se obtiene x⁶ + x⁵ − 4x⁴ + x³ − 10x².', hint: 'Distribuí cada término de p sobre x³ − 2x².', form: 'expanded', origin: '(x^3+3*x^2+2*x+5)*(x^3-2*x^2)' },
  { catalogId: 'precalculo-33-2f', lesson: 'Multiplicación y productos notables', type: 'algebra', prompt: 'Con q(x) = −3x³ − 3x² + 4x + 3 y r(x) = x³ − 2x², calculá q(x)·r(x) desarrollado.', answer: '-3*x^6+3*x^5+10*x^4-5*x^3-6*x^2', explanation: 'Cada término de q por x³ y por −2x² produce −3x⁶ + 3x⁵ + 10x⁴ − 5x³ − 6x².', hint: 'Hay cuatro términos en q y dos en r: son ocho productos.', form: 'expanded', origin: '(-3*x^3-3*x^2+4*x+3)*(x^3-2*x^2)' },
  { catalogId: 'precalculo-42-2b', lesson: 'Trinomios y diferencias de cuadrados', type: 'choice', prompt: '¿Cómo factoriza x² + 3x − 7 sobre los enteros?', answer: 'No tiene factores lineales enteros', explanation: 'El discriminante es 9 + 28 = 37, que no es un cuadrado perfecto. Inspeccionar pares de enteros no alcanza.', hint: 'Calculá b² − 4ac antes de inventar factores.', options: ['No tiene factores lineales enteros', '(x + 7)(x − 1)', '(x + 1)(x + 3)'] },
  { catalogId: 'precalculo-42-2d', lesson: 'Trinomios y diferencias de cuadrados', type: 'algebra', prompt: 'Factorizá 9x² − 3xy − 2y².', answer: '(3*x-2*y)*(3*x+y)', explanation: '3x por 3x da 9x²; los cruzados 3xy y −6xy suman −3xy; (−2y)(y) = −2y².', hint: 'Buscá dos binomios cuyos primeros términos den 9x².', form: 'product', origin: '9*x^2-3*x*y-2*y^2' },
  { catalogId: 'precalculo-42-2f', lesson: 'Trinomios y diferencias de cuadrados', type: 'algebra', prompt: 'Factorizá x² + 4x + 3.', answer: '(x+1)*(x+3)', explanation: '1 y 3 suman 4 y multiplican 3.', hint: 'Buscá dos enteros que sumen 4 y multipliquen 3.', form: 'product', origin: 'x^2+4*x+3' },
  { catalogId: 'precalculo-42-2g', lesson: 'Trinomios y diferencias de cuadrados', type: 'algebra', prompt: 'Factorizá x² − 10x + 24.', answer: '(x-4)*(x-6)', explanation: '−4 y −6 suman −10 y multiplican 24.', hint: 'Los dos números son negativos porque la suma es negativa y el producto positivo.', form: 'product', origin: 'x^2-10*x+24' },
  { catalogId: 'precalculo-42-2h', lesson: 'Trinomios y diferencias de cuadrados', type: 'algebra', prompt: 'Factorizá 2x² − x − 3.', answer: '(2*x-3)*(x+1)', explanation: '2x por x da 2x²; los cruzados 2x y −3x suman −x; (−3)(1) = −3.', hint: 'El 2 del primer coeficiente tiene que ir en uno de los binomios.', form: 'product', origin: '2*x^2-x-3' },
  { catalogId: 'precalculo-42-2i', lesson: 'Trinomios y diferencias de cuadrados', type: 'algebra', prompt: 'Factorizá 16x − 5 − 3x².', answer: '(3*x-1)*(5-x)', explanation: 'Reordená como −3x² + 16x − 5. (3x − 1)(5 − x) recupera ese trinomio.', hint: 'Ordená primero por potencias de x. El coeficiente principal es −3.', form: 'product', origin: '-3*x^2+16*x-5' },
  { catalogId: 'precalculo-42-1p', lesson: 'Factorización completa', type: 'algebra', prompt: 'Factorizá a² − 2a + b² + 2b − 2ab.', answer: '(a-b)*(a-b-2)', explanation: 'Es (a − b)² − 2(a − b). El factor común a − b deja (a − b − 2).', hint: 'Agrupá los términos que forman (a − b)².', form: 'product', origin: 'a^2-2*a+b^2+2*b-2*a*b' },
  { catalogId: 'precalculo-42-1q', lesson: 'Suma y diferencia de cubos', type: 'algebra', prompt: 'Factorizá −8a³ + 36a² − 54a + 27.', answer: '(3-2*a)^3', explanation: '(2a − 3)³ = 8a³ − 36a² + 54a − 27. El polinomio es el opuesto, o sea (3 − 2a)³.', hint: 'Compará con el cubo de un binomio de la forma (pa + q)³.', form: 'product', origin: '-8*a^3+36*a^2-54*a+27' },
  { catalogId: 'precalculo-42-1r', lesson: 'Factor común y agrupación', type: 'algebra', prompt: 'Factorizá xa³ + 3xa²b + 3xab² + xb³.', answer: 'x*(a+b)^3', explanation: 'x es factor común y lo que queda es el cubo de a + b.', hint: 'Sacá x y reconocé los coeficientes 1, 3, 3, 1.', form: 'product', origin: 'x*a^3+3*x*a^2*b+3*x*a*b^2+x*b^3' },
  { catalogId: 'precalculo-52-1b', lesson: 'División sintética', type: 'algebra', prompt: 'Factorizá 2x³ − 5x² + 2x − 5 usando una raíz racional.', answer: '(2*x-5)*(x^2+1)', explanation: 'x = 5/2 anula el polinomio. El cociente es 2x² + 2 = 2(x² + 1), y x² + 1 no tiene raíces reales.', hint: 'Probá candidatos p/q entre los factores de 5 y de 2.', form: 'product', origin: '2*x^3-5*x^2+2*x-5' },
  { catalogId: 'precalculo-52-1c', lesson: 'División sintética', type: 'algebra', prompt: 'Factorizá −8x³ + 14x² − 7x + 1.', answer: '(x-1)*(1-2*x)*(4*x-1)', explanation: 'x = 1 es raíz. El cociente −8x² + 6x − 1 = −(2x − 1)(4x − 1).', hint: 'Probá x = 1 y después el discriminante del cociente cuadrático.', form: 'product', origin: '-8*x^3+14*x^2-7*x+1' },
  { catalogId: 'precalculo-52-1d', lesson: 'División sintética', type: 'algebra', prompt: 'Factorizá 3x³ + 7x² + x − 2.', answer: '(x+2)*(3*x^2+x-1)', explanation: 'x = −2 es raíz. El cociente 3x² + x − 1 tiene discriminante 13 y no factoriza más en enteros.', hint: 'Los candidatos enteros son los divisores de 2.', form: 'product', origin: '3*x^3+7*x^2+x-2' },
  { catalogId: 'precalculo-52-1g', lesson: 'División sintética', type: 'algebra', prompt: 'Factorizá 4x⁴ − 8x³ + 5x² − x.', answer: 'x*(x-1)*(2*x-1)^2', explanation: 'Hay factor x. En el cúbico, x = 1 es raíz y el cociente es (2x − 1)².', hint: 'Sacá x y buscá una raíz racional del factor cúbico.', form: 'product', origin: '4*x^4-8*x^3+5*x^2-x' },
  { catalogId: 'discreta-93-6a', lesson: 'Cuantificadores anidados', type: 'choice', prompt: 'En los enteros, ¿es verdad que existe un y tal que todo x cumple x = y + 1?', answer: 'Falso', explanation: 'Un solo y no puede ser el anterior de todos los enteros. El existencial de afuera es demasiado fuerte.', hint: 'Leé el cuantificador de la izquierda primero.', options: ['Verdadero', 'Falso'] },
  { catalogId: 'discreta-93-6b', lesson: 'Cuantificadores anidados', type: 'choice', prompt: 'En los enteros, ¿es verdad que para todo x existe un y tal que x = y + 1?', answer: 'Verdadero', explanation: 'Para cada x podés elegir y = x − 1. El testigo puede depender de x.', hint: 'El existencial está adentro: el testigo puede cambiar con x.', options: ['Verdadero', 'Falso'] },
  { catalogId: 'discreta-93-6c', lesson: 'Cuantificadores anidados', type: 'choice', prompt: 'En los reales, ¿existe un y tal que todo x cumple 2x + 3y = 1?', answer: 'Falso', explanation: 'Si y estuviera fijo, 2x + 3y cambia cuando cambia x y no puede valer 1 para todos.', hint: 'Despejá x y preguntate si puede ser el mismo y para dos valores distintos de x.', options: ['Verdadero', 'Falso'] },
];

function problemOf(catalogId: string): OpenBookProblem {
  const course: Course = catalogId.startsWith('discreta') ? 'discreta' : 'precalculo';
  const problem = bookCatalog[course].find(item => item.id === catalogId);
  if (!problem?.visuals[0]) throw new Error(`Falta el inciso ${catalogId} en el catálogo.`);
  return problem;
}

export const extraBookExercises: ExtraBookExercise[] = rows.map(row => {
  const problem = problemOf(row.catalogId);
  const exercise = `${problem.number}${problem.part}`;
  const id = `${problem.course}-libro-extra-${problem.page}-${exercise}`;
  const answer = String(row.answer);
  const requiredForm = row.form === 'expanded' ? 'expanded' as const
    : row.form === 'product' ? (isLinearFactorization(answer) ? 'linearFactors' as const : 'factored' as const)
    : undefined;
  if (row.form === 'product' && !isFactored(answer)) throw new Error(`La clave de ${id} no está factorizada.`);
  if (row.origin) solutionOrigins[id] = row.origin;
  const question: Question = {
    id, type: row.type, prompt: row.prompt, answer: row.answer, explanation: row.explanation,
    hints: [row.hint, row.explanation], tag: row.lesson, difficulty: row.difficulty ?? (row.form === 'product' ? 2 : 1),
    options: row.options, universe: row.universe, requiredForm, math: problem.math ?? undefined,
    bookSource: {
      course: problem.course, page: problem.page, printedPage: problem.printedPage,
      section: `${problem.sectionCode} · ${problem.section}`, exercise, crop: problem.visuals[0].crop,
    },
  };
  return { course: problem.course, lessonTitle: row.lesson, question };
});
