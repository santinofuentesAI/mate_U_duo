import { useEffect, useState } from 'react';
import katex from 'katex';
import type { Course } from './types';
import { algebraRules } from './algebraRules';
import { truthRows } from './engine';
import { logicTables, type LogicTableSpec } from './courseTables';

function Formula({ value }: { value: string }) {
  return <span className="math" dangerouslySetInnerHTML={{ __html: katex.renderToString(value, { throwOnError: false, strict: false }) }} />;
}

function mark(value: boolean) {
  return value ? 'V' : 'F';
}

function LogicTable({ table }: { table: LogicTableSpec }) {
  const rows = truthRows(table.expr, table.variables);
  return (
    <section className="table-block">
      <h3>{table.title}</h3>
      <div className="course-table-wrap">
        <table>
          <caption>{table.expr}</caption>
          <thead>
            <tr>{table.variables.map(variable => <th key={variable}>{variable}</th>)}<th>{table.expr}</th></tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                {table.variables.map(variable => <td key={variable} className={row.values[variable] ? 'truth-v' : 'truth-f'}>{mark(!!row.values[variable])}</td>)}
                <td key="resultado" className={row.result ? 'truth-v' : 'truth-f'}>{mark(row.result)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function CourseSheet({ course }: { course: Course }) {
  switch (course) {
    case 'discreta':
      return <>{logicTables.map(table => <LogicTable key={table.id} table={table}/>)}</>;
    case 'precalculo':
      return <>{algebraRules.map(group => (
        <section className="table-block" key={group.id}>
          <h3>{group.title}</h3>
          <div className="course-table-wrap">
            <table className="formula-table">
              <thead><tr><th>Nombre</th><th>Fórmula</th><th>Para qué sirve</th></tr></thead>
              <tbody>
                {group.rules.map(rule => (
                  <tr key={rule.name}>
                    <td>{rule.name}</td>
                    <td><Formula value={rule.formula}/>{rule.condition && <small>{rule.condition}</small>}</td>
                    <td>{rule.why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}</>;
    default: {
      const never: never = course;
      return never;
    }
  }
}

export function CourseTables({ course }: { course: Course }) {
  const [open, setOpen] = useState(false);
  const label = course === 'discreta' ? 'Tablas de Discreta' : 'Tablas de Precálculo';
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [open]);
  return (
    <>
      <button type="button" className="table-opener" aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(true)}>Tablas</button>
      {open && (
        <>
          <button type="button" className="table-stage-backdrop" aria-label="Cerrar tablas" onClick={() => setOpen(false)}/>
          <div className="table-stage" role="dialog" aria-modal="true" aria-label={label}>
            <div className="table-stage-bar">
              <b>Tablas</b>
              <button type="button" onClick={() => setOpen(false)}>Cerrar</button>
            </div>
            <CourseSheet course={course}/>
          </div>
        </>
      )}
    </>
  );
}
