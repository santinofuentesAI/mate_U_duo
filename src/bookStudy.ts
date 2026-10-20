import type { Course, Lesson } from './types';
import { bookCatalog, type OpenBookProblem } from './bookCatalog';

const sectionByTitle: Record<string, string> = {
  'Introducción y razonamiento lógico': '1.1',
  'Formas normales': '1.5',
  'Inferencias cuantificadas': '1.7',
  'Métodos de demostración': '1.8',
  'División sintética': '3.3.5',
  'Fracciones y dominio': '3.3.5',
  'Operar fracciones algebraicas': '3.3.5',
  'Radicales y racionalización': '3.3.5',
};
const weekAlias: Record<string, string> = { B4: 'S4', B5: 'S5' };

export function studyTour(course: Course): OpenBookProblem[] {
  return [...bookCatalog[course]].sort((a, b) => a.page - b.page || a.number - b.number || a.part.localeCompare(b.part, 'es', { numeric: true }));
}

export function bookProblemsForLesson(lesson: Lesson): OpenBookProblem[] {
  const tour = studyTour(lesson.course);
  const section = sectionByTitle[lesson.title];
  if (section) return tour.filter(problem => problem.sectionCode === section);
  const code = lesson.unit.split(' · ')[0];
  const week = weekAlias[code] ?? code;
  return tour.filter(problem => problem.week === week);
}

export function readWorkedIds(course: Course): string[] {
  try {
    const value = JSON.parse(localStorage.getItem(`mate-book-exam-done-${course}`) || '[]');
    return Array.isArray(value) ? value.filter((id: unknown) => typeof id === 'string') : [];
  } catch { return []; }
}

export function nextStudyProblem(problems: OpenBookProblem[], status: (problem: OpenBookProblem) => string) {
  return problems.find(problem => status(problem) === 'identified')
    || problems.find(problem => status(problem) === 'submitted')
    || problems[0];
}

export function classWeekTour(course: Course, week: string): OpenBookProblem[] {
  return studyTour(course).filter(problem => problem.id.includes('-clase-') && problem.week === week);
}

export function missingCourseWeeks(course: Course) {
  const present = new Set(bookCatalog[course].map(problem => problem.week));
  return ['S5', 'S6'].filter(week => !present.has(week));
}
