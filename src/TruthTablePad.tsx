import { useMemo, useState } from 'react';
import { classify, parseLogic, truthRows } from './engine';
import { SymbolInput } from './Keyboard';

export function TruthTablePad({
  expression,
  variables,
  value,
  onChange,
  disabled = false,
}: {
  expression: string;
  variables: string[];
  value: string[];
  onChange: (next: string[]) => void;
  disabled?: boolean;
}) {
  const rows = useMemo(() => {
    try { return truthRows(expression, variables); }
    catch { return []; }
  }, [expression, variables]);
  function write(index: number, token: string) {
    const next = rows.map((_, i) => (i === index ? token : value[i] || ''));
    onChange(next);
  }
  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>{variables.map(v => <th key={v}>{v}</th>)}<th>{expression}</th></tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {variables.map(v => <td key={v}>{row.values[v] ? 'V' : 'F'}</td>)}
              <td>
                <div className="truth-buttons">
                  {['V', 'F'].map(token => (
                    <button
                      key={token}
                      type="button"
                      disabled={disabled}
                      aria-label={`Fila ${i + 1}: ${token}`}
                      className={value[i] === token ? 'selected' : ''}
                      onClick={() => write(i, token)}
                    >{token}</button>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function TruthTableLab() {
  const [expression, setExpression] = useState('P→Q');
  const [filled, setFilled] = useState<string[]>([]);
  const [status, setStatus] = useState('');
  let variables: string[] = [];
  let error = '';
  try {
    variables = [...new Set(expression.toUpperCase().match(/[A-Z]/g) || [])].sort();
    if (variables.length > 3) throw new Error('Usá hasta tres letras para que la tabla quepa en el teléfono.');
    parseLogic(expression);
  } catch (e) {
    error = e instanceof Error ? e.message : 'Revisá la expresión.';
  }
  function check() {
    if (error) { setStatus(error); return; }
    const rows = truthRows(expression, variables);
    if (filled.length !== rows.length || filled.some(cell => !cell)) { setStatus('Completá cada fila con V o F.'); return; }
    const expected = rows.map(row => row.result ? 'V' : 'F');
    const ok = filled.every((cell, i) => cell === expected[i]);
    setStatus(ok ? `Tabla correcta. La fórmula es una ${classify(expression).toLowerCase()}.` : 'Hay al menos una fila distinta. Evaluá primero negaciones y paréntesis.');
  }
  return (
    <section className="card truth-lab">
      <span className="eyebrow">TABLA A MANO</span>
      <h3>Llená la columna, no la mires hecha.</h3>
      <p>Escribí una fórmula, completá V o F en cada fila y después comprobá. Así se estudia para un examen, no memorizando una captura.</p>
      <div className="operator-presets" role="group" aria-label="Fórmulas de ejemplo">
        {[['P→Q', 'Implicación'], ['P∧Q', 'Conjunción'], ['¬(P∨Q)', 'De Morgan'], ['P↔Q', 'Bicondicional']].map(([expr, name]) => (
          <button key={expr} type="button" className={expression === expr ? 'selected' : ''} onClick={() => { setExpression(expr); setFilled([]); setStatus(''); }}>{name}</button>
        ))}
      </div>
      <SymbolInput value={expression} onChange={next => { setExpression(next); setFilled([]); setStatus(''); }} label="Fórmula para la tabla" />
      {error ? <p className="notice">{error}</p> : <TruthTablePad expression={expression} variables={variables} value={filled} onChange={setFilled} />}
      <button className="primary" type="button" onClick={check}>Comprobar tabla</button>
      {status && <p className="notice" role="status">{status}</p>}
    </section>
  );
}
