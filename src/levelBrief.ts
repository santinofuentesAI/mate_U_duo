/** Qué es cada nivel, en castellano, antes de los ejercicios. La clave es el título de la lección. */
const briefs: Record<string, [string, string]> = {
  'Proposiciones y conectores': [
    'Una proposición es una frase que se puede decir si es verdadera o falsa. “2 + 2 = 4” sí. “¿Cuánto es 2 + 2?” no, porque es una pregunta. “Y” pide las dos partes verdaderas. “O” se conforma con una. “No” da vuelta el valor.',
    'Si ves botones, tocá la frase o el valor V o F. Si te piden armar la frase con símbolos, escribís solo la fórmula. P es una idea, Q es la otra, ∧ es “y”, ∨ es “o” y ¬ es “no”.',
  ],
  'Implicación y bicondicional': [
    '“Si llueve, llevo paraguas” se escribe P → Q. Solo falla en un caso: llueve y no llevás paraguas. Si no llueve, la frase no se cae. La flecha al revés, Q → P, es otra frase: “si llevo paraguas, llueve”.',
    'P ↔ Q es “las dos valen lo mismo”: las dos verdaderas o las dos falsas. En el ejercicio tocás V o F, o escribís la flecha que pide el enunciado. No escribas la explicación al lado.',
  ],
  'Tablas de verdad': [
    'Una tabla prueba todas las combinaciones. Con una letra hay 2 filas: V y F. Con dos letras hay 4: VV, VF, FV y FF. En cada fila se calcula la fórmula. Si al final siempre da V, es tautología. Si siempre da F, es contradicción.',
    'Si preguntan cuántas filas, escribís el número. Si preguntan qué clase es, tocás Tautología, Contradicción o Contingencia. Contingencia significa que unas filas dan V y otras F.',
  ],
  'Equivalencias y simplificación': [
    'Dos fórmulas dicen lo mismo cuando, en todos los casos, dan el mismo V o F. Simplificar es dejar una más corta que sigue diciendo lo mismo. ¬¬P es otra vez P: el “no no” se cancela. ¬(P y Q) es “no P, o no Q”.',
    'En la casilla escribís la fórmula corta, por ejemplo P o ¬P∨¬Q. No escribas “por De Morgan” al lado. La última línea es la que se corrige.',
  ],
  'Traducción y contraejemplos': [
    'Traducir es pasar la frase del castellano a letras sin cambiar lo que dice. “Si estudio, apruebo” es P → Q. Un contraejemplo es un solo caso donde las premisas salen bien y la conclusión no. Con uno alcanza para mostrar que el razonamiento no siempre vale.',
    'Si piden la traducción, escribís la fórmula. Si piden el caso que la tumba, tocás esa opción. Varios ejemplos a favor no demuestran un “todos”.',
  ],
  'Circuitos lógicos': [
    'Un circuito es la misma lógica, dibujada con interruptores. En serie los dos tienen que estar cerrados: P y Q. En paralelo alcanza con uno: P o Q. La salida es 1 si conduce y 0 si no.',
    'Si preguntan si conduce, tocás Sí o No. Si piden la salida, escribís la fórmula, por ejemplo P∨Q. No describas el dibujo en la casilla.',
  ],
  'Reglas de inferencia': [
    'Una regla saca una frase nueva de las que ya tenés. Si sabés “si estudio, apruebo” y además sabés “estudio”, podés escribir “apruebo”. Eso se llama modus ponens. No podés elegir la conclusión que te gustaría: solo la que el patrón permite.',
    'Tocá el nombre de la regla o la frase que sí se concluye. Si el paso no está permitido, la opción es No o Falacia.',
  ],
  'Demostraciones y falacias': [
    'Una demostración es una lista: cada línea es un dato o sale de líneas de arriba con una regla. Una falacia parece una regla y no lo es. De “si llueve, me mojo” y “me mojo” no sale que llueve: pudo mojarte otra cosa.',
    'Cuando preguntan si el paso vale, tocás Sí o No. Cuando piden la conclusión, tocás la frase que sí se sigue. No hace falta redactar la prueba entera.',
  ],
  'Predicados y universos': [
    'P(x): “x es mayor que 2” todavía no es verdadera ni falsa, porque falta decir qué es x. El universo es la bolsa de objetos que x puede ser. En los enteros, P(4) es V y P(1) es F. En este curso los naturales incluyen el 0.',
    'Tocás V o F cuando ya fijaron el número. Si piden marcar los x que cumplen, tocás esos números y dejás afuera los demás.',
  ],
  'Universal y existencial': [
    '“Para todo” pide que todos cumplan. Con un solo caso que falla, ya es falso. “Existe” pide que al menos uno cumpla. Con un solo ejemplo que sirve, ya es verdadero. “Existe” no quiere decir “hay uno solo”.',
    'En el ejercicio tocás V o F. Leé primero el universo, por ejemplo {1, 2}. Si la frase dice “todos” y ves un elemento que no cumple, es F.',
  ],
  'Negar y distribuir': [
    'Negar “todos aprobaron” no es “nadie aprobó”. Es “alguien no aprobó”. El “para todo” se vuelve “existe”, y la frase de adentro se niega. Negar “alguien tiene 18” es “nadie tiene 18”.',
    'Tocá la frase en castellano que dice eso. No armes una fórmula si las opciones ya están escritas.',
  ],
  'Cuantificadores anidados': [
    'Se lee de izquierda a derecha. “Para cada persona hay una madre” deja que la madre cambie: es verdadero. “Hay una madre de todas las personas” pide la misma para todas: es falso. El orden cambia el sentido.',
    'Tocás V o F. Si el “existe” está adentro, el ejemplo puede depender del de afuera. Si el “existe” está afuera, el ejemplo es uno solo para todos.',
  ],
  'Matrices y patrones': [
    'A[m][n] es el número de la fila m y la columna n. Si la fórmula es m + 3n + 4, la casilla de la fila 2 y la columna 0 es 2 + 0 + 4 = 6. Se escribe 6, solo el número. Avanzar una fila suma 1. Avanzar una columna suma 3.',
    'Escribí el número que pide la casilla. No escribas la fórmula ni la palabra “fila”.',
  ],
  'Inferencias cuantificadas': [
    'Si todos los del grupo practican y Ana está en el grupo, Ana practica. De un solo caso, por ejemplo “Ana practica”, no sale “todos practican”. Un ejemplo sirve para el “existe”. No sirve para el “para todo”.',
    'Tocás Sí cuando el paso está permitido y No cuando no. No escribas la prueba ni una fórmula nueva.',
  ],
  'Métodos de demostración': [
    'Para probar que el cuadrado de un par es par, el par se escribe n = 2k, con k entero. Entonces n² = 4k², que también es par. Probar por el contrario es suponer lo opuesto y llegar a un absurdo. Unos pocos ejemplos no prueban un “todos”.',
    'Tocá la escritura o el método que pide el enunciado, por ejemplo “n = 2k”. No redactes el párrafo de la demostración.',
  ],
  'Pertenencia e inclusión': [
    '1 ∈ A quiere decir que el número 1 está dentro de A. {1} ⊆ A quiere decir que el conjunto de solo el 1 cabe en A. No es lo mismo: 1 es un número y {1} es una bolsa con ese número. El vacío entra como subconjunto de cualquiera, pero no es un elemento de cualquiera.',
    'Tocás Sí o No. Si preguntan cuántos subconjuntos tiene un conjunto de 3 letras, escribís el número, no la lista.',
  ],
  'Operaciones con conjuntos': [
    'La unión junta, sin repetir. {1, 2} unido con {2, 3} es {1, 2, 3}. La intersección se queda con lo común: {2}. La diferencia A − B se queda con lo de A que no está en B. El complemento es lo del universo que no está en A.',
    'Si hay botones con números, tocá los que entran. Si no tocás ninguno, la respuesta es el vacío. Si hay opciones escritas, tocá el conjunto.',
  ],
  'Intervalos y fronteras': [
    'Un intervalo es un tramo de la recta. El corchete [ incluye el extremo. El paréntesis ( lo deja afuera. x > 3 se escribe (3, ∞): el 3 no entra y el infinito nunca entra. −1 ≤ x ≤ 2 se escribe [−1, 2]: los dos extremos entran.',
    'Tocá el intervalo que ya está escrito. No lo armes en una casilla si la pantalla muestra opciones.',
  ],
  'Venn y leyes de conjuntos': [
    'El dibujo parte el universo en zonas. Con dos conjuntos hay 4 zonas, contando la de afuera. El código 100 significa “solo A”: adentro de A, afuera de B y afuera de C. 111 es el centro, adentro de los tres. A unido con su complemento es todo el universo. A cortado con su complemento es el vacío.',
    'Si ves códigos, tocá los que cumplen. Si ves opciones, tocá el conjunto, por ejemplo el vacío o el universo.',
  ],
  'Aplicaciones e inclusión-exclusión': [
    'Sumar los tamaños cuenta dos veces a la gente que está en los dos grupos. 10 en A, 6 en B y 2 en ambos: los que están en al menos uno son 10 + 6 − 2 = 14. “Solo A” es 10 − 2 = 8, no 10. Se escribe el número, sin la cuenta al lado.',
    'Escribí solo el número. Si el enunciado no da un dato, esa zona no se inventa ni se deja en blanco con una frase.',
  ],
  'Regiones de Venn': [
    'El número grande de un grupo incluye a quienes también están en otro. 20 tienen alergia al polen y 8 de ellos también al polvo. Solo polen: 20 − 8 = 12. Se escribe 12. “Ninguno” sale del total menos los que están en al menos un grupo.',
    'Escribí solo el número. “Solo A” no es el total de A: al total se le resta lo compartido.',
  ],
  'Leyes de conjuntos de clase': [
    'Una ley dice que dos escrituras son el mismo conjunto, para cualquier A y B. Unir A con A no agrega nada: sigue siendo A. El vacío no tiene elementos. El universo es todo lo que se está mirando. Estar fuera de “A o B” es estar fuera de A y fuera de B.',
    'Tocá la opción que quedó: A, B, el vacío o el universo. No escribas una explicación.',
  ],
  'Conjunto potencia y producto': [
    'P(A) junta todos los subconjuntos de A. Siempre entran el vacío y el propio A. Las rayas |P(A)| preguntan cuántos hay, no cuáles. Si A = {1}, hay 2: el vacío y {1}. A × B son los pares, uno de cada conjunto. Si A tiene 2 elementos y B tiene 7, hay 14 pares. Se escribe el número.',
    'En la casilla va solo el número. No escribas la lista de subconjuntos ni los pares. Si no tocás nada en un ejercicio de botones, eso es el vacío.',
  ],
  'Cardinalidad y conteo': [
    '|A| pregunta cuántos elementos distintos hay. El vacío tiene 0. {5} y {√25} son el mismo conjunto, porque √25 es 5, así que ahí hay uno. Juntar {a} con {b, c, d} da 4 elementos. Si |A| = 2 y |B| = 7, los pares de A × B son 14. Se escribe 14, no la lista.',
    'Escribí solo el número que pide la pregunta. La coma se usa solo cuando el enunciado pide dos resultados.',
  ],
  'Introducción y razonamiento lógico': [
    'Un ejemplo a favor no prueba un “todos”. “Todos los enteros son positivos” se cae con un solo caso: −1. No hace falta mirar el resto. Varios casos que sí cumplen no cierran la prueba.',
    'Tocá el caso que refuta, o No cuando preguntan si unos pocos ejemplos alcanzan. No escribas un párrafo.',
  ],
  'Formas normales': [
    'Es otra manera de escribir la misma frase, sin flechas. “Si P, entonces Q” se puede escribir “no P, o Q”. Una forma conjuntiva es un “y” de varios “o”, como (P o Q) y (no P o R). Un literal es solo una letra o su negación, como P o ¬P.',
    'Tocá la escritura que ya está armada así. Si te piden quitar la flecha, escribís la fórmula, por ejemplo ¬P∨Q.',
  ],
  'Raíces racionales y factores': [
    'Una raíz es un número que, al reemplazar la letra, deja el polinomio en 0. Si P(1) = 0, el 1 es raíz y (x − 1) es factor. Los candidatos racionales se prueban: no todos sirven. Si el número no está en esa lista, puede haber otras raíces que no son fracciones.',
    'Si piden el factor, tocás x − r, con r la raíz. Si piden factorizar, escribís el producto, por ejemplo (x−2)(x−3).',
  ],
  'División sintética': [
    'Es el atajo para dividir entre x − r con los coeficientes, de la potencia más alta a la constante. El r va a la izquierda: x − 3 usa 3; x + 2 usa −2, porque x + 2 = x − (−2). Si falta un término, su hueco es 0: x³ − 1 se escribe 1, 0, 0, −1. Bajá el primero tal cual: ya es el coeficiente principal del cociente, porque el divisor es mónico. Cada número se multiplica por r y se SUMA a la columna siguiente: el signo de r ya trae la resta de la división larga. El último es el resto P(r). Si da 0, x − r divide exacto. Ejemplo: 2x³ − 7x² + 2x + 3 entre x − 1. Bajá 2; −7 + 2·1 = −5; 2 + (−5)·1 = −3; 3 + (−3)·1 = 0. Cociente 2x² − 5x − 3 y resto 0. Los pasos de la apertura muestran por qué cada número.',
    'Si piden r, escribís ese número, con signo. Si piden el cociente, escribís el polinomio, por ejemplo 2x^2-5x-3, y no la fila completa. Si piden el resto y la división es exacta, escribís 0. Si hay casillas, completás la fila de números. Cada casilla explica por qué se suma ese producto.',
  ],
  'Factorización completa': [
    'Factorizar es escribir el polinomio como producto, no desarrollarlo. x² − 1 = (x − 1)(x + 1). x² + 4 no se parte en factores de primer grado con números reales: no hay un número real que al cuadrado dé −4. Si todavía queda un trinomio que se puede partir, no está completo.',
    'Escribí el producto. Si preguntan si se puede partir en números reales, tocás Sí o No.',
  ],
  'Fracciones y dominio': [
    'El dominio son los números donde el denominador de la fracción original no es cero. 1/(x − 3) no existe en x = 3. Aunque después se simplifique y el 3 “desaparezca”, sigue prohibido. Se cancelan factores, no pedazos de una suma. Tachar la x de x + 1 no vale.',
    'Si preguntan qué valor se excluye, escribí ese número. Si piden la fracción simplificada, escribí la expresión, por ejemplo x+2, y no la explicación.',
  ],
  'Operar fracciones algebraicas': [
    'Para sumar, el denominador tiene que ser el mismo. 1/x + 2/x = 3/x, con x distinto de 0. Para dividir, se multiplica por la fracción dada vuelta. Al final se puede simplificar, pero se conservan todos los números que anulaban algún denominador.',
    'Escribí la fracción que queda, por ejemplo 3/x. No dejes la cuenta en la casilla.',
  ],
  'Radicales y racionalización': [
    '√9 es 3, el número no negativo cuyo cuadrado es 9. Racionalizar es sacar la raíz del denominador. 1/√2 se multiplica arriba y abajo por √2 y queda √2/2. El valor no cambia. Si abajo hay una suma, se multiplica por lo mismo con el signo del medio cambiado.',
    'Si hay opciones, tocá la fracción ya racionalizada. Si piden un número, escribí solo ese número.',
  ],
  'Conjuntos numéricos': [
    'En este curso el 0 es natural. Los enteros agregan los negativos, como −12. Los racionales son cocientes de enteros, como 2/3 o 0,75. √2 no es ese cociente: es irracional. √(16/25) sí es racional, porque es 4/5.',
    'Tocá el conjunto. Si piden 0,125 como fracción, escribís 1/8, ya simplificada. 2/16 no vale, porque se puede reducir.',
  ],
  'Signos y jerarquía de operaciones': [
    'Primero lo de adentro del paréntesis, después multiplicar y dividir, al final sumar y restar. −7 + 12 = 5, porque gana el positivo más grande. (−4)(−3) = 12: dos menos dan más. −3² es −9, porque el cuadrado es solo del 3. (−3)² es 9, porque el menos está adentro.',
    'Escribí solo el número, con su signo. No escribas la cuenta ni las palabras “positivo” o “negativo”.',
  ],
  'Fracciones numéricas': [
    'Una fracción es un solo número. 1/2 + 1/3 no se suma “por arriba y por abajo”. El común es 6: 3/6 + 2/6 = 5/6. Multiplicar sí es arriba con arriba y abajo con abajo. Dividir es multiplicar por la dada vuelta.',
    'Escribí la fracción resultante, por ejemplo 5/6. No escribas el común denominador al lado.',
  ],
  'Leyes de potencias': [
    'Misma base: al multiplicar se suman los exponentes. x² · x³ = x⁵. Al elevar una potencia, se multiplican: (y²)³ = y⁶. 5⁰ = 1. Un exponente negativo da vuelta la base: 2⁻¹ = 1/2, no −2.',
    'Si piden un número, escribí ese número. Si piden una letra, escribí la potencia, por ejemplo x^5. No dejes la cuenta.',
  ],
  'Raíces y valor absoluto': [
    '√49 = 7, nunca −7: la raíz cuadrada principal no es negativa. |−8| = 8, la distancia al cero. ∛(−27) = −3, porque (−3)³ = −27. Si la raíz es par, lo de adentro no puede ser negativo.',
    'Escribí el número. Si preguntan para qué x existe la raíz, tocá la opción, por ejemplo x ≥ 5.',
  ],
  'Variables y valor numérico': [
    'Evaluar es reemplazar la letra por el número y hacer la cuenta. 2x + 1 con x = 3 es 2·3 + 1 = 7. Si x = −4 y la expresión es x², el paréntesis va primero: (−4)² = 16, no −16.',
    'Escribí solo el número que queda. No escribas la x ni la cuenta que hiciste para llegar.',
  ],
  'Monomios y términos semejantes': [
    'El grado de 4x³ es 3, el exponente. Dos términos se suman solo si tienen la misma letra y el mismo exponente. 3x + 4x = 7x. 2x² y 2x no se juntan. El grado de 9a²bc³ es 2 + 1 + 3 = 6.',
    'Si piden el grado, escribí el número. Si piden reducir, escribí el término, por ejemplo 7x.',
  ],
  'Suma y resta de polinomios': [
    'Sumar es juntar los que se parecen. (x + 2) + (2x + 1) = 3x + 3. Restar cambia todos los signos del segundo antes de juntar. (x + 5) − (x + 2) = 3, porque las x se van.',
    'Escribí el polinomio que queda, por ejemplo 3x+3. No escribas los paréntesis del enunciado otra vez.',
  ],
  'Multiplicación y productos notables': [
    '(x + 1)² no es x² + 1. Es x² + 2x + 1: el doble del producto, 2x, no se pierde. (x + 2)(x − 2) = x² − 4, y ahí sí se van los del medio. x(x + 3) = x² + 3x.',
    'Escribí el desarrollo, por ejemplo x^2+2x+1. No dejes el cuadrado del paréntesis sin abrir.',
  ],
  'División de polinomios': [
    'Se ordenan dividendo y divisor de la potencia más alta a la más baja. El primer término del cociente es el cociente de los dos de adelante: en (2x³ − x² − 8x − 2) ÷ (2x + 3) sale 2x³ / 2x = x², porque x² · 2x reproduce el 2x³ que se quiere cancelar. Ese x² se multiplica por TODO el divisor, no solo por el 2x, y da 2x³ + 3x². Se resta: el 2x³ se va si el término está bien. Se baja el siguiente y se repite: −4x² / 2x = −2x, luego −2x / 2x = −1. Se para cuando el resto tiene grado menor que el divisor. Acá el resto es 1. Comprobación: (2x + 3)(x² − 2x − 1) + 1 vuelve al dividendo. Los pasos de la apertura muestran cada resta.',
    'Si piden el cociente, escribí el polinomio, por ejemplo x^2-2x-1. Si piden el resto, escribí el número, acá 1. No dejes la cuenta larga en la casilla.',
  ],
  'Factor común y agrupación': [
    'El factor común es lo que está en todos los términos. 3x + 6 = 3(x + 2). Si no está en todos, no es común. Cuando no hay uno solo, se agrupan de a dos y después se saca el paréntesis que quedó repetido.',
    'Escribí el producto, por ejemplo 3*(x+2). Escribir otra vez 3x+6 no es factorizar.',
  ],
  'Trinomios y diferencias de cuadrados': [
    'x² − 4 es (x − 2)(x + 2): una resta de dos cuadrados. x² + 4 no se parte así. x² + 5x + 6 = (x + 2)(x + 3), porque 2 + 3 = 5 y 2 · 3 = 6. El término del medio tiene que coincidir con esa suma.',
    'Escribí el producto, no el trinomio otra vez. Un ejemplo de forma es (x-2)*(x+2).',
  ],
  'Suma y diferencia de cubos': [
    '2³ = 8. x³ − 1 = (x − 1)(x² + x + 1). x³ + 8 = (x + 2)(x² − 2x + 4): en la suma, el término del medio lleva menos. No es la misma cuenta que (x + 2)³.',
    'Si preguntan el cubo, tocá el número. Si piden factorizar, escribí el producto completo, los dos factores.',
  ],
  'Ecuaciones lineales y equivalencia': [
    'Resolver es hallar el número que hace verdadera la igualdad. x + 4 = 9 pasa a x = 5: se resta 4 de los dos lados. Si al despejar queda 0 = 0, todos los reales sirven. Si queda 1 = 2, no hay solución.',
    'Si piden x, escribí solo el número. Si preguntan el conjunto, tocá Todos los reales, Ninguna, o la opción que muestra el valor.',
  ],
  'Ecuaciones cuadráticas': [
    'Es una ecuación con x². x² − 5x + 6 = 0 se parte en (x − 2)(x − 3) = 0, así que las soluciones son 2 y 3. El discriminante dice cuántas hay en los reales: positivo, dos; cero, una; negativo, ninguna. x² + 1 = 0 no tiene solución real.',
    'Si hay botones, tocá cada solución. Si piden el discriminante, escribí el número. Si preguntan cuántas hay, tocá Ninguna, Una o Dos.',
  ],
  'Ecuaciones de grado superior': [
    'Se pasa todo a un lado y se parte en factores. x(x − 2) = 0 tiene dos soluciones: 0 y 2. El 0 no se tira. Cada factor que se puede anular aporta un número. Si un factor nunca es cero en los reales, no aporta solución.',
    'Tocá cada solución que muestran los botones. Si preguntan cuántas distintas hay, escribí ese número. Una raíz repetida cuenta una vez cuando piden distintas.',
  ],
  'Ecuaciones racionales': [
    'La x está abajo, en un denominador. Primero se anota el número prohibido: en 1/(x − 4) el 4 no vale, porque deja cero abajo. Después se despeja. Si el resultado es justo el prohibido, no hay solución. 1/x = 1/2 da x = 2, y 2 no anula el denominador.',
    'Si preguntan el valor excluido, escribí ese número. Si piden la solución, escribí solo el valor de x. Si no hay, tocá Ninguna o “no tiene solución”.',
  ],
  'Ecuaciones con radicales': [
    'La x está dentro de una raíz. √x = 3 pasa a x = 9, y hay que comprobar: √9 es 3, así que sirve. Elevar al cuadrado a veces inventa un número que en la ecuación original no funciona. Una raíz cuadrada nunca vale un negativo, así que √(algo) = −1 no tiene solución.',
    'Escribí solo el valor de x que sí cumple en la ecuación original. Si no hay ninguno, tocá “no hay solución”.',
  ],
  'Plantear problemas de aplicación': [
    'Primero se dice qué es x. Dos enteros seguidos que suman 25: el menor es x y el otro es x + 1. Entonces 2x + 1 = 25 y x = 12. El mayor es 13. Al final se revisa que el número tenga sentido: una edad no es negativa.',
    'Escribí solo el número que nombra la pregunta. Si piden el menor, no escribas los dos.',
  ],
  'Inecuaciones lineales': [
    'No se busca un solo x: se busca un tramo. x + 2 ≤ 5 queda x ≤ 3. Si piden el corte, se escribe 3, no el intervalo. Multiplicar o dividir por un negativo da vuelta el sentido: el “menor” pasa a “mayor”. Si la x se va y queda algo cierto, sirven todos los reales. Si queda algo falso, no sirve ninguno: el vacío.',
    'Si el enunciado dice “escribí solo ese número”, va el corte, con signo si es negativo. Si hay opciones, tocá el intervalo o la frase.',
  ],
  'Inecuaciones polinomiales': [
    'Se pasa todo a un lado y se parte en factores. (x − 2)(x − 5) > 0 es positivo fuera de 2 y de 5: x < 2 o x > 5. El corchete ]a, b[ deja los extremos afuera. [a, b] los incluye. Si la desigualdad es estricta, las raíces no entran.',
    'Tocá el intervalo o la frase que ya está en las opciones. No lo escribas a mano si la pantalla lo muestra.',
  ],
  'Inecuaciones racionales': [
    'Es una fracción comparada con cero. El número que hace cero abajo nunca es solución. El que hace cero arriba sí puede entrar si dice “menor o igual” o “mayor o igual”. En (x − 4)/x > 0, el 0 no entra. En la opción, ese corte queda con el corchete abierto.',
    'Tocá Sí o No cuando preguntan si un número entra. Si piden el conjunto, tocá el intervalo de las opciones.',
  ],
  'Relación y gráfico': [
    'Una relación de A en B es un gráfico G dentro de A × B: pares (a, b). aRb significa que ese par está en G. Un mismo a puede ir a varios b, a uno, o a ninguno: no es una función. El dominio son los de A que salen; el ámbito, los de B que reciben. Ejemplo: A = {1, 3, 4}, B = {2, 5}, a = b − 1 da G = {(1, 2), (4, 5)}.',
    'Si hay botones de pares, tocá los que entran. Si piden el dominio o el ámbito, tocá esos elementos. Si piden cuántos pares hay, escribí solo el número.',
  ],
  'Operaciones con relaciones': [
    'Unión, intersección y diferencia se hacen con los gráficos, el mismo A y el mismo B. La inversa da vuelta cada par: (1, a) pasa a (a, 1). El complemento es respecto de A × B: entran los pares que no estaban. Ejemplo: G = {(1, a), (2, b)} y H = {(2, b), (3, c)}. La unión tiene tres pares; la intersección solo {(2, b)}; R − S deja {(1, a)}.',
    'Tocá los pares que pide el enunciado. Si preguntan si R⁻¹ coincide con R, tocá Sí o No. Si piden cuántos pares tiene el complemento, escribí el número.',
  ],
  'Composición de relaciones': [
    'S ∘ R pide un puente: aRb y ese b se relaciona con c por S. El receptor de R tiene que ser el emisor de S. No hace falta que sean funciones. Ejemplo: R = {(1, a), (2, b)} y S = {(a, X), (b, Y)} da {(1, X), (2, Y)}. Si c no tiene salida, ese a no llega. Invertir el camino da (S ∘ R)⁻¹ = R⁻¹ ∘ S⁻¹.',
    'Tocá los pares compuestos. Si preguntan quién de A no participa, tocá ese elemento. Si preguntan si las inversas coinciden, tocá Sí o No.',
  ],
  'Función de variable real': [
    'Una función asigna a cada x una imagen o ninguna, nunca dos. A trozos, la fórmula cambia según el intervalo: se usa la pieza que contiene a x. Si dice x ≤ 2, el 2 entra ahí, no en 2 < x. Ejemplo del folio: x³ + 8 si x ≤ 2, x² − 6x + 10 si 2 < x < 5, 8 si x ≥ 5. Entonces f(2) = 16 y f(5) = 8. El 1813 que imprime el folio para otro ejemplo no se reproduce y no se usa como clave.',
    'Si piden f(a), escribí el número. Si preguntan qué pieza usa un x, tocá esa fórmula. El cociente a trozos del trabajo 1 se escribe como fracción, por ejemplo -3/4.',
  ],
  'Dominio máximo': [
    'Si no dicen el dominio, se toma el mayor subconjunto de ℝ donde la fórmula existe. Denominador distinto de cero. Raíz de índice par con radicando ≥ 0. El cubo admite negativos y el 0. Ejemplo: √((x+1)(x−1)(x−2))/x vive donde el cúbico es ≥ 0 y x ≠ 0: [−1, 0) ∪ (0, 1] ∪ [2, ∞). √(x − 3) + 1/(x − 5) pide x ≥ 3 y x ≠ 5.',
    'Tocá el intervalo de las opciones. Si preguntan si un número entra, tocá Sí o No. No escribas el dominio a mano si la pantalla ya lo muestra.',
  ],
  'Lectura de gráficas': [
    'El dominio se lee en el eje x: hasta dónde hay curva. El ámbito se lee en el eje y. Creciente: al ir a la derecha, sube. Decreciente: baja. Constante: un tramo horizontal. Un cero es un corte con el eje x. f(a) es la altura en x = a. La preimagen de k son los x con esa altura. La figura del folio S7 no está en el texto extraído: esos incisos se guardan a mano.',
    'Si dan un tramo constante, escribí la altura. Si comparan dos puntos de un tramo creciente, tocá la desigualdad. Un cero se toca como corte con el eje x.',
  ],
};

export function levelBrief(title: string): string[] {
  const found = briefs[title];
  return found ? [found[0], found[1]] : [];
}

export function briefTitles(): string[] {
  return Object.keys(briefs);
}
