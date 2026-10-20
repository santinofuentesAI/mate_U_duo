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

export function ProblemMethod({ course }: { course: Course }) {
  const steps = course === 'discreta' ? discrete : precalc;
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
      <p className="notice">{course === 'precalculo' ? 'Para división sintética usá el laboratorio: cambiá r hasta que el resto sea 0.' : 'Para tablas usá el laboratorio: llená vos la columna y recién después comprobá.'}</p>
    </div>
  );
}
