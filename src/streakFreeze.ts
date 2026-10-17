// Streak freeze and weekend protection system

import type { Progress } from './types';
import { dayKey } from './progress';

export interface StreakData {
  current: number;
  longest: number;
  lastDate: string;
  freezesAvailable: number;
  freezeUsedDates: string[];
  weekendProtection: boolean;
}

export const FREEZE_COST_XP = 100;
export const FREEZE_COST_COINS = 50;

export function buyStreakFreeze(progress: Progress, useCoins: boolean = false): Progress {
  const cost = useCoins ? FREEZE_COST_COINS : FREEZE_COST_XP;
  const currency = useCoins ? 'coins' : 'xp';
  
  const currentValue = useCoins ? (progress.coins || 0) : progress.xp;
  
  if (currentValue < cost) {
    return progress; // Not enough currency
  }
  
  return {
    ...progress,
    xp: useCoins ? progress.xp : progress.xp - cost,
    coins: useCoins ? (progress.coins || 0) - cost : progress.coins,
    streakFreezes: (progress.streakFreezes || 0) + 1
  };
}

export function toggleWeekendProtection(progress: Progress): Progress {
  return {
    ...progress,
    weekendProtection: !progress.weekendProtection
  };
}

export function checkAndUpdateStreak(progress: Progress): {
  progress: Progress;
  streakStatus: 'maintained' | 'increased' | 'frozen' | 'lost' | 'protected';
  message: string;
} {
  const today = dayKey();
  const yesterday = dayKey(new Date(Date.now() - 86400000));
  const lastStreakDate = progress.lastStreakDate || '';
  
  // Check if already updated today
  if (lastStreakDate === today) {
    return {
      progress,
      streakStatus: 'maintained',
      message: 'Racha ya actualizada hoy'
    };
  }
  
  // Check if completed at least 1 lesson today
  const completedToday = progress.attempts.some(a => 
    a.date.startsWith(today) && a.correct
  );
  
  if (!completedToday) {
    // Didn't complete anything today - might lose streak
    const isWeekend = [0, 6].includes(new Date().getDay());
    
    // Weekend protection
    if (isWeekend && progress.weekendProtection) {
      return {
        progress: {
          ...progress,
          lastStreakDate: today
        },
        streakStatus: 'protected',
        message: '🛡️ Protección de fin de semana activa'
      };
    }
    
    // Try to use freeze
    if ((progress.streakFreezes || 0) > 0) {
      return {
        progress: {
          ...progress,
          streakFreezes: progress.streakFreezes! - 1,
          lastStreakDate: today,
          freezeUsedDates: [...(progress.freezeUsedDates || []), today]
        },
        streakStatus: 'frozen',
        message: '🛡️ Congelador usado automáticamente'
      };
    }
    
    // Lose streak
    const longestStreak = Math.max(progress.longestStreak || 0, progress.currentStreak || 0);
    return {
      progress: {
        ...progress,
        currentStreak: 0,
        longestStreak,
        lastStreakDate: today
      },
      streakStatus: 'lost',
      message: 'Racha perdida. ¡Empezá una nueva hoy!'
    };
  }
  
  // Completed at least 1 lesson today
  const streakContinues = lastStreakDate === yesterday;
  const newStreak = streakContinues ? (progress.currentStreak || 0) + 1 : 1;
  const longestStreak = Math.max(progress.longestStreak || 0, newStreak);
  
  return {
    progress: {
      ...progress,
      currentStreak: newStreak,
      longestStreak,
      lastStreakDate: today
    },
    streakStatus: streakContinues ? 'increased' : 'maintained',
    message: streakContinues 
      ? `🔥 Racha de ${newStreak} días!` 
      : '🔥 Racha iniciada!'
  };
}

export function getStreakInfo(progress: Progress): {
  current: number;
  longest: number;
  freezes: number;
  weekendProtection: boolean;
  daysUntilLoss: number;
} {
  const today = dayKey();
  const lastDate = progress.lastStreakDate || '';
  const yesterday = dayKey(new Date(Date.now() - 86400000));
  
  // Check if need to complete today
  const completedToday = progress.attempts.some(a => 
    a.date.startsWith(today) && a.correct
  );
  
  let daysUntilLoss = 0;
  if (lastDate === today || (lastDate === yesterday && !completedToday)) {
    const isWeekend = [0, 6].includes(new Date().getDay());
    if (progress.weekendProtection && isWeekend) {
      daysUntilLoss = 2; // Protected until Monday
    } else if ((progress.streakFreezes || 0) > 0) {
      daysUntilLoss = 1; // Can use freeze
    } else if (!completedToday) {
      daysUntilLoss = 0; // Will lose today if don't complete
    } else {
      daysUntilLoss = 1; // Safe for today
    }
  }
  
  return {
    current: progress.currentStreak || 0,
    longest: progress.longestStreak || 0,
    freezes: progress.streakFreezes || 0,
    weekendProtection: progress.weekendProtection || false,
    daysUntilLoss
  };
}
