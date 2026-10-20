import type { Course, Lesson } from './types';
import { lessons } from './content';
import { bookRoutes } from './bookIndex';

export interface WeekGroup {
  code: string;
  unit: string;
  label: string;
  lessons: Lesson[];
  bookPage?: number;
}

export function weekNumber(unitOrCode: string, index = 0): number {
  const match = unitOrCode.match(/(\d+)/);
  return match ? Number(match[1]) : index + 1;
}

export function weekTitle(unit: string): string {
  return unit.includes(' · ') ? unit.split(' · ')[1] : unit;
}

export function weekHeading(unit: string, index = 0): string {
  const name = weekTitle(unit);
  return `Semana ${weekNumber(unit, index)} · ${name || unit}`;
}

export function weekCode(lesson: Lesson): string {
  return lesson.unit.split(' · ')[0];
}

function rank(code: string): number {
  const week = code.match(/^S(\d+)/);
  if (week) return Number(week[1]);
  if (code.startsWith('B')) return 100 + Number(code.slice(1) || 0);
  return 200;
}

export function weekGroups(course: Course): WeekGroup[] {
  const path = lessons.filter(lesson => lesson.course === course);
  const units = [...new Set(path.map(lesson => lesson.unit))];
  return units
    .map((unit, index) => {
      const groupLessons = path.filter(lesson => lesson.unit === unit);
      const code = unit.split(' · ')[0];
      const route = bookRoutes[course].find(item => item.week === code);
      return { code, unit, label: weekHeading(unit, index), lessons: groupLessons, bookPage: route?.page };
    })
    .sort((a, b) => rank(a.code) - rank(b.code) || a.code.localeCompare(b.code));
}
