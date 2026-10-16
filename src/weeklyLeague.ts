// Weekly league - compete against your previous week

import type { Progress } from './types';

export interface WeeklyStats {
  week: string; // ISO week 'YYYY-WW'
  xp: number;
  exercisesCompleted: number;
  lessonsCompleted: number;
  accuracy: number; // 0-1
  perfectAnswers: number;
  streak: number;
}

export interface LeagueComparison {
  thisWeek: WeeklyStats;
  lastWeek: WeeklyStats | null;
  change: {
    xp: number;
    exercises: number;
    accuracy: number;
  };
  rank: 'ahead' | 'behind' | 'tied' | 'first-week';
  message: string;
  motivationalQuote: string;
}

function getISOWeek(date: Date): string {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${d.getFullYear()}-W${weekNo.toString().padStart(2, '0')}`;
}

function getWeekStart(weekString: string): Date {
  const [year, week] = weekString.split('-W').map(Number);
  const jan4 = new Date(year, 0, 4);
  const weekStart = new Date(jan4);
  weekStart.setDate(jan4.getDate() - (jan4.getDay() || 7) + 1 + (week - 1) * 7);
  return weekStart;
}

function getWeekEnd(weekString: string): Date {
  const start = getWeekStart(weekString);
  const end = new Date(start);
  end.setDate(start.getDate() + 7);
  return end;
}

export function calculateWeeklyStats(progress: Progress, week: string): WeeklyStats {
  const weekStart = getWeekStart(week);
  const weekEnd = getWeekEnd(week);
  
  const weekAttempts = progress.attempts.filter(a => {
    const attemptDate = new Date(a.date);
    return attemptDate >= weekStart && attemptDate < weekEnd;
  });
  
  const correctAttempts = weekAttempts.filter(a => a.correct);
  const accuracy = weekAttempts.length > 0 
    ? correctAttempts.length / weekAttempts.length 
    : 0;
  
  // Count unique lessons completed this week
  const lessonsThisWeek = new Set(
    correctAttempts.map(a => {
      // Extract lesson ID from question ID (format: lessonId-questionId)
      const parts = a.questionId.split('-');
      return parts.slice(0, -1).join('-');
    })
  ).size;
  
  // Count perfect answers (correct on first try without hints)
  const perfectAnswers = correctAttempts.filter(a => !a.hintUsed).length;
  
  // Calculate XP earned this week (10 per correct, 5 if hint used)
  const xp = correctAttempts.reduce((sum, a) => 
    sum + (a.hintUsed ? 5 : 10), 0
  );
  
  return {
    week,
    xp,
    exercisesCompleted: correctAttempts.length,
    lessonsCompleted: lessonsThisWeek,
    accuracy,
    perfectAnswers,
    streak: progress.currentStreak || 0
  };
}

export function getWeeklyComparison(progress: Progress): LeagueComparison {
  const thisWeek = getISOWeek(new Date());
  const lastWeekDate = new Date();
  lastWeekDate.setDate(lastWeekDate.getDate() - 7);
  const lastWeek = getISOWeek(lastWeekDate);
  
  const thisWeekStats = calculateWeeklyStats(progress, thisWeek);
  const lastWeekStats = calculateWeeklyStats(progress, lastWeek);
  
  // Check if there was any activity last week
  const hasLastWeekData = lastWeekStats.exercisesCompleted > 0;
  
  if (!hasLastWeekData) {
    return {
      thisWeek: thisWeekStats,
      lastWeek: null,
      change: {
        xp: thisWeekStats.xp,
        exercises: thisWeekStats.exercisesCompleted,
        accuracy: thisWeekStats.accuracy
      },
      rank: 'first-week',
      message: '¡Primera semana! Seguí practicando para comparar la próxima semana.',
      motivationalQuote: '🌟 Cada gran logro comienza con la decisión de intentarlo.'
    };
  }
  
  const change = {
    xp: thisWeekStats.xp - lastWeekStats.xp,
    exercises: thisWeekStats.exercisesCompleted - lastWeekStats.exercisesCompleted,
    accuracy: thisWeekStats.accuracy - lastWeekStats.accuracy
  };
  
  let rank: 'ahead' | 'behind' | 'tied';
  if (change.xp > 0) rank = 'ahead';
  else if (change.xp < 0) rank = 'behind';
  else rank = 'tied';
  
  let message = '';
  let motivationalQuote = '';
  
  if (rank === 'ahead') {
    const percentChange = lastWeekStats.xp > 0 
      ? Math.round((change.xp / lastWeekStats.xp) * 100) 
      : 100;
    message = `¡Vas ganando! +${change.xp} XP (+${percentChange}%) vs. semana pasada`;
    motivationalQuote = change.xp > 50 
      ? '🔥 ¡Imparable! Mantené este ritmo.'
      : '💪 ¡Bien! Seguí mejorando cada día.';
  } else if (rank === 'behind') {
    message = `Vas ${Math.abs(change.xp)} XP detrás de tu semana pasada`;
    motivationalQuote = '📈 Todavía hay tiempo para recuperar. ¡Vos podés!';
  } else {
    message = `Empatado con tu semana pasada (${thisWeekStats.xp} XP)`;
    motivationalQuote = '🎯 ¡Un poco más de esfuerzo para superarte!';
  }
  
  return {
    thisWeek: thisWeekStats,
    lastWeek: lastWeekStats,
    change,
    rank,
    message,
    motivationalQuote
  };
}

export function getWeeklyLeaderboard(progress: Progress): {
  weeks: WeeklyStats[];
  bestWeek: WeeklyStats | null;
  averageXP: number;
} {
  const weeks: WeeklyStats[] = [];
  const currentDate = new Date();
  
  // Get stats for last 8 weeks
  for (let i = 0; i < 8; i++) {
    const weekDate = new Date(currentDate);
    weekDate.setDate(weekDate.getDate() - (i * 7));
    const weekString = getISOWeek(weekDate);
    const stats = calculateWeeklyStats(progress, weekString);
    
    if (stats.exercisesCompleted > 0) {
      weeks.push(stats);
    }
  }
  
  const bestWeek = weeks.length > 0
    ? weeks.reduce((best, week) => week.xp > best.xp ? week : best)
    : null;
  
  const averageXP = weeks.length > 0
    ? Math.round(weeks.reduce((sum, w) => sum + w.xp, 0) / weeks.length)
    : 0;
  
  return {
    weeks,
    bestWeek,
    averageXP
  };
}
