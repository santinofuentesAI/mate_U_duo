import { lazy, Suspense, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, FileText, FlaskConical, NotebookPen, Search, Sigma } from 'lucide-react';
import katex from 'katex';
import { lessons } from './content';
import type { Course, Lesson, Question } from './types';
import { TopicIcon } from './TopicIcon';
import { MathExpression } from './MathExpression';
import { weekGroups, weekHeading, weekNumber, weekTitle, type WeekGroup } from './weekGroups';
import { WeekPdf } from './WeekPdf';
import { SymbolSheet } from './SymbolSheet';
import { Explorers } from './Explorers';
import { ProblemMethod } from './ProblemMethod';
import { Fold } from './InApp';
import { solutionSteps } from './solutionSteps';
const TechnicalBooks = lazy(() => import('./TechnicalBooks').then(m => ({ default: m.TechnicalBooks })));
const Books = lazy(() => import('./Books').then(m => ({ default: m.Books })));
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

function AnswerText({ question }: { question: Question }) {
  const answer = question.answer;
  if (Array.isArray(answer)) return <>{answer.join(' · ')}</>;
  if (question.type === 'algebra') return <MathExpression value={answer}/>;
  return <>{answer}</>;
}

function SolvedExercise({ index, question }: { index: number; question: Question }) {
  const steps = solutionSteps(question);
  return (
    <Fold className="solved-question" title={`Ejercicio ${index + 1} · ${question.prompt}`}>
      <div className="example" aria-label={`Pasos del ejercicio ${index + 1}`}>
        {steps.map((step, stepIndex) => <div key={`${question.id}-${stepIndex}`}><span>{stepIndex + 1}</span><p>{step}</p></div>)}
        <div><span>{steps.length + 1}</span><p><b>Respuesta:</b> <AnswerText question={question}/></p></div>
      </div>
      {question.exclusions && <p><b>Restricciones:</b> {question.exclusions.join(', ')}</p>}
    </Fold>
  );
}

function LessonArticle({ lesson, onBack, onPractice, showBack = true }: { lesson: Lesson; onBack: () => void; onPractice: (lesson: Lesson) => void; showBack?: boolean }) {
  const idea = lesson.theory[0];
  const more = lesson.theory.slice(1);
  return (
    <article className="card reading-article">
      {showBack && <button className="text-button" type="button" onClick={onBack}><ArrowLeft size={17}/> Volver</button>}
      <small>{weekHeading(lesson.unit)}</small>
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
        <Fold title={`Ver ejercicios explicados (${lesson.questions.length})`}><p className="notice">Son de la app, para cuando ya lo intentaste. Cada uno muestra cómo se llega a la respuesta.</p>{lesson.questions.map((q, i) => <SolvedExercise key={q.id} index={i} question={q}/>)}</Fold>
      </section>
      <button className="primary" type="button" onClick={() => onPractice(lesson)}>Practicar este tema <ArrowRight size={18}/></button>
      <small className="source-note">{lesson.source} · páginas {lesson.pages} · explicación adaptada</small>
    </article>
  );
}

function LabTools({ course, onExplore, onMethod, onSymbols, onTechnical }: { course: Course; onExplore: () => void; onMethod: () => void; onSymbols: () => void; onTechnical: () => void }) {
  return (
    <div className="library-axes library-lab">
      <button className="simple-link" type="button" onClick={onExplore}><FlaskConical size={22}/><span><b>Abrir explorador</b><small>{course === 'precalculo' ? 'Ecuaciones y división sintética' : 'Lógica, conjuntos y tablas'}</small></span><ArrowRight size={18}/></button>
      <button className="simple-link" type="button" onClick={onMethod}><NotebookPen size={22}/><span><b>Cómo hacer un problema bien</b><small>Dato, traducción, paso, comprobación</small></span><ArrowRight size={18}/></button>
      <button className="simple-link" type="button" onClick={onSymbols}><Sigma size={22}/><span><b>Símbolos del curso</b><small>Qué significa cada signo</small></span><ArrowRight size={18}/></button>
      <button className="simple-link" type="button" onClick={onTechnical}><BookOpen size={22}/><span><b>Técnica · texto del libro</b><small>Buscar por página</small></span><ArrowRight size={18}/></button>
    </div>
  );
}

function WeekRead({ group, onPractice, onBack, onPdf }: { group: WeekGroup; onPractice: (lesson: Lesson) => void; onBack: () => void; onPdf: () => void }) {
  const [topic, setTopic] = useState(group.lessons[0]?.id ?? '');
  const lesson = group.lessons.find(item => item.id === topic) || group.lessons[0];
  if (!lesson) return <p className="notice">Esta semana todavía no tiene explicación en la app.</p>;
  return (
    <div className="week-html">
      <button className="text-button" type="button" onClick={onBack}><ArrowLeft size={17}/> Volver a las semanas</button>
      <span className="eyebrow">SEMANA {weekNumber(group.unit)}</span>
      <h1>{weekTitle(group.unit)}</h1>
      <p>Tres ejes: la idea, un ejemplo hecho, y cómo pensarlo. El folio de la semana se abre aparte, si lo cargaste.</p>
      <div className="week-topic-chips" role="group" aria-label={`Temas de ${group.label}`}>
        {group.lessons.map(item => (
          <button key={item.id} type="button" className={item.id === lesson.id ? 'selected' : ''} onClick={() => setTopic(item.id)}>{item.title}</button>
        ))}
      </div>
      <button className="secondary" type="button" onClick={onPdf}><FileText size={16}/> Folio PDF de la semana {weekNumber(group.unit)}</button>
      <LessonArticle lesson={lesson} onBack={onBack} onPractice={onPractice} showBack={false}/>
    </div>
  );
}

export function Library({ course, onPractice, onProblem }: { course: Course; onPractice: (l: Lesson) => void; onRead?: (page: number) => void; onProblem: (id: string) => void }) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [technical, setTechnical] = useState(false);
  const [symbols, setSymbols] = useState(false);
  const [explore, setExplore] = useState(false);
  const [method, setMethod] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);
  const [bookPage, setBookPage] = useState<number | undefined>();
  const [weekView, setWeekView] = useState<{ code: string; mode: 'read' | 'pdf' } | null>(null);
  const path = lessons.filter(l => l.course === course);
  const reading = path.find(l => l.id === selected);
  const groups = weekGroups(course);
  const filtered = path.filter(l => normalize(`${l.title} ${l.theory.join(' ')}`).includes(normalize(search)));
  const currentWeek = weekView ? groups.find(group => group.code === weekView.code) : undefined;
  function openBook(page?: number) {
    setSelected(null);
    setWeekView(null);
    setBookPage(page);
    setBookOpen(true);
    window.scrollTo(0, 0);
  }
  const tools = <LabTools course={course} onExplore={() => { setSelected(null); setWeekView(null); setExplore(true); }} onMethod={() => { setSelected(null); setWeekView(null); setMethod(true); }} onSymbols={() => { setSelected(null); setWeekView(null); setSymbols(true); }} onTechnical={() => { setSelected(null); setWeekView(null); setTechnical(true); }}/>;
  if (bookOpen) {
    return (
      <div className="simple-flow reading-library">
        <button className="text-button" type="button" onClick={() => { setBookOpen(false); setBookPage(undefined); }}><ArrowLeft size={17}/> Volver a Biblioteca</button>
        <Suspense fallback={<p role="status">Preparando el libro…</p>}>
          <Books course={course} initialPage={bookPage} onPageChange={setBookPage} onProblem={onProblem}/>
        </Suspense>
      </div>
    );
  }
  if (technical) return <Suspense fallback={<p role="status">Preparando Técnica…</p>}><TechnicalBooks course={course} onRead={page => { setTechnical(false); openBook(page); }} onProblem={onProblem} onBack={() => setTechnical(false)}/></Suspense>;
  if (explore) return <div className="simple-flow reading-library"><button className="text-button" type="button" onClick={() => setExplore(false)}><ArrowLeft size={17}/> Volver a Biblioteca</button><Explorers course={course}/></div>;
  if (method) return <div className="simple-flow reading-library"><button className="text-button" type="button" onClick={() => setMethod(false)}><ArrowLeft size={17}/> Volver a Biblioteca</button><ProblemMethod course={course}/></div>;
  if (symbols) return <div className="simple-flow reading-library"><SymbolSheet course={course} onBack={() => setSymbols(false)}/></div>;
  if (reading) return <div className="simple-flow reading-library"><h1>Biblioteca</h1>{tools}<LessonArticle lesson={reading} onBack={() => setSelected(null)} onPractice={onPractice}/></div>;
  if (currentWeek && weekView?.mode === 'read') {
    return <div className="simple-flow reading-library"><WeekRead group={currentWeek} onPractice={onPractice} onBack={() => setWeekView(null)} onPdf={() => setWeekView({ code: currentWeek.code, mode: 'pdf' })}/></div>;
  }
  if (currentWeek && weekView?.mode === 'pdf') {
    return (
      <div className="simple-flow reading-library">
        <button className="text-button" type="button" onClick={() => setWeekView({ code: currentWeek.code, mode: 'read' })}><ArrowLeft size={17}/> Volver a la Semana {weekNumber(currentWeek.unit)}</button>
        <h1>{currentWeek.label}</h1>
        <WeekPdf course={course} week={currentWeek.code} label={currentWeek.label}/>
      </div>
    );
  }
  return (
    <div className="simple-flow reading-library">
      <h1>Biblioteca</h1>
      <p>Una unidad es una semana. Leé la idea, mirá el ejemplo y, si querés, el PDF del libro o el folio de esa semana.</p>
      <label className="simple-search"><Search size={18}/><input aria-label="Buscar en la biblioteca" placeholder="Buscar tema o concepto…" value={search} onChange={e => setSearch(e.target.value)}/></label>
      {search ? (
        <>
          <div className="simple-link-list">{filtered.map(l => <button key={l.id} type="button" onClick={() => { setSelected(l.id); window.scrollTo(0, 0); }}><b>{l.title}</b><span>{weekHeading(l.unit)} · guía visual</span></button>)}</div>
          {!filtered.length && <p className="notice">No encontré ese concepto. Probá otra palabra.</p>}
        </>
      ) : (
        <>
          <p className="library-section">EL LIBRO</p>
          <button className="library-book" type="button" onClick={() => openBook()}>
            <BookOpen size={28}/>
            <span>
              <b>Abrir el libro del curso</b>
              <small>Cargá el PDF una vez. Saltá por semana y leé la página original aquí.</small>
            </span>
            <ArrowRight size={18}/>
          </button>
          <p className="library-section">SEMANAS</p>
          <div className="week-shelf">
            {groups.map((group, index) => (
              <article className="week-card" key={group.unit}>
                <small>SEMANA {weekNumber(group.unit, index)}</small>
                <h2>{weekTitle(group.unit)}</h2>
                <p className="week-topics">{group.lessons.map(lesson => lesson.title).join(' · ')}</p>
                <div className="week-card-actions">
                  <button type="button" className="primary" onClick={() => { setWeekView({ code: group.code, mode: 'read' }); window.scrollTo(0, 0); }}>Leer</button>
                  <button type="button" className="secondary" onClick={() => { setWeekView({ code: group.code, mode: 'pdf' }); window.scrollTo(0, 0); }}>Folio PDF</button>
                </div>
              </article>
            ))}
          </div>
          <p className="library-section">LABORATORIO</p>
          {tools}
        </>
      )}
    </div>
  );
}
