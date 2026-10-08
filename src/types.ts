export type Course = 'discreta' | 'precalculo';
export type QuestionType = 'choice' | 'text' | 'logic' | 'table' | 'set' | 'order' | 'venn' | 'algebra' | 'synthetic' | 'guidedproof' | 'examproof';
export interface BookSource {
  course: Course; page: number; printedPage: number; section: string; exercise: string;
  crop: { x: number; y: number; width: number; height: number };
  adaptation?: string;
}
export interface Question {
  id: string; type: QuestionType; prompt: string; math?: string;
  options?: string[]; answer: string | string[]; explanation: string;
  hints: string[]; tag: string; difficulty: 1 | 2 | 3;
  expression?: string; variables?: string[]; universe?: string[];
  exclusions?: string[]; coefficients?: number[]; root?: number;
  bookSource?: BookSource; requiredForm?: 'factored'|'expanded'|'linearFactors'|'irreducibleFraction';
  premises?: string[];
  translation?:string;
  guidedSteps?: { expression: string; rule: string; hint: string }[];
}
export interface Lesson {
  id: string; course: Course; unit: string; title: string; icon: string;
  description: string; source: string; pages: string; minutes: number;
  theory: string[]; formulas: string[]; example: { title: string; steps: string[] };
  questions: Question[];
}
export interface AnswerDetails { answer: string|string[]; exclusions?: string[]; error?: string; }
export interface Attempt extends Partial<AnswerDetails> { questionId: string; lessonId: string; correct: boolean; assisted: boolean; date: string; }
export interface SkillProgress { successes: number; stage: number; due: string; last: string; }
export interface Progress {
  version: 1; attempts: Attempt[]; completed: string[]; skills: Record<string, SkillProgress>;
  xp: number; spentCoins?: number; days: string[]; course: Course; dark: boolean; fontScale: number;
  sound: boolean; reduceMotion: boolean; goal: number; palette?: import('./palettes').Palette; favorites?: string[];
}
