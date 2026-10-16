// Error explanation patterns for common mistakes

export interface ErrorPattern {
  id: string;
  topics: string[]; // Which lesson topics this applies to
  pattern: (userAnswer: string, correctAnswer: string, questionText: string, questionType: string) => boolean;
  explanation: string;
  example?: string;
  relatedTableSection?: string;
}

export const errorPatterns: ErrorPattern[] = [
  // Logic errors
  {
    id: 'modus-tollens-confusion',
    topics: ['inference', 'implicacion', 'demostraciones'],
    pattern: (user, correct, text, type) => 
      type === 'logic' && 
      text.includes('→') &&
      user.includes('P') && !user.includes('¬') &&
      correct.includes('¬P'),
    explanation: 'Confundiste el Modus Tollens con negar el antecedente (una falacia). Si tenemos P → Q y ¬Q, podemos concluir ¬P. Pero si solo negamos P, no podemos concluir nada sobre Q.',
    example: 'Válido: P → Q, ¬Q ⊢ ¬P\nFalacia: P → Q, ¬P ⊬ ¬Q',
    relatedTableSection: 'inference-rules'
  },
  {
    id: 'de-morgan-incomplete',
    topics: ['equivalencias', 'proposiciones'],
    pattern: (user, correct, text) =>
      text.toLowerCase().includes('morgan') &&
      ((user.includes('∨') && correct.includes('∧')) || 
       (user.includes('∧') && correct.includes('∨'))),
    explanation: 'Olvidaste cambiar el conector al aplicar De Morgan. Recordá: la negación de una disyunción es una conjunción, y viceversa.\n¬(P ∨ Q) = ¬P ∧ ¬Q\n¬(P ∧ Q) = ¬P ∨ ¬Q',
    relatedTableSection: 'equivalences'
  },
  {
    id: 'de-morgan-forgot-negations',
    topics: ['equivalencias', 'proposiciones'],
    pattern: (user, correct) => {
      const userNegCount = (user.match(/¬/g) || []).length;
      const correctNegCount = (correct.match(/¬/g) || []).length;
      return correctNegCount > userNegCount && (user.includes('∧') || user.includes('∨'));
    },
    explanation: 'Te falta negar las proposiciones individuales. De Morgan no solo cambia el conector (∨ ↔ ∧), también niega cada proposición: ¬(P ∨ Q) = ¬P ∧ ¬Q',
    relatedTableSection: 'equivalences'
  },
  {
    id: 'implication-equivalence',
    topics: ['implicacion', 'equivalencias'],
    pattern: (user, correct, text) =>
      text.includes('→') &&
      correct.includes('∨') && correct.includes('¬') &&
      !user.includes('∨'),
    explanation: 'Recordá que P → Q es equivalente a ¬P ∨ Q. La implicación se puede escribir como una disyunción negando el antecedente.',
    example: 'P → Q ≡ ¬P ∨ Q',
    relatedTableSection: 'equivalences'
  },
  {
    id: 'conjunction-vs-disjunction',
    topics: ['proposiciones', 'conectores'],
    pattern: (user, correct) =>
      (user.includes('∧') && correct.includes('∨')) ||
      (user.includes('∨') && correct.includes('∧')),
    explanation: 'Confundiste "y" (∧) con "o" (∨).\n∧ (conjunción) = ambas deben ser verdaderas\n∨ (disyunción) = al menos una debe ser verdadera',
    relatedTableSection: 'connectives'
  },
  {
    id: 'negation-missing',
    topics: ['proposiciones', 'negacion'],
    pattern: (user, correct) => {
      const correctNegs = (correct.match(/¬/g) || []).length;
      const userNegs = (user.match(/¬/g) || []).length;
      return correctNegs > userNegs;
    },
    explanation: 'Te falta aplicar una o más negaciones. Revisá el enunciado: ¿hay algún "no" que olvidaste traducir?',
    relatedTableSection: 'connectives'
  },
  
  // Set theory errors
  {
    id: 'union-vs-intersection',
    topics: ['conjuntos', 'operaciones'],
    pattern: (user, correct) =>
      (user.includes('∪') && correct.includes('∩')) ||
      (user.includes('∩') && correct.includes('∪')),
    explanation: 'Confundiste unión (∪) con intersección (∩).\n∪ = elementos en al menos uno de los conjuntos\n∩ = elementos en ambos conjuntos',
    relatedTableSection: 'set-operations'
  },
  {
    id: 'complement-missing',
    topics: ['conjuntos', 'complemento'],
    pattern: (user, correct) => {
      const userHasComplement = user.includes('̄') || user.includes('′') || user.includes('ᶜ');
      const correctHasComplement = correct.includes('̄') || correct.includes('′') || correct.includes('ᶜ');
      return correctHasComplement && !userHasComplement;
    },
    explanation: 'Te falta el complemento. El complemento de A (escrito A′ o Aᶜ) incluye todos los elementos del universo que NO están en A.',
    relatedTableSection: 'set-operations'
  },
  
  // Algebra errors
  {
    id: 'sign-error',
    topics: ['algebra', 'signos', 'ecuaciones'],
    pattern: (user, correct) => {
      // Check if numbers differ only in sign
      const userNum = parseFloat(user.replace(/[^\d.-]/g, ''));
      const correctNum = parseFloat(correct.replace(/[^\d.-]/g, ''));
      return !isNaN(userNum) && !isNaN(correctNum) && userNum === -correctNum;
    },
    explanation: 'Error de signo. Revisá si al despejar o simplificar cambiaste correctamente los signos. Recordá: al pasar un término al otro lado de la ecuación, cambia su signo.',
  },
  {
    id: 'distributive-error',
    topics: ['algebra', 'productos', 'factorizacion'],
    pattern: (user, correct, text) =>
      text.toLowerCase().includes('distribu') ||
      text.toLowerCase().includes('factor') ||
      text.toLowerCase().includes('producto'),
    explanation: 'Error en la distributiva o factorización. Recordá que a(b + c) = ab + ac. No olvides aplicar el factor a todos los términos.',
    relatedTableSection: 'factoring'
  },
  {
    id: 'radical-domain',
    topics: ['radicales', 'dominio', 'ecuaciones'],
    pattern: (user, correct, text) =>
      text.toLowerCase().includes('radic') &&
      text.toLowerCase().includes('dominio'),
    explanation: 'Olvidaste considerar el dominio de la raíz. Una raíz cuadrada solo está definida para valores no negativos. El radicando debe ser ≥ 0.',
    relatedTableSection: 'radicals'
  },
  
  // Truth table errors
  {
    id: 'truth-table-implication',
    topics: ['tablas', 'implicacion'],
    pattern: (user, correct, text, type) =>
      type === 'table' &&
      text.includes('→'),
    explanation: 'Recordá que P → Q solo es falsa cuando P es verdadera y Q es falsa. En todos los demás casos es verdadera.',
    example: 'P | Q | P→Q\nV | V |  V\nV | F |  F  ← único caso falso\nF | V |  V\nF | F |  V',
    relatedTableSection: 'connectives'
  },
  
  // General errors
  {
    id: 'parentheses-order',
    topics: ['general'],
    pattern: (user, correct) => {
      const userParens = user.replace(/[^()]/g, '');
      const correctParens = correct.replace(/[^()]/g, '');
      return userParens.length !== correctParens.length;
    },
    explanation: 'Error en el uso de paréntesis. Los paréntesis determinan el orden de las operaciones. Asegurate de agrupar correctamente.',
  },
];

export function findErrorExplanation(
  userAnswer: string,
  correctAnswer: string,
  questionText: string,
  questionType: string,
  lessonTopic: string
): {
  pattern: ErrorPattern | null;
  explanation: string;
  example?: string;
  relatedTableSection?: string;
} {
  // Normalize answers for comparison
  const normalizeAnswer = (ans: string) => 
    ans.toLowerCase().trim().replace(/\s+/g, '');
  
  const userNorm = normalizeAnswer(userAnswer);
  const correctNorm = normalizeAnswer(correctAnswer);
  
  // Try to find a matching error pattern
  for (const pattern of errorPatterns) {
    // Check if pattern applies to this topic
    const topicMatch = pattern.topics.includes('general') || 
                       pattern.topics.some(topic => 
                         lessonTopic.toLowerCase().includes(topic.toLowerCase())
                       );
    
    if (topicMatch && pattern.pattern(userAnswer, correctAnswer, questionText, questionType)) {
      return {
        pattern,
        explanation: pattern.explanation,
        example: pattern.example,
        relatedTableSection: pattern.relatedTableSection
      };
    }
  }
  
  // Generic explanation if no specific pattern matches
  return {
    pattern: null,
    explanation: 'La respuesta correcta es diferente. Revisá el enunciado y los conceptos clave de esta lección.',
    relatedTableSection: undefined
  };
}
