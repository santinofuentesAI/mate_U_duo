import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { rationalCandidates, synthetic } from './engine';

function fmt(n: number): string {
  if (Number.isInteger(n)) return String(n);
  const rounded = Math.round(n * 1000) / 1000;
  return String(rounded);
}

export function SyntheticPad({
  coefficients,
  root,
  value,
  onChange,
  disabled = false,
  onRootChange,
}: {
  coefficients: number[];
  root: number;
  value: string[];
  onChange: (next: string[]) => void;
  disabled?: boolean;
  onRootChange?: (root: number) => void;
}) {
  const cells = coefficients.map((_, i) => value[i] ?? '');
  function write(index: number, text: string) {
    const next = coefficients.map((_, i) => (i === index ? text : cells[i]));
    onChange(next);
  }
  const nextEmpty = cells.findIndex(cell => cell.trim() === '');
  const previous = nextEmpty > 0 ? Number(cells[nextEmpty - 1]) : NaN;
  const why = nextEmpty === 0
    ? `Bajá el ${fmt(coefficients[0])} tal cual: es el primer coeficiente del cociente. No se multiplica todavía porque el divisor es mónico.`
    : nextEmpty > 0 && nextEmpty < coefficients.length && Number.isFinite(previous)
      ? `Esta casilla es ${fmt(coefficients[nextEmpty])} + (${fmt(root)})·(${fmt(previous)}). El producto ${fmt(root * previous)} va en la fila del medio. Se SUMA, no se resta: el signo de r ya trae la resta de la división larga.${nextEmpty === coefficients.length - 1 ? ` El último número es el resto P(${fmt(root)}).` : ''}`
      : nextEmpty > 0 && nextEmpty < coefficients.length
        ? 'Completá la casilla de la izquierda primero: cada producto usa el número que acabás de bajar o de sumar.'
        : `La fila final es el cociente (un grado menos) y el último número es el resto P(${fmt(root)}). Si da 0, x − (${fmt(root)}) divide exacto.`;
  return (
    <div className="synthetic-pad">
      <div className="synthetic-root">
        <label>
          Raíz r
          <input
            aria-label="Raíz r"
            inputMode="decimal"
            value={String(root)}
            disabled={disabled || !onRootChange}
            onChange={e => onRootChange?.(Number(e.target.value))}
          />
        </label>
        <small>Bajá el primero. Multiplicá por r y sumá al siguiente. El último es el resto P(r). Cada casilla tiene el porqué abajo.</small>
      </div>
      <div className="synthetic-table" role="group" aria-label="Tabla de división sintética">
        <div className="synthetic-row coeffs">
          <span />
          {coefficients.map((c, i) => <b key={`c-${i}`}>{fmt(c)}</b>)}
        </div>
        <div className="synthetic-row middle">
          <span className="synthetic-r">{fmt(root)}</span>
          {coefficients.map((_, i) => {
            if (i === 0) return <span key={`m-${i}`} />;
            const previous = Number(cells[i - 1]);
            const ready = cells[i - 1]?.trim() !== '' && Number.isFinite(previous);
            return <span key={`m-${i}`}>{ready ? fmt(root * previous) : '× r'}</span>;
          })}
        </div>
        <div className="synthetic-row bottom">
          <span />
          {coefficients.map((_, i) => (
            <label key={`b-${i}`}>
              {i === 0 ? 'Bajá' : i === coefficients.length - 1 ? 'Resto' : `Cociente ${i}`}
              <input
                aria-label={i === coefficients.length - 1 ? 'Resto' : `Fila final, posición ${i + 1}`}
                inputMode="decimal"
                value={cells[i]}
                disabled={disabled}
                onChange={e => write(i, e.target.value)}
              />
            </label>
          ))}
        </div>
      </div>
      <p className="synthetic-why" role="status"><b>Por qué esta casilla.</b> {why}</p>
    </div>
  );
}

export function SyntheticLab() {
  const [coeffsText, setCoeffsText] = useState('2, -7, 2, 3');
  const [root, setRoot] = useState(1);
  const [row, setRow] = useState(['', '', '', '']);
  const [status, setStatus] = useState('');
  const coefficients = coeffsText.split(/[,\s]+/).map(Number).filter(n => Number.isFinite(n));
  const ready = coefficients.length >= 2;
  const expected = ready ? synthetic(coefficients, root).map(String) : [];
  const candidates = ready ? rationalCandidates(coefficients) : [];
  function tryRoot() {
    if (!ready) { setStatus('Escribí al menos dos coeficientes, de mayor a menor grado. Un 0 marca un término que falta.'); return; }
    const filled = row.slice(0, coefficients.length);
    if (filled.some(cell => !cell.trim())) { setStatus('Completá la fila final antes de comprobar.'); return; }
    const remainder = filled[filled.length - 1];
    const match = filled.map(s => s.trim()) .join(',') === expected.join(',');
    if (match && (remainder === '0' || remainder === '-0')) setStatus(`r = ${root} es raíz. El resto es 0 y el cociente usa ${filled.slice(0, -1).join(', ')}.`);
    else if (match) setStatus(`La fila está bien. El resto es ${remainder}: (x − ${root}) no divide exactamente.`);
    else setStatus('Revisá una casilla. Bajá el primero y, en cada columna, sumá el coeficiente con r por el número de la izquierda.');
  }
  function load(next: number[], nextRoot: number) {
    setCoeffsText(next.join(', '));
    setRoot(nextRoot);
    setRow(next.map(() => ''));
    setStatus('');
  }
  return (
    <section className="card synthetic-lab">
      <span className="eyebrow">PROBAR RAÍCES</span>
      <h3>División sintética de verdad.</h3>
      <p>Escribí los coeficientes, elegí un r y llená la fila. Si el resto no es 0, probá otra raíz. Eso es el método, no un atajo.</p>
      <div className="equation-presets">
        <button type="button" onClick={() => load([2, -7, 2, 3], 1)}>2x³ − 7x² + 2x + 3</button>
        <button type="button" onClick={() => load([1, 0, 0, -1], 1)}>x³ − 1</button>
        <button type="button" onClick={() => load([1, -6, 11, -6], 1)}>x³ − 6x² + 11x − 6</button>
      </div>
      <label>Coeficientes, de mayor a menor grado<input aria-label="Coeficientes del polinomio" value={coeffsText} onChange={e => { setCoeffsText(e.target.value); setRow(e.target.value.split(/[,\s]+/).filter(Boolean).map(() => '')); setStatus(''); }}/></label>
      {ready && <SyntheticPad coefficients={coefficients} root={root} value={row} onChange={setRow} onRootChange={value => { setRoot(value); setStatus(''); }}/>}
      {candidates.length > 0 && <div className="candidate-row" role="group" aria-label="Candidatos racionales">{candidates.map(c => <button type="button" key={c} onClick={() => { setRoot(c); setRow(coefficients.map(() => '')); setStatus(''); }}>r = {fmt(c)}</button>)}</div>}
      <div className="row wrap">
        <button className="primary" type="button" onClick={tryRoot}>Comprobar esta raíz</button>
        <button className="secondary" type="button" onClick={() => { setRow(coefficients.map(() => '')); setStatus(''); }}><RotateCcw size={16}/>Vaciar fila</button>
      </div>
      {status && <p className="notice" role="status">{status}</p>}
    </section>
  );
}
