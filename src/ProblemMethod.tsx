import katex from 'katex';
import type { Course } from './types';

const discrete = [
  ['Leé el enunciado dos veces.', 'Marcá qué es dato, qué es pedido y qué es ruido. Una empresa en el texto no cambia la ley lógica.'],
  ['Traducí a símbolos.', 'P, Q, conjuntos o regiones. Si no podés escribirlo, todavía no entendiste el caso.'],
  ['Elegí una herramienta.', 'Tabla, equivalencia, diagrama de Venn o cardinal. Una sola, la que el pedido pide.'],
  ['Hacé un paso y nombralo.', 'De Morgan, inclusión-exclusión, regla del producto. El nombre evita el salto mágico.'],
  ['Comprobá con un caso chico.', 'Una fila de la tabla, un elemento del universo, un número chico. Si falla ahí, falla el examen.'],
];

const precalc = [
  ['Identificá la forma.', '¿Es producto notable, fracción, polinomio para dividir, o una ecuación? El método sale de la forma, no del miedo.'],
  ['Ordená y no omitas ceros.', 'Potencias descendentes. Un término que falta es un 0. Sin eso la sintética miente.'],
  ['Probá, no adivines.', 'Candidatos p/q, una raíz, un factor. Cada prueba deja un resto o un producto que se puede mirar.'],
  ['Escribí el producto o la fracción simplificada.', 'Factorizar es un producto. Simplificar conserva el dominio original.'],
  ['Volvé a multiplicar o a sustituir.', 'Si (x − r) divide, P(r) = 0. Si factorizaste, el producto reconstruye el original.'],
];

const discreteWorked = [
  ['Dato', 'Política del kiosco: si pagó, recibe el café. P = pagó. Q = recibe.'],
  ['Traducción', 'P → Q. No es causalidad: es implicación material.'],
  ['Herramienta', 'La fila falsa de la implicación: VF.'],
  ['Paso', 'Cobró y no entregó: F. No pagó: la regla no se rompe, V.'],
  ['Comprobar', 'P = F, Q = F da V. Coincide con la tabla de P → Q.'],
];

const precalcWorked = [
  ['Forma', 'Polinomio para dividir: x³ − 6x² + 11x − 6. El divisor que se prueba es x − r.'],
  ['Orden', 'Coeficientes 1, −6, 11, −6. No falta ninguna potencia: no hay que poner un 0.'],
  ['Prueba', 'Candidatos ±1, ±2, ±3, ±6. Probá r = 1, a la izquierda, porque el divisor sería x − 1.'],
  ['Paso', 'Bajá el 1. 1·1 = 1, debajo de −6; −6 + 1 = −5. −5·1 = −5, debajo de 11; 11 − 5 = 6. 6·1 = 6, debajo de −6; −6 + 6 = 0. Se SUMA porque r ya trae la resta. Fila 1, −5, 6, 0.'],
  ['Comprobar', 'El 0 es P(1): (x − 1) divide exacto. El cociente 1, −5, 6 es x² − 5x + 6 = (x − 2)(x − 3).'],
];

function Formula({ value }: { value: string }) {
  return <div className="math" dangerouslySetInnerHTML={{ __html: katex.renderToString(value, { throwOnError: false, strict: false, displayMode: true }) }} />;
}

export function ProblemMethod({ course }: { course: Course }) {
  const steps = course === 'discreta' ? discrete : precalc;
  const worked = course === 'discreta' ? discreteWorked : precalcWorked;
  return (
    <div className="problem-method">
      <span className="eyebrow">ANTES DE TOCAR EL TECLADO</span>
      <h1>Cómo hacer un problema bien</h1>
      <p>No es un truco. Es el mismo orden que un examen bien resuelto: dato, traducción, herramienta, paso nombrado, comprobación.</p>
      <ol className="method-steps">
        {steps.map(([title, body]) => (
          <li key={title}><b>{title}</b><p>{body}</p></li>
        ))}
      </ol>
      <section className="worked-method">
        <h2>Un problema hecho con ese orden</h2>
        <Formula value={course === 'discreta' ? 'P\\to Q' : 'x^{3}-6x^{2}+11x-6=(x-1)(x-2)(x-3)'} />
        <ol className="method-steps">
          {worked.map(([title, body]) => (
            <li key={title}><b>{title}</b><p>{body}</p></li>
          ))}
        </ol>
      </section>
      <p className="notice">{course === 'precalculo' ? 'Para división sintética usá el laboratorio: cambiá r hasta que el resto sea 0.' : 'Para tablas usá el laboratorio: llená vos la columna y recién después comprobá.'}</p>
    </div>
  );
}
