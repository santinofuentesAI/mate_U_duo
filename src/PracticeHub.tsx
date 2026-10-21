import { useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, ScrollText, Target } from 'lucide-react';
import { lessons } from './content';
import type { Progress } from './types';
import { bank, dailyTitle, latestAttempts, mixedPractice, practicePlan, type PracticeIntensity, type PracticeItem } from './learning';
import { BookPractice } from './BookPractice';
import { BookExam } from './BookExam';
import { ExamLobby } from './ExamLobby';
import { CaseStudio } from './CaseStudy';
import { weekHeading } from './weekGroups';
import { clampDrillCount, DRILL_COUNTS, DRILL_MAX, DRILL_MIN, drillsFor, topicPractice, topicTitle, type DrillId } from './topicDrills';
import { ChoiceList, Fold } from './InApp';

interface Props { progress: Progress; onStart: (items: PracticeItem[], title: string, mode: string) => void; onExam: (units: string[]) => void; onRead: (page: number) => void; initialBookProblem?: string; }
type Screen = 'home' | 'book' | 'reviewed' | 'errors' | 'cases';
const intensities: { id: PracticeIntensity; label: string; hint: string }[] = [
  { id: 'easy', label: 'Fácil', hint: 'Lo básico' },
  { id: 'medium', label: 'Medio', hint: 'Ritmo de clase' },
  { id: 'hard', label: 'Difícil', hint: 'Lo que traba' },
  { id: 'exam', label: 'Examen', hint: 'Sin ayudas' },
];
export function PracticeHub({ progress: p, onStart, onExam, onRead, initialBookProblem }: Props) {
  const drills = drillsFor(p.course);
  const [screen, setScreen] = useState<Screen>(initialBookProblem ? 'book' : 'home');
  const [focus, setFocus] = useState(initialBookProblem);
  const [topic, setTopic] = useState('all');
  const [length, setLength] = useState(20);
  const [examOpen, setExamOpen] = useState(false);
  const [intensity, setIntensity] = useState<PracticeIntensity>('exam');
  const [drill, setDrill] = useState<DrillId>(drills[0].id);
  const [drillCount, setDrillCount] = useState(10);
  const items = bank(lessons, p.course), bookItems = items.filter(i => i.question.bookSource);
  const units = [...new Set(items.map(i => i.lesson.unit))];
  const daily = mixedPractice(items, p, intensity, length, new Date(), topic);
  const last = latestAttempts(p);
  const errors = items.filter(i => { const a = last.get(i.question.id); return a && (!a.correct || a.assisted); });
  const chosenDrill = drills.find(item => item.id === drill) ?? drills[0];
  function open(next: Screen) { setScreen(next); window.scrollTo(0, 0); }
  function startTopic() {
    try {
      const pack = topicPractice(p.course, chosenDrill.id, drillCount, crypto.randomUUID(), items, lessons);
      onStart(pack, topicTitle(chosenDrill.id, pack.length), `drill-${chosenDrill.id}`);
    } catch {
      onStart([], topicTitle(chosenDrill.id, drillCount), `drill-${chosenDrill.id}`);
    }
  }
  if (screen === 'book') return <div className="simple-flow"><button className="text-button" onClick={() => open('home')}><ArrowLeft size={17}/> Volver a Practicar</button><BookExam key={`${p.course}-${focus || 'saved'}`} course={p.course} items={bookItems} progress={p} onStart={onStart} onRead={onRead} initialProblem={focus}/></div>;
  if (screen === 'reviewed') return <div className="simple-flow"><button className="text-button" onClick={() => open('home')}><ArrowLeft size={17}/> Volver a Practicar</button><h1>Prácticas corregidas</h1><p>Estos ejercicios sí tienen respuesta y explicación comprobadas.</p><BookPractice items={bookItems} progress={p} count={3} onStart={onStart}/></div>;
  if (screen === 'errors') return <div className="simple-flow"><button className="text-button" onClick={() => open('home')}><ArrowLeft size={17}/> Volver a Practicar</button><h1>Volver a intentar</h1><p>{errors.length ? `${errors.length} ejercicios para afianzar. Resolvelos de nuevo sin mirar la respuesta.` : 'No tenés ejercicios pendientes por error.'}</p>{errors.length > 0 && <button className="primary" onClick={() => onStart(practicePlan(errors, p, Math.min(3, errors.length)), 'Volver a intentar', 'errors')}>Practicar ahora <ArrowRight size={18}/></button>}</div>;
  if (screen === 'cases') return <div className="simple-flow"><button className="text-button" onClick={() => open('home')}><ArrowLeft size={17}/> Volver a Practicar</button><CaseStudio course={p.course} onStart={(item, title) => onStart([item], title, 'case')}/></div>;
  return <div className="simple-flow practice-simple"><h1>Practicar</h1><p>Misma rutina: modo, semana, cantidad, empezar. Los casos van después. Más abajo, un solo tema a fondo. El libro, al final.</p>
    <section className="simple-feature motion-in"><div><h2>20 de hoy</h2><p>Fácil a difícil, o examen: sin pistas y con la nota recién al final. La tira corta son 8 del mismo plan.</p></div>
      <div className="intensity-row" role="radiogroup" aria-label="Dificultad de la práctica">{intensities.map(option => <button key={option.id} type="button" role="radio" aria-checked={intensity === option.id} className={intensity === option.id ? 'selected' : ''} onClick={() => setIntensity(option.id)}><b>{option.label}</b><small>{option.hint}</small></button>)}</div>
      <ChoiceList label="Qué repasar" name="Tema a repasar" value={topic} onChange={setTopic} options={[{ value: 'all', label: 'Todos los temas' }, ...units.map((unit, index) => ({ value: unit, label: weekHeading(unit, index) }))]}/>
      <div className="week-topic-chips" role="group" aria-label="Cuántos ejercicios">
        <button type="button" className={length === 20 ? 'selected' : ''} onClick={() => setLength(20)}>20</button>
        <button type="button" className={length === 8 ? 'selected' : ''} onClick={() => setLength(8)}>8 · corta</button>
      </div>
      <button className="primary" disabled={!daily.length} onClick={() => onStart(daily, dailyTitle(intensity, length), `daily-${intensity}`)}>Empezar <ArrowRight size={18}/></button>
    </section>
    <section className="simple-feature motion-in case-feature"><div><h2><ScrollText size={18}/> Estudios de caso</h2><p>Una historia de un negocio, después la matemática de esas semanas. Es lo segundo que más conviene practicar.</p></div>
      <button className="primary" onClick={() => open('cases')}>Estudios de caso <ArrowRight size={18}/></button>
    </section>
    <section className="simple-feature motion-in drill-feature"><div><h2><Target size={18}/> Un tema, a fondo</h2><p>Elegí el tipo y cuántos. En división sintética, potencias, notables, conectores e inferencias elegís entre opciones: lo pensás vos.</p></div>
      <div className="week-topic-chips" role="radiogroup" aria-label="Tema específico">{drills.map(item => <button key={item.id} type="button" role="radio" aria-checked={chosenDrill.id === item.id} className={chosenDrill.id === item.id ? 'selected' : ''} onClick={() => setDrill(item.id)}>{item.label}</button>)}</div>
      <p className="drill-hint">{chosenDrill.hint}</p>
      <div className="week-topic-chips" role="radiogroup" aria-label="Cuántos de este tema">{DRILL_COUNTS.map(n => <button key={n} type="button" role="radio" aria-checked={drillCount === n} className={drillCount === n ? 'selected' : ''} onClick={() => setDrillCount(n)}>{n}</button>)}</div>
      <label className="practice-topic"><span>O escribí cuántos</span><input type="number" min={DRILL_MIN} max={DRILL_MAX} value={drillCount} aria-label="Cantidad de ejercicios del tema" onChange={e => setDrillCount(clampDrillCount(Number(e.target.value)))}/></label>
      <button className="primary" onClick={startTopic}>Empezar {drillCount} de {chosenDrill.label.toLowerCase()} <ArrowRight size={18}/></button>
    </section>
    <Fold title="Otras formas de practicar"><div className="simple-link-list"><button onClick={() => open('reviewed')}><b>Prácticas corregidas</b><span>Respuesta y explicación comprobadas</span></button><button onClick={() => open('errors')}><b>Volver a intentar</b><span>{errors.length} ejercicios para repasar</span></button><button onClick={() => setExamOpen(true)}><b>Simulacro</b><span>35 desafíos de las lecciones</span></button></div></Fold>
    <button className="simple-link" onClick={() => open('book')}><BookOpen size={22}/><span><b>Elegir semana o número</b><small>El recorrido del libro, un ejercicio a la vez. No hay clave inventada.</small></span><ArrowRight size={18}/></button>
    {examOpen && <ExamLobby units={units} defaultUnits={units} onClose={() => setExamOpen(false)} onStart={selected => { setExamOpen(false); onExam(selected); }}/>}
  </div>;
}
