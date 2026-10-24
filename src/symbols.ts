import type { Course } from './types';

export interface CourseSymbol {
  id: string;
  latex: string;
  name: string;
  meaning: string;
}

export interface SymbolGroup {
  id: string;
  title: string;
  items: CourseSymbol[];
}

const discrete: SymbolGroup[] = [
  {
    id: 'connectives',
    title: 'Conectores',
    items: [
      { id: 'not', latex: '\\neg P', name: 'Negación', meaning: 'Invierte el valor. ¬V es F. ¬F es V.' },
      { id: 'and', latex: 'P\\land Q', name: 'Y', meaning: 'V solo si las dos son V.' },
      { id: 'or', latex: 'P\\lor Q', name: 'O inclusiva', meaning: 'V si al menos una es V. También si las dos lo son.' },
      { id: 'xor', latex: 'P\\oplus Q', name: 'O exclusiva', meaning: 'V si exactamente una es V.' },
      { id: 'imp', latex: 'P\\to Q', name: 'Implicación', meaning: 'Falsa solo en VF: P vale y Q no.' },
      { id: 'iff', latex: 'P\\leftrightarrow Q', name: 'Bicondicional', meaning: 'V cuando P y Q coinciden.' },
    ],
  },
  {
    id: 'quantifiers',
    title: 'Cuantificadores',
    items: [
      { id: 'forall', latex: '\\forall x\\,P(x)', name: 'Para todo', meaning: 'Todos los valores del universo cumplen P. Un contraejemplo alcanza para negarlo.' },
      { id: 'exists', latex: '\\exists x\\,P(x)', name: 'Existe', meaning: 'Basta un testigo. No significa exactamente uno.' },
    ],
  },
  {
    id: 'sets',
    title: 'Conjuntos',
    items: [
      { id: 'in', latex: 'x\\in A', name: 'Pertenece', meaning: 'x es un elemento de A.' },
      { id: 'union', latex: 'A\\cup B', name: 'Unión', meaning: 'Lo que está en A, en B, o en ambos.' },
      { id: 'inter', latex: 'A\\cap B', name: 'Intersección', meaning: 'Solo lo que está en A y en B.' },
      { id: 'empty', latex: '\\varnothing', name: 'Vacío', meaning: 'El conjunto sin elementos.' },
      { id: 'comp', latex: 'A^{c}', name: 'Complemento', meaning: 'Lo que está en el universo y no en A. El universo hay que decirlo.' },
      { id: 'power', latex: '\\mathcal{P}(A)', name: 'Conjunto potencia', meaning: 'Todos los subconjuntos de A, incluido ∅ y A.' },
      { id: 'prod', latex: 'A\\times B', name: 'Producto cartesiano', meaning: 'Pares ordenados (a, b) con a ∈ A y b ∈ B.' },
      { id: 'card', latex: '|A|', name: 'Cardinal', meaning: 'Cuántos elementos distintos hay. ℕ en esta app incluye 0.' },
    ],
  },
  {
    id: 'relations',
    title: 'Relaciones',
    items: [
      { id: 'rel', latex: 'aRb', name: 'Relacionado', meaning: '(a, b) está en el gráfico. Un a puede ir a varios b, a uno, o a ninguno.' },
      { id: 'inv', latex: 'R^{-1}', name: 'Inversa', meaning: 'Da vuelta cada par. El emisor y el receptor se intercambian.' },
      { id: 'compose', latex: 'S\\circ R', name: 'Composición', meaning: 'Hay un puente: aRb y bSc producen (a, c).' },
    ],
  },
];

const precalc: SymbolGroup[] = [
  {
    id: 'products',
    title: 'Productos notables',
    items: [
      { id: 'sqsum', latex: '(a+b)^{2}=a^{2}+2ab+b^{2}', name: 'Cuadrado de una suma', meaning: 'El 2ab no se pierde. No es a² + b².' },
      { id: 'sqdiff', latex: '(a-b)^{2}=a^{2}-2ab+b^{2}', name: 'Cuadrado de una diferencia', meaning: 'El último cuadrado sigue positivo.' },
      { id: 'diffsq', latex: 'a^{2}-b^{2}=(a-b)(a+b)', name: 'Diferencia de cuadrados', meaning: 'Conjugados. Factorizar es un producto.' },
      { id: 'cubesum', latex: 'a^{3}+b^{3}=(a+b)(a^{2}-ab+b^{2})', name: 'Suma de cubos', meaning: 'El producto del medio es negativo.' },
      { id: 'cubediff', latex: 'a^{3}-b^{3}=(a-b)(a^{2}+ab+b^{2})', name: 'Diferencia de cubos', meaning: 'El producto del medio es positivo.' },
    ],
  },
  {
    id: 'fractions',
    title: 'Fracciones y dominio',
    items: [
      { id: 'cancel', latex: '\\dfrac{ab}{ac}=\\dfrac{b}{c}', name: 'Cancelar factores', meaning: 'Factorizá antes. No taches sumandos. Conservá a ≠ 0.' },
      { id: 'abs', latex: '\\sqrt{x^{2}}=|x|', name: 'Raíz de un cuadrado', meaning: 'La raíz principal no es negativa.' },
    ],
  },
  {
    id: 'synthetic',
    title: 'División sintética',
    items: [
      { id: 'pr', latex: 'P(r)=0', name: 'Raíz', meaning: 'Si el resto es 0, (x − r) divide a P. Probá candidatos p/q; no adivines r.' },
      { id: 'zeros', latex: 'x^{3}+0x^{2}+x-1', name: 'Ceros que faltan', meaning: 'Potencias descendentes. Un término ausente es un 0 en la fila.' },
    ],
  },
  {
    id: 'functions',
    title: 'Funciones',
    items: [
      { id: 'fun', latex: 'f:A\\to B', name: 'Función', meaning: 'A cada x le corresponde una imagen o ninguna, nunca dos.' },
      { id: 'dom', latex: '\\mathrm{Dom}(f)', name: 'Dominio máximo', meaning: 'Denominador ≠ 0. Raíz par con radicando ≥ 0.' },
    ],
  },
];

export function symbolGroups(course: Course): SymbolGroup[] {
  switch (course) {
    case 'discreta': return discrete;
    case 'precalculo': return precalc;
    default: {
      const never: never = course;
      return never;
    }
  }
}

export function allSymbols(course: Course): CourseSymbol[] {
  return symbolGroups(course).flatMap(group => group.items);
}
