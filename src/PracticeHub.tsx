import { useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, ScrollText } from 'lucide-react';
import { lessons } from './content';
import type { Progress } from './types';
import { bank, dailyTitle, latestAttempts, mixedPractice, practicePlan, type PracticeIntensity, type PracticeItem } from './learning';
import { BookPractice } from './BookPractice';
import { BookExam } from './BookExam';
import { ExamLobby } from './ExamLobby';
import { CaseStudio } from './CaseStudy';

interface Props { progress: Progress; onStart: (items: PracticeItem[], title: string, mode: string) => void; onExam: (units: string[]) => void; onRead: (page: number) => void; initialBookProblem?: string; }
type Screen = 'home' | 'book' | 'reviewed' | 'errors' | 'cases';
const intensities: { id: PracticeIntensity; label: string; hint: string }[] = [
  { id: 'easy', label: 'Fácil', hint: 'Lo básico' },
  { id: 'medium', label: 'Medio', hint: 'Ritmo de clase' },
  { id: 'hard', label: 'Difícil', hint: 'Lo que traba' },
  { id: 'exam', label: 'Examen', hint: 'Mezcla real' },
];
export function PracticeHub({ progress: p, onStart, onExam, onRead, initialBookProblem }: Props) {
  const [screen, setScreen] = useState<Screen>(initialBookProblem ? 'book' : 'home');
  const [focus, setFocus] = useState(initialBookProblem);
  const [topic, setTopic] = useState('all');
  const [length, setLength] = useState(20);
  const [examOpen, setExamOpen] = useState(false);
  const [intensity, setIntensity] = useState<PracticeIntensity>('exam');
  const items = bank(lessons, p.course), bookItems = items.filter(i => i.question.bookSource);
  const units = [...new Set(items.map(i => i.lesson.unit))];
  const daily = mixedPractice(items, p, intensity, length, new Date(), topic);
  const last = latestAttempts(p);
  const errors = items.filter(i => { const a = last.get(i.question.id); return a && (!a.correct || a.assisted); });
  function open(next: Screen) { setScreen(next); window.scrollTo(0, 0); }
  if (screen === 'book') return <div className="simple-flow"><button className="text-button" onClick={() => open('home')}><ArrowLeft size={17}/> Volver a Practicar</button><BookExam key={`${p.course}-${focus || 'saved'}`} course={p.course} items={bookItems} progress={p} onStart={onStart} onRead={onRead} initialProblem={focus}/></div>;
  if (screen === 'reviewed') return <div className="simple-flow"><button className="text-button" onClick={() => open('home')}><ArrowLeft size={17}/> Volver a Practicar</button><h1>Prácticas corregidas</h1><p>Estos ejercicios sí tienen respuesta y explicación comprobadas.</p><BookPractice items={bookItems} progress={p} count={3} onStart={onStart}/></div>;
  if (screen === 'errors') return <div className="simple-flow"><button className="text-button" onClick={() => open('home')}><ArrowLeft size={17}/> Volver a Practicar</button><h1>Volver a intentar</h1><p>{errors.length ? `${errors.length} ejercicios para afianzar. Resolvelos de nuevo sin mirar la respuesta.` : 'No tenés ejercicios pendientes por error.'}</p>{errors.length > 0 && <button className="primary" onClick={() => onStart(practicePlan(errors, p, Math.min(3, errors.length)), 'Volver a intentar', 'errors')}>Practicar ahora <ArrowRight size={18}/></button>}</div>;
  if (screen === 'cases') return <div className="simple-flow"><button className="text-button" onClick={() => open('home')}><ArrowLeft size={17}/> Volver a Practicar</button><CaseStudio course={p.course} onStart={(item, title) => onStart([item], title, 'case')}/></div>;
  return <div className="simple-flow practice-simple"><h1>Practicar</h1><p>Misma rutina: modo, tema, cantidad, empezar. Los casos van después. El libro, al final.</p>
    <section className="simple-feature motion-in"><div><h2>20 de hoy</h2><p>Fácil a difícil, o examen mezclado. La tira corta son 8 del mismo plan.</p></div>
      <div className="intensity-row" role="radiogroup" aria-label="Dificultad de la práctica">{intensities.map(option => <button key={option.id} type="button" role="radio" aria-checked={intensity === option.id} className={intensity === option.id ? 'selected' : ''} onClick={() => setIntensity(option.id)}><b>{option.label}</b><small>{option.hint}</small></button>)}</div>
      <label className="practice-topic"><span>Qué repasar</span><select aria-label="Tema a repasar" value={topic} onChange={e => setTopic(e.target.value)}><option value="all">Todos los temas</option>{units.map(unit => <option key={unit} value={unit}>{unit.split(' · ')[1] || unit}</option>)}</select></label>
      <div className="week-topic-chips" role="group" aria-label="Cuántos ejercicios">
        <button type="button" className={length === 20 ? 'selected' : ''} onClick={() => setLength(20)}>20</button>
        <button type="button" className={length === 8 ? 'selected' : ''} onClick={() => setLength(8)}>8 · corta</button>
      </div>
      <button className="primary" disabled={!daily.length} onClick={() => onStart(daily, dailyTitle(intensity, length), `daily-${intensity}`)}>Empezar <ArrowRight size={18}/></button>
    </section>
    <section className="simple-feature motion-in case-feature"><div><h2><ScrollText size={18}/> Estudios de caso</h2><p>Una historia de un negocio, después la matemática de esas semanas. Es lo segundo que más conviene practicar.</p></div>
      <button className="primary" onClick={() => open('cases')}>Estudios de caso <ArrowRight size={18}/></button>
    </section>
    <details className="simple-more"><summary>Otras formas de practicar</summary><div className="simple-link-list"><button onClick={() => open('reviewed')}><b>Prácticas corregidas</b><span>Respuesta y explicación comprobadas</span></button><button onClick={() => open('errors')}><b>Volver a intentar</b><span>{errors.length} ejercicios para repasar</span></button><button onClick={() => setExamOpen(true)}><b>Simulacro</b><span>35 desafíos de las lecciones</span></button></div></details>
    <button className="simple-link" onClick={() => open('book')}><BookOpen size={22}/><span><b>Elegir semana o número</b><small>El recorrido del libro, un ejercicio a la vez. No hay clave inventada.</small></span><ArrowRight size={18}/></button>
    {examOpen && <ExamLobby units={units} defaultUnits={units} onClose={() => setExamOpen(false)} onStart={selected => { setExamOpen(false); onExam(selected); }}/>}
  </div>;
}
