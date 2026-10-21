import { useEffect, useState } from 'react';
import katex from 'katex';
import type { Course } from './types';
import { algebraRules } from './algebraRules';
import { truthRows } from './engine';
import { logicTables, referenceFor, type LogicTableSpec } from './courseTables';

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

function NoteTable({ title, rows }: { title: string; rows: { name: string; formula: string; why: string }[] }) {
  return (
    <section className="table-block">
      <h3>{title}</h3>
      <div className="course-table-wrap">
        <table className="formula-table">
          <thead><tr><th>Nombre</th><th>Fórmula</th><th>Qué es</th></tr></thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.name}>
                <td>{row.name}</td>
                <td><Formula value={row.formula}/></td>
                <td>{row.why}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function CourseSheet({ course, topic }: { course: Course; topic: string }) {
  const sheet = referenceFor(course, topic);
  const logic = logicTables.filter(table => sheet.logicIds.includes(table.id));
  const algebra = algebraRules.filter(group => sheet.algebraIds.includes(group.id));
  return (
    <>
      {sheet.about.map(paragraph => <p className="table-about" key={paragraph.slice(0, 48)}>{paragraph}</p>)}
      {sheet.notes.length > 0 && <NoteTable title="De este nivel" rows={sheet.notes}/>}
      {logic.map(table => <LogicTable key={table.id} table={table}/>)}
      {algebra.map(group => (
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
      ))}
    </>
  );
}

export function CourseTables({ course, topic }: { course: Course; topic: string }) {
  const [open, setOpen] = useState(false);
  const sheet = referenceFor(course, topic);
  const label = `Tablas de ${sheet.heading}`;
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [open]);
  return (
    <div className="table-access">
      <aside className="table-rail"><button type="button" className="table-opener" aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(true)}>Tablas<small>de este nivel</small></button></aside>
      {open && (
        <>
          <button type="button" className="table-stage-backdrop" aria-label="Cerrar tablas" onClick={() => setOpen(false)}/>
          <div className="table-stage" role="dialog" aria-modal="true" aria-label={label}>
            <div className="table-stage-bar">
              <b>{label}</b>
              <button type="button" onClick={() => setOpen(false)}>Cerrar</button>
            </div>
            <CourseSheet course={course} topic={topic}/>
          </div>
        </>
      )}
    </div>
  );
}
