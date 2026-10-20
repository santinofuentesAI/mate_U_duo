import { lazy, Suspense, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, FileText, Search } from 'lucide-react';
import katex from 'katex';
import { lessons } from './content';
import type { Course, Lesson } from './types';
import { TopicIcon } from './TopicIcon';
import { lessonWeekLabel } from './bookScope';
import { MathExpression } from './MathExpression';
import { weekGroups, type WeekGroup } from './weekGroups';
import { WeekPdf } from './WeekPdf';
const TechnicalBooks = lazy(() => import('./TechnicalBooks').then(m => ({ default: m.TechnicalBooks })));
const normalize = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

function LessonArticle({ lesson, onBack, onPractice }: { lesson: Lesson; onBack: () => void; onPractice: (lesson: Lesson) => void }) {
  return (
    <article className="card reading-article">
      <button className="text-button" type="button" onClick={onBack}><ArrowLeft size={17}/> Volver</button>
      <small>{lessonWeekLabel(lesson)}</small>
      <h2><TopicIcon name={lesson.icon} size={22}/> {lesson.title}</h2>
      {lesson.theory.map(t => <p key={t}>{t}</p>)}
      <div className="formula-box">{lesson.formulas.map(f => <div className="math" key={f} dangerouslySetInnerHTML={{ __html: katex.renderToString(f, { throwOnError: false, strict: false, displayMode: true }) }}/>)}</div>
      <h3>Ejemplo paso a paso</h3>
      <div className="example">{lesson.example.steps.map((s, i) => <div key={i}><span>{i + 1}</span><p>{s}</p></div>)}</div>
      <details className="simple-more"><summary>Ver ejercicios explicados ({lesson.questions.length})</summary>{lesson.questions.map((q, i) => <details className="solved-question" key={q.id}><summary>Ejercicio {i + 1} · {q.prompt}</summary><p><b>Respuesta:</b> {Array.isArray(q.answer) ? q.answer.join(' · ') : q.type === 'algebra' ? <MathExpression value={q.answer}/> : q.answer}</p>{q.exclusions && <p><b>Restricciones:</b> {q.exclusions.join(', ')}</p>}<p>{q.explanation}</p></details>)}</details>
      <button className="primary" type="button" onClick={() => onPractice(lesson)}>Practicar este tema <ArrowRight size={18}/></button>
      <small className="source-note">{lesson.source} · páginas {lesson.pages} · explicación adaptada</small>
    </article>
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
      <p>Una idea a la vez. Si preferís el folio, abrí el PDF de esta semana.</p>
      <div className="week-topic-chips" role="group" aria-label={`Temas de ${group.code}`}>
        {group.lessons.map(item => (
          <button key={item.id} type="button" className={item.id === lesson.id ? 'selected' : ''} onClick={() => setTopic(item.id)}>{item.title}</button>
        ))}
      </div>
      <button className="secondary" type="button" onClick={onPdf}><FileText size={16}/> Ver el PDF de {group.code}</button>
      <LessonArticle lesson={lesson} onBack={onBack} onPractice={onPractice}/>
    </div>
  );
}

export function Library({ course, onPractice, onRead, onProblem }: { course: Course; onPractice: (l: Lesson) => void; onRead: (page: number) => void; onProblem: (id: string) => void }) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [technical, setTechnical] = useState(false);
  const [weekView, setWeekView] = useState<{ code: string; mode: 'html' | 'pdf' } | null>(null);
  const path = lessons.filter(l => l.course === course);
  const reading = path.find(l => l.id === selected);
  const groups = weekGroups(course);
  const filtered = path.filter(l => normalize(`${l.title} ${l.theory.join(' ')}`).includes(normalize(search)));
  const currentWeek = weekView ? groups.find(group => group.code === weekView.code) : undefined;
  if (technical) return <Suspense fallback={<p role="status">Preparando Técnica…</p>}><TechnicalBooks course={course} onRead={onRead} onProblem={onProblem} onBack={() => setTechnical(false)}/></Suspense>;
  if (reading) return <div className="simple-flow reading-library"><h1>Biblioteca</h1><LessonArticle lesson={reading} onBack={() => setSelected(null)} onPractice={onPractice}/></div>;
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
      <p>Elegí una semana: HTML simple o el PDF de esa semana. Buscá un tema si ya sabés el nombre.</p>
      <label className="simple-search"><Search size={18}/><input aria-label="Buscar en la biblioteca" placeholder="Buscar tema o concepto…" value={search} onChange={e => setSearch(e.target.value)}/></label>
      <button className="simple-link" type="button" onClick={() => setTechnical(true)}><BookOpen size={22}/><span><b>Técnica · texto del libro</b><small>Buscar por página y abrir el original</small></span><ArrowRight size={18}/></button>
      {search ? (
        <>
          <div className="simple-link-list">{filtered.map(l => <button key={l.id} type="button" onClick={() => { setSelected(l.id); window.scrollTo(0, 0); }}><b>{l.title}</b><span>{lessonWeekLabel(l)} · ejemplo resuelto</span></button>)}</div>
          {!filtered.length && <p className="notice">No encontré ese concepto. Probá otra palabra.</p>}
        </>
      ) : (
        <div className="week-shelf">
          {groups.map(group => (
            <article className="week-card" key={group.code}>
              <small>{group.code}</small>
              <h2>{group.lessons[0]?.unit.split(' · ')[1] || group.label}</h2>
              <p>{group.lessons.map(lesson => lesson.title).join(' · ')}</p>
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
