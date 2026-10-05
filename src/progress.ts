import type { Progress, Question, Lesson, AnswerDetails } from './types';
import { validPalette } from './palettes';
export const STORAGE_KEY = 'mate-u-duo.v1';
export const freshProgress = (): Progress => ({ version: 1, attempts: [], completed: [], skills: {}, xp: 0, days: [], course: 'discreta', dark: false, fontScale: 1, sound: false, reduceMotion: false, goal: 8 });
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
  return { ...freshProgress(), ...p, palette: validPalette(p.palette), fontScale: Math.min(1.3, Math.max(1, Number(p.fontScale) || 1)), goal: Math.min(30, Math.max(4, Number(p.goal) || 8)), dark: !!p.dark, sound: !!p.sound, reduceMotion: !!p.reduceMotion };
}
export function loadProgress(): Progress { try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? validateProgress(JSON.parse(raw)) : freshProgress(); } catch { return freshProgress(); } }
export function recordAttempt(p: Progress, lesson: Lesson, q: Question, correct: boolean, assisted: boolean, now = new Date(), details?: AnswerDetails): Progress {
  const last = p.skills[q.id];
  const isScheduledReview = !!last && now.getTime() >= Date.parse(last.due);
  const succeeds = correct && !assisted;
  const stage = succeeds ? Math.min(4, (last?.stage || 0) + (isScheduledReview ? 1 : 0)) : 0;
  const successes = succeeds ? (last?.successes || 0) + 1 : 0;
  const intervals = [1, 3, 7, 14, 30];
  const due = succeeds && last && !isScheduledReview ? last.due : new Date(now.getTime() + (succeeds ? intervals[stage] * 86400000 : 10 * 60000)).toISOString();
  const day = dayKey(now);
  // Repeated attempts never farm XP; a correct answer with hints still remains in review.
  const rewarded = p.attempts.some(a => a.questionId === q.id && a.correct);
  return { ...p, xp: p.xp + (correct && !rewarded ? (assisted ? 5 : 10) : 0), days: [...new Set([...p.days, day])],
    attempts: [...p.attempts, { questionId: q.id, lessonId: lesson.id, correct, assisted, date: now.toISOString(), ...details }].slice(-100000),
    skills: { ...p.skills, [q.id]: { stage, successes, due, last: now.toISOString() } } };
}
export function lessonMastery(p: Progress, lesson: Lesson) { const mastered = lesson.questions.filter(q => (p.skills[q.id]?.stage || 0) >= 1 && (p.skills[q.id]?.successes || 0) >= 2).length; return Math.round(mastered / lesson.questions.length * 100); }
export function streak(p: Progress, now = new Date()) { const days = new Set(p.days); let count = 0; const d = new Date(`${dayKey(now)}T12:00:00-06:00`); if (!days.has(dayKey(d))) d.setDate(d.getDate() - 1); while (days.has(dayKey(d))) { count++; d.setDate(d.getDate() - 1); } return count; }
