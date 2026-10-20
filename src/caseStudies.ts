import type { Course, Question } from './types';

export interface CaseStudy {
  id: string;
  course: Course;
  weeks: string[];
  title: string;
  setting: string;
  story: string[];
  lessonTitle: string;
  question: Question;
}

function ask(
  id: string,
  type: Question['type'],
  prompt: string,
  answer: Question['answer'],
  explanation: string,
  extra: Partial<Question> = {},
): Question {
  return {
    id,
    type,
    prompt,
    answer,
    explanation,
    hints: ['Traducí el relato a un dato o una fórmula, y recién después calculá.', explanation],
    tag: 'Estudio de caso',
    difficulty: 2,
    ...extra,
  };
}

export const caseStudies: CaseStudy[] = [
  {
    id: 'caso-d-s1-cafe',
    course: 'discreta',
    weeks: ['S1'],
    title: 'El café que solo se entrega si pagás',
    setting: 'Cafetería del recinto',
    story: [
      'En el kiosco de la facultad, Milo anota una regla en un papelito: «Si la persona pagó, entonces le entregamos el café».',
      'P significa “pagó”. Q significa “recibe el café”. No prometen nada si alguien no pagó: la regla solo falla si cobraron y no entregaron.',
      'Pasá esa política a una fórmula. No inventes una causalidad extra: es implicación material, tal como en clase.',
    ],
    lessonTitle: 'Implicación y bicondicional',
    question: ask('caso-d-s1-cafe-q', 'logic', 'Escribí la política del kiosco: si P (pagó), entonces Q (recibe el café).', 'P→Q', 'La condición suficiente se escribe P → Q. Solo es falsa en VF.'),
  },
  {
    id: 'caso-d-s1-acceso',
    course: 'discreta',
    weeks: ['S1'],
    title: 'La puerta del laboratorio',
    setting: 'Laboratorio de cómputo',
    story: [
      'El laboratorio abre si tenés carné y también el código del día. Falta una de las dos cosas y la puerta no se mueve.',
      'P: “tiene carné”. Q: “tiene el código”. Las dos tienen que valer a la vez.',
      'Esa es una conjunción, no una disyunción: no basta con una sola credencial.',
    ],
    lessonTitle: 'Proposiciones y conectores',
    question: ask('caso-d-s1-acceso-q', 'logic', 'Escribí la condición para que abra la puerta: carné y código.', 'P∧Q', 'La “y” de ambas credenciales es P ∧ Q.'),
  },
  {
    id: 'caso-d-s1-tabla',
    course: 'discreta',
    weeks: ['S1'],
    title: 'La garantía de la tienda',
    setting: 'Tienda de celulares',
    story: [
      'La tienda publica: «Si el aparato está defectuoso, se hace el reembolso». P es defecto, Q es reembolso.',
      'Un cliente reclama que la frase es una trampa. Para decidirlo hay que mirar las cuatro combinaciones de verdad, no una anécdota.',
      'Completá la tabla de P → Q en el orden VV, VF, FV, FF. Ahí se ve cuándo la promesa se rompe.',
    ],
    lessonTitle: 'Tablas de verdad',
    question: ask('caso-d-s1-tabla-q', 'table', 'Completá P → Q en orden VV, VF, FV, FF.', ['V', 'F', 'V', 'V'], 'La única fila falsa es VF: hubo defecto y no hubo reembolso.', { expression: 'P→Q', variables: ['P', 'Q'], difficulty: 1 }),
  },
  {
    id: 'caso-d-s2-alarma',
    course: 'discreta',
    weeks: ['S2'],
    title: 'La alarma en serie',
    setting: 'Depósito de una pyme',
    story: [
      'En el depósito hay dos interruptores, P y Q, uno detrás del otro en la misma rama. La sirena solo suena si los dos conducen.',
      'En clase eso se modela con una serie: no alcanza con que uno esté cerrado.',
      'Escribí la salida del circuito. 1 significa conduce.',
    ],
    lessonTitle: 'Circuitos lógicos',
    question: ask('caso-d-s2-alarma-q', 'logic', 'Dos interruptores P y Q en serie. Escribí la salida de la alarma.', 'P∧Q', 'Una serie exige las dos entradas. Eso es P ∧ Q.'),
  },
  {
    id: 'caso-d-s3-stock',
    course: 'discreta',
    weeks: ['S3'],
    title: 'El inventario que se quedó en cero',
    setting: 'Bodega de una ferretería',
    story: [
      'La ferretería revisa U = {1, 2, 3}: tres códigos de tornillo. P(x) dice “el código x tiene stock 0”.',
      'El código 2 está en cero; 1 y 3 todavía tienen cajas. Al dueño le basta un testigo para decir que hay un faltante.',
      '¿Es verdadero ∃x ∈ U: P(x)?',
    ],
    lessonTitle: 'Universal y existencial',
    question: ask('caso-d-s3-stock-q', 'choice', 'U={1,2,3} y P(2) es V. ¿Es verdadero ∃x ∈ U: P(x)?', 'V', 'Un solo testigo alcanza para el existencial.', { options: ['V', 'F'], difficulty: 1 }),
  },
  {
    id: 'caso-d-s5-encuesta',
    course: 'discreta',
    weeks: ['S4', 'S5'],
    title: 'La encuesta de dos servicios',
    setting: 'Cooperativa de internet',
    story: [
      'La cooperativa pregunta a sus asociados: 80 tienen televisión (A), 60 tienen internet (B) y 30 tienen ambos.',
      'La gerencia quiere el número que tiene al menos uno de los dos, no el diagrama pintado.',
      'Eso es inclusión-exclusión de dos conjuntos: sumá y restá la intersección, que estaba contada dos veces.',
    ],
    lessonTitle: 'Regiones de Venn',
    question: ask('caso-d-s5-encuesta-q', 'text', '80 en A, 60 en B y 30 en ambas. ¿Cuántos están en al menos un servicio?', '110', '|A ∪ B| = 80 + 60 − 30 = 110.', { difficulty: 1 }),
  },
  {
    id: 'caso-d-s6-sku',
    course: 'discreta',
    weeks: ['S6'],
    title: 'Los códigos y los tamaños',
    setting: 'Taller de camisetas',
    story: [
      'El taller imprime 4 diseños (C) en 3 tallas (L): Bajo, Medio y Alto. Cada par (diseño, talla) es una etiqueta distinta.',
      'No es un subconjunto: es un producto cartesiano. El orden importa: (c1, Alto) no es lo mismo que mezclar los conjuntos.',
      'Calculá cuántas etiquetas distintas hay.',
    ],
    lessonTitle: 'Conjunto potencia y producto',
    question: ask('caso-d-s6-sku-q', 'text', '4 diseños y 3 tallas. Calculá |C × L|.', '12', 'La regla del producto: 4 · 3 = 12.', { difficulty: 1 }),
  },
  {
    id: 'caso-d-s6-potencia',
    course: 'discreta',
    weeks: ['S6'],
    title: 'Los menús de la soda',
    setting: 'Soda de cuatro extras',
    story: [
      'La soda ofrece 4 extras opcionales: queso, chile, huevo y aguacate. Cada extra se pone o no se pone.',
      'Un pedido es un subconjunto de esos cuatro extras, incluido no pedir ninguno.',
      '¿Cuántos pedidos distintos hay? Eso es |P(A)| con |A| = 4.',
    ],
    lessonTitle: 'Conjunto potencia y producto',
    question: ask('caso-d-s6-potencia-q', 'text', 'Un conjunto tiene 4 extras. Calculá |P(A)|.', '16', '2⁴ = 16, contando el vacío.', { difficulty: 1 }),
  },
  {
    id: 'caso-p-b1-potencias',
    course: 'precalculo',
    weeks: ['B1'],
    title: 'El inventario que se compacta',
    setting: 'Bodega de cables',
    story: [
      'Una bodega mide rollos con la misma base x. Juntan x³ con x² y después los parten en grupos de x⁴, con x ≠ 0.',
      'Eso no es un cuento de unidades: es el producto y el cociente de potencias de igual base.',
      'Simplificá x³ · x² / x⁴. El cero de x queda fuera porque dividieron.',
    ],
    lessonTitle: 'Leyes de potencias',
    question: ask('caso-p-b1-potencias-q', 'algebra', 'Simplificá x³ · x² / x⁴, con x ≠ 0.', 'x', '3 + 2 − 4 = 1. Queda x, con x ≠ 0.', { exclusions: ['0'], difficulty: 1 }),
  },
  {
    id: 'caso-p-b3-factor',
    course: 'precalculo',
    weeks: ['B2', 'B3'],
    title: 'El marco que se desarma',
    setting: 'Taller de marcos',
    story: [
      'El área de un marco cuadrado menos un hueco cuadrado se escribe 9x² − 4. Quieren cortar dos tiras, no dejar la diferencia.',
      'Reconocé una diferencia de cuadrados: (3x)² − 2².',
      'Factorizá como producto de binomios. Después se puede comprobar multiplicando.',
    ],
    lessonTitle: 'Trinomios y diferencias de cuadrados',
    question: ask('caso-p-b3-factor-q', 'algebra', 'Factorizá 9x² − 4 como producto de binomios.', '(3x-2)*(3x+2)', 'Diferencia de cuadrados: (3x − 2)(3x + 2).', { requiredForm: 'factored' }),
  },
  {
    id: 'caso-p-s4-sintetica',
    course: 'precalculo',
    weeks: ['S4', 'B3'],
    title: 'El costo que se prueba con una raíz',
    setting: 'Taller de impresión',
    story: [
      'El costo de un tiraje se modela con 2x³ − 7x² + 2x + 3. Alguien afirma que x = 1 anula el costo extra, o sea que (x − 1) divide al polinomio.',
      'No hay que adivinar: se prueba con división sintética. Coeficientes 2, −7, 2, 3 y r = 1.',
      'Completá la fila final. Si el resto es 0, la afirmación del taller es cierta.',
    ],
    lessonTitle: 'División sintética',
    question: ask('caso-p-s4-sintetica-q', 'synthetic', 'Completá la fila final al dividir 2x³ − 7x² + 2x + 3 por x − 1.', ['2', '-5', '-3', '0'], 'Bajá 2; −7 + 2 = −5; 2 − 5 = −3; 3 − 3 = 0.', { coefficients: [2, -7, 2, 3], root: 1 }),
  },
  {
    id: 'caso-p-s4-simplificar',
    course: 'precalculo',
    weeks: ['S4'],
    title: 'La tarifa que se cancela de más',
    setting: 'App de envíos',
    story: [
      'La app escribe una tarifa (x² − 1)/(x − 1). Un programador cancela x − 1 y deja x + 1, pero x = 1 nunca fue un envío válido.',
      'Sí se cancelan factores, no términos. El dominio original conserva el agujero.',
      'Simplificá la fracción. El 1 excluido se indica aparte, no se borra de la historia.',
    ],
    lessonTitle: 'Fracciones y dominio',
    question: ask('caso-p-s4-simplificar-q', 'algebra', 'Simplificá (x² − 1)/(x − 1). Indicá el valor excluido.', 'x+1', 'x² − 1 = (x − 1)(x + 1). x = 1 sigue fuera.', { exclusions: ['1'] }),
  },
];

export const caseExercises = caseStudies.map(item => ({
  course: item.course,
  lessonTitle: item.lessonTitle,
  question: item.question,
}));

export function casesFor(course: Course, weeks: string[]): CaseStudy[] {
  const wanted = new Set(weeks);
  return caseStudies.filter(item => item.course === course && item.weeks.some(week => wanted.has(week)));
}

export function caseWeeks(course: Course): string[] {
  return [...new Set(caseStudies.filter(item => item.course === course).flatMap(item => item.weeks))].sort();
}
