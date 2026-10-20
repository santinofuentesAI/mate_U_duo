import { lazy, Suspense, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, FileText, FlaskConical, NotebookPen, Search, Sigma } from 'lucide-react';
import katex from 'katex';
import { lessons } from './content';
import type { Course, Lesson } from './types';
import { TopicIcon } from './TopicIcon';
import { lessonWeekLabel } from './bookScope';
import { MathExpression } from './MathExpression';
import { weekGroups, type WeekGroup } from './weekGroups';
import { WeekPdf } from './WeekPdf';
import { SymbolSheet } from './SymbolSheet';
import { Explorers } from './Explorers';
import { ProblemMethod } from './ProblemMethod';
const TechnicalBooks = lazy(() => import('./TechnicalBooks').then(m => ({ default: m.TechnicalBooks })));
const normalize = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

function Formula({ value }: { value: string }) {
  return <div className="math" dangerouslySetInnerHTML={{ __html: katex.renderToString(value, { throwOnError: false, strict: false, displayMode: true }) }} />;
}

function AxisHead({ n, label }: { n: 1 | 2 | 3; label: string }) {
  return (
    <header className="axis-head">
      <span className="axis-num" aria-hidden="true">{n}</span>
      <small>EJE {n} · {label}</small>
    </header>
  );
}

function LessonArticle({ lesson, onBack, onPractice, showBack = true }: { lesson: Lesson; onBack: () => void; onPractice: (lesson: Lesson) => void; showBack?: boolean }) {
  const idea = lesson.theory[0];
  const more = lesson.theory.slice(1);
  return (
    <article className="card reading-article">
      {showBack && <button className="text-button" type="button" onClick={onBack}><ArrowLeft size={17}/> Volver</button>}
      <small>{lesson.unit}</small>
      <h2><TopicIcon name={lesson.icon} topic={lesson.title} size={22}/> {lesson.title}</h2>
      <section className="guide-axis axis-1">
        <AxisHead n={1} label="EXPLICAR"/>
        {idea && <div className="idea-card"><small>LA IDEA</small><p>{idea}</p></div>}
        {lesson.formulas.length > 0 && (
          <div className="formula-box formula-tiles">
            {lesson.formulas.map(f => <Formula key={f} value={f} />)}
          </div>
        )}
        {more.length > 0 && (
          <ul className="idea-points">
            {more.map(point => <li key={point}>{point}</li>)}
          </ul>
        )}
      </section>
      <section className="guide-axis axis-2">
        <AxisHead n={2} label="EJEMPLO HECHO"/>
        <h3>Ejemplo paso a paso</h3>
        <div className="example">{lesson.example.steps.map((s, i) => <div key={i}><span>{i + 1}</span><p>{s}</p></div>)}</div>
      </section>
      <section className="guide-axis axis-3">
        <AxisHead n={3} label="CÓMO PENSARLO"/>
        <p>Dato, traducción, herramienta, paso nombrado, comprobación. El folio del profesor se hace en Practicar: acá está qué mirar, no una clave inventada.</p>
        <ol className="method-steps">
          <li><b>¿Qué te dan?</b><p>Separá dato, pedido y ruido. El ejemplo de arriba es el modelo.</p></li>
          <li><b>¿A qué se parece?</b><p>{idea || 'Buscá la forma: tabla, conjunto, producto o fracción.'}</p></li>
          <li><b>Comprobá en chiquito.</b><p>Una fila, un número, un producto que reconstruye el original.</p></li>
        </ol>
        <details className="simple-more"><summary>Ver ejercicios explicados ({lesson.questions.length})</summary><p className="notice">Son de la app, para cuando ya lo intentaste. No reemplazan los del libro.</p>{lesson.questions.map((q, i) => <details className="solved-question" key={q.id}><summary>Ejercicio {i + 1} · {q.prompt}</summary><p><b>Respuesta:</b> {Array.isArray(q.answer) ? q.answer.join(' · ') : q.type === 'algebra' ? <MathExpression value={q.answer}/> : q.answer}</p>{q.exclusions && <p><b>Restricciones:</b> {q.exclusions.join(', ')}</p>}<p>{q.explanation}</p></details>)}</details>
      </section>
      <button className="primary" type="button" onClick={() => onPractice(lesson)}>Practicar este tema <ArrowRight size={18}/></button>
      <small className="source-note">{lesson.source} · páginas {lesson.pages} · explicación adaptada</small>
    </article>
  );
}

function LabTools({ course, onExplore, onMethod, onSymbols, onTechnical }: { course: Course; onExplore: () => void; onMethod: () => void; onSymbols: () => void; onTechnical: () => void }) {
  return (
    <div className="library-axes">
      <button className="simple-link" type="button" onClick={onExplore}><FlaskConical size={22}/><span><b>Abrir explorador</b><small>{course === 'precalculo' ? 'Ecuaciones y división sintética, en vivo' : 'Lógica, conjuntos y tablas, en vivo'}</small></span><ArrowRight size={18}/></button>
      <button className="simple-link" type="button" onClick={onMethod}><NotebookPen size={22}/><span><b>Cómo hacer un problema bien</b><small>El orden: dato, traducción, paso, comprobación</small></span><ArrowRight size={18}/></button>
      <button className="simple-link" type="button" onClick={onSymbols}><Sigma size={22}/><span><b>Símbolos del curso</b><small>Qué significa cada signo, en una ficha</small></span><ArrowRight size={18}/></button>
      <button className="simple-link" type="button" onClick={onTechnical}><BookOpen size={22}/><span><b>Técnica · texto del libro</b><small>Buscar por página y abrir el original</small></span><ArrowRight size={18}/></button>
    </div>
  );
}

function WeekHtml({ group, onPractice, onBack, onPdf }: { group: WeekGroup; onPractice: (lesson: Lesson) => void; onBack: () => void; onPdf: () => void }) {
  const [topic, setTopic] = useState(group.lessons[0]?.id ?? '');
  const lesson = group.lessons.find(item => item.id === topic) || group.lessons[0];
  if (!lesson) return <p className="notice">Esta semana todavía no tiene explicación en la app.</p>;
  return (
    <div className="week-html">
      <button className="text-button" type="button" onClick={onBack}><ArrowLeft size={17}/> Volver a las semanas</button>
      <span className="eyebrow">{group.code}</span>
      <h1>{group.lessons[0]?.unit.split(' · ')[1] || group.label}</h1>
      <p>Tres ejes: explicar, un ejemplo hecho, y cómo pensarlo. El PDF de la semana queda acá si lo cargaste.</p>
      <div className="week-topic-chips" role="group" aria-label={`Temas de ${group.code}`}>
        {group.lessons.map(item => (
          <button key={item.id} type="button" className={item.id === lesson.id ? 'selected' : ''} onClick={() => setTopic(item.id)}>{item.title}</button>
        ))}
      </div>
      <button className="secondary" type="button" onClick={onPdf}><FileText size={16}/> Ver el PDF de {group.code}</button>
      <LessonArticle lesson={lesson} onBack={onBack} onPractice={onPractice} showBack={false}/>
    </div>
  );
}

export function Library({ course, onPractice, onRead, onProblem }: { course: Course; onPractice: (l: Lesson) => void; onRead: (page: number) => void; onProblem: (id: string) => void }) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [technical, setTechnical] = useState(false);
  const [symbols, setSymbols] = useState(false);
  const [explore, setExplore] = useState(false);
  const [method, setMethod] = useState(false);
  const [weekView, setWeekView] = useState<{ code: string; mode: 'html' | 'pdf' } | null>(null);
  const path = lessons.filter(l => l.course === course);
  const reading = path.find(l => l.id === selected);
  const groups = weekGroups(course);
  const filtered = path.filter(l => normalize(`${l.title} ${l.theory.join(' ')}`).includes(normalize(search)));
  const currentWeek = weekView ? groups.find(group => group.code === weekView.code) : undefined;
  if (technical) return <Suspense fallback={<p role="status">Preparando Técnica…</p>}><TechnicalBooks course={course} onRead={onRead} onProblem={onProblem} onBack={() => setTechnical(false)}/></Suspense>;
  if (explore) return <div className="simple-flow reading-library"><button className="text-button" type="button" onClick={() => setExplore(false)}><ArrowLeft size={17}/> Volver a Biblioteca</button><Explorers course={course}/></div>;
  if (method) return <div className="simple-flow reading-library"><button className="text-button" type="button" onClick={() => setMethod(false)}><ArrowLeft size={17}/> Volver a Biblioteca</button><ProblemMethod course={course}/></div>;
  if (symbols) return <div className="simple-flow reading-library"><SymbolSheet course={course} onBack={() => setSymbols(false)}/></div>;
  const tools = <LabTools course={course} onExplore={() => { setSelected(null); setWeekView(null); setExplore(true); }} onMethod={() => { setSelected(null); setWeekView(null); setMethod(true); }} onSymbols={() => { setSelected(null); setWeekView(null); setSymbols(true); }} onTechnical={() => { setSelected(null); setWeekView(null); setTechnical(true); }}/>;
  if (reading) return <div className="simple-flow reading-library"><h1>Biblioteca</h1>{tools}<LessonArticle lesson={reading} onBack={() => setSelected(null)} onPractice={onPractice}/></div>;
  if (currentWeek && weekView?.mode === 'html') {
    return <div className="simple-flow reading-library"><WeekHtml group={currentWeek} onPractice={onPractice} onBack={() => setWeekView(null)} onPdf={() => setWeekView({ code: currentWeek.code, mode: 'pdf' })}/></div>;
  }
  if (currentWeek && weekView?.mode === 'pdf') {
    return (
      <div className="simple-flow reading-library">
        <button className="text-button" type="button" onClick={() => setWeekView({ code: currentWeek.code, mode: 'html' })}><ArrowLeft size={17}/> Volver al HTML de {currentWeek.code}</button>
        <h1>{currentWeek.label}</h1>
        <WeekPdf course={course} week={currentWeek.code} label={currentWeek.label}/>
      </div>
    );
  }
  return (
    <div className="simple-flow reading-library">
      <h1>Biblioteca</h1>
      <p>Para leer y tocar. Explicación, ejemplo hecho y cómo pensarlo. El laboratorio vive acá. Los ejercicios del folio se hacen en Practicar, sin clave inventada.</p>
      <label className="simple-search"><Search size={18}/><input aria-label="Buscar en la biblioteca" placeholder="Buscar tema o concepto…" value={search} onChange={e => setSearch(e.target.value)}/></label>
      {tools}
      {search ? (
        <>
          <div className="simple-link-list">{filtered.map(l => <button key={l.id} type="button" onClick={() => { setSelected(l.id); window.scrollTo(0, 0); }}><b>{l.title}</b><span>{lessonWeekLabel(l)} · guía visual</span></button>)}</div>
          {!filtered.length && <p className="notice">No encontré ese concepto. Probá otra palabra.</p>}
        </>
      ) : (
        <div className="week-shelf">
          {groups.map(group => (
            <article className="week-card" key={group.code}>
              <small>{group.code}</small>
              <h2>{group.lessons[0]?.unit.split(' · ')[1] || group.label}</h2>
              <p>{group.lessons[0]?.theory[0] || group.lessons.map(lesson => lesson.title).join(' · ')}</p>
              <div className="week-card-actions">
                <button type="button" className="primary" onClick={() => { setWeekView({ code: group.code, mode: 'html' }); window.scrollTo(0, 0); }}>HTML</button>
                <button type="button" className="secondary" onClick={() => { setWeekView({ code: group.code, mode: 'pdf' }); window.scrollTo(0, 0); }}>PDF</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
