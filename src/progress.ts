import type { Progress, Question, Lesson, AnswerDetails } from './types';
import { validPalette } from './palettes';
import { initializeFSRSCard, reviewFSRSCard, updateFSRSCard, type FSRSReviewResult } from './fsrs';
import { updateTopicMastery } from './topicMastery';
export const STORAGE_KEY = 'mate-u-duo.v1';
export const freshProgress = (): Progress => ({ 
  version: 1, attempts: [], completed: [], skills: {}, xp: 0, days: [], 
  course: 'discreta', dark: false, fontScale: 1, sound: false, reduceMotion: false, 
  goal: 8, dailyGoalType: 'exercises', dailyGoalValue: 10, dailyProgress: {}, 
  achievements: [], level: 1, coins: 20, currentStreak: 0, longestStreak: 0, 
  streakFreezes: 0, freezeUsedDates: [], weekendProtection: false 
});
const studyDayFormatter=new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Costa_Rica', year: 'numeric', month: '2-digit', day: '2-digit' });
export function dayKey(now = new Date()) { return studyDayFormatter.format(now); }
export function validateProgress(v: unknown): Progress {
  if (!v || typeof v !== 'object') throw new Error('El archivo no contiene un progreso válido.');
  const p = v as Progress;
  if(p.favorites!==undefined&&(!Array.isArray(p.favorites)||p.favorites.length>200||p.favorites.some(x=>typeof x!=='string'||x.length>100)))throw new Error('Favoritos inválidos.');
  const validAnswer=(a:unknown)=>typeof a==='string'?a.length<=5000:Array.isArray(a)&&a.length<=64&&a.every(x=>typeof x==='string'&&x.length<=5000);
  if(Array.isArray(p.attempts)&&p.attempts.some(a=>a&&((a.answer!==undefined&&!validAnswer(a.answer))||(a.exclusions!==undefined&&(!Array.isArray(a.exclusions)||!validAnswer(a.exclusions)))||(a.error!==undefined&&(typeof a.error!=='string'||a.error.length>5000)))))throw new Error('Respuestas guardadas inválidas.');
  if (p.spentCoins !== undefined && (!Number.isInteger(p.spentCoins) || p.spentCoins < 0)) throw new Error('El saldo de monedas no es válido.');
  if (p.version !== 1 || !Array.isArray(p.attempts) || !Array.isArray(p.completed) || !p.skills || typeof p.skills !== 'object' || !Array.isArray(p.days) || !Number.isFinite(p.xp) || p.xp < 0 || !['discreta', 'precalculo'].includes(p.course)) throw new Error('Formato de copia incompatible.');
  if (p.attempts.length > 100000 || p.attempts.some(a => !a || typeof a.questionId !== 'string' || typeof a.lessonId !== 'string' || typeof a.correct !== 'boolean' || typeof a.assisted !== 'boolean' || !Number.isFinite(Date.parse(a.date)))) throw new Error('El historial contiene entradas inválidas.');
  if (p.completed.some(x => typeof x !== 'string') || p.days.some(x => typeof x !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(x))) throw new Error('Datos de avance inválidos.');
  for (const s of Object.values(p.skills)) if (!s || !Number.isInteger(s.stage) || s.stage < 0 || s.stage > 4 || !Number.isInteger(s.successes) || s.successes < 0 || !Number.isFinite(Date.parse(s.due)) || !Number.isFinite(Date.parse(s.last))) throw new Error('Calendario de repaso inválido.');
  return { 
    ...freshProgress(), ...p, 
    palette: validPalette(p.palette), 
    fontScale: Math.min(1.3, Math.max(1, Number(p.fontScale) || 1)), 
    goal: Math.min(30, Math.max(4, Number(p.goal) || 8)), 
    dark: !!p.dark, 
    sound: !!p.sound, 
    reduceMotion: !!p.reduceMotion, 
    dailyGoalType: p.dailyGoalType || 'exercises', 
    dailyGoalValue: Math.min(30, Math.max(3, Number(p.dailyGoalValue) || 10)), 
    dailyProgress: p.dailyProgress || {}, 
    achievements: p.achievements || [], 
    level: Math.max(1, Math.floor((p.xp || 0) / 100) + 1),
    coins: Math.max(0, Number(p.coins) || 20),
    currentStreak: Math.max(0, Number(p.currentStreak) || 0),
    longestStreak: Math.max(0, Number(p.longestStreak) || 0),
    streakFreezes: Math.max(0, Number(p.streakFreezes) || 0),
    freezeUsedDates: Array.isArray(p.freezeUsedDates) ? p.freezeUsedDates : [],
    weekendProtection: !!p.weekendProtection
  };
}
export function loadProgress(): Progress { try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? validateProgress(JSON.parse(raw)) : freshProgress(); } catch { return freshProgress(); } }
export function recordAttempt(p: Progress, lesson: Lesson, q: Question, correct: boolean, assisted: boolean, now = new Date(), details?: AnswerDetails, hintsUsed?: number[]): Progress {
  const last = p.skills[q.id];
  const isScheduledReview = !!last && now.getTime() >= Date.parse(last.due);
  const succeeds = correct && !assisted;
  const stage = succeeds ? Math.min(4, (last?.stage || 0) + (isScheduledReview ? 1 : 0)) : 0;
  const successes = succeeds ? (last?.successes || 0) + 1 : 0;
  const intervals = [1, 3, 7, 14, 30];
  const due = succeeds && last && !isScheduledReview ? last.due : new Date(now.getTime() + (succeeds ? intervals[stage] * 86400000 : 10 * 60000)).toISOString();
  const day = dayKey(now);
  
  // Calculate XP with hints penalty
  const rewarded = p.attempts.some(a => a.questionId === q.id && a.correct);
  let xpGained = 0;
  if (correct && !rewarded) {
    if (hintsUsed && hintsUsed.length > 0) {
      // Calculate penalty for hints used
      const penalty = hintsUsed.reduce((sum, level) => {
        if (level === 1) return sum + 2;
        if (level === 2) return sum + 4;
        if (level === 3) return sum + 7;
        return sum;
      }, 0);
      xpGained = Math.max(1, 10 - penalty);
    } else {
      xpGained = assisted ? 5 : 10;
    }
  }
  
  // Earn 1 coin for every 5 XP gained
  const coinsGained = Math.floor(xpGained / 5);
  
  // Update FSRS card for spaced repetition
  let progressWithFSRS = p;
  const existingCard = p.fsrsCards?.[q.id];
  const fsrsCard = existingCard || initializeFSRSCard(q.id, lesson.unit);
  
  // Determine FSRS rating based on performance
  let fsrsRating: 1 | 2 | 3 | 4 = 3; // Default to "good"
  if (!correct) {
    fsrsRating = 1; // Again
  } else if (assisted || (hintsUsed && hintsUsed.length > 0)) {
    fsrsRating = 2; // Hard
  } else if (!rewarded) {
    fsrsRating = 4; // Easy (first time correct without help)
  }
  
  const reviewResult: FSRSReviewResult = {
    rating: fsrsRating,
    correct,
    hintsUsed: hintsUsed?.length || 0
  };
  
  const updatedCard = reviewFSRSCard(fsrsCard, reviewResult);
  progressWithFSRS = updateFSRSCard(progressWithFSRS, updatedCard);
  
  // Update topic mastery
  const topicFromLesson = lesson.unit || lesson.title.toLowerCase();
  let progressWithMastery = updateTopicMastery(
    progressWithFSRS,
    topicFromLesson,
    correct,
    assisted || !!(hintsUsed && hintsUsed.length > 0)
  );
  
  // Also track question-specific topic if available
  if (q.topic) {
    progressWithMastery = updateTopicMastery(
      progressWithMastery,
      q.topic,
      correct,
      assisted || !!(hintsUsed && hintsUsed.length > 0)
    );
  }
  
  return { 
    ...progressWithMastery, 
    xp: p.xp + xpGained,
    coins: (p.coins || 0) + coinsGained,
    days: [...new Set([...p.days, day])],
    attempts: [...p.attempts, { 
      questionId: q.id, 
      lessonId: lesson.id, 
      correct, 
      assisted, 
      date: now.toISOString(), 
      hintUsed: hintsUsed && hintsUsed.length > 0,
      hintsUsedLevels: hintsUsed,
      ...details 
    }].slice(-100000),
    skills: { ...p.skills, [q.id]: { stage, successes, due, last: now.toISOString() } } 
  };
}
export function lessonMastery(p: Progress, lesson: Lesson) { const mastered = lesson.questions.filter(q => (p.skills[q.id]?.stage || 0) >= 1 && (p.skills[q.id]?.successes || 0) >= 2).length; return Math.round(mastered / lesson.questions.length * 100); }
export function streak(p: Progress, now = new Date()) { const days = new Set(p.days); let count = 0; const d = new Date(`${dayKey(now)}T12:00:00-06:00`); if (!days.has(dayKey(d))) d.setDate(d.getDate() - 1); while (days.has(dayKey(d))) { count++; d.setDate(d.getDate() - 1); } return count; }
export function dailyGoalProgress(p: Progress, now = new Date()): { current: number; target: number; met: boolean } {
  const today = dayKey(now);
  const todayData = p.dailyProgress?.[today] || { exercises: 0, xp: 0 };
  const type = p.dailyGoalType || 'exercises';
  const target = p.dailyGoalValue || 10;
  const current = type === 'exercises' ? todayData.exercises : todayData.xp;
  return { current, target, met: current >= target };
}
export function recordDailyProgress(p: Progress, exercisesCompleted: number, xpEarned: number, now = new Date()): Progress {
  const today = dayKey(now);
  const current = p.dailyProgress?.[today] || { exercises: 0, xp: 0 };
  return {
    ...p,
    dailyProgress: {
      ...p.dailyProgress,
      [today]: {
        exercises: current.exercises + exercisesCompleted,
        xp: current.xp + xpEarned
      }
    }
  };
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  check: (p: Progress) => boolean;
}

export const achievements: Achievement[] = [
  { id: 'first-lesson', title: 'Primera lección', description: 'Completá tu primera lección', icon: '🎓', check: p => p.completed.length >= 1 },
  { id: 'streak-3', title: 'Racha de 3 días', description: 'Practicá 3 días seguidos', icon: '🔥', check: p => streak(p) >= 3 },
  { id: 'streak-7', title: 'Racha de 7 días', description: 'Una semana de práctica constante', icon: '⚡', check: p => streak(p) >= 7 },
  { id: 'streak-30', title: 'Racha de 30 días', description: 'Un mes completo de aprendizaje', icon: '💎', check: p => streak(p) >= 30 },
  { id: 'xp-100', title: '100 XP', description: 'Alcanzá 100 puntos de experiencia', icon: '⭐', check: p => p.xp >= 100 },
  { id: 'xp-500', title: '500 XP', description: 'Alcanzá 500 puntos de experiencia', icon: '🌟', check: p => p.xp >= 500 },
  { id: 'xp-1000', title: '1000 XP', description: 'Alcanzá 1000 puntos de experiencia', icon: '✨', check: p => p.xp >= 1000 },
  { id: 'lessons-5', title: '5 lecciones', description: 'Completá 5 lecciones', icon: '📚', check: p => p.completed.length >= 5 },
  { id: 'lessons-10', title: '10 lecciones', description: 'Completá 10 lecciones', icon: '📖', check: p => p.completed.length >= 10 },
  { id: 'perfect-5', title: 'Perfección', description: '5 respuestas correctas seguidas sin ayuda', icon: '💯', check: p => {
    const last5 = p.attempts.slice(-5);
    return last5.length === 5 && last5.every(a => a.correct && !a.assisted);
  }},
  { id: 'daily-goal-7', title: 'Meta diaria × 7', description: 'Cumplí tu meta diaria 7 veces', icon: '🎯', check: p => {
    const goalType = p.dailyGoalType || 'exercises';
    const goalValue = p.dailyGoalValue || 10;
    return Object.values(p.dailyProgress || {}).filter(d => 
      goalType === 'exercises' ? d.exercises >= goalValue : d.xp >= goalValue
    ).length >= 7;
  }},
  { id: 'explorer', title: 'Explorador', description: 'Guardá 5 lecciones favoritas', icon: '🗺️', check: p => (p.favorites?.length || 0) >= 5 },
];

export function checkNewAchievements(p: Progress): string[] {
  const current = new Set(p.achievements || []);
  const newOnes: string[] = [];
  for (const achievement of achievements) {
    if (!current.has(achievement.id) && achievement.check(p)) {
      newOnes.push(achievement.id);
    }
  }
  return newOnes;
}

export function userLevel(xp: number): { level: number; title: string; nextLevelXP: number; progress: number } {
  const level = Math.max(1, Math.floor(xp / 100) + 1);
  const currentLevelXP = (level - 1) * 100;
  const nextLevelXP = level * 100;
  const progress = Math.round(((xp - currentLevelXP) / 100) * 100);
  
  const titles = [
    'Principiante', 'Aprendiz', 'Estudiante', 'Practicante', 'Competente',
    'Avanzado', 'Experto', 'Maestro', 'Virtuoso', 'Leyenda'
  ];
  const titleIndex = Math.min(Math.floor((level - 1) / 2), titles.length - 1);
  
  return { level, title: titles[titleIndex], nextLevelXP, progress };
}
