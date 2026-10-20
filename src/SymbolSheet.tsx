import katex from 'katex';
import { ArrowLeft } from 'lucide-react';
import type { Course } from './types';
import { symbolGroups } from './symbols';

function Formula({ value }: { value: string }) {
  return <div className="math" dangerouslySetInnerHTML={{ __html: katex.renderToString(value, { throwOnError: false, strict: false, displayMode: true }) }} />;
}

export function SymbolSheet({ course, onBack }: { course: Course; onBack: () => void }) {
  const groups = symbolGroups(course);
  return (
    <div className="symbol-sheet">
      <button className="text-button" type="button" onClick={onBack}><ArrowLeft size={17}/> Volver</button>
      <span className="eyebrow">DICCIONARIO CORTO</span>
      <h1>Símbolos</h1>
      <p>{course === 'discreta' ? 'Tocá un símbolo, leé qué hace, y usalo en el teclado. ℕ incluye 0 en esta app.' : 'Una ficha por forma. Factorizar es un producto. Simplificar conserva el dominio.'}</p>
      {groups.map(group => (
        <section key={group.id} className="symbol-group">
          <h2>{group.title}</h2>
          <div className="symbol-grid">
            {group.items.map(item => (
              <article className="symbol-tile" key={item.id}>
                <small>{item.name}</small>
                <Formula value={item.latex} />
                <p>{item.meaning}</p>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
