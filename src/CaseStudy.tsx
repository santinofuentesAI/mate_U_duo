import { useEffect, useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import type { Course } from './types';
import { caseStudies, caseWeeks, casesFor, type CaseStudy as CaseItem } from './caseStudies';
import { seedNumber, type PracticeItem } from './learning';
import { lessons } from './content';

function prefersReducedMotion(): boolean {
  if (typeof document !== 'undefined' && document.documentElement.dataset.motion === 'reduce') return true;
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function TypeStory({ paragraphs, onDone }: { paragraphs: string[]; onDone: () => void }) {
  const full = paragraphs.join('\n\n');
  const instant = prefersReducedMotion();
  const [shown, setShown] = useState(instant ? full.length : 0);
  useEffect(() => {
    if (instant) return;
    if (shown >= full.length) return;
    const timer = window.setTimeout(() => setShown(n => Math.min(full.length, n + 1)), 16);
    return () => window.clearTimeout(timer);
  }, [full, instant, shown]);
  const done = shown >= full.length;
  return (
    <article className="case-story" aria-live="polite">
      <p>{full.slice(0, shown)}{!done && <span className="case-caret" aria-hidden="true">▌</span>}</p>
      <div className="case-story-actions">
        {!done && <button className="secondary" type="button" onClick={() => setShown(full.length)}>Mostrar el relato entero</button>}
        {done && <button className="primary" type="button" onClick={onDone}>Pasar a la matemática<ArrowRight size={18}/></button>}
      </div>
    </article>
  );
}

export function CaseStudio({ course, onStart }: { course: Course; onStart: (item: PracticeItem, title: string) => void }) {
  const available = caseWeeks(course);
  const [weeks, setWeeks] = useState<string[]>(available);
  const [picked, setPicked] = useState<CaseItem | null>(null);
  const item = useMemo<PracticeItem | null>(() => {
    if (!picked) return null;
    const lesson = lessons.find(l => l.course === course && l.title === picked.lessonTitle);
    if (!lesson) return null;
    return { lesson, question: picked.question };
  }, [course, picked]);
  function roll() {
    const pool = casesFor(course, weeks.length ? weeks : available);
    if (!pool.length) return;
    const choice = pool[seedNumber(`${Date.now()}-${pool.map(c => c.id).join()}`) % pool.length];
    setPicked(choice);
    window.scrollTo(0, 0);
  }
  function toggle(week: string) {
    setWeeks(prev => prev.includes(week) ? prev.filter(w => w !== week) : [...prev, week]);
  }
  if (picked && item) {
    return (
      <div className="case-studio">
        <span className="eyebrow">{picked.setting} · {picked.weeks.join(' · ')}</span>
        <h1>{picked.title}</h1>
        <TypeStory paragraphs={picked.story} onDone={() => onStart(item, picked.title)} />
        <button className="text-button" type="button" onClick={() => setPicked(null)}>Elegir otro caso</button>
      </div>
    );
  }
  return (
    <div className="case-studio">
      <span className="eyebrow">DE UN RELATO A UNA FÓRMULA</span>
      <h1>Estudios de caso</h1>
      <p>Elegí las semanas. Sale una historia de un negocio o un taller, y después el mismo tipo de matemática del curso. Cada número se puede comprobar.</p>
      <fieldset className="case-weeks">
        <legend>Semanas que querés meter</legend>
        <div className="intensity-row">
          {available.map(week => (
            <label key={week} className={weeks.includes(week) ? 'chosen' : ''}>
              <input type="checkbox" checked={weeks.includes(week)} onChange={() => toggle(week)} />
              {week}
            </label>
          ))}
        </div>
        <button className="secondary" type="button" onClick={() => setWeeks(available)}>Todas las semanas</button>
      </fieldset>
      <button className="primary" type="button" disabled={!weeks.length} onClick={roll}>Contame una historia<ArrowRight size={18}/></button>
      <p className="notice">{caseStudies.filter(c => c.course === course).length} casos escritos para este curso.</p>
    </div>
  );
}
