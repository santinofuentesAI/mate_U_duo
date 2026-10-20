import type { Course, Lesson } from './types';
import { lessons } from './content';
import { lessonWeekLabel } from './bookScope';
import { bookRoutes } from './bookIndex';

export interface WeekGroup {
  code: string;
  label: string;
  lessons: Lesson[];
  bookPage?: number;
}

export function weekCode(lesson: Lesson): string {
  const label = lessonWeekLabel(lesson);
  if (label.startsWith('Complemento')) return 'Apoyo';
  const match = label.match(/^(S\d+|B\d+)/);
  return match?.[1] || lesson.unit.split(' · ')[0];
}

function rank(code: string): number {
  const week = code.match(/^S(\d+)/);
  if (week) return Number(week[1]);
  if (code.startsWith('B')) return 100 + Number(code.slice(1) || 0);
  return 200;
}

export function weekGroups(course: Course): WeekGroup[] {
  const path = lessons.filter(lesson => lesson.course === course);
  const byCode = new Map<string, Lesson[]>();
  for (const lesson of path) {
    const code = weekCode(lesson);
    const list = byCode.get(code) || [];
    list.push(lesson);
    byCode.set(code, list);
  }
  return [...byCode.entries()]
    .sort((a, b) => rank(a[0]) - rank(b[0]) || a[0].localeCompare(b[0]))
    .map(([code, groupLessons]) => {
      const route = bookRoutes[course].find(item => item.week === code);
      const label = groupLessons[0] ? lessonWeekLabel(groupLessons[0]) : code;
      return { code, label, lessons: groupLessons, bookPage: route?.page };
    });
}
