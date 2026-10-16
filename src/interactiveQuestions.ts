// Interactive exercise questions for Phase 5c types
import type { Question } from './types';

// Helper to create interactive questions with unique IDs
const interactive = (type: Question['type'], prompt: string, explanation: string, extra: any): Question => ({
  id: '', // Will be set when added to lesson
  type,
  prompt,
  answer: ['interactive'],
  explanation,
  hints: ['Revisá la definición del concepto.', 'Probá con ejemplos concretos.', explanation],
  tag: '',
  difficulty: 2,
  topic: extra.topic || '',
  ...extra
});

// 1. PROOFBUILDER (Discreta: Lógica proposicional, Inferencia)
export const proofBuilderQuestions: Question[] = [
  interactive('proofbuilder', 'Demostrá Q a partir de las premisas: P → Q, P ∨ R, ¬R', 
    'Primero usá silogismo disyuntivo con P ∨ R y ¬R para obtener P. Luego aplicá modus ponens con P → Q para concluir Q.',
    {
      topic: 'inferencia',
      premises: ['P → Q', 'P ∨ R', '¬R'],
      answer: 'Q',
      validSteps: [
        { expression: 'P', rule: 'Silogismo disyuntivo', hint: 'De P ∨ R y ¬R' },
        { expression: 'Q', rule: 'Modus ponens', hint: 'De P → Q y P' }
      ]
    }
  ),
  
  interactive('proofbuilder', 'Demostrá ¬P a partir de: P → Q, Q → R, ¬R',
    'Primero aplicá modus tollens con Q → R y ¬R para obtener ¬Q. Luego aplicá modus tollens con P → Q y ¬Q para obtener ¬P.',
    {
      topic: 'inferencia',
      premises: ['P → Q', 'Q → R', '¬R'],
      answer: '¬P',
      validSteps: [
        { expression: '¬Q', rule: 'Modus tollens', hint: 'De Q → R y ¬R' },
        { expression: '¬P', rule: 'Modus tollens', hint: 'De P → Q y ¬Q' }
      ]
    }
  ),
  
  interactive('proofbuilder', 'Demostrá T a partir de: P ∨ Q, P → S, Q → T, ¬S',
    'De P → S y ¬S obtenés ¬P por modus tollens. De P ∨ Q y ¬P obtenés Q por silogismo disyuntivo. De Q → T y Q obtenés T por modus ponens.',
    {
      topic: 'inferencia',
      premises: ['P ∨ Q', 'P → S', 'Q → T', '¬S'],
      answer: 'T',
      validSteps: [
        { expression: '¬P', rule: 'Modus tollens', hint: 'De P → S y ¬S' },
        { expression: 'Q', rule: 'Silogismo disyuntivo', hint: 'De P ∨ Q y ¬P' },
        { expression: 'T', rule: 'Modus ponens', hint: 'De Q → T y Q' }
      ]
    }
  )
];

// 2. INTERACTIVE-TABLE (Discreta: Tablas de verdad)
export const interactiveTableQuestions: Question[] = [
  interactive('interactive-table', 'Completá la tabla de verdad para (P ∧ Q) → R',
    'Una implicación solo es falsa cuando el antecedente es verdadero y el consecuente es falso. Calculá primero P ∧ Q, luego la implicación completa.',
    {
      topic: 'tablas-de-verdad',
      expression: '(P∧Q)→R',
      variables: ['P', 'Q', 'R']
    }
  ),
  
  interactive('interactive-table', 'Completá la tabla de verdad para ¬(P ∨ Q)',
    'Primero calculá P ∨ Q, que es verdadera cuando al menos una proposición es verdadera. Luego negá el resultado.',
    {
      topic: 'tablas-de-verdad',
      expression: '¬(P∨Q)',
      variables: ['P', 'Q']
    }
  ),
  
  interactive('interactive-table', 'Completá la tabla de verdad para (P → Q) ∧ (Q → P)',
    'Esta es la definición del bicondicional. Calculá cada implicación por separado, luego hacé la conjunción de ambas.',
    {
      topic: 'tablas-de-verdad',
      expression: '(P→Q)∧(Q→P)',
      variables: ['P', 'Q']
    }
  )
];

// 3. ORDER-STEPS (Discreta: Demostraciones)
export const orderStepsQuestions: Question[] = [
  interactive('order-steps', 'Ordená los pasos de la demostración de R desde: P → Q, Q → R, P',
    'El orden lógico debe seguir las dependencias: primero usá P y P → Q para obtener Q, luego usá Q y Q → R para obtener R.',
    {
      topic: 'demostraciones',
      steps: [
        'P (Premisa)',
        'Q (Modus ponens: P, P → Q)',
        'R (Modus ponens: Q, Q → R)'
      ],
      correctOrder: [0, 1, 2]
    }
  ),
  
  interactive('order-steps', 'Ordená los pasos para demostrar T desde: S ∨ P, ¬S, (R ∨ S) → T, S ∨ P',
    'Primero obtenés P, luego R ∨ S, finalmente T usando modus ponens.',
    {
      topic: 'demostraciones',
      steps: [
        'P (Silogismo disyuntivo: S ∨ P, ¬S)',
        'R ∨ S (Adición: P → P ∨ cualquier cosa, reordenado)',
        'T (Modus ponens: R ∨ S, (R ∨ S) → T)'
      ],
      correctOrder: [0, 1, 2]
    }
  ),
  
  interactive('order-steps', 'Ordená la prueba de ¬Q desde: P ∨ Q, P → R, ¬P, ¬R',
    'De ¬P y P ∨ Q obtenés Q, de P → R y ¬R obtenés ¬P (ya dado), luego de ¬P y P ∨ Q obtenés Q.',
    {
      topic: 'demostraciones',
      steps: [
        '¬P (Premisa)',
        'Q (Silogismo disyuntivo: P ∨ Q, ¬P)'
      ],
      correctOrder: [0, 1]
    }
  )
];

// 4. SORT-CARDS (Discreta: Equivalencias lógicas)
export const sortCardsQuestions: Question[] = [
  interactive('sort-cards', 'Clasificá las siguientes expresiones en equivalentes o no equivalentes a P → Q',
    'Recordá que P → Q ≡ ¬P ∨ Q y también equivale a ¬Q → ¬P (contraposición).',
    {
      topic: 'equivalencias',
      cards: [
        '¬P ∨ Q',
        '¬Q → ¬P',
        'Q → P',
        'P ∧ ¬Q',
        '¬(P ∧ ¬Q)'
      ],
      buckets: [
        { label: 'Equivalentes a P → Q', correctCards: [0, 1, 4] },
        { label: 'No equivalentes', correctCards: [2, 3] }
      ]
    }
  ),
  
  interactive('sort-cards', 'Clasificá las leyes de De Morgan: agrupa las que son equivalencias correctas',
    'Las leyes de De Morgan cambian ∧ por ∨ (o viceversa) y niegan cada componente.',
    {
      topic: 'equivalencias',
      cards: [
        '¬(P ∧ Q) ≡ ¬P ∨ ¬Q',
        '¬(P ∨ Q) ≡ ¬P ∧ ¬Q',
        '¬(P ∧ Q) ≡ ¬P ∧ ¬Q',
        '¬(P ∨ Q) ≡ ¬P ∨ ¬Q'
      ],
      buckets: [
        { label: 'Correctas', correctCards: [0, 1] },
        { label: 'Incorrectas', correctCards: [2, 3] }
      ]
    }
  ),
  
  interactive('sort-cards', 'Agrupa las expresiones según sean tautologías, contradicciones o contingencias',
    'Una tautología es siempre verdadera, una contradicción siempre falsa, y una contingencia puede ser verdadera o falsa.',
    {
      topic: 'tablas-de-verdad',
      cards: [
        'P ∨ ¬P',
        'P ∧ ¬P',
        'P → P',
        'P ∧ Q',
        '¬(P ↔ ¬P)'
      ],
      buckets: [
        { label: 'Tautologías', correctCards: [0, 2, 4] },
        { label: 'Contradicciones', correctCards: [1] },
        { label: 'Contingencias', correctCards: [3] }
      ]
    }
  )
];

// 5. INTERACTIVE-VENN (Discreta: Conjuntos)
export const interactiveVennQuestions: Question[] = [
  interactive('interactive-venn', 'Seleccioná las regiones que corresponden a A ∩ B (intersección)',
    'La intersección contiene solo los elementos que están en ambos conjuntos a la vez.',
    {
      topic: 'conjuntos',
      sets: [
        { label: 'A', color: '#7556ef' },
        { label: 'B', color: '#f97316' }
      ],
      operation: 'A ∩ B',
      correctRegions: ['AB']
    }
  ),
  
  interactive('interactive-venn', 'Seleccioná las regiones de (A ∪ B) − C',
    'Primero considerá todos los elementos en A o B (unión), luego quitá los que están en C.',
    {
      topic: 'conjuntos',
      sets: [
        { label: 'A', color: '#7556ef' },
        { label: 'B', color: '#f97316' },
        { label: 'C', color: '#22c55e' }
      ],
      operation: '(A ∪ B) − C',
      correctRegions: ['A-only', 'AB', 'B-only']
    }
  ),
  
  interactive('interactive-venn', 'Seleccioná las regiones de A △ B (diferencia simétrica)',
    'La diferencia simétrica contiene elementos que están en exactamente uno de los dos conjuntos, no en ambos.',
    {
      topic: 'conjuntos',
      sets: [
        { label: 'A', color: '#7556ef' },
        { label: 'B', color: '#f97316' }
      ],
      operation: 'A △ B',
      correctRegions: ['A-only', 'B-only']
    }
  )
];

// 6. GRAPH-SLIDER (Precálculo: Funciones cuadráticas)
export const graphSliderQuestions: Question[] = [
  interactive('graph-slider', 'Ajustá los parámetros para obtener la parábola f(x) = 2x² − 4x + 1',
    'El coeficiente de x² es a = 2, el de x es b = −4, y el término independiente es c = 1.',
    {
      topic: 'funciones-cuadraticas',
      functionType: 'quadratic',
      targetParams: { a: 2, b: -4, c: 1 },
      tolerance: 0.2
    }
  ),
  
  interactive('graph-slider', 'Ajustá los parámetros para la función lineal f(x) = −3x + 5',
    'En una función lineal, a es la pendiente y b es la ordenada al origen.',
    {
      topic: 'funciones-lineales',
      functionType: 'linear',
      targetParams: { a: -3, b: 5, c: 0 },
      tolerance: 0.2
    }
  ),
  
  interactive('graph-slider', 'Ajustá los parámetros para f(x) = x³ − 3x² + 2',
    'En esta función cúbica, a = 1, b = −3, c = 0, d = 2.',
    {
      topic: 'funciones-polinomiales',
      functionType: 'cubic',
      targetParams: { a: 1, b: -3, c: 0, d: 2 },
      tolerance: 0.2
    }
  )
];

// 7. MATCH-GRAPHS (Precálculo: Reconocimiento de funciones)
export const matchGraphsQuestions: Question[] = [
  interactive('match-graphs', 'Emparejá cada gráfica con su ecuación',
    'Observá la dirección de la parábola (a > 0 abre hacia arriba), el vértice, y las intersecciones con los ejes.',
    {
      topic: 'funciones-cuadraticas',
      graphs: [
        {
          id: 'g1',
          equation: 'f(x) = x² + 2',
          points: [[-5, 27], [-4, 18], [-3, 11], [-2, 6], [-1, 3], [0, 2], [1, 3], [2, 6], [3, 11], [4, 18], [5, 27]]
        },
        {
          id: 'g2',
          equation: 'f(x) = −x² + 4',
          points: [[-5, -21], [-4, -12], [-3, -5], [-2, 0], [-1, 3], [0, 4], [1, 3], [2, 0], [3, -5], [4, -12], [5, -21]]
        },
        {
          id: 'g3',
          equation: 'f(x) = 2x − 1',
          points: [[-5, -11], [-4, -9], [-3, -7], [-2, -5], [-1, -3], [0, -1], [1, 1], [2, 3], [3, 5], [4, 7], [5, 9]]
        }
      ],
      correctMatches: {
        'g1': 'f(x) = x² + 2',
        'g2': 'f(x) = −x² + 4',
        'g3': 'f(x) = 2x − 1'
      }
    }
  ),
  
  interactive('match-graphs', 'Relacioná las gráficas con sus funciones cuadráticas',
    'Fijate en el coeficiente principal: si a < 0 la parábola abre hacia abajo, si a > 1 es más angosta.',
    {
      topic: 'funciones-cuadraticas',
      graphs: [
        {
          id: 'g1',
          equation: 'f(x) = x² − 4x + 3',
          points: [[-2, 15], [-1, 8], [0, 3], [1, 0], [2, -1], [3, 0], [4, 3], [5, 8], [6, 15]]
        },
        {
          id: 'g2',
          equation: 'f(x) = −2x² + 8',
          points: [[-3, -10], [-2, 0], [-1, 6], [0, 8], [1, 6], [2, 0], [3, -10]]
        }
      ],
      correctMatches: {
        'g1': 'f(x) = x² − 4x + 3',
        'g2': 'f(x) = −2x² + 8'
      }
    }
  ),
  
  interactive('match-graphs', 'Emparejá cada función lineal con su gráfica',
    'Identificá la pendiente (positiva sube, negativa baja) y el punto de corte con el eje y.',
    {
      topic: 'funciones-lineales',
      graphs: [
        {
          id: 'g1',
          equation: 'f(x) = 3x + 1',
          points: [[-3, -8], [-2, -5], [-1, -2], [0, 1], [1, 4], [2, 7], [3, 10]]
        },
        {
          id: 'g2',
          equation: 'f(x) = −x + 4',
          points: [[-2, 6], [-1, 5], [0, 4], [1, 3], [2, 2], [3, 1], [4, 0], [5, -1]]
        }
      ],
      correctMatches: {
        'g1': 'f(x) = 3x + 1',
        'g2': 'f(x) = −x + 4'
      }
    }
  )
];

export const allInteractiveQuestions = [
  ...proofBuilderQuestions,
  ...interactiveTableQuestions,
  ...orderStepsQuestions,
  ...sortCardsQuestions,
  ...interactiveVennQuestions,
  ...graphSliderQuestions,
  ...matchGraphsQuestions
];
