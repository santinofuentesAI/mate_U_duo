import { useState } from 'react';
import { ArrowRight, BookOpen, GraduationCap, Library, RefreshCw } from 'lucide-react';
import type { Course } from './types';
import { ChoiceChips } from './InApp';

const parts: { title: string; text: string; icon: typeof GraduationCap }[] = [
  { title: 'Aprender', text: 'Cada unidad es una semana. El nivel se marca si acertás la mayoría al primer intento, sin pista.', icon: GraduationCap },
  { title: 'Practicar', text: 'Veinte de hoy, un tema a fondo o el examen. En examen no hay ayudas: la nota aparece al terminar.', icon: RefreshCw },
  { title: 'Biblioteca', text: 'La idea del tema, las tablas y el paso a paso de lo que ya tiene solución.', icon: Library },
  { title: 'Mi libro', text: 'Cargás tu PDF y resolvés el ejercicio. Si no hay una clave comprobada, no se inventa.', icon: BookOpen },
];

export function Welcome({ initialCourse, onStart }: { initialCourse: Course; onStart: (course: Course) => void }) {
  const [course, setCourse] = useState<Course>(initialCourse);
  function pick(value: string) {
    if (value === 'discreta' || value === 'precalculo') setCourse(value);
  }
  return (
    <main className="welcome">
      <p className="welcome-brand">mate <b>U DUO</b></p>
      <h1>Dos cursos, un lugar para estudiarlos.</h1>
      <p>Mate U Duo es para Matemática Discreta y Precálculo. Los ejercicios se corrigen de verdad. El avance queda en este dispositivo.</p>
      <ul className="welcome-parts">
        {parts.map(part => (
          <li key={part.title}>
            <part.icon size={22} aria-hidden="true"/>
            <span><b>{part.title}</b>{part.text}</span>
          </li>
        ))}
      </ul>
      <section className="welcome-start">
        <h2>¿Con cuál empezás?</h2>
        <ChoiceChips name="Curso para empezar" value={course} options={[{ value: 'discreta', label: 'Matemática Discreta' }, { value: 'precalculo', label: 'Precálculo' }]} onChange={pick}/>
        <button className="primary wide" onClick={() => onStart(course)}>Empezar a estudiar<ArrowRight size={18}/></button>
      </section>
    </main>
  );
}
