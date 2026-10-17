import type { Course } from './types';

export interface WeekInfo {
  id: string;
  course: Course;
  weekNumber: number;
  title: string;
  description: string;
  enabled: boolean;
  comingSoon?: boolean;
  unlockRequirement?: string;
}

export const weekStructure: WeekInfo[] = [
  // Matemática Discreta
  { id: 'discreta-intro', course: 'discreta', weekNumber: 0, title: 'Introducción', description: 'Razonamiento lógico básico', enabled: true },
  { id: 'discreta-s1', course: 'discreta', weekNumber: 1, title: 'Semana 1', description: 'Lógica proposicional', enabled: true },
  { id: 'discreta-s2', course: 'discreta', weekNumber: 2, title: 'Semana 2', description: 'Circuitos e inferencia', enabled: true },
  { id: 'discreta-s3', course: 'discreta', weekNumber: 3, title: 'Semana 3', description: 'Predicados y cuantificadores', enabled: true },
  { id: 'discreta-s4', course: 'discreta', weekNumber: 4, title: 'Semana 4', description: 'Conjuntos y operaciones', enabled: true },
  { 
    id: 'discreta-s5', 
    course: 'discreta', 
    weekNumber: 5, 
    title: 'Semana 5', 
    description: 'Relaciones y funciones', 
    enabled: false,
    comingSoon: true,
    unlockRequirement: 'Completá el 70% de la Semana 4'
  },
  { 
    id: 'discreta-s6', 
    course: 'discreta', 
    weekNumber: 6, 
    title: 'Semana 6', 
    description: 'Grafos y árboles', 
    enabled: false,
    comingSoon: true,
    unlockRequirement: 'Completá el 70% de la Semana 5'
  },
  
  // Precálculo
  { id: 'precalculo-b1', course: 'precalculo', weekNumber: 1, title: 'Bloque 1', description: 'Números reales', enabled: true },
  { id: 'precalculo-b2', course: 'precalculo', weekNumber: 2, title: 'Bloque 2', description: 'Expresiones algebraicas', enabled: true },
  { id: 'precalculo-b3', course: 'precalculo', weekNumber: 3, title: 'Bloque 3', description: 'Factorización', enabled: true },
  { id: 'precalculo-b4', course: 'precalculo', weekNumber: 4, title: 'Bloque 4', description: 'Fracciones algebraicas', enabled: true },
  { id: 'precalculo-b5', course: 'precalculo', weekNumber: 5, title: 'Bloque 5', description: 'Ecuaciones', enabled: true },
  { 
    id: 'precalculo-b6', 
    course: 'precalculo', 
    weekNumber: 6, 
    title: 'Bloque 6', 
    description: 'Funciones y gráficas', 
    enabled: false,
    comingSoon: true,
    unlockRequirement: 'Completá el 70% del Bloque 5'
  },
];

export function getWeeksForCourse(course: Course): WeekInfo[] {
  return weekStructure.filter(w => w.course === course);
}

export function isWeekUnlocked(weekId: string, completedLessons: string[], allLessons: { id: string; unit: string }[]): boolean {
  const week = weekStructure.find(w => w.id === weekId);
  if (!week || week.enabled) return week?.enabled || false;
  
  // Check unlock requirement
  const prevWeekNumber = week.weekNumber - 1;
  const prevWeek = weekStructure.find(w => w.course === week.course && w.weekNumber === prevWeekNumber);
  if (!prevWeek) return false;
  
  // Count lessons in previous week
  const prevWeekLessons = allLessons.filter(l => 
    l.unit.toLowerCase().includes(`s${prevWeekNumber}`) || 
    l.unit.toLowerCase().includes(`b${prevWeekNumber}`)
  );
  const completed = prevWeekLessons.filter(l => completedLessons.includes(l.id)).length;
  const required = Math.ceil(prevWeekLessons.length * 0.7);
  
  return completed >= required;
}

export interface ExerciseTemplate {
  type: 'choice' | 'text' | 'logic' | 'algebra' | 'set' | 'venn' | 'table' | 'order' | 'synthetic';
  name: string;
  description: string;
  example: string;
}

export const exerciseTemplates: ExerciseTemplate[] = [
  {
    type: 'choice',
    name: 'Opción múltiple',
    description: 'El estudiante elige una respuesta de varias opciones',
    example: `choice('¿Cuál número es par?', ['3', '5', '8'], '8', 'Un número par es divisible por 2.')`
  },
  {
    type: 'text',
    name: 'Respuesta corta',
    description: 'El estudiante escribe una respuesta numérica o textual',
    example: `input('text', 'Calculá 2 + 3.', '5', 'Sumá ambos números.')`
  },
  {
    type: 'logic',
    name: 'Expresión lógica',
    description: 'El estudiante escribe una fórmula lógica (P, Q, ¬, ∧, ∨, →, ↔)',
    example: `input('logic', 'Escribí "P y no Q".', 'P∧¬Q', 'La conjunción es ∧ y la negación es ¬.')`
  },
  {
    type: 'algebra',
    name: 'Expresión algebraica',
    description: 'El estudiante escribe una expresión matemática',
    example: `input('algebra', 'Factorizá x²−4.', '(x-2)*(x+2)', 'Es una diferencia de cuadrados.')`
  },
  {
    type: 'set',
    name: 'Selección de conjunto',
    description: 'El estudiante selecciona elementos de un conjunto',
    example: `input('set', 'Seleccioná los números pares.', ['2','4'], 'Los divisibles por 2.', { universe: ['1','2','3','4','5'] })`
  },
  {
    type: 'venn',
    name: 'Diagrama de Venn',
    description: 'El estudiante selecciona regiones en un diagrama de Venn',
    example: `input('venn', 'Seleccioná A ∩ B.', ['011','111'], 'Las regiones donde ambos son verdaderos.', { universe: ['000','100','010','001','110','101','011','111'] })`
  },
  {
    type: 'table',
    name: 'Tabla de verdad',
    description: 'El estudiante completa una tabla de verdad',
    example: `input('table', 'Completá P → Q.', ['V','F','V','V'], 'Solo VF es falsa.', { expression: 'P→Q', variables: ['P','Q'] })`
  },
  {
    type: 'order',
    name: 'Ordenar pasos',
    description: 'El estudiante ordena pasos de una demostración',
    example: `input('order', 'Ordená los pasos.', ['P','P ∨ Q','R'], 'Primero la premisa, luego adición, luego modus ponens.', { options: ['R','P ∨ Q','P'] })`
  },
  {
    type: 'synthetic',
    name: 'División sintética',
    description: 'El estudiante completa la fila final de división sintética',
    example: `input('synthetic', 'Completá la división.', ['2','-5','-3','0'], 'Bajá el primero y aplicá el algoritmo.', { coefficients: [2,-7,2,3], root: 1 })`
  },
];
