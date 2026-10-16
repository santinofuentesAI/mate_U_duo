// Per-topic mastery level system

import type { Progress } from './types';

export type MasteryLevel = 'ninguno' | 'familiar' | 'competente' | 'dominado';

export interface TopicMastery {
  topic: string;
  level: MasteryLevel;
  correctAnswers: number;
  totalAttempts: number;
  lastPracticed: string; // ISO date
  consecutiveCorrect: number;
  independentCorrect: number; // Correct without hints/assistance
}

// Thresholds for mastery progression
const MASTERY_THRESHOLDS = {
  familiar: {
    minAttempts: 3,
    minAccuracy: 0.6,
    minIndependent: 1
  },
  competente: {
    minAttempts: 8,
    minAccuracy: 0.75,
    minConsecutive: 3,
    minIndependent: 5
  },
  dominado: {
    minAttempts: 15,
    minAccuracy: 0.85,
    minConsecutive: 5,
    minIndependent: 10
  }
};

export function calculateMasteryLevel(mastery: TopicMastery): MasteryLevel {
  if (mastery.totalAttempts === 0) return 'ninguno';

  const accuracy = mastery.correctAnswers / mastery.totalAttempts;

  // Check for Dominado
  if (
    mastery.totalAttempts >= MASTERY_THRESHOLDS.dominado.minAttempts &&
    accuracy >= MASTERY_THRESHOLDS.dominado.minAccuracy &&
    mastery.consecutiveCorrect >= MASTERY_THRESHOLDS.dominado.minConsecutive &&
    mastery.independentCorrect >= MASTERY_THRESHOLDS.dominado.minIndependent
  ) {
    return 'dominado';
  }

  // Check for Competente
  if (
    mastery.totalAttempts >= MASTERY_THRESHOLDS.competente.minAttempts &&
    accuracy >= MASTERY_THRESHOLDS.competente.minAccuracy &&
    mastery.consecutiveCorrect >= MASTERY_THRESHOLDS.competente.minConsecutive &&
    mastery.independentCorrect >= MASTERY_THRESHOLDS.competente.minIndependent
  ) {
    return 'competente';
  }

  // Check for Familiar
  if (
    mastery.totalAttempts >= MASTERY_THRESHOLDS.familiar.minAttempts &&
    accuracy >= MASTERY_THRESHOLDS.familiar.minAccuracy &&
    mastery.independentCorrect >= MASTERY_THRESHOLDS.familiar.minIndependent
  ) {
    return 'familiar';
  }

  return 'ninguno';
}

export function updateTopicMastery(
  progress: Progress,
  topic: string,
  correct: boolean,
  assisted: boolean
): Progress {
  const masteries = progress.topicMasteries || {};
  const current = masteries[topic] || {
    topic,
    level: 'ninguno',
    correctAnswers: 0,
    totalAttempts: 0,
    lastPracticed: new Date().toISOString().split('T')[0],
    consecutiveCorrect: 0,
    independentCorrect: 0
  };

  const updated: TopicMastery = {
    ...current,
    totalAttempts: current.totalAttempts + 1,
    correctAnswers: correct ? current.correctAnswers + 1 : current.correctAnswers,
    lastPracticed: new Date().toISOString().split('T')[0],
    consecutiveCorrect: correct ? current.consecutiveCorrect + 1 : 0,
    independentCorrect: correct && !assisted 
      ? current.independentCorrect + 1 
      : current.independentCorrect
  };

  updated.level = calculateMasteryLevel(updated);

  return {
    ...progress,
    topicMasteries: {
      ...masteries,
      [topic]: updated
    }
  };
}

export function getTopicMastery(progress: Progress, topic: string): TopicMastery {
  return progress.topicMasteries?.[topic] || {
    topic,
    level: 'ninguno',
    correctAnswers: 0,
    totalAttempts: 0,
    lastPracticed: '',
    consecutiveCorrect: 0,
    independentCorrect: 0
  };
}

export function getAllTopicMasteries(progress: Progress): TopicMastery[] {
  return Object.values(progress.topicMasteries || {});
}

export function getMasteryBadge(level: MasteryLevel): string {
  const badges = {
    ninguno: '⚪',
    familiar: '🟡',
    competente: '🟠',
    dominado: '🟢'
  };
  return badges[level];
}

export function getMasteryDetails(level: MasteryLevel): { emoji: string; color: string; label: string } {
  const details = {
    ninguno: { emoji: '⚪', color: '#cbd5e1', label: 'Sin practica' },
    familiar: { emoji: '🟡', color: '#fbbf24', label: 'Familiar' },
    competente: { emoji: '🟠', color: '#f97316', label: 'Competente' },
    dominado: { emoji: '🟢', color: '#22c55e', label: 'Dominado' }
  };
  return details[level];
}

export function getUnitMasteryProgress(progress: Progress, unitTopics: string[]): {
  level: MasteryLevel;
  progress: number; // 0-100
  topicsAtLevel: Record<MasteryLevel, number>;
} {
  const masteries = unitTopics.map(topic => getTopicMastery(progress, topic));
  
  const topicsAtLevel: Record<MasteryLevel, number> = {
    ninguno: 0,
    familiar: 0,
    competente: 0,
    dominado: 0
  };

  for (const m of masteries) {
    topicsAtLevel[m.level]++;
  }

  // Overall unit level is minimum of all topics
  let unitLevel: MasteryLevel = 'dominado';
  if (topicsAtLevel.ninguno > 0) unitLevel = 'ninguno';
  else if (topicsAtLevel.familiar > 0) unitLevel = 'familiar';
  else if (topicsAtLevel.competente > 0) unitLevel = 'competente';

  const totalProgress = (
    topicsAtLevel.familiar * 33 +
    topicsAtLevel.competente * 66 +
    topicsAtLevel.dominado * 100
  ) / unitTopics.length;

  return {
    level: unitLevel,
    progress: Math.round(totalProgress),
    topicsAtLevel
  };
}
