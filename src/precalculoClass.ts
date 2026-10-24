import type { Course, Question } from './types';
import type { OpenBookProblem } from './bookCatalog';

interface ClassExercise { course: Course; lessonTitle: string; question: Question; }

const crop = { x: 0, y: 0, width: 1, height: 1 };

interface Key {
  lesson: string;
  type: Question['type'];
  prompt: string;
  answer: string | string[];
  explanation: string;
  hint: string;
  options?: string[];
  universe?: string[];
}

interface Spec {
  week: 'S5' | 'S6' | 'S7';
  packet: number;
  number: number;
  part: string;
  section: string;
  code: string;
  instruction: string;
  text: string;
  math?: string;
  key?: Key;
}

const specs: Spec[] = [
  { week: 'S5', packet: 4, number: 101, part: '', section: 'Ecuaciones', code: 'S5.0', instruction: 'Ejemplo del folio S5. −2 y −3 se sustituyen en x² + 6 = −5x y ambos cumplen.', text: 'Determiná el conjunto solución de x² + 6 = −5x.', math: 'x^2+6=-5x', key: { lesson: 'Ecuaciones cuadráticas', type: 'set', prompt: 'Seleccioná las soluciones reales de x² + 6 = −5x.', answer: ['-2', '-3'], explanation: 'x² + 5x + 6 = 0 se factoriza (x + 2)(x + 3) = 0. El folio da S = {−2, −3}.', hint: 'Pasá todo a un lado y factorizá.', universe: ['-6', '-3', '-2', '0', '2', '3'] } },
  { week: 'S5', packet: 4, number: 102, part: '', section: 'Ecuaciones lineales', code: 'S5.1', instruction: 'Ejemplo del folio S5. Llevá la lineal a ax + b = 0.', text: 'Determiná el conjunto solución de 7x + 15 = 3(3x − 7).', math: '7x+15=3(3x-7)', key: { lesson: 'Ecuaciones lineales y equivalencia', type: 'text', prompt: 'Resolvé 7x + 15 = 3(3x − 7). Escribí x.', answer: '18', explanation: '7x + 15 = 9x − 21 → 36 = 2x → x = 18.', hint: 'Distribuí el 3 y agrupá las x.' } },
  { week: 'S5', packet: 4, number: 103, part: '', section: 'Ecuaciones lineales', code: 'S5.1', instruction: 'Ejemplo resuelto del folio S5. Si la variable se cancela y queda una identidad, S = ℝ; si queda una falsedad, S = ∅.', text: 'Determiná el conjunto solución de (w − 2)(w − 3) − (w − 1)² = 5 − 3w.', math: '(w-2)(w-3)-(w-1)^2=5-3w', key: { lesson: 'Ecuaciones lineales y equivalencia', type: 'choice', prompt: '¿Qué conjunto solución tiene (w − 2)(w − 3) − (w − 1)² = 5 − 3w en ℝ?', answer: 'Todos los reales', explanation: 'Al expandir queda 0 = 0. El folio concluye S = ℝ.', hint: 'Expandí y simplificá; mirá si queda una identidad.', options: ['Todos los reales', 'Ninguna', 'Solo w = 1'] } },
  { week: 'S5', packet: 5, number: 104, part: '', section: 'Ecuaciones cuadráticas', code: 'S5.2', instruction: 'Ejemplo del folio S5. Δ < 0 implica que no hay soluciones reales.', text: 'Determiná el conjunto solución de x² + 81 = 0.', math: 'x^2+81=0', key: { lesson: 'Ecuaciones cuadráticas', type: 'choice', prompt: '¿Cuántas soluciones reales tiene x² + 81 = 0?', answer: 'Ninguna', explanation: 'x² = −81 no tiene raíz real. Δ = −324 < 0.', hint: 'Un cuadrado real no es negativo.', options: ['Ninguna', 'Una', 'Dos'] } },
  { week: 'S5', packet: 5, number: 104, part: 'b', section: 'Ecuaciones cuadráticas', code: 'S5.2', instruction: 'Ejemplo del folio S5, el primero del par de la página 5. Pasá todo a un lado y factorizá.', text: 'Determiná el conjunto solución de 2(p² + 1) = −3p + 1.', math: '2(p^2+1)=-3p+1', key: { lesson: 'Ecuaciones cuadráticas', type: 'set', prompt: 'Seleccioná las soluciones reales de 2(p² + 1) = −3p + 1.', answer: ['-1', '-1/2'], explanation: '2p² + 2 + 3p − 1 = 0 → 2p² + 3p + 1 = 0 → (2p + 1)(p + 1) = 0. S = {−1, −1/2}.', hint: 'Expandí y dejá un cuadrático igual a cero.', universe: ['-3', '-1', '-1/2', '0', '1/2', '1'] } },
  { week: 'S5', packet: 5, number: 105, part: '', section: 'Ecuaciones cuadráticas', code: 'S5.2', instruction: 'Nota del folio S5: con Δ < 0 no hay soluciones reales; las complejas se mencionan y no se piden acá.', text: 'Determiná el conjunto solución real de x² + x + 1 = 0.', math: 'x^2+x+1=0', key: { lesson: 'Ecuaciones cuadráticas', type: 'choice', prompt: 'En ℝ, ¿qué conjunto solución tiene x² + x + 1 = 0?', answer: 'Ninguna real', explanation: 'Δ = 1 − 4 = −3. El folio da las raíces complejas; acá S = ∅ en ℝ.', hint: 'Calculá el discriminante.', options: ['Ninguna real', '{−1}', '{0, −1}'] } },
  { week: 'S5', packet: 6, number: 106, part: '', section: 'Ecuaciones polinomiales', code: 'S5.3', instruction: 'Ejemplo del folio S5. Pasá todo a un lado y factorizá. −2 es raíz doble.', text: 'Determiná el conjunto solución de x⁵ − 5x³ + 4x = −2x⁴ + 10x² − 8.', math: 'x^5-5x^3+4x=-2x^4+10x^2-8', key: { lesson: 'Ecuaciones de grado superior', type: 'set', prompt: 'Seleccioná las soluciones reales distintas de x⁵ − 5x³ + 4x = −2x⁴ + 10x² − 8.', answer: ['-2', '-1', '1', '2'], explanation: 'Queda x⁵ + 2x⁴ − 5x³ − 10x² + 4x + 8 = 0 = (x + 2)²(x + 1)(x − 1)(x − 2). Las raíces distintas son −2, −1, 1 y 2.', hint: 'Probá ±1 y ±2; −2 anula dos veces.', universe: ['-4', '-2', '-1', '0', '1', '2', '4'] } },
  { week: 'S5', packet: 7, number: 107, part: '', section: 'Ecuaciones racionales', code: 'S5.4', instruction: 'Ejemplo del folio S5. Excluí primero el cero del denominador original.', text: 'Determiná el conjunto solución de (x² + 2x − 3)/(x − 1) = 1.', math: '\\frac{x^2+2x-3}{x-1}=1', key: { lesson: 'Ecuaciones racionales', type: 'set', prompt: 'Seleccioná las soluciones reales válidas de (x² + 2x − 3)/(x − 1) = 1.', answer: ['-2'], explanation: 'x ≠ 1. Multiplicá: x² + 2x − 3 = x − 1 → x² + x − 2 = 0 → (x + 2)(x − 1) = 0. x = 1 está excluido; queda x = −2.', hint: 'El 1 no puede ser solución aunque anule un factor.', universe: ['-3', '-2', '-1', '0', '1', '3'] } },
  { week: 'S5', packet: 7, number: 108, part: '', section: 'Ecuaciones racionales', code: 'S5.4', instruction: 'Segundo ejemplo de la página 7 del folio S5. Excluí x = 0 y x = 3 antes de multiplicar.', text: 'Determiná el conjunto solución de 2 + (x + 1)/(x² − 3x) = 4/(3x − 9).', math: '2+\\frac{x+1}{x^2-3x}=\\frac{4}{3x-9}', key: { lesson: 'Ecuaciones racionales', type: 'set', prompt: 'Seleccioná las soluciones reales válidas de 2 + (x + 1)/(x² − 3x) = 4/(3x − 9).', answer: ['1/6'], explanation: 'Dominio: x ≠ 0 y x ≠ 3. El denominador común es 3x(x − 3). Queda 6x² − 19x + 3 = 0, con raíces 3 y 1/6. x = 3 está excluido; queda x = 1/6.', hint: 'x² − 3x = x(x − 3) y 3x − 9 = 3(x − 3).', universe: ['-1', '0', '1/6', '1/3', '1', '3'] } },
  { week: 'S5', packet: 8, number: 109, part: '', section: 'Ecuaciones radicales', code: 'S5.5', instruction: 'Ejemplo del folio S5. Aislá la raíz, imponé el dominio y descartá extrañas.', text: 'Determiná el conjunto solución de √(2x + 3) + x = 6.', math: '\\sqrt{2x+3}+x=6', key: { lesson: 'Ecuaciones con radicales', type: 'set', prompt: 'Seleccioná las soluciones reales de √(2x + 3) + x = 6.', answer: ['3'], explanation: 'Dominio x ≥ −3/2 y 6 − x ≥ 0. Al cuadrar: 2x + 3 = (6 − x)² → x² − 14x + 33 = 0 → x = 3 o 11. Solo x = 3 cumple.', hint: 'x = 11 hace negativo el lado aislado.', universe: ['-3/2', '0', '3', '6', '11'] } },
  { week: 'S5', packet: 8, number: 110, part: '', section: 'Ecuaciones radicales', code: 'S5.5', instruction: 'Ejemplo del folio S5. Las dos raíces principales son no negativas.', text: 'Determiná el conjunto solución de 2 = √(1 − 5x) + √(1 − x).', math: '2=\\sqrt{1-5x}+\\sqrt{1-x}', key: { lesson: 'Ecuaciones con radicales', type: 'set', prompt: 'Seleccioná las soluciones reales de 2 = √(1 − 5x) + √(1 − x).', answer: ['0'], explanation: 'Dominio x ≤ 1/5. Aislá y cuadrá dos veces: queda x(x + 3) = 0. x = −3 no cumple; x = 0 sí: 1 + 1 = 2.', hint: 'Comprobá cada candidata en la original.', universe: ['-3', '-1', '0', '1/5', '1'] } },
  { week: 'S5', packet: 8, number: 111, part: '', section: 'Ecuaciones radicales', code: 'S5.5', instruction: 'Ejemplo del folio S5. Se lee como raíz cúbica: ∛(x² + 4x − 4) = 2.', text: 'Determiná el conjunto solución de ∛(x² + 4x − 4) = 2.', math: '\\sqrt[3]{x^2+4x-4}=2', key: { lesson: 'Ecuaciones con radicales', type: 'set', prompt: 'Seleccioná las soluciones reales de ∛(x² + 4x − 4) = 2.', answer: ['-6', '2'], explanation: 'Cubo: x² + 4x − 4 = 8 → x² + 4x − 12 = 0 → (x + 6)(x − 2) = 0. La raíz cúbica es inyectiva; ambas valen.', hint: 'Elevar al cubo no introduce extrañas.', universe: ['-6', '-2', '0', '2', '4'] } },

  { week: 'S6', packet: 3, number: 101, part: '', section: 'Inecuaciones', code: 'S6.0', instruction: 'Ejemplo del folio S6. Un número es solución si al sustituir queda una desigualdad verdadera.', text: '¿Es 2 solución de x² + 6 > −5x?', math: 'x^2+6>-5x', key: { lesson: 'Inecuaciones polinomiales', type: 'choice', prompt: '¿Es 2 solución de x² + 6 > −5x?', answer: 'Sí', explanation: '4 + 6 > −10 → 10 > −10, verdadera. El folio usa este testigo.', hint: 'Sustituí x = 2 sin resolver la inecuación.', options: ['Sí', 'No'] } },
  { week: 'S6', packet: 3, number: 102, part: '', section: 'Inecuaciones', code: 'S6.0', instruction: 'Ejemplo dado en el folio S6. El conjunto solución se publica; no se rederive otra lista.', text: 'El conjunto solución de x³ + x ≤ 4x² − 6.', math: 'x^3+x\\le 4x^2-6', key: { lesson: 'Inecuaciones polinomiales', type: 'choice', prompt: 'El folio da S para x³ + x ≤ 4x² − 6. ¿Cuál es?', answer: ']−∞, 1] ∪ [2, 3]', explanation: 'El material de clase afirma S = ]−∞, 1] ∪ [2, 3].', hint: 'Es el ejemplo resuelto de la definición de conjunto solución.', options: [']−∞, 1] ∪ [2, 3]', '[1, 2] ∪ [3, ∞)', 'ℝ', '∅'] } },
  { week: 'S6', packet: 3, number: 103, part: '', section: 'Inecuaciones lineales', code: 'S6.1', instruction: 'Nota del folio S6: si la variable se cancela y la desigualdad es verdadera, S = ℝ; si es falsa, S = ∅.', text: 'Determiná el conjunto solución de 2x + 1 ≤ 3 + 2x.', math: '2x+1\\le 3+2x', key: { lesson: 'Inecuaciones lineales', type: 'choice', prompt: '¿Qué conjunto solución tiene 2x + 1 ≤ 3 + 2x?', answer: 'ℝ', explanation: '2x − 2x ≤ 3 − 1 → 0 ≤ 2, verdadera. El folio concluye S = ℝ.', hint: 'Cancelá 2x y mirá si queda una desigualdad verdadera.', options: ['ℝ', '∅', '{0}', '[0, ∞)'] } },
  { week: 'S6', packet: 4, number: 104, part: '', section: 'Inecuaciones lineales', code: 'S6.1', instruction: 'Ejemplo del folio S6. Al multiplicar o dividir por un negativo se invierte la desigualdad.', text: 'Determiná el conjunto solución de −2x + 3 ≥ 4.', math: '-2x+3\\ge 4', key: { lesson: 'Inecuaciones lineales', type: 'choice', prompt: '¿Cuál es S para −2x + 3 ≥ 4?', answer: ']−∞, −1/2]', explanation: '−2x ≥ 1. Dividir por −2 invierte: x ≤ −1/2. S = ]−∞, −1/2].', hint: 'El coeficiente de x es negativo.', options: [']−∞, −1/2]', '[−1/2, ∞)', '{−1/2}', 'ℝ'] } },
  { week: 'S6', packet: 4, number: 105, part: '', section: 'Inecuaciones lineales', code: 'S6.1', instruction: 'Ejemplo del folio S6. Distribuí y agrupá.', text: 'Determiná el conjunto solución de 3(x − 2) > 1 − 2(x + 2).', math: '3(x-2)>1-2(x+2)', key: { lesson: 'Inecuaciones lineales', type: 'choice', prompt: '¿Cuál es S para 3(x − 2) > 1 − 2(x + 2)?', answer: ']3/5, ∞)', explanation: '3x − 6 > 1 − 2x − 4 → 5x > 3 → x > 3/5.', hint: 'Distribuí los dos lados antes de despejar.', options: [']3/5, ∞)', ']−∞, 3/5]', '{3/5}', '∅'] } },
  { week: 'S6', packet: 4, number: 106, part: '', section: 'Inecuaciones lineales', code: 'S6.1', instruction: 'Ejemplo del folio S6. Una desigualdad doble se parte en dos, o se opera el trío a la vez.', text: 'Determiná el conjunto solución de −4 < x − 13 ≤ 3.', math: '-4<x-13\\le 3', key: { lesson: 'Inecuaciones lineales', type: 'choice', prompt: '¿Cuál es S para −4 < x − 13 ≤ 3?', answer: ']9, 16]', explanation: 'Sumá 13: 9 < x ≤ 16. S = ]9, 16].', hint: 'Sumá 13 a los tres lados.', options: [']9, 16]', '[9, 16]', ']−4, 3]', 'ℝ'] } },
  { week: 'S6', packet: 5, number: 107, part: '', section: 'Inecuaciones polinomiales', code: 'S6.2', instruction: 'Ejemplo del folio S6. Factorizá y leé el signo en cada intervalo.', text: 'Determiná el conjunto solución de x² − 2x − 3 > 0.', math: 'x^2-2x-3>0', key: { lesson: 'Inecuaciones polinomiales', type: 'choice', prompt: '¿Cuál es S para x² − 2x − 3 > 0?', answer: ']−∞, −1[ ∪ ]3, ∞)', explanation: '(x − 3)(x + 1) > 0 fuera de las raíces: x < −1 o x > 3. Los ceros no entran porque la desigualdad es estricta.', hint: 'Las raíces son −1 y 3.', options: [']−∞, −1[ ∪ ]3, ∞)', '[−1, 3]', ']−1, 3[', 'ℝ'] } },
  { week: 'S6', packet: 5, number: 108, part: '', section: 'Inecuaciones polinomiales', code: 'S6.2', instruction: 'Ejemplo del folio S6. La factorización publicada es x(x + 1)²(x − 2)(−3x + 2). El signo se lee de ahí, sin inventar otro factor.', text: 'Determiná el conjunto solución de −3x⁵ + 2x⁴ − 9x³ − 4x ≤ 0.', math: '-3x^5+2x^4-9x^3-4x\\le 0', key: { lesson: 'Inecuaciones polinomiales', type: 'choice', prompt: 'Con la factorización x(x + 1)²(x − 2)(−3x + 2), ¿cuál es S para −3x⁵ + 2x⁴ − 9x³ − 4x ≤ 0?', answer: '{−1} ∪ [0, 2/3] ∪ [2, ∞)', explanation: 'Ceros en −1 (par), 0, 2/3 y 2. El signo es negativo en (0, 2/3) y (2, ∞). El toque en −1 vale 0, así que entra como punto.', hint: '(x + 1)² no cambia de signo; los demás sí.', options: ['{−1} ∪ [0, 2/3] ∪ [2, ∞)', '[−1, 0] ∪ [2/3, 2]', ']−∞, 0]', 'ℝ'] } },
  { week: 'S6', packet: 5, number: 109, part: '', section: 'Inecuaciones racionales', code: 'S6.3', instruction: 'Ejemplo del folio S6, escrito como producto. −x² + x − 1 nunca se anula (Δ < 0) y es siempre negativo.', text: 'Determiná el conjunto solución de (x + 2)(−x² + x − 1)(x − 2)(x − 1) ≤ 0.', math: '(x+2)(-x^2+x-1)(x-2)(x-1)\\le 0', key: { lesson: 'Inecuaciones racionales', type: 'choice', prompt: '¿Cuál es S para (x + 2)(−x² + x − 1)(x − 2)(x − 1) ≤ 0?', answer: '[−2, 1] ∪ [2, ∞)', explanation: '−x² + x − 1 < 0 siempre, así que la desigualdad equivale a (x + 2)(x − 2)(x − 1) ≥ 0: [−2, 1] ∪ [2, ∞).', hint: 'El cuadrático sin raíces reales no aporta ceros; solo invierte el signo.', options: ['[−2, 1] ∪ [2, ∞)', ']−2, 1[ ∪ ]2, ∞)', '[−2, 2]', '∅'] } },
  { week: 'S6', packet: 6, number: 2, part: '', section: 'Trabajo en clase', code: 'S6.4', instruction: 'Trabajo en clase S6, ejercicio 2. El folio dice p.87; en el libro 2024 la lista es el Ejercicio 4, impresa 86.', text: 'Determiná el conjunto solución de (x + 4)(3x + 2) > 0.', math: '(x+4)(3x+2)>0', key: { lesson: 'Inecuaciones polinomiales', type: 'choice', prompt: '¿Cuál es S para (x + 4)(3x + 2) > 0?', answer: ']−∞, −4[ ∪ ]−2/3, ∞)', explanation: 'Ceros en −4 y −2/3. El producto es positivo fuera de las raíces. La desigualdad es estricta, así que los ceros no entran.', hint: 'Los dos factores tienen el mismo signo fuera del intervalo entre las raíces.', options: [']−∞, −4[ ∪ ]−2/3, ∞)', ']−4, −2/3[', '[−4, −2/3]', 'ℝ'] } },
  { week: 'S6', packet: 6, number: 3, part: '', section: 'Trabajo en clase', code: 'S6.4', instruction: 'Trabajo en clase S6, ejercicio 3 del Ejercicio 4, impresa 86.', text: 'Determiná el conjunto solución de (3x + 3)(2x + 1) < 0.', math: '(3x+3)(2x+1)<0', key: { lesson: 'Inecuaciones polinomiales', type: 'choice', prompt: '¿Cuál es S para (3x + 3)(2x + 1) < 0?', answer: ']−1, −1/2[', explanation: '3(x + 1)(2x + 1) < 0. El 3 no cambia el signo. El producto es negativo entre −1 y −1/2.', hint: 'Sacá el 3 y mirá el intervalo entre las raíces.', options: [']−1, −1/2[', ']−∞, −1[ ∪ ]−1/2, ∞)', '[−1, −1/2]', '∅'] } },
  { week: 'S6', packet: 6, number: 5, part: '', section: 'Trabajo en clase', code: 'S6.4', instruction: 'Trabajo en clase S6, ejercicio 5 del Ejercicio 4, impresa 86.', text: 'Determiná el conjunto solución de x(−x − 7)(−5x + 2) < 0.', math: 'x(-x-7)(-5x+2)<0', key: { lesson: 'Inecuaciones polinomiales', type: 'choice', prompt: '¿Cuál es S para x(−x − 7)(−5x + 2) < 0?', answer: ']−∞, −7[ ∪ ]0, 2/5[', explanation: 'Equivale a x(x + 7)(x − 2/5) < 0. Ceros en −7, 0 y 2/5. El producto de los tres es negativo a la izquierda de −7 y entre 0 y 2/5.', hint: 'Dos factores negativos se pueden reescribir sin cambiar el sentido.', options: [']−∞, −7[ ∪ ]0, 2/5[', ']−7, 0[ ∪ ]2/5, ∞)', ']−7, 2/5[', 'ℝ'] } },
  { week: 'S6', packet: 6, number: 11, part: '', section: 'Trabajo en clase', code: 'S6.4', instruction: 'Trabajo en clase S6, ejercicio 11 del Ejercicio 4, impresa 86.', text: 'Determiná el conjunto solución de 3(2 − x)(4 − 3x)(x + 2) > 0.', math: '3(2-x)(4-3x)(x+2)>0', key: { lesson: 'Inecuaciones polinomiales', type: 'choice', prompt: '¿Cuál es S para 3(2 − x)(4 − 3x)(x + 2) > 0?', answer: ']−2, 4/3[ ∪ ]2, ∞)', explanation: 'El 3 no cambia el signo. Ceros en −2, 4/3 y 2. El producto es positivo en (−2, 4/3) y en (2, ∞).', hint: '2 − x cambia de signo en 2, y 4 − 3x en 4/3.', options: [']−2, 4/3[ ∪ ]2, ∞)', ']−∞, −2[ ∪ ]4/3, 2[', '[−2, 4/3] ∪ [2, ∞)', '∅'] } },
  { week: 'S6', packet: 6, number: 14, part: '', section: 'Trabajo en clase', code: 'S6.4', instruction: 'Trabajo en clase S6, ejercicio 14 del Ejercicio 4, impresa 86.', text: 'Determiná el conjunto solución de (5 − 7x)(x + 2)(6x + 1) ≤ 0.', math: '(5-7x)(x+2)(6x+1)\\le 0', key: { lesson: 'Inecuaciones polinomiales', type: 'choice', prompt: '¿Cuál es S para (5 − 7x)(x + 2)(6x + 1) ≤ 0?', answer: '[−2, −1/6] ∪ [5/7, ∞)', explanation: 'Ceros en −2, −1/6 y 5/7. El producto es negativo en (−2, −1/6) y en (5/7, ∞). Como la desigualdad no es estricta, los tres ceros entran.', hint: '5 − 7x cambia de signo en 5/7.', options: ['[−2, −1/6] ∪ [5/7, ∞)', ']−2, −1/6[ ∪ ]5/7, ∞)', ']−∞, −2] ∪ [−1/6, 5/7]', 'ℝ'] } },
  { week: 'S6', packet: 6, number: 17, part: '', section: 'Trabajo en clase', code: 'S6.4', instruction: 'Trabajo en clase S6, ejercicio 17 del Ejercicio 4, impresa 86. El factor (x + 2) aparece dos veces.', text: 'Determiná el conjunto solución de −½(x + 2)(x − 2)(x + 2) ≤ 0.', math: '-\\frac{1}{2}(x+2)(x-2)(x+2)\\le 0', key: { lesson: 'Inecuaciones polinomiales', type: 'choice', prompt: '¿Cuál es S para −½(x + 2)(x − 2)(x + 2) ≤ 0?', answer: '{−2} ∪ [2, ∞)', explanation: 'Queda −½(x + 2)²(x − 2) ≤ 0. (x + 2)² no cambia de signo y vale 0 en −2. El producto es ≤ 0 en x = −2 y en x ≥ 2.', hint: '(x + 2) está dos veces: el toque en −2 no cambia el signo.', options: ['{−2} ∪ [2, ∞)', '[−2, 2]', ']−∞, −2] ∪ [2, ∞)', '∅'] } },

  { week: 'S7', packet: 3, number: 101, part: '', section: 'Función de variable real', code: 'S7.1', instruction: 'El folio escribe f(x) = 2x + 8x + 8 sobre ℕ y afirma f(5) = 1813. 2·5 + 8⁵ + 8 = 32786 y 2·5 + 8·5 + 8 = 58: el 1813 no se reproduce. No hay clave automática de ese número.', text: 'El ejemplo numérico f(5) = 1813 del folio no se autocorrige.' },
  { week: 'S7', packet: 3, number: 102, part: '', section: 'Función de variable real', code: 'S7.1', instruction: 'Definición de clase: a cada x del dominio le corresponde una imagen o ninguna, nunca dos. Eso distingue función de relación.', text: '¿Puede un mismo x tener dos imágenes distintas en una función?', key: { lesson: 'Función de variable real', type: 'choice', prompt: 'En una función f: A → B, un mismo x de A ¿puede tener dos imágenes distintas?', answer: 'No', explanation: 'La imagen, si existe, es única. Puede no existir; no puede haber dos.', hint: 'Única o ninguna, nunca dos.', options: ['No', 'Sí, si el dominio es ℝ', 'Sí, en una función a trozos'] } },
  { week: 'S7', packet: 3, number: 103, part: '', section: 'Función a trozos', code: 'S7.1', instruction: 'La pieza se elige con el intervalo que contiene a x. x ≤ 2 usa x³ + 8; 2 < x < 5 usa x² − 6x + 10; x ≥ 5 usa 8.', text: 'Con esa f a trozos, ¿qué pieza usa x = 2?', key: { lesson: 'Función de variable real', type: 'choice', prompt: 'f(x)=x³+8 si x≤2, x²−6x+10 si 2<x<5, 8 si x≥5. ¿Qué pieza usa x = 2?', answer: 'x³ + 8', explanation: '2 cumple x ≤ 2, no el intervalo abierto (2, 5).', hint: 'El extremo con ≤ entra en esa pieza.', options: ['x³ + 8', 'x² − 6x + 10', '8'] } },
  { week: 'S7', packet: 4, number: 104, part: '', section: 'Dominio máximo', code: 'S7.2', instruction: 'Peligro del folio: denominador distinto de cero; raíz de índice par con radicando ≥ 0. Un polinomio sin denominador ni raíz par tiene dominio ℝ.', text: '¿Cuál es el dominio máximo de un polinomio como x² − 3x + 2?', key: { lesson: 'Dominio máximo', type: 'choice', prompt: 'Si f(x) es un polinomio, ¿cuál es su dominio máximo en ℝ?', answer: 'ℝ', explanation: 'No hay denominador ni raíz de índice par. Todo real se puede sustituir.', hint: 'Las restricciones salen de dividir o de una raíz par.', options: ['ℝ', 'ℝ excepto 0', '[0, ∞)'] } },
  { week: 'S7', packet: 4, number: 105, part: '', section: 'Dominio máximo', code: 'S7.2', instruction: 'Una raíz cúbica admite radicando negativo. El denominador x² − 25 se anula en ±5.', text: 'En √[3]{(x² − 25)}, ¿x = −5 está en el dominio?', key: { lesson: 'Dominio máximo', type: 'choice', prompt: 'Para la raíz cúbica ∛(x² − 25), ¿x = −5 está en el dominio?', answer: 'Sí: el cubo admite 0 y negativos', explanation: 'En −5 el radicando vale 0 y la raíz cúbica de 0 existe. El folio usa ∛(x² − 25) en un denominador: ahí ±5 sí se excluyen por dividir.', hint: 'El cubo no pide radicando positivo. Un denominador sí pide no anularse.', options: ['Sí: el cubo admite 0 y negativos', 'No, porque el radicando queda 0', 'No, las raíces nunca valen 0'] } },
  { week: 'S7', packet: 7, number: 1, part: '', section: 'Trabajo en clase', code: 'S7.1', instruction: 'f a trozos: x³+8 si x≤2; x²−6x+10 si 2<x<5; 8 si x≥5. Pedí [f(17/3) − f(4 − 2f(−2))] / [f(2π) − f(2)].', text: 'Calculá ese valor.', math: '\\frac{f(17/3)-f(4-2f(-2))}{f(2\\pi)-f(2)}', key: { lesson: 'Función de variable real', type: 'text', prompt: 'f a trozos: x³+8 si x≤2; x²−6x+10 si 2<x<5; 8 si x≥5. Calculá [f(17/3)−f(4−2f(−2))]/[f(2π)−f(2)]. Escribí la fracción.', answer: '-3/4', explanation: '17/3>5 → 8. f(−2)=0, luego f(4)=2. Arriba 6. 2π>5 → 8 y f(2)=16. Abajo −8. 6/(−8)=−3/4.', hint: '17/3 y 2π caen en la pieza constante 8. f(2) usa x³+8.' } },
  { week: 'S7', packet: 7, number: 2, part: 'a', section: 'Trabajo en clase', code: 'S7.2', instruction: 'r(x) = √(x³ − 2x² − x + 2) / x. El cúbico es (x+1)(x−1)(x−2). Denominador x ≠ 0 y radicando ≥ 0.', text: 'Determiná el dominio máximo de r.', math: 'r(x)=\\frac{\\sqrt{x^3-2x^2-x+2}}{x}', key: { lesson: 'Dominio máximo', type: 'choice', prompt: 'r(x)=√((x+1)(x−1)(x−2))/x. ¿Cuál es el dominio máximo?', answer: '[−1, 0) ∪ (0, 1] ∪ [2, ∞)', explanation: '(x+1)(x−1)(x−2) ≥ 0 en [−1,1] ∪ [2,∞). Se saca x = 0, que está dentro de [−1,1].', hint: 'Raíz par ≥ 0 y denominador ≠ 0.', options: ['[−1, 0) ∪ (0, 1] ∪ [2, ∞)', '[−1, 1] ∪ [2, ∞)', '(0, ∞)', 'ℝ'] } },
  { week: 'S7', packet: 7, number: 2, part: 'b', section: 'Trabajo en clase', code: 'S7.2', instruction: 'El folio imprime g(x) = √x − 3 + 1x − 5. Se lee g(x) = √(x − 3) + 1/(x − 5), la lectura que usa raíz par y denominador, alineada con la nota de peligro.', text: 'Determiná el dominio máximo de g.', math: 'g(x)=\\sqrt{x-3}+\\frac{1}{x-5}', key: { lesson: 'Dominio máximo', type: 'choice', prompt: 'g(x)=√(x−3)+1/(x−5). ¿Cuál es el dominio máximo?', answer: '[3, 5) ∪ (5, ∞)', explanation: 'x − 3 ≥ 0 y x ≠ 5. El 5 está a la derecha de 3, así que se abre ahí.', hint: 'La raíz pide x ≥ 3; el denominador saca el 5.', options: ['[3, 5) ∪ (5, ∞)', '[3, ∞)', 'ℝ \\ {5}', '(5, ∞)'] } },
  { week: 'S7', packet: 7, number: 3, part: '', section: 'Trabajo en clase', code: 'S7.3', instruction: 'El folio pide preimagen de −3, f(2), intervalos constante y decreciente, ceros y cantidad de preimágenes de 3, sobre una gráfica que no está en el PDF extraído. Sin figura no hay clave automática.', text: 'Los incisos de la gráfica se guardan a mano cuando tengas el dibujo.' },
  { week: 'S7', packet: 5, number: 106, part: '', section: 'Análisis de gráficas', code: 'S7.3', instruction: 'El análisis de la gráfica de las páginas 5–6 no incluye el dibujo en el texto extraído. Dominio, ámbito, monotonía y preimágenes quedan abiertos.', text: 'Completá dominio, ámbito, intersecciones y monotonía con la figura de clase.' },
];

function pageOf(spec: Spec) {
  switch (spec.week) {
    case 'S5': return 700 + spec.packet;
    case 'S6': return 800 + spec.packet;
    case 'S7': return 1000 + spec.packet;
    default: {
      const never: never = spec.week;
      return never;
    }
  }
}

export const precalculoClassCatalog: OpenBookProblem[] = specs.map(spec => {
  const page = pageOf(spec);
  return {
    id: `precalculo-clase-${spec.week.toLowerCase()}-${spec.number}${spec.part}`,
    course: 'precalculo' as Course,
    week: spec.week,
    assignment: 'confirmed' as const,
    section: spec.section,
    sectionCode: spec.code,
    page,
    printedPage: spec.packet,
    number: spec.number,
    part: spec.part,
    instruction: spec.instruction,
    text: spec.text,
    math: spec.math,
    review: spec.key ? 'reviewed' as const : 'auxiliary' as const,
    inventoryReviewed: false,
    classAssigned: true,
    visuals: [],
    sourcePages: [page],
  };
});

export const PRECALC_S5_HOMEWORK = new Set(['precalculo-63-1c', 'precalculo-63-1g', 'precalculo-63-1h', 'precalculo-63-2h']);

export const precalculoClassBookExercises: ClassExercise[] = specs.flatMap(spec => {
  if (!spec.key) return [];
  const problem = precalculoClassCatalog.find(item => item.number === spec.number && item.part === spec.part && item.week === spec.week)!;
  const exercise = `${problem.number}${problem.part}`;
  const question: Question = {
    id: `${problem.course}-clase-${problem.week.toLowerCase()}-${exercise}`,
    type: spec.key.type,
    prompt: spec.key.prompt,
    answer: spec.key.answer,
    explanation: spec.key.explanation,
    hints: [spec.key.hint, spec.key.explanation],
    tag: spec.key.lesson,
    difficulty: spec.key.type === 'choice' ? 1 : 2,
    options: spec.key.options,
    universe: spec.key.universe,
    bookSource: {
      course: problem.course,
      page: problem.page,
      printedPage: problem.printedPage,
      section: `${problem.sectionCode} · ${problem.section}`,
      exercise,
      crop,
    },
  };
  return [{ course: problem.course, lessonTitle: spec.key.lesson, question }];
});
