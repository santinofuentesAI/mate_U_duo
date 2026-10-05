import type { Course, Question } from './types';
export interface BookExercise { course: Course; lessonTitle: string; question: Question; }
// Selected original incisos. Image pixels remain in the user's locally imported PDF.
export const bookExercises: BookExercise[] = [
  {
    "course": "precalculo",
    "lessonTitle": "Conjuntos numéricos",
    "question": {
      "id": "precalculo-libro-18-1b",
      "type": "choice",
      "prompt": "¿(2/√2)² representa un número irracional?",
      "answer": "Falso",
      "explanation": "2/√2 = √2; al elevar al cuadrado da 2, que es racional.",
      "hints": [
        "Revisá la definición de racional y resolvé primero la operación.",
        "2/√2 = √2; al elevar al cuadrado da 2, que es racional."
      ],
      "tag": "Conjuntos numéricos",
      "difficulty": 1,
      "bookSource": {
        "course": "precalculo",
        "page": 18,
        "printedPage": 18,
        "section": "1.4 · Práctica 1",
        "exercise": "1b",
        "crop": {
          "x": 0.12,
          "y": 0.197,
          "width": 0.64,
          "height": 0.047
        }
      },
      "options": [
        "Verdadero",
        "Falso"
      ]
    }
  },
  {
    "course": "precalculo",
    "lessonTitle": "Conjuntos numéricos",
    "question": {
      "id": "precalculo-libro-18-1d",
      "type": "choice",
      "prompt": "Si √x es un entero positivo, ¿x=9 es un valor posible?",
      "answer": "Verdadero",
      "explanation": "√9 = 3, que es un entero positivo.",
      "hints": [
        "Revisá la definición de racional y resolvé primero la operación.",
        "√9 = 3, que es un entero positivo."
      ],
      "tag": "Conjuntos numéricos",
      "difficulty": 1,
      "bookSource": {
        "course": "precalculo",
        "page": 18,
        "printedPage": 18,
        "section": "1.4 · Práctica 1",
        "exercise": "1d",
        "crop": {
          "x": 0.12,
          "y": 0.282,
          "width": 0.64,
          "height": 0.026
        }
      },
      "options": [
        "Verdadero",
        "Falso"
      ]
    }
  },
  {
    "course": "precalculo",
    "lessonTitle": "Conjuntos numéricos",
    "question": {
      "id": "precalculo-libro-18-1e",
      "type": "choice",
      "prompt": "¿Todo número natural es entero y racional al mismo tiempo?",
      "answer": "Verdadero",
      "explanation": "Los naturales están incluidos en los enteros, y cada entero n se escribe n/1.",
      "hints": [
        "Revisá la definición de racional y resolvé primero la operación.",
        "Los naturales están incluidos en los enteros, y cada entero n se escribe n/1."
      ],
      "tag": "Conjuntos numéricos",
      "difficulty": 1,
      "bookSource": {
        "course": "precalculo",
        "page": 18,
        "printedPage": 18,
        "section": "1.4 · Práctica 1",
        "exercise": "1e",
        "crop": {
          "x": 0.12,
          "y": 0.315,
          "width": 0.64,
          "height": 0.021
        }
      },
      "options": [
        "Verdadero",
        "Falso"
      ]
    }
  },
  {
    "course": "precalculo",
    "lessonTitle": "Conjuntos numéricos",
    "question": {
      "id": "precalculo-libro-18-1f",
      "type": "choice",
      "prompt": "¿Todo número racional es irracional?",
      "answer": "Falso",
      "explanation": "Un racional se escribe como cociente de enteros. Un irracional no admite esa representación.",
      "hints": [
        "Revisá la definición de racional y resolvé primero la operación.",
        "Un racional se escribe como cociente de enteros. Un irracional no admite esa representación."
      ],
      "tag": "Conjuntos numéricos",
      "difficulty": 1,
      "bookSource": {
        "course": "precalculo",
        "page": 18,
        "printedPage": 18,
        "section": "1.4 · Práctica 1",
        "exercise": "1f",
        "crop": {
          "x": 0.12,
          "y": 0.34,
          "width": 0.64,
          "height": 0.035
        }
      },
      "options": [
        "Verdadero",
        "Falso"
      ]
    }
  },
  {
    "course": "precalculo",
    "lessonTitle": "Leyes de potencias",
    "question": {
      "id": "precalculo-libro-18-3c",
      "type": "choice",
      "prompt": "Aplicá las leyes de potencias. Elegí el resultado en notación potencial.",
      "answer": "(4/5)⁸",
      "explanation": "Restá exponentes al dividir: 7−3=4. Multiplicá por 2 al elevar: 4·2=8.",
      "hints": [
        "En productos sumás exponentes; en cocientes restás; en una potencia de potencia multiplicás.",
        "Restá exponentes al dividir: 7−3=4. Multiplicá por 2 al elevar: 4·2=8."
      ],
      "tag": "Leyes de potencias",
      "difficulty": 2,
      "bookSource": {
        "course": "precalculo",
        "page": 18,
        "printedPage": 18,
        "section": "1.4 · Práctica 1",
        "exercise": "3c",
        "crop": {
          "x": 0.12,
          "y": 0.698,
          "width": 0.22,
          "height": 0.047
        }
      },
      "math": "\\left[\\left(\\frac45\\right)^7\\div\\left(\\frac45\\right)^3\\right]^2",
      "options": [
        "(4/5)⁸",
        "(4/5)¹⁰",
        "(4/5)⁴"
      ]
    }
  },
  {
    "course": "precalculo",
    "lessonTitle": "Leyes de potencias",
    "question": {
      "id": "precalculo-libro-18-3g",
      "type": "choice",
      "prompt": "Aplicá las leyes de potencias. Elegí el resultado en notación potencial.",
      "answer": "(7/2)³",
      "explanation": "La base es la misma: 2+4+6−9=3.",
      "hints": [
        "En productos sumás exponentes; en cocientes restás; en una potencia de potencia multiplicás.",
        "La base es la misma: 2+4+6−9=3."
      ],
      "tag": "Leyes de potencias",
      "difficulty": 2,
      "bookSource": {
        "course": "precalculo",
        "page": 18,
        "printedPage": 18,
        "section": "1.4 · Práctica 1",
        "exercise": "3g",
        "crop": {
          "x": 0.12,
          "y": 0.874,
          "width": 0.29,
          "height": 0.045
        }
      },
      "math": "\\left(\\frac72\\right)^2\\left(\\frac72\\right)^4\\left(\\frac72\\right)^6\\div\\left(\\frac72\\right)^9",
      "options": [
        "(7/2)³",
        "(7/2)¹²",
        "(7/2)²¹"
      ]
    }
  },
  {
    "course": "precalculo",
    "lessonTitle": "Signos y jerarquía de operaciones",
    "question": {
      "id": "precalculo-libro-19-6a",
      "type": "text",
      "prompt": "Calculá el resultado de esta operación.",
      "answer": "20",
      "explanation": "Las potencias dan 16−{225−[4−9(−25)]}. El corchete vale 229, la llave −4, y 16−(−4)=20.",
      "hints": [
        "Primero raíces y potencias; después productos y cocientes; finalmente sumas y restas.",
        "Las potencias dan 16−{225−[4−9(−25)]}. El corchete vale 229, la llave −4, y 16−(−4)=20."
      ],
      "tag": "Signos y jerarquía de operaciones",
      "difficulty": 2,
      "bookSource": {
        "course": "precalculo",
        "page": 19,
        "printedPage": 19,
        "section": "1.4 · Práctica 1",
        "exercise": "6a",
        "crop": {
          "x": 0.12,
          "y": 0.462,
          "width": 0.37,
          "height": 0.037
        }
      },
      "math": "\\sqrt{256}-\\{15^2-[4-3^2(0^2-5^2)]\\}"
    }
  },
  {
    "course": "precalculo",
    "lessonTitle": "Signos y jerarquía de operaciones",
    "question": {
      "id": "precalculo-libro-19-6b",
      "type": "text",
      "prompt": "Calculá el resultado de esta operación.",
      "answer": "25600",
      "explanation": "Los factores dan 8², (−2)⁴ y (−5)²: 64·16·25=25600.",
      "hints": [
        "Primero raíces y potencias; después productos y cocientes; finalmente sumas y restas.",
        "Los factores dan 8², (−2)⁴ y (−5)²: 64·16·25=25600."
      ],
      "tag": "Signos y jerarquía de operaciones",
      "difficulty": 2,
      "bookSource": {
        "course": "precalculo",
        "page": 19,
        "printedPage": 19,
        "section": "1.4 · Práctica 1",
        "exercise": "6b",
        "crop": {
          "x": 0.12,
          "y": 0.493,
          "width": 0.37,
          "height": 0.027
        }
      },
      "math": "(3+5)^2(1+\\sqrt[3]{-27})^4(3-8)^2"
    }
  },
  {
    "course": "precalculo",
    "lessonTitle": "Signos y jerarquía de operaciones",
    "question": {
      "id": "precalculo-libro-19-6c",
      "type": "text",
      "prompt": "Calculá el resultado de esta operación.",
      "answer": "12",
      "explanation": "La raíz principal de (−12)² es 12. La raíz cúbica de −8 es −2; el segundo sumando vale 0.",
      "hints": [
        "Primero raíces y potencias; después productos y cocientes; finalmente sumas y restas.",
        "La raíz principal de (−12)² es 12. La raíz cúbica de −8 es −2; el segundo sumando vale 0."
      ],
      "tag": "Signos y jerarquía de operaciones",
      "difficulty": 2,
      "bookSource": {
        "course": "precalculo",
        "page": 19,
        "printedPage": 19,
        "section": "1.4 · Práctica 1",
        "exercise": "6c",
        "crop": {
          "x": 0.12,
          "y": 0.518,
          "width": 0.37,
          "height": 0.026
        }
      },
      "math": "\\sqrt{(-5-7)^2}+(\\sqrt[3]{-8}+2)"
    }
  },
  {
    "course": "precalculo",
    "lessonTitle": "Signos y jerarquía de operaciones",
    "question": {
      "id": "precalculo-libro-19-6f",
      "type": "text",
      "prompt": "Calculá el resultado de esta operación.",
      "answer": "4",
      "explanation": "Como 7⁴=2401, resulta (5−7)+6=4.",
      "hints": [
        "Primero raíces y potencias; después productos y cocientes; finalmente sumas y restas.",
        "Como 7⁴=2401, resulta (5−7)+6=4."
      ],
      "tag": "Signos y jerarquía de operaciones",
      "difficulty": 2,
      "bookSource": {
        "course": "precalculo",
        "page": 19,
        "printedPage": 19,
        "section": "1.4 · Práctica 1",
        "exercise": "6f",
        "crop": {
          "x": 0.12,
          "y": 0.594,
          "width": 0.37,
          "height": 0.026
        }
      },
      "math": "(5-\\sqrt[4]{2401})+(11-5)"
    }
  },
  {
    "course": "precalculo",
    "lessonTitle": "Fracciones numéricas",
    "question": {
      "id": "precalculo-libro-19-6p",
      "type": "algebra",
      "prompt": "Calculá y escribí el resultado como fracción.",
      "answer": "1/60",
      "explanation": "5/12−7/18=1/36. La cuarta raíz de 10000/1296 es 5/3; su inversa es 3/5. El producto es 1/60.",
      "hints": [
        "Usá denominador común y recordá que elevar a −1 invierte una cantidad no nula.",
        "5/12−7/18=1/36. La cuarta raíz de 10000/1296 es 5/3; su inversa es 3/5. El producto es 1/60."
      ],
      "tag": "Fracciones numéricas",
      "difficulty": 2,
      "bookSource": {
        "course": "precalculo",
        "page": 19,
        "printedPage": 19,
        "section": "1.4 · Práctica 1",
        "exercise": "6p",
        "crop": {
          "x": 0.12,
          "y": 0.858,
          "width": 0.3,
          "height": 0.056
        }
      },
      "math": "\\left(\\frac5{12}-\\frac7{18}\\right)\\left(\\sqrt[4]{\\frac{10000}{1296}}\\right)^{-1}"
    }
  },
  {
    "course": "precalculo",
    "lessonTitle": "Monomios y términos semejantes",
    "question": {
      "id": "precalculo-libro-33-1a",
      "type": "choice",
      "prompt": "Clasificá la expresión e indicá su grado.",
      "answer": "Binomio · grado 2",
      "explanation": "Tiene dos términos y su mayor exponente es 2.",
      "hints": [
        "Contá términos separados por sumas o restas exteriores y buscá la mayor potencia.",
        "Tiene dos términos y su mayor exponente es 2."
      ],
      "tag": "Monomios y términos semejantes",
      "difficulty": 1,
      "bookSource": {
        "course": "precalculo",
        "page": 33,
        "printedPage": 33,
        "section": "2.5 · Práctica",
        "exercise": "1a",
        "crop": {
          "x": 0.12,
          "y": 0.148,
          "width": 0.17,
          "height": 0.032
        }
      },
      "math": "x^2+5",
      "options": [
        "Binomio · grado 2",
        "Monomio · grado 2",
        "Binomio · grado 1"
      ]
    }
  },
  {
    "course": "precalculo",
    "lessonTitle": "Monomios y términos semejantes",
    "question": {
      "id": "precalculo-libro-33-1c",
      "type": "choice",
      "prompt": "Clasificá la expresión e indicá su grado.",
      "answer": "Polinomio de 4 términos · grado 3",
      "explanation": "Hay cuatro términos. El grado es el mayor exponente, 3, no la cantidad de términos.",
      "hints": [
        "Contá términos separados por sumas o restas exteriores y buscá la mayor potencia.",
        "Hay cuatro términos. El grado es el mayor exponente, 3, no la cantidad de términos."
      ],
      "tag": "Monomios y términos semejantes",
      "difficulty": 1,
      "bookSource": {
        "course": "precalculo",
        "page": 33,
        "printedPage": 33,
        "section": "2.5 · Práctica",
        "exercise": "1c",
        "crop": {
          "x": 0.12,
          "y": 0.216,
          "width": 0.21,
          "height": 0.024
        }
      },
      "math": "x^3+x^2+x+1",
      "options": [
        "Polinomio de 4 términos · grado 3",
        "Trinomio · grado 3",
        "Polinomio de 4 términos · grado 4"
      ]
    }
  },
  {
    "course": "precalculo",
    "lessonTitle": "Suma y resta de polinomios",
    "question": {
      "id": "precalculo-libro-33-2a",
      "type": "algebra",
      "prompt": "p(x)=x³+3x²+2x+5, q(x)=−3x³−3x²+4x+3 y r(x)=x³−2x².\nCalculá r(x)−p(x).",
      "answer": "-5x^2-2x-5",
      "explanation": "Al restar p, cambiá todos sus signos: x³−2x²−x³−3x²−2x−5=−5x²−2x−5.",
      "hints": [
        "Agrupá términos de igual potencia y cuidá el signo delante de cada polinomio.",
        "Al restar p, cambiá todos sus signos: x³−2x²−x³−3x²−2x−5=−5x²−2x−5."
      ],
      "tag": "Suma y resta de polinomios",
      "difficulty": 2,
      "bookSource": {
        "course": "precalculo",
        "page": 33,
        "printedPage": 33,
        "section": "2.5 · Práctica",
        "exercise": "2a",
        "crop": {
          "x": 0.09,
          "y": 0.253,
          "width": 0.8,
          "height": 0.201
        }
      }
    }
  },
  {
    "course": "precalculo",
    "lessonTitle": "Suma y resta de polinomios",
    "question": {
      "id": "precalculo-libro-33-2b",
      "type": "algebra",
      "prompt": "p(x)=x³+3x²+2x+5, q(x)=−3x³−3x²+4x+3 y r(x)=x³−2x².\nCalculá 3p(x)+r(x).",
      "answer": "4x^3+7x^2+6x+15",
      "explanation": "3p=3x³+9x²+6x+15. Al sumar r, queda 4x³+7x²+6x+15.",
      "hints": [
        "Agrupá términos de igual potencia y cuidá el signo delante de cada polinomio.",
        "3p=3x³+9x²+6x+15. Al sumar r, queda 4x³+7x²+6x+15."
      ],
      "tag": "Suma y resta de polinomios",
      "difficulty": 2,
      "bookSource": {
        "course": "precalculo",
        "page": 33,
        "printedPage": 33,
        "section": "2.5 · Práctica",
        "exercise": "2b",
        "crop": {
          "x": 0.09,
          "y": 0.253,
          "width": 0.8,
          "height": 0.201
        }
      }
    }
  },
  {
    "course": "precalculo",
    "lessonTitle": "Multiplicación y productos notables",
    "question": {
      "id": "precalculo-libro-33-4b",
      "type": "algebra",
      "prompt": "Desarrollá y reducí el producto.",
      "answer": "x^5+2x^4+3x^3-6x^2-12x-18",
      "explanation": "Distribuí x³ y −6 sobre los tres términos: x⁵+2x⁴+3x³−6x²−12x−18.",
      "hints": [
        "Multiplicá cada término del primer factor por cada término del segundo.",
        "Distribuí x³ y −6 sobre los tres términos: x⁵+2x⁴+3x³−6x²−12x−18."
      ],
      "tag": "Multiplicación y productos notables",
      "difficulty": 2,
      "bookSource": {
        "course": "precalculo",
        "page": 33,
        "printedPage": 33,
        "section": "2.5 · Práctica",
        "exercise": "4b",
        "crop": {
          "x": 0.12,
          "y": 0.638,
          "width": 0.31,
          "height": 0.023
        }
      },
      "math": "(x^3-6)(x^2+2x+3)"
    }
  },
  {
    "course": "precalculo",
    "lessonTitle": "Multiplicación y productos notables",
    "question": {
      "id": "precalculo-libro-33-4c",
      "type": "algebra",
      "prompt": "Desarrollá y reducí el producto.",
      "answer": "x^3+1",
      "explanation": "Los términos −x²+x² y x−x se anulan. Queda x³+1.",
      "hints": [
        "Multiplicá cada término del primer factor por cada término del segundo.",
        "Los términos −x²+x² y x−x se anulan. Queda x³+1."
      ],
      "tag": "Multiplicación y productos notables",
      "difficulty": 2,
      "bookSource": {
        "course": "precalculo",
        "page": 33,
        "printedPage": 33,
        "section": "2.5 · Práctica",
        "exercise": "4c",
        "crop": {
          "x": 0.12,
          "y": 0.661,
          "width": 0.26,
          "height": 0.023
        }
      },
      "math": "(x+1)(x^2-x+1)"
    }
  },
  {
    "course": "precalculo",
    "lessonTitle": "Factor común y agrupación",
    "question": {
      "id": "precalculo-libro-42-1a",
      "type": "algebra",
      "prompt": "Factorizá como producto de factores (se aceptan factores equivalentes).",
      "answer": "(3-y)*(x^2+x+1)",
      "explanation": "Agrupá (3−y)x²+(3−y)x+(3−y). El factor común es 3−y.",
      "hints": [
        "Buscá primero factor común; después reconocé productos notables o suma/diferencia de cubos.",
        "Agrupá (3−y)x²+(3−y)x+(3−y). El factor común es 3−y."
      ],
      "tag": "Factor común y agrupación",
      "difficulty": 2,
      "bookSource": {
        "course": "precalculo",
        "page": 42,
        "printedPage": 42,
        "section": "3.2.5 · Práctica 1",
        "exercise": "1a",
        "crop": {
          "x": 0.12,
          "y": 0.28400000000000003,
          "width": 0.55,
          "height": 0.025
        }
      },
      "math": "3x^2-xy+3-yx^2+3x-y",
      "requiredForm": "factored"
    }
  },
  {
    "course": "precalculo",
    "lessonTitle": "Suma y diferencia de cubos",
    "question": {
      "id": "precalculo-libro-42-1e",
      "type": "algebra",
      "prompt": "Factorizá como producto de factores (se aceptan factores equivalentes).",
      "answer": "(2-y)*(4+2y+y^2)",
      "explanation": "Identificá 2³−y³. La diferencia de cubos da (2−y)(4+2y+y²).",
      "hints": [
        "Buscá primero factor común; después reconocé productos notables o suma/diferencia de cubos.",
        "Identificá 2³−y³. La diferencia de cubos da (2−y)(4+2y+y²)."
      ],
      "tag": "Suma y diferencia de cubos",
      "difficulty": 2,
      "bookSource": {
        "course": "precalculo",
        "page": 42,
        "printedPage": 42,
        "section": "3.2.5 · Práctica 1",
        "exercise": "1e",
        "crop": {
          "x": 0.12,
          "y": 0.383,
          "width": 0.55,
          "height": 0.025
        }
      },
      "math": "8-y^3",
      "requiredForm": "factored"
    }
  },
  {
    "course": "precalculo",
    "lessonTitle": "Factorización completa",
    "question": {
      "id": "precalculo-libro-42-1g",
      "type": "algebra",
      "prompt": "Factorizá como producto de factores (se aceptan factores equivalentes).",
      "answer": "(x-2)*(x+2)*(x^2+2x+4)*(x^2-2x+4)",
      "explanation": "Primero x⁶−64=(x³−8)(x³+8). Aplicá diferencia y suma de cubos a cada factor.",
      "hints": [
        "Buscá primero factor común; después reconocé productos notables o suma/diferencia de cubos.",
        "Primero x⁶−64=(x³−8)(x³+8). Aplicá diferencia y suma de cubos a cada factor."
      ],
      "tag": "Factorización completa",
      "difficulty": 3,
      "bookSource": {
        "course": "precalculo",
        "page": 42,
        "printedPage": 42,
        "section": "3.2.5 · Práctica 1",
        "exercise": "1g",
        "crop": {
          "x": 0.12,
          "y": 0.433,
          "width": 0.55,
          "height": 0.025
        }
      },
      "math": "x^6-64",
      "requiredForm": "factored"
    }
  },
  {
    "course": "precalculo",
    "lessonTitle": "Factorización completa",
    "question": {
      "id": "precalculo-libro-42-1i",
      "type": "algebra",
      "prompt": "Factorizá como producto de factores (se aceptan factores equivalentes).",
      "answer": "(2x-y)^3",
      "explanation": "Los cuatro términos coinciden con a³−3a²b+3ab²−b³, usando a=2x y b=y.",
      "hints": [
        "Buscá primero factor común; después reconocé productos notables o suma/diferencia de cubos.",
        "Los cuatro términos coinciden con a³−3a²b+3ab²−b³, usando a=2x y b=y."
      ],
      "tag": "Factorización completa",
      "difficulty": 2,
      "bookSource": {
        "course": "precalculo",
        "page": 42,
        "printedPage": 42,
        "section": "3.2.5 · Práctica 1",
        "exercise": "1i",
        "crop": {
          "x": 0.12,
          "y": 0.482,
          "width": 0.55,
          "height": 0.025
        }
      },
      "math": "8x^3-12x^2y+6xy^2-y^3",
      "requiredForm": "factored"
    }
  },
  {
    "course": "precalculo",
    "lessonTitle": "Factor común y agrupación",
    "question": {
      "id": "precalculo-libro-42-1l",
      "type": "algebra",
      "prompt": "Factorizá como producto de factores (se aceptan factores equivalentes).",
      "answer": "(x-1)*(3x^2+1)",
      "explanation": "Agrupá 3x²(x−1)+(x−1). Extraé el binomio común x−1.",
      "hints": [
        "Buscá primero factor común; después reconocé productos notables o suma/diferencia de cubos.",
        "Agrupá 3x²(x−1)+(x−1). Extraé el binomio común x−1."
      ],
      "tag": "Factor común y agrupación",
      "difficulty": 2,
      "bookSource": {
        "course": "precalculo",
        "page": 42,
        "printedPage": 42,
        "section": "3.2.5 · Práctica 1",
        "exercise": "1l",
        "crop": {
          "x": 0.12,
          "y": 0.554,
          "width": 0.55,
          "height": 0.025
        }
      },
      "math": "3x^3-3x^2+x-1",
      "requiredForm": "factored"
    }
  },
  {
    "course": "precalculo",
    "lessonTitle": "Trinomios y diferencias de cuadrados",
    "question": {
      "id": "precalculo-libro-42-2a",
      "type": "algebra",
      "prompt": "Factorizá el trinomio.",
      "answer": "(x+3)*(x+5)",
      "explanation": "3 y 5 suman 8 y multiplican 15.",
      "hints": [
        "Buscá dos números cuya suma sea el coeficiente de x y cuyo producto sea el término independiente.",
        "3 y 5 suman 8 y multiplican 15."
      ],
      "tag": "Trinomios y diferencias de cuadrados",
      "difficulty": 2,
      "bookSource": {
        "course": "precalculo",
        "page": 42,
        "printedPage": 42,
        "section": "3.2.5 · Práctica 1",
        "exercise": "2a",
        "crop": {
          "x": 0.12,
          "y": 0.812,
          "width": 0.32,
          "height": 0.025
        }
      },
      "math": "x^2+8x+15",
      "requiredForm": "factored"
    }
  },
  {
    "course": "precalculo",
    "lessonTitle": "Trinomios y diferencias de cuadrados",
    "question": {
      "id": "precalculo-libro-42-2c",
      "type": "algebra",
      "prompt": "Factorizá el trinomio.",
      "answer": "(x-5)*(x-6)",
      "explanation": "−5 y −6 suman −11 y multiplican 30.",
      "hints": [
        "Buscá dos números cuya suma sea el coeficiente de x y cuyo producto sea el término independiente.",
        "−5 y −6 suman −11 y multiplican 30."
      ],
      "tag": "Trinomios y diferencias de cuadrados",
      "difficulty": 2,
      "bookSource": {
        "course": "precalculo",
        "page": 42,
        "printedPage": 42,
        "section": "3.2.5 · Práctica 1",
        "exercise": "2c",
        "crop": {
          "x": 0.12,
          "y": 0.862,
          "width": 0.32,
          "height": 0.025
        }
      },
      "math": "x^2-11x+30",
      "requiredForm": "factored"
    }
  },
  {
    "course": "precalculo",
    "lessonTitle": "Ecuaciones de grado superior",
    "question": {
      "id": "precalculo-libro-63-1d",
      "type": "set",
      "prompt": "Seleccioná todas las soluciones reales válidas de la ecuación.",
      "answer": [
        "0",
        "-3",
        "-1/2",
        "1/2"
      ],
      "explanation": "Agrupá: x(x+3)(4x²−1)=x(x+3)(2x−1)(2x+1). Igualá cada factor a cero.",
      "hints": [
        "Respetá el dominio y comprobá cada candidata en la ecuación original.",
        "Agrupá: x(x+3)(4x²−1)=x(x+3)(2x−1)(2x+1). Igualá cada factor a cero."
      ],
      "tag": "Ecuaciones de grado superior",
      "difficulty": 3,
      "bookSource": {
        "course": "precalculo",
        "page": 63,
        "printedPage": 63,
        "section": "4.6 · Práctica 1",
        "exercise": "1d",
        "crop": {
          "x": 0.12,
          "y": 0.208,
          "width": 0.38,
          "height": 0.023
        }
      },
      "math": "4x^4+12x^3-x^2-3x=0",
      "universe": [
        "0",
        "-3",
        "3",
        "-1/2",
        "1/2",
        "-2",
        "2"
      ]
    }
  },
  {
    "course": "precalculo",
    "lessonTitle": "Ecuaciones racionales",
    "question": {
      "id": "precalculo-libro-63-1h",
      "type": "set",
      "prompt": "Seleccioná todas las soluciones reales válidas de la ecuación.",
      "answer": [
        "2"
      ],
      "explanation": "Excluí x=−1. Multiplicar por x+1 da x²−x−2=0, cuyas raíces son 2 y −1. La segunda no pertenece al dominio.",
      "hints": [
        "Respetá el dominio y comprobá cada candidata en la ecuación original.",
        "Excluí x=−1. Multiplicar por x+1 da x²−x−2=0, cuyas raíces son 2 y −1. La segunda no pertenece al dominio."
      ],
      "tag": "Ecuaciones racionales",
      "difficulty": 3,
      "bookSource": {
        "course": "precalculo",
        "page": 63,
        "printedPage": 63,
        "section": "4.6 · Práctica 1",
        "exercise": "1h",
        "crop": {
          "x": 0.12,
          "y": 0.297,
          "width": 0.31,
          "height": 0.047
        }
      },
      "math": "x-\\frac{2x}{x+1}=\\frac2{x+1}",
      "universe": [
        "-1",
        "0",
        "1",
        "2"
      ]
    }
  },
  {
    "course": "precalculo",
    "lessonTitle": "Ecuaciones racionales",
    "question": {
      "id": "precalculo-libro-63-1j",
      "type": "set",
      "prompt": "Seleccioná todas las soluciones reales válidas de la ecuación.",
      "answer": [
        "5"
      ],
      "explanation": "Excluí −1/2 y −3/2. Al cruzar, 6x²+x−12=6x²−x−2; 2x=10 y x=5.",
      "hints": [
        "Respetá el dominio y comprobá cada candidata en la ecuación original.",
        "Excluí −1/2 y −3/2. Al cruzar, 6x²+x−12=6x²−x−2; 2x=10 y x=5."
      ],
      "tag": "Ecuaciones racionales",
      "difficulty": 3,
      "bookSource": {
        "course": "precalculo",
        "page": 63,
        "printedPage": 63,
        "section": "4.6 · Práctica 1",
        "exercise": "1j",
        "crop": {
          "x": 0.535,
          "y": 0.134,
          "width": 0.31,
          "height": 0.043
        }
      },
      "math": "\\frac{3x-4}{2x+1}=\\frac{3x-2}{2x+3}",
      "universe": [
        "-1/2",
        "-3/2",
        "1",
        "5"
      ]
    }
  },
  {
    "course": "precalculo",
    "lessonTitle": "Ecuaciones racionales",
    "question": {
      "id": "precalculo-libro-63-1l",
      "type": "set",
      "prompt": "Seleccioná todas las soluciones reales válidas de la ecuación.",
      "answer": [
        "7"
      ],
      "explanation": "Excluí −1/2 y 3/4. Multiplicá en cruz: 12x−9=10x+5; x=7.",
      "hints": [
        "Respetá el dominio y comprobá cada candidata en la ecuación original.",
        "Excluí −1/2 y 3/4. Multiplicá en cruz: 12x−9=10x+5; x=7."
      ],
      "tag": "Ecuaciones racionales",
      "difficulty": 3,
      "bookSource": {
        "course": "precalculo",
        "page": 63,
        "printedPage": 63,
        "section": "4.6 · Práctica 1",
        "exercise": "1l",
        "crop": {
          "x": 0.535,
          "y": 0.219,
          "width": 0.31,
          "height": 0.037
        }
      },
      "math": "\\frac3{2x+1}=\\frac5{4x-3}",
      "universe": [
        "-1/2",
        "3/4",
        "-7",
        "7"
      ]
    }
  },
  {
    "course": "precalculo",
    "lessonTitle": "Ecuaciones con radicales",
    "question": {
      "id": "precalculo-libro-63-2a",
      "type": "set",
      "prompt": "Seleccioná todas las soluciones reales válidas de la ecuación.",
      "answer": [
        "2"
      ],
      "explanation": "Aislá la raíz: 2√(x+7)=8−x, con −7≤x≤8. Al cuadrar: x²−20x+36=0, raíces 2 y 18. Solo 2 verifica la ecuación original.",
      "hints": [
        "Respetá el dominio y comprobá cada candidata en la ecuación original.",
        "Aislá la raíz: 2√(x+7)=8−x, con −7≤x≤8. Al cuadrar: x²−20x+36=0, raíces 2 y 18. Solo 2 verifica la ecuación original."
      ],
      "tag": "Ecuaciones con radicales",
      "difficulty": 3,
      "bookSource": {
        "course": "precalculo",
        "page": 63,
        "printedPage": 63,
        "section": "4.6 · Práctica 1",
        "exercise": "2a",
        "crop": {
          "x": 0.12,
          "y": 0.424,
          "width": 0.3,
          "height": 0.026
        }
      },
      "math": "x+2\\sqrt{x+7}=8",
      "universe": [
        "2",
        "18",
        "-7",
        "8"
      ]
    }
  },
  {
    "course": "precalculo",
    "lessonTitle": "Ecuaciones con radicales",
    "question": {
      "id": "precalculo-libro-63-2c",
      "type": "set",
      "prompt": "Seleccioná todas las soluciones reales válidas de la ecuación.",
      "answer": [
        "12"
      ],
      "explanation": "Necesitás x≥7. Al cuadrar, 2x+1=(x−7)²; x²−16x+48=0. Las candidatas son 4 y 12; solo 12 verifica.",
      "hints": [
        "Respetá el dominio y comprobá cada candidata en la ecuación original.",
        "Necesitás x≥7. Al cuadrar, 2x+1=(x−7)²; x²−16x+48=0. Las candidatas son 4 y 12; solo 12 verifica."
      ],
      "tag": "Ecuaciones con radicales",
      "difficulty": 3,
      "bookSource": {
        "course": "precalculo",
        "page": 63,
        "printedPage": 63,
        "section": "4.6 · Práctica 1",
        "exercise": "2c",
        "crop": {
          "x": 0.12,
          "y": 0.475,
          "width": 0.3,
          "height": 0.026
        }
      },
      "math": "\\sqrt{2x+1}=x-7",
      "universe": [
        "4",
        "7",
        "12",
        "-1/2"
      ]
    }
  },
  {
    "course": "discreta",
    "lessonTitle": "Tablas de verdad",
    "question": {
      "id": "discreta-libro-56-2a",
      "type": "choice",
      "prompt": "Clasificá la proposición: ¬(P→Q)↔(P∧¬Q)",
      "answer": "Tautología",
      "explanation": "Evaluá todas las asignaciones. La columna final es V en todas las filas.",
      "hints": [
        "Recordá: todas V es tautología; todas F, contradicción; una mezcla, contingencia.",
        "Evaluá todas las asignaciones. La columna final es V en todas las filas."
      ],
      "tag": "Tablas de verdad",
      "difficulty": 2,
      "bookSource": {
        "course": "discreta",
        "page": 56,
        "printedPage": 54,
        "section": "1.2 · Conectivas lógicas",
        "exercise": "2a",
        "crop": {
          "x": 0.15,
          "y": 0.118,
          "width": 0.71,
          "height": 0.222
        }
      },
      "options": [
        "Tautología",
        "Contradicción",
        "Contingencia"
      ],
      "expression": "¬(P→Q)↔(P∧¬Q)"
    }
  },
  {
    "course": "discreta",
    "lessonTitle": "Tablas de verdad",
    "question": {
      "id": "discreta-libro-56-2c",
      "type": "choice",
      "prompt": "Clasificá la proposición: (P∨Q)→(Q→(P∧Q))",
      "answer": "Contingencia",
      "explanation": "Si P=F y Q=V, P∨Q es V y Q→(P∧Q) es F: la implicación completa es F. Las otras tres filas dan V; es una contingencia.",
      "hints": [
        "Recordá: todas V es tautología; todas F, contradicción; una mezcla, contingencia.",
        "Si P=F y Q=V, P∨Q es V y Q→(P∧Q) es F: la implicación completa es F. Las otras tres filas dan V; es una contingencia."
      ],
      "tag": "Tablas de verdad",
      "difficulty": 2,
      "bookSource": {
        "course": "discreta",
        "page": 56,
        "printedPage": 54,
        "section": "1.2 · Conectivas lógicas",
        "exercise": "2c",
        "crop": {
          "x": 0.15,
          "y": 0.118,
          "width": 0.71,
          "height": 0.222
        }
      },
      "options": [
        "Tautología",
        "Contradicción",
        "Contingencia"
      ],
      "expression": "(P∨Q)→(Q→(P∧Q))"
    }
  },
  {
    "course": "discreta",
    "lessonTitle": "Tablas de verdad",
    "question": {
      "id": "discreta-libro-56-2d",
      "type": "choice",
      "prompt": "Clasificá la proposición: ((P→Q)→R)↔((P∧¬R)→¬Q)",
      "answer": "Contingencia",
      "explanation": "Evaluá todas las asignaciones. Hay filas V y filas F; por ejemplo P=V,Q=V,R=F da F y P=V,Q=V,R=V da V.",
      "hints": [
        "Recordá: todas V es tautología; todas F, contradicción; una mezcla, contingencia.",
        "Evaluá todas las asignaciones. Hay filas V y filas F; por ejemplo P=V,Q=V,R=F da F y P=V,Q=V,R=V da V."
      ],
      "tag": "Tablas de verdad",
      "difficulty": 2,
      "bookSource": {
        "course": "discreta",
        "page": 56,
        "printedPage": 54,
        "section": "1.2 · Conectivas lógicas",
        "exercise": "2d",
        "crop": {
          "x": 0.15,
          "y": 0.118,
          "width": 0.71,
          "height": 0.222
        }
      },
      "options": [
        "Tautología",
        "Contradicción",
        "Contingencia"
      ],
      "expression": "((P→Q)→R)↔((P∧¬R)→¬Q)"
    }
  },
  {
    "course": "discreta",
    "lessonTitle": "Tablas de verdad",
    "question": {
      "id": "discreta-libro-56-2a-tabla",
      "type": "table",
      "prompt": "Completá la columna final de ¬(P→Q)↔(P∧¬Q).",
      "answer": [
        "V",
        "V",
        "V",
        "V"
      ],
      "explanation": "Una implicación solo es F cuando su antecedente es V y su consecuente F. En las cuatro filas de esta proposición, el resultado es V.",
      "hints": [
        "Calculá primero las expresiones dentro de paréntesis.",
        "Una implicación solo es F cuando su antecedente es V y su consecuente F. En las cuatro filas de esta proposición, el resultado es V."
      ],
      "tag": "Tablas de verdad",
      "difficulty": 2,
      "bookSource": {
        "course": "discreta",
        "page": 56,
        "printedPage": 54,
        "section": "1.2 · Conectivas lógicas",
        "exercise": "2a-tabla",
        "crop": {
          "x": 0.15,
          "y": 0.118,
          "width": 0.71,
          "height": 0.222
        },
        "adaptation": "Paso guiado del inciso 2a: completar su tabla antes de clasificar."
      },
      "expression": "¬(P→Q)↔(P∧¬Q)",
      "variables": [
        "P",
        "Q"
      ]
    }
  },
  {
    "course": "discreta",
    "lessonTitle": "Tablas de verdad",
    "question": {
      "id": "discreta-libro-56-2c-tabla",
      "type": "table",
      "prompt": "Completá la columna final de (P∨Q)→(Q→(P∧Q)).",
      "answer": [
        "V",
        "V",
        "F",
        "V"
      ],
      "explanation": "En orden (V,V), (V,F), (F,V), (F,F), la columna final es V,V,F,V. En la tercera fila, Q→(P∧Q) es F y su antecedente exterior P∨Q es V.",
      "hints": [
        "Calculá primero las expresiones dentro de paréntesis.",
        "En orden (V,V), (V,F), (F,V), (F,F), la columna final es V,V,F,V. En la tercera fila, Q→(P∧Q) es F y su antecedente exterior P∨Q es V."
      ],
      "tag": "Tablas de verdad",
      "difficulty": 2,
      "bookSource": {
        "course": "discreta",
        "page": 56,
        "printedPage": 54,
        "section": "1.2 · Conectivas lógicas",
        "exercise": "2c-tabla",
        "crop": {
          "x": 0.15,
          "y": 0.118,
          "width": 0.71,
          "height": 0.222
        },
        "adaptation": "Paso guiado del inciso 2c: completar su tabla antes de clasificar."
      },
      "expression": "(P∨Q)→(Q→(P∧Q))",
      "variables": [
        "P",
        "Q"
      ]
    }
  },
  {
    "course": "discreta",
    "lessonTitle": "Equivalencias y simplificación",
    "question": {
      "id": "discreta-libro-63-1",
      "type": "logic",
      "prompt": "Simplificá P∨¬(¬R∨P)∨R. Usá 1 para verdadero y 0 para falso.",
      "answer": "P∨R",
      "explanation": "De Morgan da P∨(R∧¬P)∨R. Absorción: R∨(R∧¬P)=R; queda P∨R.",
      "hints": [
        "Aplicá De Morgan y buscá absorción o una proposición junto a su negación.",
        "De Morgan da P∨(R∧¬P)∨R. Absorción: R∨(R∧¬P)=R; queda P∨R."
      ],
      "tag": "Equivalencias y simplificación",
      "difficulty": 2,
      "bookSource": {
        "course": "discreta",
        "page": 63,
        "printedPage": 61,
        "section": "1.3 · Leyes de la lógica",
        "exercise": "1",
        "crop": {
          "x": 0.17,
          "y": 0.204,
          "width": 0.7,
          "height": 0.039
        }
      },
      "expression": "P∨¬(¬R∨P)∨R"
    }
  },
  {
    "course": "discreta",
    "lessonTitle": "Equivalencias y simplificación",
    "question": {
      "id": "discreta-libro-63-2",
      "type": "logic",
      "prompt": "Simplificá (P↔R)∧¬(¬P∨R). Usá 1 para verdadero y 0 para falso.",
      "answer": "0",
      "explanation": "De Morgan da P∧¬R. Esos valores hacen falso P↔R; por tanto la conjunción es siempre falsa.",
      "hints": [
        "Aplicá De Morgan y buscá absorción o una proposición junto a su negación.",
        "De Morgan da P∧¬R. Esos valores hacen falso P↔R; por tanto la conjunción es siempre falsa."
      ],
      "tag": "Equivalencias y simplificación",
      "difficulty": 2,
      "bookSource": {
        "course": "discreta",
        "page": 63,
        "printedPage": 61,
        "section": "1.3 · Leyes de la lógica",
        "exercise": "2",
        "crop": {
          "x": 0.17,
          "y": 0.242,
          "width": 0.7,
          "height": 0.039
        }
      },
      "expression": "(P↔R)∧¬(¬P∨R)"
    }
  },
  {
    "course": "discreta",
    "lessonTitle": "Equivalencias y simplificación",
    "question": {
      "id": "discreta-libro-63-4",
      "type": "logic",
      "prompt": "Simplificá ((¬P∨Q)∧P)→Q. Usá 1 para verdadero y 0 para falso.",
      "answer": "1",
      "explanation": "El antecedente se reduce a P∧Q. De (P∧Q)→Q resulta una tautología.",
      "hints": [
        "Aplicá De Morgan y buscá absorción o una proposición junto a su negación.",
        "El antecedente se reduce a P∧Q. De (P∧Q)→Q resulta una tautología."
      ],
      "tag": "Equivalencias y simplificación",
      "difficulty": 2,
      "bookSource": {
        "course": "discreta",
        "page": 63,
        "printedPage": 61,
        "section": "1.3 · Leyes de la lógica",
        "exercise": "4",
        "crop": {
          "x": 0.17,
          "y": 0.317,
          "width": 0.7,
          "height": 0.039
        }
      },
      "expression": "((¬P∨Q)∧P)→Q"
    }
  },
  {
    "course": "discreta",
    "lessonTitle": "Equivalencias y simplificación",
    "question": {
      "id": "discreta-libro-63-5",
      "type": "logic",
      "prompt": "Simplificá ((¬P∧Q)∨¬(Q∨P))∧((P∨R)∧(P∨¬R)). Usá 1 para verdadero y 0 para falso.",
      "answer": "0",
      "explanation": "El primer bloque se reduce a ¬P; el segundo a P. La conjunción ¬P∧P es falsa.",
      "hints": [
        "Aplicá De Morgan y buscá absorción o una proposición junto a su negación.",
        "El primer bloque se reduce a ¬P; el segundo a P. La conjunción ¬P∧P es falsa."
      ],
      "tag": "Equivalencias y simplificación",
      "difficulty": 2,
      "bookSource": {
        "course": "discreta",
        "page": 63,
        "printedPage": 61,
        "section": "1.3 · Leyes de la lógica",
        "exercise": "5",
        "crop": {
          "x": 0.17,
          "y": 0.355,
          "width": 0.7,
          "height": 0.039
        }
      },
      "expression": "((¬P∧Q)∨¬(Q∨P))∧((P∨R)∧(P∨¬R))"
    }
  },
  {
    "course": "discreta",
    "lessonTitle": "Reglas de inferencia",
    "question": {
      "id": "discreta-libro-73-1b",
      "type": "order",
      "prompt": "Premisas: 1) Q→¬R; 2) P∨R; 3) Q.\nOrdená estas líneas derivadas para demostrar P∧Q.",
      "answer": [
        "¬R · Modus ponens (premisas 1 y 3)",
        "P · Silogismo disyuntivo (premisa 2 y ¬R)",
        "P∧Q · Conjunción (P y premisa 3)"
      ],
      "explanation": "De Q y Q→¬R obtenés ¬R por modus ponens. De P∨R y ¬R obtenés P. Finalmente, juntá P y Q por conjunción.",
      "hints": [
        "Empezá por aplicar modus ponens a la premisa Q.",
        "De Q y Q→¬R obtenés ¬R por modus ponens. De P∨R y ¬R obtenés P. Finalmente, juntá P y Q por conjunción."
      ],
      "tag": "Reglas de inferencia",
      "difficulty": 2,
      "bookSource": {
        "course": "discreta",
        "page": 73,
        "printedPage": 71,
        "section": "1.4 · Inferencias lógicas",
        "exercise": "1b",
        "crop": {
          "x": 0.2,
          "y": 0.281,
          "width": 0.69,
          "height": 0.036
        },
        "adaptation": "Demostración guiada: ordenar líneas y justificaciones, en lugar de escribir una prueba libre."
      },
      "options": [
        "¬R · Modus ponens (premisas 1 y 3)",
        "P · Silogismo disyuntivo (premisa 2 y ¬R)",
        "P∧Q · Conjunción (P y premisa 3)"
      ]
    }
  },
  {
    "course": "discreta",
    "lessonTitle": "Demostraciones y falacias",
    "question": {
      "id": "discreta-libro-73-1a",
      "type": "guidedproof",
      "prompt": "Demostrá P a partir de las premisas. Escribí cada conclusión y justificá la regla antes de pasar al siguiente paso.",
      "answer": [
        "¬R · Modus tollens (premisas 2 y 3)",
        "¬R∨¬S · Adición",
        "¬(R∧S) · De Morgan",
        "¬(¬P∨¬Q) · Modus tollens (premisa 1)",
        "P∧Q · De Morgan y doble negación",
        "P · Simplificación"
      ],
      "explanation": "La cadena niega R mediante modus tollens, niega R∧S mediante adición y De Morgan, aplica modus tollens a la primera premisa y termina con De Morgan, doble negación y simplificación.",
      "hints": [
        "De R→T y ¬T podés deducir ¬R, no R.",
        "La cadena niega R mediante modus tollens, niega R∧S mediante adición y De Morgan, aplica modus tollens a la primera premisa y termina con De Morgan, doble negación y simplificación."
      ],
      "tag": "Demostraciones y falacias",
      "difficulty": 3,
      "bookSource": {
        "course": "discreta",
        "page": 73,
        "printedPage": 71,
        "section": "1.4 · Inferencias lógicas",
        "exercise": "1a",
        "crop": {
          "x": 0.2,
          "y": 0.251,
          "width": 0.69,
          "height": 0.033
        },
        "adaptation": "Demostración guiada: ordenar una cadena válida con sus leyes."
      },
      "premises": [
        "(¬P∨¬Q)→(R∧S)",
        "R→T",
        "¬T"
      ],
      "guidedSteps": [
        { "expression": "¬R", "rule": "Modus tollens", "hint": "Usá R→T junto con ¬T: si R fuera verdadero, T tendría que serlo." },
        { "expression": "¬R∨¬S", "rule": "Adición", "hint": "Desde ¬R podés agregar una alternativa disyuntiva sin perder verdad." },
        { "expression": "¬(R∧S)", "rule": "De Morgan", "hint": "Convertí la disyunción de negaciones en la negación de una conjunción." },
        { "expression": "¬(¬P∨¬Q)", "rule": "Modus tollens", "hint": "Aplicá modus tollens a la primera premisa: negaste su consecuente R∧S." },
        { "expression": "P∧Q", "rule": "De Morgan + doble negación", "hint": "Negar (¬P∨¬Q) produce una conjunción; luego se eliminan las dobles negaciones." },
        { "expression": "P", "rule": "Simplificación", "hint": "De una conjunción verdadera podés tomar uno de sus componentes." }
      ],
      "options": [
        "Modus tollens",
        "Adición",
        "De Morgan",
        "De Morgan + doble negación",
        "Simplificación",
        "Modus ponens",
        "Silogismo disyuntivo",
        "Conjunción"
      ]
    }
  },
  {
    "course": "discreta",
    "lessonTitle": "Universal y existencial",
    "question": {
      "id": "discreta-libro-94-2b-ii",
      "type": "choice",
      "prompt": "Universo: Juan, Raquel, Pedro, Rosa y Francis. Juan, Raquel y Pedro son casados. Pedro y Raquel tienen casa propia; los demás alquilan. Pedro y Rosa tienen auto. Todos excepto Pedro estudian en la universidad.\nCP: casa propia; E: estudia. Evaluá ∀x[CP(x)∨E(x)].",
      "answer": "Verdadero",
      "explanation": "Pedro tiene casa propia; todos los demás estudian. Cada persona satisface al menos uno de los predicados.",
      "hints": [
        "∀x(P∨Q) no equivale en general a (∀xP)∨(∀xQ).",
        "Pedro tiene casa propia; todos los demás estudian. Cada persona satisface al menos uno de los predicados."
      ],
      "tag": "Universal y existencial",
      "difficulty": 2,
      "bookSource": {
        "course": "discreta",
        "page": 94,
        "printedPage": 92,
        "section": "1.5 · Predicados y cuantificadores",
        "exercise": "2b.ii",
        "crop": {
          "x": 0.15,
          "y": 0.302,
          "width": 0.71,
          "height": 0.38
        }
      },
      "options": [
        "Verdadero",
        "Falso"
      ]
    }
  },
  {
    "course": "discreta",
    "lessonTitle": "Universal y existencial",
    "question": {
      "id": "discreta-libro-94-2b-iii",
      "type": "choice",
      "prompt": "Universo: Juan, Raquel, Pedro, Rosa y Francis. Juan, Raquel y Pedro son casados. Pedro y Raquel tienen casa propia; los demás alquilan. Pedro y Rosa tienen auto. Todos excepto Pedro estudian en la universidad.\nCP: casa propia; E: estudia. Evaluá ∀x[CP(x)]∨∀x[E(x)].",
      "answer": "Falso",
      "explanation": "No todos tienen casa propia y no todos estudian (Pedro no estudia). Las dos proposiciones universales son falsas.",
      "hints": [
        "∀x(P∨Q) no equivale en general a (∀xP)∨(∀xQ).",
        "No todos tienen casa propia y no todos estudian (Pedro no estudia). Las dos proposiciones universales son falsas."
      ],
      "tag": "Universal y existencial",
      "difficulty": 2,
      "bookSource": {
        "course": "discreta",
        "page": 94,
        "printedPage": 92,
        "section": "1.5 · Predicados y cuantificadores",
        "exercise": "2b.iii",
        "crop": {
          "x": 0.15,
          "y": 0.302,
          "width": 0.71,
          "height": 0.38
        }
      },
      "options": [
        "Verdadero",
        "Falso"
      ]
    }
  },
  {
    "course": "discreta",
    "lessonTitle": "Operaciones con conjuntos",
    "question": {
      "id": "discreta-libro-123-1a",
      "type": "set",
      "prompt": "A={a,b,c}, B={c,d,e} y C={c,e,f,g}.\nCalculá A×(B−C).",
      "answer": [
        "(a,d)",
        "(b,d)",
        "(c,d)"
      ],
      "explanation": "B−C={d}. Emparejá cada elemento de A con d; el orden de cada par importa.",
      "hints": [
        "La diferencia A−B quita los elementos de B; △ conserva los que están en solo uno de los conjuntos.",
        "B−C={d}. Emparejá cada elemento de A con d; el orden de cada par importa."
      ],
      "tag": "Operaciones con conjuntos",
      "difficulty": 2,
      "bookSource": {
        "course": "discreta",
        "page": 123,
        "printedPage": 121,
        "section": "2.1 · Definiciones y operaciones",
        "exercise": "1a",
        "crop": {
          "x": 0.17,
          "y": 0.662,
          "width": 0.71,
          "height": 0.135
        }
      },
      "universe": [
        "(a,d)",
        "(b,d)",
        "(c,d)",
        "(d,a)",
        "(a,c)",
        "(b,e)"
      ]
    }
  },
  {
    "course": "discreta",
    "lessonTitle": "Operaciones con conjuntos",
    "question": {
      "id": "discreta-libro-123-1b",
      "type": "set",
      "prompt": "A={a,b,c}, B={c,d,e} y C={c,e,f,g}.\nCalculá P(A−B), el conjunto potencia.",
      "answer": [
        "∅",
        "{a}",
        "{b}",
        "{a,b}"
      ],
      "explanation": "A−B={a,b}. Sus cuatro subconjuntos son ∅, {a}, {b} y {a,b}.",
      "hints": [
        "La diferencia A−B quita los elementos de B; △ conserva los que están en solo uno de los conjuntos.",
        "A−B={a,b}. Sus cuatro subconjuntos son ∅, {a}, {b} y {a,b}."
      ],
      "tag": "Operaciones con conjuntos",
      "difficulty": 2,
      "bookSource": {
        "course": "discreta",
        "page": 123,
        "printedPage": 121,
        "section": "2.1 · Definiciones y operaciones",
        "exercise": "1b",
        "crop": {
          "x": 0.17,
          "y": 0.662,
          "width": 0.71,
          "height": 0.135
        }
      },
      "universe": [
        "∅",
        "{a}",
        "{b}",
        "{c}",
        "{a,b}",
        "{a,c}",
        "{a,b,c}"
      ]
    }
  },
  {
    "course": "discreta",
    "lessonTitle": "Operaciones con conjuntos",
    "question": {
      "id": "discreta-libro-123-1c",
      "type": "set",
      "prompt": "A={a,b,c}, B={c,d,e} y C={c,e,f,g}.\nCalculá (A△C)∩B.",
      "answer": [
        "e"
      ],
      "explanation": "A△C={a,b,e,f,g}. Al intersectar con B={c,d,e}, solo queda e.",
      "hints": [
        "La diferencia A−B quita los elementos de B; △ conserva los que están en solo uno de los conjuntos.",
        "A△C={a,b,e,f,g}. Al intersectar con B={c,d,e}, solo queda e."
      ],
      "tag": "Operaciones con conjuntos",
      "difficulty": 2,
      "bookSource": {
        "course": "discreta",
        "page": 123,
        "printedPage": 121,
        "section": "2.1 · Definiciones y operaciones",
        "exercise": "1c",
        "crop": {
          "x": 0.17,
          "y": 0.662,
          "width": 0.71,
          "height": 0.135
        }
      },
      "universe": [
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
        "g"
      ]
    }
  },
  {
    "course": "discreta",
    "lessonTitle": "Operaciones con conjuntos",
    "question": {
      "id": "discreta-libro-123-2",
      "type": "set",
      "prompt": "U={a,b,c,d,e,f}, A={a,b,e}, B={c,e,f}, C={b,e,f}.\nCalculá ([(A−B)∪C]∩(B△C)ᶜ)∪{d}. El complemento ᶜ se toma respecto de U.",
      "answer": [
        "a",
        "d",
        "e",
        "f"
      ],
      "explanation": "A−B={a,b}; al unir C obtenés {a,b,e,f}. B△C={b,c}; su complemento en U es {a,d,e,f}. La intersección da {a,e,f}; al unir {d}, resulta {a,d,e,f}.",
      "hints": [
        "La barra del original indica complemento: calculá U−(B△C) antes de intersectar.",
        "A−B={a,b}; al unir C obtenés {a,b,e,f}. B△C={b,c}; su complemento en U es {a,d,e,f}. La intersección da {a,e,f}; al unir {d}, resulta {a,d,e,f}."
      ],
      "tag": "Operaciones con conjuntos",
      "difficulty": 3,
      "bookSource": {
        "course": "discreta",
        "page": 123,
        "printedPage": 121,
        "section": "2.1 · Definiciones y operaciones",
        "exercise": "2",
        "crop": {
          "x": 0.17,
          "y": 0.797,
          "width": 0.71,
          "height": 0.057
        }
      },
      "universe": [
        "a",
        "b",
        "c",
        "d",
        "e",
        "f"
      ]
    }
  },
  {
    "course": "discreta",
    "lessonTitle": "Operaciones con conjuntos",
    "question": {
      "id": "discreta-libro-124-5a",
      "type": "set",
      "prompt": "A={a,b}, B={b,c,d}, C={a,d}. Calculá (A∪C)△B.",
      "answer": [
        "a",
        "c"
      ],
      "explanation": "A∪C={a,b,d}; los elementos que están solo en uno de ese conjunto y B son a y c.",
      "hints": [
        "Calculá primero la operación interior y después construí el conjunto pedido.",
        "A∪C={a,b,d}; los elementos que están solo en uno de ese conjunto y B son a y c."
      ],
      "tag": "Operaciones con conjuntos",
      "difficulty": 2,
      "bookSource": {
        "course": "discreta",
        "page": 124,
        "printedPage": 122,
        "section": "2.1 · Definiciones y operaciones",
        "exercise": "5a",
        "crop": {
          "x": 0.15,
          "y": 0.255,
          "width": 0.71,
          "height": 0.106
        }
      },
      "universe": [
        "a",
        "b",
        "c",
        "d",
        "e",
        "f"
      ]
    }
  },
  {
    "course": "discreta",
    "lessonTitle": "Operaciones con conjuntos",
    "question": {
      "id": "discreta-libro-124-6a",
      "type": "set",
      "prompt": "A={3,4,5} y B={3,5,8,9}. Calculá P(A∩B).",
      "answer": [
        "∅",
        "{3}",
        "{5}",
        "{3,5}"
      ],
      "explanation": "A∩B={3,5}; su potencia contiene cuatro subconjuntos.",
      "hints": [
        "Calculá primero la operación interior y después construí el conjunto pedido.",
        "A∩B={3,5}; su potencia contiene cuatro subconjuntos."
      ],
      "tag": "Operaciones con conjuntos",
      "difficulty": 2,
      "bookSource": {
        "course": "discreta",
        "page": 124,
        "printedPage": 122,
        "section": "2.1 · Definiciones y operaciones",
        "exercise": "6a",
        "crop": {
          "x": 0.15,
          "y": 0.419,
          "width": 0.71,
          "height": 0.09
        }
      },
      "universe": [
        "∅",
        "{3}",
        "{4}",
        "{5}",
        "{3,5}",
        "{3,4,5}"
      ]
    }
  },
  {
    "course": "discreta",
    "lessonTitle": "Operaciones con conjuntos",
    "question": {
      "id": "discreta-libro-124-6b",
      "type": "set",
      "prompt": "U={1,2,3,4,5,6,7,8,9}, A={3,4,5} y B={3,5,8,9}. Calculá (B−A)ᶜ. El complemento se toma respecto de U.",
      "answer": [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7"
      ],
      "explanation": "B−A={8,9}. La barra del libro indica su complemento en U: {1,2,3,4,5,6,7}.",
      "hints": [
        "Primero restá A de B. Después quitá ese resultado del universo U.",
        "B−A={8,9}. La barra del libro indica su complemento en U: {1,2,3,4,5,6,7}."
      ],
      "tag": "Operaciones con conjuntos",
      "difficulty": 2,
      "bookSource": {
        "course": "discreta",
        "page": 124,
        "printedPage": 122,
        "section": "2.1 · Definiciones y operaciones",
        "exercise": "6b",
        "crop": {
          "x": 0.15,
          "y": 0.419,
          "width": 0.71,
          "height": 0.121
        }
      },
      "universe": [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9"
      ]
    }
  },
  {
    "course": "discreta",
    "lessonTitle": "Venn y leyes de conjuntos",
    "question": {
      "id": "discreta-libro-137-1",
      "type": "venn",
      "prompt": "Representá (A−B)∪(B∩C). Tocá todas las regiones que pertenecen al conjunto.",
      "answer": [
        "100",
        "101",
        "011",
        "111"
      ],
      "explanation": "A−B incluye 100 y 101. B∩C incluye 011 y 111. La unión reúne esas cuatro regiones.",
      "hints": [
        "Buscá A fuera de B; después agregá toda la intersección entre B y C.",
        "A−B incluye 100 y 101. B∩C incluye 011 y 111. La unión reúne esas cuatro regiones."
      ],
      "tag": "Venn y leyes de conjuntos",
      "difficulty": 2,
      "bookSource": {
        "course": "discreta",
        "page": 137,
        "printedPage": 135,
        "section": "2.3 · Diagramas de Venn",
        "exercise": "1",
        "crop": {
          "x": 0.17,
          "y": 0.53,
          "width": 0.71,
          "height": 0.035
        }
      }
    }
  },
  {
    "course": "discreta",
    "lessonTitle": "Aplicaciones e inclusión-exclusión",
    "question": {
      "id": "discreta-libro-149-3a",
      "type": "text",
      "prompt": "Encuesta de 135 personas: prensa 70, radio 83, televisión 74; prensa∩radio 50, prensa∩televisión 38, radio∩televisión 41; los tres medios 27.\n¿Cuántas utilizan al menos uno de los medios?",
      "answer": "125",
      "explanation": "70+83+74−50−38−41+27=125. Las 10 personas restantes no usan esos medios.",
      "hints": [
        "Las intersecciones de pares incluyen a quienes están en los tres conjuntos; no los contés dos veces.",
        "70+83+74−50−38−41+27=125. Las 10 personas restantes no usan esos medios."
      ],
      "tag": "Aplicaciones e inclusión-exclusión",
      "difficulty": 3,
      "bookSource": {
        "course": "discreta",
        "page": 149,
        "printedPage": 147,
        "section": "2.5 · Cardinalidad",
        "exercise": "3a",
        "crop": {
          "x": 0.17,
          "y": 0.205,
          "width": 0.71,
          "height": 0.22
        }
      }
    }
  },
  {
    "course": "discreta",
    "lessonTitle": "Aplicaciones e inclusión-exclusión",
    "question": {
      "id": "discreta-libro-149-3b",
      "type": "text",
      "prompt": "Encuesta de 135 personas: prensa 70, radio 83, televisión 74; prensa∩radio 50, prensa∩televisión 38, radio∩televisión 41; los tres medios 27.\n¿Cuántas utilizan exactamente dos?",
      "answer": "48",
      "explanation": "Quitá quienes usan tres de cada intersección de pares: (50−27)+(38−27)+(41−27)=48.",
      "hints": [
        "Las intersecciones de pares incluyen a quienes están en los tres conjuntos; no los contés dos veces.",
        "Quitá quienes usan tres de cada intersección de pares: (50−27)+(38−27)+(41−27)=48."
      ],
      "tag": "Aplicaciones e inclusión-exclusión",
      "difficulty": 3,
      "bookSource": {
        "course": "discreta",
        "page": 149,
        "printedPage": 147,
        "section": "2.5 · Cardinalidad",
        "exercise": "3b",
        "crop": {
          "x": 0.17,
          "y": 0.205,
          "width": 0.71,
          "height": 0.277
        }
      }
    }
  },
  {
    "course": "discreta",
    "lessonTitle": "Aplicaciones e inclusión-exclusión",
    "question": {
      "id": "discreta-libro-150-6a",
      "type": "text",
      "prompt": "120 estudiantes; 100 estudian al menos un idioma. Francés 65, alemán 45, ruso 42; francés∩alemán 20, alemán∩ruso 15; los tres idiomas 8.\n¿Cuántos estudian francés y ruso?",
      "answer": "25",
      "explanation": "100=65+45+42−20−15−|F∩R|+8. Despejá: |F∩R|=25, incluyendo los 8 que estudian los tres.",
      "hints": [
        "Usá inclusión-exclusión para obtener primero la intersección que falta.",
        "100=65+45+42−20−15−|F∩R|+8. Despejá: |F∩R|=25, incluyendo los 8 que estudian los tres."
      ],
      "tag": "Aplicaciones e inclusión-exclusión",
      "difficulty": 3,
      "bookSource": {
        "course": "discreta",
        "page": 150,
        "printedPage": 148,
        "section": "2.5 · Cardinalidad",
        "exercise": "6a",
        "crop": {
          "x": 0.15,
          "y": 0.352,
          "width": 0.71,
          "height": 0.19600000000000006
        }
      }
    }
  },
  {
    "course": "discreta",
    "lessonTitle": "Aplicaciones e inclusión-exclusión",
    "question": {
      "id": "discreta-libro-150-6c",
      "type": "text",
      "prompt": "120 estudiantes; 100 estudian al menos un idioma. Francés 65, alemán 45, ruso 42; francés∩alemán 20, alemán∩ruso 15; los tres idiomas 8.\n¿Cuántos estudian exactamente uno de los idiomas?",
      "answer": "56",
      "explanation": "F∩R=25. Solo francés: 65−20−25+8=28; solo alemán: 45−20−15+8=18; solo ruso: 42−25−15+8=10. Sumá 28+18+10=56.",
      "hints": [
        "Usá inclusión-exclusión para obtener primero la intersección que falta.",
        "F∩R=25. Solo francés: 65−20−25+8=28; solo alemán: 45−20−15+8=18; solo ruso: 42−25−15+8=10. Sumá 28+18+10=56."
      ],
      "tag": "Aplicaciones e inclusión-exclusión",
      "difficulty": 3,
      "bookSource": {
        "course": "discreta",
        "page": 150,
        "printedPage": 148,
        "section": "2.5 · Cardinalidad",
        "exercise": "6c",
        "crop": {
          "x": 0.15,
          "y": 0.352,
          "width": 0.71,
          "height": 0.28400000000000003
        }
      }
    }
  },
  {
    "course": "discreta",
    "lessonTitle": "Aplicaciones e inclusión-exclusión",
    "question": {
      "id": "discreta-libro-151-8a",
      "type": "text",
      "prompt": "|A|=2 y |B|=3. Calculá |P(A)×P(B)|.",
      "answer": "32",
      "explanation": "|P(A)|=2²=4 y |P(B)|=2³=8. El producto cartesiano tiene 4·8=32 elementos.",
      "hints": [
        "|P(X)|=2 elevado a |X|; |X×Y|=|X|·|Y|. Respetá el orden de las operaciones.",
        "|P(A)|=2²=4 y |P(B)|=2³=8. El producto cartesiano tiene 4·8=32 elementos."
      ],
      "tag": "Aplicaciones e inclusión-exclusión",
      "difficulty": 2,
      "bookSource": {
        "course": "discreta",
        "page": 151,
        "printedPage": 149,
        "section": "2.5 · Cardinalidad",
        "exercise": "8a",
        "crop": {
          "x": 0.17,
          "y": 0.115,
          "width": 0.5,
          "height": 0.074
        }
      }
    }
  },
  {
    "course": "discreta",
    "lessonTitle": "Aplicaciones e inclusión-exclusión",
    "question": {
      "id": "discreta-libro-151-8b",
      "type": "text",
      "prompt": "|A|=2 y |B|=3. Calculá |P(A×B)|.",
      "answer": "64",
      "explanation": "Primero |A×B|=2·3=6. Su conjunto potencia tiene 2⁶=64 elementos.",
      "hints": [
        "|P(X)|=2 elevado a |X|; |X×Y|=|X|·|Y|. Respetá el orden de las operaciones.",
        "Primero |A×B|=2·3=6. Su conjunto potencia tiene 2⁶=64 elementos."
      ],
      "tag": "Aplicaciones e inclusión-exclusión",
      "difficulty": 2,
      "bookSource": {
        "course": "discreta",
        "page": 151,
        "printedPage": 149,
        "section": "2.5 · Cardinalidad",
        "exercise": "8b",
        "crop": {
          "x": 0.17,
          "y": 0.115,
          "width": 0.5,
          "height": 0.106
        }
      }
    }
  },
  {
    "course": "discreta",
    "lessonTitle": "Aplicaciones e inclusión-exclusión",
    "question": {
      "id": "discreta-libro-151-9a",
      "type": "text",
      "prompt": "|A|=3 y |B|=5. Calculá |P(A)×B|.",
      "answer": "40",
      "explanation": "El conjunto potencia de A tiene 2³=8 elementos. El producto tiene 8·5=40.",
      "hints": [
        "|P(X)|=2 elevado a |X|; |X×Y|=|X|·|Y|. Respetá el orden de las operaciones.",
        "El conjunto potencia de A tiene 2³=8 elementos. El producto tiene 8·5=40."
      ],
      "tag": "Aplicaciones e inclusión-exclusión",
      "difficulty": 2,
      "bookSource": {
        "course": "discreta",
        "page": 151,
        "printedPage": 149,
        "section": "2.5 · Cardinalidad",
        "exercise": "9a",
        "crop": {
          "x": 0.17,
          "y": 0.23,
          "width": 0.5,
          "height": 0.074
        }
      }
    }
  },
  {
    "course": "discreta",
    "lessonTitle": "Aplicaciones e inclusión-exclusión",
    "question": {
      "id": "discreta-libro-151-10a",
      "type": "text",
      "prompt": "|A|=2, |B|=4 y |A∩B|=1. Calculá |P(B−A)×A|.",
      "answer": "16",
      "explanation": "B−A tiene 4−1=3 elementos. P(B−A) tiene 2³=8. Multiplicá por |A|=2: 16.",
      "hints": [
        "|P(X)|=2 elevado a |X|; |X×Y|=|X|·|Y|. Respetá el orden de las operaciones.",
        "B−A tiene 4−1=3 elementos. P(B−A) tiene 2³=8. Multiplicá por |A|=2: 16."
      ],
      "tag": "Aplicaciones e inclusión-exclusión",
      "difficulty": 2,
      "bookSource": {
        "course": "discreta",
        "page": 151,
        "printedPage": 149,
        "section": "2.5 · Cardinalidad",
        "exercise": "10a",
        "crop": {
          "x": 0.16,
          "y": 0.407,
          "width": 0.72,
          "height": 0.099
        }
      }
    }
  }
];
