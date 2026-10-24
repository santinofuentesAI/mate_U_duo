import type { Course } from './types';
import { algebraRules } from './algebraRules';
import { levelBrief } from './levelBrief';

export interface LogicTableSpec {
  id: string;
  title: string;
  expr: string;
  variables: string[];
}

export const logicTables: LogicTableSpec[] = [
  { id: 'not', title: 'Negación', expr: '¬P', variables: ['P'] },
  { id: 'and', title: 'Conjunción', expr: 'P∧Q', variables: ['P', 'Q'] },
  { id: 'or', title: 'Disyunción', expr: 'P∨Q', variables: ['P', 'Q'] },
  { id: 'imp', title: 'Implicación', expr: 'P→Q', variables: ['P', 'Q'] },
  { id: 'iff', title: 'Bicondicional', expr: 'P↔Q', variables: ['P', 'Q'] },
  { id: 'xor', title: 'Exclusiva', expr: 'P⊻Q', variables: ['P', 'Q'] },
];

export interface TableFamily {
  id: string;
  title: string;
}

export interface LevelNote { name: string; formula: string; why: string; }

export interface LevelReference {
  heading: string;
  about: string[];
  logicIds: string[];
  algebraIds: string[];
  notes: LevelNote[];
}

const countNotes: LevelNote[] = [
  { name: 'Vacío', formula: '\\emptyset', why: 'No tiene elementos. |∅| = 0. Está incluido en cualquier conjunto y es uno de los elementos de P(A).' },
  { name: 'Conjunto potencia', formula: '|P(A)|=2^{|A|}', why: 'Cada elemento entra o no entra. P(A) incluye el vacío y el propio A.' },
  { name: 'Producto cartesiano', formula: '|A\\times B|=|A|\\cdot|B|', why: 'Pares ordenados. (a, b) y (b, a) son distintos si a ≠ b.' },
  { name: 'Diferencia', formula: '|A-B|=|A|-|A\\cap B|', why: 'Se quitan los elementos de A que también están en B.' },
  { name: 'Unión de tres', formula: '|A\\cup B\\cup C|=|A|+|B|+|C|-|A\\cap B|-|A\\cap C|-|B\\cap C|+|A\\cap B\\cap C|', why: 'Se resta lo contado dos veces y se devuelve el triple, que se había restado de más.' },
];

const setNotes: LevelNote[] = [
  { name: 'Vacío', formula: '\\emptyset', why: 'El conjunto sin elementos. ∅ ⊆ A siempre. ∅ ∈ A solo si el vacío es uno de los objetos de A.' },
  { name: 'Unión', formula: 'A\\cup B', why: 'Lo que está en A, en B o en ambos.' },
  { name: 'Intersección', formula: 'A\\cap B', why: 'Lo que está en los dos a la vez.' },
  { name: 'Diferencia', formula: 'A-B', why: 'Lo de A que no está en B. No es el complemento.' },
  { name: 'Complemento', formula: 'A^{c}', why: 'Lo del universo que queda fuera de A.' },
  { name: 'De Morgan', formula: '(A\\cup B)^{c}=A^{c}\\cap B^{c}', why: 'Estar fuera de la unión es estar fuera de los dos.' },
  { name: 'Inclusión-exclusión', formula: '|A\\cup B|=|A|+|B|-|A\\cap B|', why: 'La intersección se había contado dos veces.' },
];

const quantNotes: LevelNote[] = [
  { name: 'Para todo', formula: '\\forall x\\,P(x)', why: 'Todos los elementos del universo cumplen P. Un contraejemplo lo niega.' },
  { name: 'Existe', formula: '\\exists x\\,P(x)', why: 'Alcanza un testigo. No significa exactamente uno.' },
  { name: 'Negar el universal', formula: '\\neg\\forall x\\,P(x)\\equiv\\exists x\\,\\neg P(x)', why: 'No todos cumplen cuando alguien falla.' },
  { name: 'Negar el existencial', formula: '\\neg\\exists x\\,P(x)\\equiv\\forall x\\,\\neg P(x)', why: 'Nadie cumple cuando todos fallan.' },
];

const relationNotes: LevelNote[] = [
  { name: 'Gráfico', formula: 'G\\subseteq A\\times B', why: 'La relación es (G, A, B). aRb significa (a, b) ∈ G. Un a puede ir a varios b, a uno, o a ninguno.' },
  { name: 'Dominio', formula: 'D_R=\\{a\\in A\\mid\\exists b:\\,aRb\\}', why: 'Los de A que salen hacia alguien de B.' },
  { name: 'Ámbito', formula: 'R[A]=\\{b\\in B\\mid\\exists a:\\,aRb\\}', why: 'Los de B que reciben alguna flecha.' },
  { name: 'Inversa', formula: 'G^{-1}=\\{(b,a)\\mid(a,b)\\in G\\}', why: 'Se dan vuelta los pares. El emisor y el receptor se intercambian.' },
  { name: 'Composición', formula: 'S\\circ R', why: 'Hay un puente: aRb y bSc producen (a, c). El receptor de R es el emisor de S.' },
];

const functionNotes: LevelNote[] = [
  { name: 'Función', formula: 'f:A\\to B', why: 'A cada x del dominio le corresponde a lo sumo una imagen. Puede no tener imagen; no puede tener dos.' },
  { name: 'Dominio máximo', formula: 'x\\in\\mathbb R', why: 'Denominador ≠ 0. Raíz de índice par con radicando ≥ 0. El cubo no pide eso.' },
  { name: 'A trozos', formula: 'f(x)=\\begin{cases}\\ldots\\end{cases}', why: 'Se usa la pieza cuyo intervalo contiene a x. El extremo que lleva ≤ entra en esa pieza.' },
];

const factorNotes: LevelNote[] = [
  { name: 'Término del cociente', formula: '\\dfrac{a_n x^{n}}{b_k x^{k}}', why: 'Se dividen solo los términos de adelante. Ese cociente se elige para cancelar el de mayor grado. Si no se cancela, el término está mal.' },
  { name: 'Identidad', formula: 'P=DQ+R', why: 'Se para cuando el grado del resto es menor que el del divisor. Comprobá: divisor × cociente + resto vuelve al dividendo.' },
  { name: 'Sintética r', formula: 'x-r', why: 'x − 3 usa r = 3. x + 2 usa r = −2. Se SUMA en cada columna porque el signo de r ya resta.' },
  { name: 'Resto P(r)', formula: 'P(r)', why: 'El último de la fila es el resto y vale P(r). Si da 0, (x − r) divide exacto. El cociente son los números de antes, un grado menos.' },
];

const ineqNotes: LevelNote[] = [
  { name: 'Sentido', formula: 'ax+b>0', why: 'Sumar conserva el sentido. Multiplicar por un negativo lo invierte.' },
  { name: 'Abierto', formula: ']a,b[', why: 'No incluye los extremos. El corchete hacia afuera es el extremo abierto.' },
  { name: 'Cerrado', formula: '[a,b]', why: 'Incluye los extremos. La desigualdad no estricta los deja adentro.' },
  { name: 'Sin cota', formula: ']{-}\\infty,a]', why: '∞ no es un número. El extremo infinito queda abierto.' },
  { name: 'Vacío', formula: 'S=\\emptyset', why: 'Ningún número cumple. Pasa cuando, al cancelar la variable, queda una falsedad.' },
];

function aboutTopic(topic: string, fallback: string): string[] {
  const brief = levelBrief(topic);
  return brief.length ? brief : [fallback];
}

/** Tablas e información del nivel que se está viendo, no del curso entero. */
export function referenceFor(course: Course, topic: string): LevelReference {
  const text = topic.toLowerCase();
  switch (course) {
    case 'discreta':
      if (/relacion|gr[aá]fico|composici[oó]n/.test(text)) return { heading: 'Relaciones', about: aboutTopic(topic, 'Una relación es un gráfico dentro de un producto cartesiano. Unión, inversa y composición se hacen con pares.'), logicIds: [], algebraIds: [], notes: relationNotes };
      if (/potencia|producto|cardinal/.test(text)) return { heading: 'Potencia, producto y cardinal', about: aboutTopic(topic, 'P(A) reúne los subconjuntos de A. A × B reúne los pares ordenados. El cardinal cuenta elementos distintos.'), logicIds: [], algebraIds: [], notes: countNotes };
      if (/venn|conjunto|pertenencia|inclusi|intervalo|operacion|ley/.test(text)) return { heading: 'Conjuntos', about: aboutTopic(topic, 'Un conjunto junta objetos. Pertenecer es de un elemento; incluir es de un conjunto en otro. Las regiones de Venn separan solo A, la intersección y el exterior.'), logicIds: [], algebraIds: [], notes: setNotes };
      if (/cuantific|predicado|universal|existencial|anidado|matriz/.test(text)) return { heading: 'Cuantificadores', about: aboutTopic(topic, 'Un predicado tiene un lugar vacío. ∀ dice que todos cumplen; ∃ dice que al menos uno cumple. El universo decide sobre qué objetos se habla.'), logicIds: ['not', 'and', 'or', 'imp'], algebraIds: [], notes: quantNotes };
      return { heading: 'Lógica', about: aboutTopic(topic, 'Una proposición es verdadera o falsa. Los conectores arman frases compuestas y la tabla lista todos los casos.'), logicIds: logicTables.map(table => table.id), algebraIds: [], notes: [] };
    case 'precalculo':
      if (/funci[oó]n|dominio m[aá]ximo|lectura de gr[aá]ficas|variable real/.test(text)) return { heading: 'Funciones', about: aboutTopic(topic, 'Una función asigna a cada x una imagen o ninguna. El dominio máximo es donde la fórmula existe en ℝ.'), logicIds: [], algebraIds: ['equations'], notes: functionNotes };
      if (/inecuac/.test(text)) return { heading: 'Inecuaciones', about: aboutTopic(topic, 'Una inecuación pide el conjunto de números que hacen verdadera una desigualdad. El sentido se invierte al multiplicar por un negativo.'), logicIds: [], algebraIds: ['equations'], notes: ineqNotes };
      if (/radical|racionalizaci|valor absoluto|raíces y valor|raices y valor/.test(text)) return { heading: 'Raíces', about: aboutTopic(topic, 'La raíz cuadrada principal es no negativa. El valor absoluto es la distancia al cero.'), logicIds: [], algebraIds: ['roots'], notes: [] };
      if (/fraccion/.test(text)) return { heading: 'Fracciones', about: aboutTopic(topic, 'Una fracción es un cociente. El dominio excluye los ceros del denominador original, también después de simplificar.'), logicIds: [], algebraIds: ['fractions'], notes: [] };
      if (/factor|trinomio|cubo|sint[eé]tica|divisi[oó]n de polinomio|ra[ií]ces racionales/.test(text)) return { heading: 'Factorización', about: aboutTopic(topic, 'Factorizar es escribir una suma como producto. Una raíz r corresponde al factor (x − r).'), logicIds: [], algebraIds: ['factors'], notes: factorNotes };
      if (/notable|multiplic/.test(text)) return { heading: 'Productos notables', about: aboutTopic(topic, 'Un producto notable es un producto que se puede escribir de una vez. El cuadrado de una suma incluye el doble producto.'), logicIds: [], algebraIds: ['products'], notes: [] };
      if (/potencia/.test(text)) return { heading: 'Potencias', about: aboutTopic(topic, 'Una potencia repite la base como factor. Misma base: se suman exponentes en un producto y se restan en un cociente.'), logicIds: [], algebraIds: ['powers'], notes: [] };
      if (/ecuaci[oó]n|plantear|lineal|cuadr[aá]t|grado superior/.test(text)) return { heading: 'Ecuaciones', about: aboutTopic(topic, 'Una ecuación pide los valores que hacen verdadera una igualdad. El conjunto solución puede tener uno, varios o ningún número.'), logicIds: [], algebraIds: ['equations'], notes: [] };
      return { heading: 'Precálculo', about: aboutTopic(topic, 'Este nivel trabaja expresiones numéricas o algebraicas. La jerarquía y los paréntesis deciden el orden.'), logicIds: [], algebraIds: ['powers'], notes: [] };
    default: {
      const never: never = course;
      return never;
    }
  }
}

export function tableFamilies(course: Course): TableFamily[] {
  switch (course) {
    case 'discreta':
      return logicTables.map(table => ({ id: table.id, title: table.title }));
    case 'precalculo':
      return algebraRules.map(group => ({ id: group.id, title: group.title }));
    default: {
      const never: never = course;
      return never;
    }
  }
}
