import { useEffect, useState } from 'react';
import katex from 'katex';
import type { Course } from './types';
import { algebraRules } from './algebraRules';
import { truthRows } from './engine';
import { logicTables, tableFamilies } from './courseTables';

function Formula({ value }: { value: string }) {
  return <span className="math" dangerouslySetInnerHTML={{ __html: katex.renderToString(value, { throwOnError: false, strict: false }) }} />;
}

function mark(value: boolean) {
  return value ? 'V' : 'F';
}

export function CourseTables({ course }: { course: Course }) {
  const families = tableFamilies(course);
  const [open, setOpen] = useState<string | null>(null);
  const chosen = families.find(item => item.id === open);
  const logic = course === 'discreta' && chosen ? logicTables.find(table => table.id === chosen.id) : undefined;
  const algebra = course === 'precalculo' && chosen ? algebraRules.find(group => group.id === chosen.id) : undefined;
  const rows = logic ? truthRows(logic.expr, logic.variables) : [];
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(null); };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [open]);
  return (
    <aside className="table-rail" aria-label={course === 'discreta' ? 'Tablas de Discreta' : 'Tablas de Precálculo'}>
      <span className="table-rail-label">Tablas</span>
      {families.map(item => (
        <button key={item.id} type="button" className={item.id === open ? 'selected' : ''} aria-label={`Tabla ${item.title}`} aria-expanded={item.id === open} onClick={() => setOpen(item.id === open ? null : item.id)}>
          <b>{item.title}</b>
          <small>{item.id === open ? 'Abierta' : 'Ver grande'}</small>
        </button>
      ))}
      {chosen && (
        <>
          <button type="button" className="table-stage-backdrop" aria-label="Achicar tabla" onClick={() => setOpen(null)}/>
          <div className="table-stage" role="region" aria-label={`Tabla ampliada: ${chosen.title}`}>
            <div className="table-stage-bar">
              <b>{chosen.title}</b>
              <button type="button" onClick={() => setOpen(null)}>Achicar</button>
            </div>
            {logic && (
              <div className="course-table-wrap">
                <table>
                  <caption>{logic.expr}</caption>
                  <thead>
                    <tr>{logic.variables.map(variable => <th key={variable}>{variable}</th>)}<th>{logic.expr}</th></tr>
                  </thead>
                  <tbody>
                    {rows.map((row, index) => (
                      <tr key={index}>
                        {logic.variables.map(variable => <td key={variable} className={row.values[variable] ? 'truth-v' : 'truth-f'}>{mark(!!row.values[variable])}</td>)}
                        <td key="resultado" className={row.result ? 'truth-v' : 'truth-f'}>{mark(row.result)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {algebra && (
              <div className="course-table-wrap">
                <table className="formula-table">
                  <thead><tr><th>Nombre</th><th>Fórmula</th><th>Para qué sirve</th></tr></thead>
                  <tbody>
                    {algebra.rules.map(rule => (
                      <tr key={rule.name}>
                        <td>{rule.name}</td>
                        <td><Formula value={rule.formula}/>{rule.condition && <small>{rule.condition}</small>}</td>
                        <td>{rule.why}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </aside>
  );
}
