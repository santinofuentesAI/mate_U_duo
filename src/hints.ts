// Progressive hint system with 3 levels

export interface HintLevel {
  level: 1 | 2 | 3;
  text: string;
  xpPenalty: number;
}

export interface QuestionHints {
  questionId: string;
  hints: [HintLevel, HintLevel, HintLevel];
  relatedTableSection?: string;
}

// Hint database - will be expanded as we add more questions
export const hintsDatabase: Record<string, QuestionHints> = {
  // Example hints for common question patterns
  'default-logic': {
    questionId: 'default-logic',
    hints: [
      {
        level: 1,
        text: 'Revisá las reglas de inferencia en "Consultar tablas". ¿Qué regla aplica aquí?',
        xpPenalty: 2
      },
      {
        level: 2,
        text: 'Identificá las premisas que tenés y qué querés demostrar. ¿Hay una implicación involucrada?',
        xpPenalty: 4
      },
      {
        level: 3,
        text: 'El primer paso es aplicar la regla relevante a las premisas dadas. Mirá el patrón exacto.',
        xpPenalty: 7
      }
    ],
    relatedTableSection: 'inference-rules'
  },
  'default-equivalence': {
    questionId: 'default-equivalence',
    hints: [
      {
        level: 1,
        text: 'Las leyes de equivalencia están en "Consultar tablas". ¿Hay negaciones que distribuir?',
        xpPenalty: 2
      },
      {
        level: 2,
        text: 'Pensá en De Morgan si hay una negación de una conjunción o disyunción.',
        xpPenalty: 4
      },
      {
        level: 3,
        text: 'Aplicá la ley paso a paso: primero distribuí la negación, luego simplificá.',
        xpPenalty: 7
      }
    ],
    relatedTableSection: 'equivalences'
  },
  'default-truth-table': {
    questionId: 'default-truth-table',
    hints: [
      {
        level: 1,
        text: 'Recordá cuándo es verdadera cada conectiva. Las tablas están en "Consultar tablas".',
        xpPenalty: 2
      },
      {
        level: 2,
        text: 'Para →: solo es falsa cuando el antecedente es V y el consecuente es F.',
        xpPenalty: 4
      },
      {
        level: 3,
        text: 'Completá columna por columna: primero las negaciones, luego las conjunciones, etc.',
        xpPenalty: 7
      }
    ],
    relatedTableSection: 'connectives'
  },
  'default-set': {
    questionId: 'default-set',
    hints: [
      {
        level: 1,
        text: '¿Es unión (∪) o intersección (∩)? Revisá las operaciones en "Consultar tablas".',
        xpPenalty: 2
      },
      {
        level: 2,
        text: 'Unión (∪) = elementos en al menos uno. Intersección (∩) = elementos en ambos.',
        xpPenalty: 4
      },
      {
        level: 3,
        text: 'Listá los elementos de cada conjunto y aplicá la operación según la definición.',
        xpPenalty: 7
      }
    ],
    relatedTableSection: 'set-operations'
  },
  'default-algebra': {
    questionId: 'default-algebra',
    hints: [
      {
        level: 1,
        text: 'Revisá las fórmulas de factorización o la fórmula cuadrática en "Consultar tablas".',
        xpPenalty: 2
      },
      {
        level: 2,
        text: '¿Podés factorizar sacando factor común? ¿O es un trinomio cuadrado perfecto?',
        xpPenalty: 4
      },
      {
        level: 3,
        text: 'Identificá el patrón (a² - b², ax² + bx + c, etc.) y aplicá la fórmula correspondiente.',
        xpPenalty: 7
      }
    ],
    relatedTableSection: 'factoring'
  },
};

export function getHintsForQuestion(
  questionId: string,
  questionType: string,
  lessonTopic: string
): QuestionHints {
  // Try exact match first
  if (hintsDatabase[questionId]) {
    return hintsDatabase[questionId];
  }
  
  // Fall back to default hints based on question type/topic
  if (questionType === 'logic' || lessonTopic.includes('lógica') || lessonTopic.includes('inferencia')) {
    return hintsDatabase['default-logic'];
  }
  if (lessonTopic.includes('equivalencia') || lessonTopic.includes('simplificación')) {
    return hintsDatabase['default-equivalence'];
  }
  if (questionType === 'table' || lessonTopic.includes('tabla')) {
    return hintsDatabase['default-truth-table'];
  }
  if (questionType === 'set' || lessonTopic.includes('conjunto')) {
    return hintsDatabase['default-set'];
  }
  if (questionType === 'algebra' || lessonTopic.includes('algebra') || lessonTopic.includes('ecuación')) {
    return hintsDatabase['default-algebra'];
  }
  
  // Generic fallback
  return {
    questionId: 'default-generic',
    hints: [
      {
        level: 1,
        text: 'Leé el enunciado con atención. ¿Qué información te dan? ¿Qué te piden?',
        xpPenalty: 2
      },
      {
        level: 2,
        text: 'Identificá el concepto clave de la lección. ¿Hay una fórmula o regla que aplique?',
        xpPenalty: 4
      },
      {
        level: 3,
        text: 'Aplicá el método paso a paso. Si hay un ejemplo similar en la lección, seguilo.',
        xpPenalty: 7
      }
    ]
  };
}

export function calculateXPWithHints(baseXP: number, hintsUsed: number[]): number {
  // Base XP is 10 for correct answer without help
  // Subtract penalties for each hint used
  let totalPenalty = 0;
  
  // Get penalties for each hint level used
  for (const level of hintsUsed) {
    if (level === 1) totalPenalty += 2;
    else if (level === 2) totalPenalty += 4;
    else if (level === 3) totalPenalty += 7;
  }
  
  // Minimum XP is 1 (always earn something for correct answer)
  return Math.max(1, baseXP - totalPenalty);
}
