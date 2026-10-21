/** Qué es cada nivel, antes del procedimiento. La clave es el título exacto de la lección. */
const briefs: Record<string, [string, string]> = {
  'Proposiciones y conectores': [
    'Una proposición es una oración que es verdadera o falsa, y no las dos cosas a la vez. “2 + 2 = 4” es una proposición; “¿cuánto es 2 + 2?” y “cerrá la puerta” no lo son, porque no tienen valor de verdad.',
    'Los conectores arman proposiciones compuestas. ∧ pide que las dos partes sean verdaderas, ∨ admite una o las dos, y ⊻ pide exactamente una. Negar cambia el valor de una sola proposición.',
  ],
  'Implicación y bicondicional': [
    'P → Q se lee “si P, entonces Q”. Solo falla en un caso: P verdadera y Q falsa. No afirma que P cause Q, ni que P sea verdadera.',
    'P ↔ Q es verdadera cuando P y Q valen lo mismo, las dos verdaderas o las dos falsas. La recíproca Q → P es otra implicación: no siempre dice lo mismo que P → Q.',
  ],
  'Tablas de verdad': [
    'Una tabla de verdad lista todas las combinaciones de verdadero y falso de las proposiciones atómicas y calcula el valor de la fórmula en cada fila. Con n letras distintas hay 2ⁿ filas.',
    'Si la columna final es siempre verdadera, la fórmula es una tautología. Si es siempre falsa, es una contradicción. Si aparecen las dos, es una contingencia.',
  ],
  'Equivalencias y simplificación': [
    'Dos fórmulas son equivalentes cuando tienen la misma tabla de verdad: dicen lo mismo, aunque se vean distintas. Una ley de equivalencia reemplaza una por la otra sin cambiar el valor.',
    'Simplificar es llegar a una fórmula más corta que sigue siendo equivalente. No es “tachar letras”: cada paso tiene que ser una equivalencia, por ejemplo De Morgan o la distributiva.',
  ],
  'Traducción y contraejemplos': [
    'Traducir es pasar una oración del castellano a símbolos sin cambiar lo que afirma. “Y”, “o”, “si… entonces” y “no” tienen un conector fijo; el resto del trabajo es decidir qué letra es cada idea.',
    'Un contraejemplo es un caso concreto donde las premisas valen y la conclusión no. Alcanza uno para mostrar que un razonamiento no es válido. Varios ejemplos favorables no demuestran que siempre valga.',
  ],
  'Circuitos lógicos': [
    'Un circuito lógico es la misma álgebra de proposiciones, dibujada con compuertas. La compuerta AND es ∧, OR es ∨ y NOT es ¬. La salida es 1 cuando la fórmula es verdadera y 0 cuando es falsa.',
    'Dos circuitos son equivalentes si, para las mismas entradas, dan la misma salida. Simplificar el circuito es simplificar la fórmula: menos compuertas, el mismo comportamiento.',
  ],
  'Reglas de inferencia': [
    'Una regla de inferencia saca una conclusión nueva a partir de premisas que ya están. No transforma una fórmula en otra equivalente: agrega una línea que se sigue de las anteriores.',
    'Modus ponens, por ejemplo, dice: si tenés P → Q y también P, podés escribir Q. La regla no “elige” la conclusión que te conviene; solo justifica la que el patrón permite.',
  ],
  'Demostraciones y falacias': [
    'Una demostración es una lista de líneas donde cada una es una premisa o se obtiene de líneas anteriores por una regla. Llegar a la conclusión con esas reglas es lo que la justifica.',
    'Una falacia parece una regla y no lo es. Afirmar el consecuente (de P → Q y Q concluir P) es el ejemplo típico: la tabla muestra casos en los que las premisas valen y la conclusión no.',
  ],
  'Predicados y universos': [
    'Un predicado es una oración con un lugar vacío. P(x): “x es par” no es verdadera ni falsa hasta que se dice qué es x y de qué universo se habla. El universo es el conjunto de objetos que x puede ser.',
    'En este curso ℕ incluye el 0. Cambiar el universo puede cambiar el valor: “todo x es positivo” es falso en ℤ y no se evalúa igual si el universo fueran solo los naturales positivos.',
  ],
  'Universal y existencial': [
    '∀x P(x) dice que todos los elementos del universo cumplen P. Es falsa en cuanto aparece un elemento que no cumple. ∃x P(x) dice que al menos uno cumple; un solo testigo la hace verdadera.',
    '“Existe” no significa “existe exactamente uno”, ni “existe y es único”. Si hace falta uno solo, eso se escribe aparte. El cuantificador siempre mira el universo que el enunciado fijó.',
  ],
  'Negar y distribuir': [
    'Negar un cuantificador lo cambia y mete la negación adentro. ¬∀x P(x) equivale a ∃x ¬P(x): no todos cumplen si hay alguien que falla. ¬∃x P(x) equivale a ∀x ¬P(x): nadie cumple si todos fallan.',
    'Distribuir es pasar ∧ o ∨ a través de un cuantificador solo cuando la ley lo permite. ∀x (P(x) ∧ Q(x)) sí se separa en dos universales. ∀x (P(x) ∨ Q(x)) no se separa en “todo cumple P o todo cumple Q”.',
  ],
  'Cuantificadores anidados': [
    'Cuando hay dos “para todo” o “existe” seguidos, se leen de izquierda a derecha. “Para cada persona hay una madre” deja que la madre cambie.',
    '“Hay una sola madre de todas las personas” pide la misma para todas. No es la misma frase. En el ejercicio se toca V o F.',
  ],
  'Matrices y patrones': [
    'Cuando el universo es finito y chico, un predicado de dos variables se puede ver como una tabla: filas un objeto, columnas el otro, y cada celda dice si la relación se cumple.',
    'La tabla no reemplaza al cuantificador. Sirve para comprobar, en ese universo concreto, si el “para todo” o el “existe” que escribiste es verdadero.',
  ],
  'Pertenencia e inclusión': [
    'x ∈ A significa que x es un elemento de A. A ⊆ B significa que todo elemento de A también está en B. Pertenecer es una relación entre un objeto y un conjunto; incluir es una relación entre dos conjuntos.',
    '1 y {1} no son el mismo objeto. 1 puede pertenecer a un conjunto; {1} es un conjunto de un elemento. ∅ está incluido en cualquier conjunto, pero ∅ no pertenece a cualquier conjunto.',
  ],
  'Operaciones con conjuntos': [
    'Unión, intersección, diferencia y complemento fabrican un conjunto nuevo. A ∪ B junta, A ∩ B se queda con lo común, A − B se queda con lo de A que no está en B, y Aᶜ es lo del universo que no está en A.',
    'El complemento solo tiene sentido si hay un universo. La diferencia A − B no necesita universo y no es lo mismo que Aᶜ. El orden de A − B importa; el de la unión y la intersección, no.',
  ],
  'Intervalos y fronteras': [
    'Un intervalo es un conjunto de números reales entre dos extremos. En este curso ]a, b[ no incluye a ni b, y [a, b] sí los incluye. El corchete que mira hacia afuera es el extremo abierto.',
    '∞ no es un número del conjunto: marca que no hay cota. Por eso se escribe ]−∞, a] y no [−∞, a]. La frontera es el extremo; incluirla o no es exactamente la diferencia entre ≤ y <.',
  ],
  'Venn y leyes de conjuntos': [
    'Un diagrama de Venn dibuja los conjuntos como regiones que se solapan. Cada región es una combinación: solo A, solo B, la intersección, o afuera de los dos. Con tres conjuntos hay ocho regiones, contando el exterior.',
    'Las leyes de conjuntos son las de la lógica, cambiando ∨ por ∪, ∧ por ∩ y ¬ por complemento. (A ∪ B)ᶜ = Aᶜ ∩ Bᶜ es De Morgan. El dibujo ayuda a verlas; la igualdad se justifica con la ley, no con un dibujo solo.',
  ],
  'Aplicaciones e inclusión-exclusión': [
    'Contar una unión no es sumar los tamaños: los elementos de la intersección estarían dos veces. |A ∪ B| = |A| + |B| − |A ∩ B|. Con tres conjuntos se restan los pares y se vuelve a sumar el triple, que se había restado de más.',
    '“Solo A” no es |A|. |A| incluye lo que A comparte con otros. Solo A es |A| menos esas intersecciones. Si el enunciado no da un dato, la región que depende de ese dato no se puede calcular.',
  ],
  'Regiones de Venn': [
    'Un diagrama parte a la gente en zonas: solo el primer grupo, solo el segundo, los dos, o ninguno. El número grande de un grupo incluye a los que también están en otro.',
    '“Solo hipertensión” es el total de hipertensión menos los que además tienen diabetes. La respuesta de estos ejercicios es un número. Si faltara un dato, esa zona no se inventa.',
  ],
  'Leyes de conjuntos de clase': [
    'Una ley dice que dos escrituras son el mismo conjunto, para cualquier A y B. A unido con una parte de A sigue siendo A.',
    '∅ es el conjunto vacío: no tiene elementos. U es el universo, todo lo que se está mirando. El complemento de “A o B” es “ni A ni B”.',
  ],
  'Conjunto potencia y producto': [
    'P(A) es la lista de todos los subconjuntos de A. Siempre entran el vacío y el propio A. Con n elementos hay 2 elevado a n subconjuntos, porque cada uno entra o no entra.',
    'A × B son los pares (a, b), uno de A y uno de B. Se cuentan multiplicando. 1 y {1} no son el mismo objeto: uno es un número y el otro es un conjunto.',
  ],
  'Cardinalidad y conteo': [
    '|A| pregunta cuántos elementos distintos hay. El vacío tiene 0. {5} y {√25} son el mismo conjunto, porque √25 es 5, así que ahí hay un solo elemento.',
    'Unión, potencia y producto se cuentan con los datos que sí están. |P(A)| = 2 elevado a |A|. |A × B| = |A| por |B|. La respuesta es el número, no la lista.',
  ],
  'Introducción y razonamiento lógico': [
    'Razonar, en este curso, es justificar una conclusión a partir de premisas. Un ejemplo a favor ilustra; no demuestra una afirmación sobre todos los casos. Un contraejemplo sí alcanza para rechazar un “todos”.',
    'Una oración que dice “esta oración es falsa” no se puede clasificar como verdadera ni como falsa sin contradecirse. Por eso no toda cadena de palabras es una proposición clásica.',
  ],
  'Formas normales': [
    'Es una manera fija de escribir una fórmula, sin flechas. Una forma conjuntiva es un “y” de varios “o”. Una disyuntiva es un “o” de varios “y”.',
    'Decir lo mismo con otra forma no cambia cuándo es verdadera. En el ejercicio se toca la escritura que ya está armada así, o se escribe la fórmula sin la flecha.',
  ],
  'Inferencias cuantificadas': [
    'Una inferencia cuantificada aplica una regla a un ∀ o un ∃. De ∀x P(x) se puede afirmar P(c) para un elemento c del universo. De P(c) se puede afirmar ∃x P(x). Al revés no vale: un caso no demuestra el “para todo”.',
    'La regla universal se usa sobre un elemento cualquiera, sin propiedades escondidas. Si c se eligió porque ya cumplía otra cosa, esa línea no representa a todos.',
  ],
  'Métodos de demostración': [
    'Demostrar es un método, no una inspiración. Directa: se asume la hipótesis y se llega a la tesis. Por contradicción: se asume lo contrario de la tesis y se llega a un absurdo. Por contrarrecíproco: se prueba ¬Q → ¬P en lugar de P → Q.',
    'Un ejemplo no es una demostración de un universal. Un contraejemplo sí cierra una afirmación falsa. Elegir el método es decidir qué se asume al empezar, no cambiar lo que hay que probar.',
  ],
  'Raíces racionales y factores': [
    'Una raíz de un polinomio P es un número r tal que P(r) = 0. Si los coeficientes son enteros, las raíces racionales posibles, cuando existen, son de la forma ± factor del término independiente sobre factor del coeficiente principal.',
    'Esos candidatos se prueban; no se adivinan. Si P(r) = 0, entonces (x − r) es un factor. Que un número no esté en la lista de candidatos racionales no impide que haya raíces irracionales.',
  ],
  'División sintética': [
    'La división sintética divide un polinomio entre x − r usando solo los coeficientes, en orden descendente. Un hueco, como la ausencia de x², se escribe como coeficiente 0. El último número es el resto.',
    'Resto 0 significa que r es raíz y que x − r divide a P. El resto distinto de 0 significa que no divide. Los números de la fila, salvo el resto, son los coeficientes del cociente.',
  ],
  'Factorización completa': [
    'Factorizar por completo es escribir el polinomio como producto de factores que ya no se pueden partir más dentro de los reales que pide el ejercicio. No es desarrollar: es el camino inverso del producto notable.',
    'Se empieza por el factor común, si lo hay. Después se reconocen diferencias de cuadrados, trinomios o cubos. Un factor lineal (x − r) corresponde a la raíz r. Dejar un trinomio que todavía se factoriza no es la forma completa.',
  ],
  'Fracciones y dominio': [
    'Una fracción algebraica es un cociente de polinomios. El dominio es el conjunto de valores donde el denominador original no es cero. Esos valores excluidos siguen excluidos aunque, después de simplificar, el denominador nuevo ya no se anule.',
    'Simplificar es cancelar factores comunes, no términos sumados. En (x² − 1)/(x − 1) se factoriza y se cancela (x − 1), y x ≠ 1 se conserva. Tachar una x de x + 1 no es cancelar.',
  ],
  'Operar fracciones algebraicas': [
    'Sumar fracciones exige un denominador común: el producto de los denominadores, o un mínimo común múltiplo si ya están factorizados. Se suman los numeradores nuevos y el denominador común se conserva.',
    'Multiplicar es multiplicar numeradores entre sí y denominadores entre sí. Dividir es multiplicar por la fracción recíproca. Después se puede simplificar, sin perder las exclusiones de todos los denominadores que aparecieron.',
  ],
  'Radicales y racionalización': [
    'La raíz cuadrada principal √a, con a ≥ 0, es el único número no negativo cuyo cuadrado es a. Por eso √(x²) = |x| y no x. La raíz cúbica existe para negativos y no usa valor absoluto.',
    'Racionalizar es reescribir una fracción para que el denominador no tenga radicales, multiplicando numerador y denominador por la misma expresión. Si el denominador es una suma con raíces, ese compañero es el conjugado. El valor de la fracción no cambia.',
  ],
  'Conjuntos numéricos': [
    'Los conjuntos numéricos están encajados. ℕ es el de los naturales y en este curso incluye el 0. ℤ agrega los negativos, ℚ los cocientes de enteros con denominador distinto de cero, y ℝ los puntos de la recta, incluidos los que no son cociente.',
    'Decir que un resultado “es un número” no alcanza: hay que decir en qué conjunto vive. √2 está en ℝ y no en ℚ. Una división por cero no está en ningún conjunto de números.',
  ],
  'Signos y jerarquía de operaciones': [
    'La jerarquía fija el orden cuando no hay paréntesis: primero potencias y raíces, después productos y cocientes, al final sumas y restas. Los paréntesis mandan sobre esa jerarquía.',
    'El signo menos es parte de la operación que le sigue, no un adorno. −3² es −(3²) = −9. (−3)² = 9, porque el paréntesis mete el signo dentro de la potencia. No son la misma expresión.',
  ],
  'Fracciones numéricas': [
    'Una fracción a/b, con b ≠ 0, es el número que multiplicado por b da a. No es “dos números sueltos”: es un solo racional. Dos fracciones son iguales cuando sus productos cruzados coinciden.',
    'Sumar es pasar a un denominador común. Multiplicar es multiplicar arriba y abajo. Dividir es multiplicar por el recíproco, que existe solo si el numerador de la segunda fracción no es cero.',
  ],
  'Leyes de potencias': [
    'Una potencia aⁿ, con n natural positivo, es a multiplicado n veces. Las leyes dicen cómo se combinan: misma base se suma el exponente en un producto y se resta en un cociente; una potencia de potencia multiplica exponentes.',
    'a⁰ = 1 si a ≠ 0. a⁻ⁿ es 1/aⁿ, no −aⁿ. El exponente negativo voltea la base, no le cambia el signo. (ab)ⁿ reparte el exponente; aⁿ + bⁿ no se factoriza como (a + b)ⁿ.',
  ],
  'Raíces y valor absoluto': [
    'La raíz enésima pregunta qué número, elevado a n, devuelve el de adentro. Si n es par, el radicando tiene que ser no negativo y la raíz principal es no negativa. Si n es impar, el radicando puede ser negativo.',
    'El valor absoluto |x| es la distancia de x al 0: x si x ≥ 0, y −x si x < 0. Por eso |x| nunca es negativo y √(x²) = |x|. Quitar las barras sin mirar el signo cambia el resultado.',
  ],
  'Variables y valor numérico': [
    'Una variable es un lugar que guarda un número de un conjunto. Una expresión algebraica combina variables y números con operaciones. El valor numérico es lo que queda al sustituir cada variable por un número concreto y operar.',
    'Sustituir no es “reemplazar la letra y ya”. Hay que respetar la jerarquía y los paréntesis. Si la expresión tiene un denominador, el número elegido no puede anularlo.',
  ],
  'Monomios y términos semejantes': [
    'Un monomio es un producto de un número, el coeficiente, por variables elevadas a exponentes. El grado es la suma de esos exponentes. Dos términos son semejantes cuando tienen exactamente las mismas variables con los mismos exponentes.',
    'Solo los semejantes se suman o se restan, y se opera el coeficiente. 3x² y 5x² son semejantes. 3x² y 3x no lo son: la potencia es parte de la identidad del término, no un detalle.',
  ],
  'Suma y resta de polinomios': [
    'Un polinomio es una suma de monomios. Sumar polinomios es agrupar términos semejantes. Restar es sumar el opuesto: se cambia el signo de cada término del polinomio que se resta.',
    'El grado del resultado puede bajar si los términos de mayor grado se cancelan. No se “resta grado con grado”: se restan coeficientes de términos que ya son semejantes.',
  ],
  'Multiplicación y productos notables': [
    'Multiplicar polinomios es distribuir: cada término del primero por cada término del segundo, y después juntar semejantes. Un producto notable es un caso que se puede escribir de una vez, sin distribuir término a término.',
    '(a + b)² no es a² + b². Falta el doble producto 2ab. (a + b)(a − b) = a² − b², y ahí los términos cruzados sí se cancelan. El nombre “notable” no autoriza a saltearse el término del medio cuando existe.',
  ],
  'División de polinomios': [
    'Dividir polinomios es encontrar un cociente y un resto tales que dividendo = divisor · cociente + resto, con el resto de grado menor que el divisor, o resto cero. Es la misma relación que en los enteros.',
    'Resto cero significa que el divisor es un factor. Si el divisor es lineal, x − r, la división sintética hace la misma cuenta con los coeficientes. Un término que falta en el dividendo se escribe con coeficiente 0 antes de empezar.',
  ],
  'Factor común y agrupación': [
    'El factor común es el producto que aparece en todos los términos. Sacarlo es escribir ese producto una vez y dejar, entre paréntesis, lo que quedaba al dividir cada término. Si no está en todos, no es común.',
    'La agrupación se usa cuando no hay un factor común de todos, pero al partir en grupos sí aparece. Se factoriza cada grupo y después el paréntesis que quedó repetido. El orden de los grupos no cambia el producto final.',
  ],
  'Trinomios y diferencias de cuadrados': [
    'Una diferencia de cuadrados a² − b² es el producto (a − b)(a + b). Hace falta que sea resta y que ambos términos sean cuadrados. a² + b² no se factoriza así en los reales.',
    'Un trinomio x² + sx + p se parte en (x + r)(x + t) cuando r + t = s y r · t = p. El término del medio tiene que coincidir con esa suma. Si el primer coeficiente no es 1, primero se busca factor común o se prueban parejas de factores.',
  ],
  'Suma y diferencia de cubos': [
    'a³ − b³ = (a − b)(a² + ab + b²). a³ + b³ = (a + b)(a² − ab + b²). El primer factor copia el signo de la suma o la resta. En el segundo, el término del medio lleva el signo contrario, y los cuadrados van siempre positivos.',
    'No es la misma fórmula que el cuadrado de una suma. (a − b)³ desarrolla tres términos más el cubo; la factorización de una diferencia de cubos deja un trinomio que, en general, no se vuelve a partir con reales.',
  ],
  'Ecuaciones lineales y equivalencia': [
    'Una ecuación es una igualdad con una incógnita. Resolverla es encontrar el conjunto de valores que la hacen verdadera. Una ecuación lineal, escrita ax + b = 0 con a ≠ 0, tiene una sola solución.',
    'Dos ecuaciones son equivalentes cuando tienen el mismo conjunto solución. Sumar lo mismo de ambos lados, o multiplicar por un número distinto de cero, produce una equivalente. Multiplicar por cero, o por una expresión que a veces es cero, puede no hacerlo.',
  ],
  'Ecuaciones cuadráticas': [
    'Una ecuación cuadrática es la que se puede escribir ax² + bx + c = 0 con a ≠ 0. El conjunto solución en los reales tiene dos valores, uno, o ninguno, según el discriminante Δ = b² − 4ac.',
    'Si Δ > 0 hay dos raíces reales distintas. Si Δ = 0 hay una raíz real doble. Si Δ < 0 no hay raíces reales. Factorizar, cuando se puede, muestra las mismas raíces: cada factor lineal igualado a cero aporta una.',
  ],
  'Ecuaciones de grado superior': [
    'Una ecuación polinomial de grado mayor que 2 se resuelve factorizando, no con una fórmula de tres letras. Cada factor lineal (x − r) aporta la raíz r. Un factor que se repite aporta la misma raíz varias veces; el conjunto solución lista los valores distintos.',
    'Se pasa todo a un lado antes de factorizar, para tener P(x) = 0. Un producto es cero solo cuando algún factor es cero. Probar candidatos racionales y bajar el grado con la división es el camino cuando no se ve el factor a simple vista.',
  ],
  'Ecuaciones racionales': [
    'Una ecuación racional tiene la incógnita en algún denominador. Antes de operar se anotan los valores que anulan cualquier denominador original: están fuera del dominio y no pueden ser solución, aunque más adelante “desaparezcan”.',
    'En el dominio permitido se multiplica por el denominador común y queda una ecuación polinomial. Sus soluciones son candidatas. Se descarta la que coincida con un valor excluido. El conjunto solución es el de las candidatas que sobreviven.',
  ],
  'Ecuaciones con radicales': [
    'Una ecuación con radicales tiene la incógnita dentro de una raíz. Primero se escribe el dominio: lo de adentro de una raíz cuadrada es ≥ 0, y si la raíz principal queda igualada a una expresión, esa expresión también es ≥ 0.',
    'Aislar la raíz y elevar al cuadrado puede inventar soluciones, porque x² = a² no implica x = a. Esas candidatas se sustituyen en la ecuación original. La raíz cúbica no exige radicando positivo y, al ser inyectiva, elevar al cubo no agrega extrañas del mismo modo.',
  ],
  'Plantear problemas de aplicación': [
    'Un problema de aplicación se traduce a una ecuación. La variable tiene que nombrar una cantidad concreta, con su unidad: “x es el ancho en centímetros”, no “x es la respuesta”.',
    'La ecuación sale de la relación del enunciado, no del número que parece el resultado. Al final se comprueba en el texto: edades no negativas, cantidades que tengan sentido y unidades que cierren. Un valor que cumple la ecuación y contradice el enunciado no es solución del problema.',
  ],
  'Inecuaciones lineales': [
    'Acá no se busca un solo x. Se busca un tramo de la recta, por ejemplo “todos los x menores o iguales que −1/2”.',
    'Sumar no cambia el sentido. Multiplicar por un negativo sí: > pasa a <. Si la x desaparece y queda algo cierto, la solución es todos los reales. Si queda algo falso, es el vacío, ∅. Cuando pidan el corte, se escribe solo ese número.',
  ],
  'Inecuaciones polinomiales': [
    'Se pasa todo a un lado y se factoriza. Cada raíz parte la recta. Entre dos raíces el signo no cambia: se prueba un número de ese tramo.',
    'Un factor al cuadrado toca la recta y no cambia el signo. > y < dejan las raíces afuera. ≥ y ≤ las incluyen. La respuesta se toca entre las opciones, con el intervalo ya escrito.',
  ],
  'Inecuaciones racionales': [
    'Es una fracción comparada con cero. El número que anula el denominador nunca es solución.',
    'El que anula el numerador sí puede entrar si la desigualdad dice ≤ o ≥. En la opción, ese corte del denominador queda con el corchete abierto.',
  ],
};

export function levelBrief(title: string): string[] {
  const found = briefs[title];
  return found ? [found[0], found[1]] : [];
}

export function briefTitles(): string[] {
  return Object.keys(briefs);
}
