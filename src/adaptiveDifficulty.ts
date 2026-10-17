// Adaptive difficulty system targeting 70-85% success rate

import type { Progress, Question } from './types';
import { getTopicMastery, type MasteryLevel } from './topicMastery';

export interface AdaptiveSettings {
  targetSuccessRate: number; // 0.7-0.85
  windowSize: number; // Recent attempts to consider
  difficultyStep: number; // How much to adjust difficulty
}

const DEFAULT_SETTINGS: AdaptiveSettings = {
  targetSuccessRate: 0.75,
  windowSize: 10,
  difficultyStep: 0.5
};

export interface DifficultyAdjustment {
  currentDifficulty: number; // 1-3
  suggestedDifficulty: number; // 1-3
  recentSuccessRate: number;
  needsPrerequisiteReview: boolean;
  prerequisiteTopics: string[];
}

export function calculateSuccessRate(progress: Progress, topic: string, windowSize: number = 10): number {
  const recentAttempts = progress.attempts
    .filter(a => a.lessonId.includes(topic.toLowerCase()) || a.questionId.includes(topic.toLowerCase()))
    .slice(-windowSize);

  if (recentAttempts.length === 0) return 0.5; // Default to middle

  const correct = recentAttempts.filter(a => a.correct && !a.assisted).length;
  return correct / recentAttempts.length;
}

export function getAdaptiveDifficulty(
  progress: Progress,
  topic: string,
  currentDifficulty: number,
  settings: AdaptiveSettings = DEFAULT_SETTINGS
): DifficultyAdjustment {
  const successRate = calculateSuccessRate(progress, topic, settings.windowSize);
  const mastery = getTopicMastery(progress, topic);

  let suggestedDifficulty = currentDifficulty;
  let needsPrerequisiteReview = false;
  const prerequisiteTopics: string[] = [];

  // Adjust difficulty based on success rate
  if (successRate < 0.7) {
    // Too hard - lower difficulty
    suggestedDifficulty = Math.max(1, currentDifficulty - settings.difficultyStep);
    
    // Check if prerequisites are weak
    const prereqs = getPrerequisiteTopics(topic);
    for (const prereq of prereqs) {
      const prereqMastery = getTopicMastery(progress, prereq);
      if (prereqMastery.level === 'ninguno' || prereqMastery.level === 'familiar') {
        needsPrerequisiteReview = true;
        prerequisiteTopics.push(prereq);
      }
    }
  } else if (successRate > 0.85) {
    // Too easy - increase difficulty
    suggestedDifficulty = Math.min(3, currentDifficulty + settings.difficultyStep);
  }

  return {
    currentDifficulty,
    suggestedDifficulty: Math.round(suggestedDifficulty * 10) / 10,
    recentSuccessRate: successRate,
    needsPrerequisiteReview,
    prerequisiteTopics
  };
}

export function selectQuestionByDifficulty(
  questions: Question[],
  targetDifficulty: number,
  mastery: MasteryLevel
): Question[] {
  // Filter questions by difficulty range
  const minDiff = Math.max(1, Math.floor(targetDifficulty));
  const maxDiff = Math.min(3, Math.ceil(targetDifficulty));

  let candidates = questions.filter(q => q.difficulty >= minDiff && q.difficulty <= maxDiff);

  // If not enough candidates, expand range
  if (candidates.length < 3) {
    candidates = questions.filter(q => Math.abs(q.difficulty - targetDifficulty) <= 1);
  }

  // If still not enough, take closest
  if (candidates.length === 0) {
    candidates = [...questions].sort((a, b) => 
      Math.abs(a.difficulty - targetDifficulty) - Math.abs(b.difficulty - targetDifficulty)
    );
  }

  // Adjust selection based on mastery level
  if (mastery === 'dominado') {
    // Prefer harder questions for mastery
    return candidates.sort((a, b) => b.difficulty - a.difficulty).slice(0, 5);
  } else if (mastery === 'ninguno') {
    // Prefer easier questions for beginners
    return candidates.sort((a, b) => a.difficulty - b.difficulty).slice(0, 5);
  }

  return candidates.slice(0, 5);
}

function getPrerequisiteTopics(topic: string): string[] {
  // Topic dependency map
  const prerequisites: Record<string, string[]> = {
    // Logic
    'tablas-verdad': ['proposiciones', 'conectores'],
    'equivalencias': ['proposiciones', 'conectores', 'tablas-verdad'],
    'inferencia': ['proposiciones', 'conectores', 'equivalencias'],
    'predicados': ['proposiciones', 'conjuntos'],
    'demostraciones': ['inferencia', 'equivalencias', 'predicados'],

    // Sets
    'operaciones-conjuntos': ['conjuntos', 'diagrama-venn'],
    'leyes-conjuntos': ['operaciones-conjuntos'],
    'producto-cartesiano': ['conjuntos'],
    'relaciones': ['producto-cartesiano', 'conjuntos'],
    'funciones': ['relaciones', 'conjuntos'],

    // Algebra
    'ecuaciones-lineales': ['algebra-basica'],
    'ecuaciones-cuadraticas': ['algebra-basica', 'factorizacion'],
    'polinomios': ['algebra-basica', 'factorizacion'],
    'radicales': ['algebra-basica', 'exponentes'],
    'racionales': ['algebra-basica', 'factorizacion'],
    'sistemas-ecuaciones': ['ecuaciones-lineales'],

    // Functions
    'dominio-rango': ['funciones'],
    'composicion': ['funciones', 'dominio-rango'],
    'inversas': ['funciones', 'composicion'],
    'graficas': ['funciones', 'dominio-rango'],
  };

  return prerequisites[topic] || [];
}

export function shouldReviewPrerequisites(
  progress: Progress,
  topic: string,
  successRate: number
): boolean {
  if (successRate >= 0.7) return false;

  const prereqs = getPrerequisiteTopics(topic);
  if (prereqs.length === 0) return false;

  // Check if any prerequisite is weak
  return prereqs.some(prereq => {
    const mastery = getTopicMastery(progress, prereq);
    return mastery.level === 'ninguno' || mastery.level === 'familiar';
  });
}

export function getPrerequisiteReviewPlan(
  progress: Progress,
  topic: string
): { topic: string; priority: number }[] {
  const prereqs = getPrerequisiteTopics(topic);
  
  return prereqs
    .map(prereq => {
      const mastery = getTopicMastery(progress, prereq);
      let priority = 0;
      
      if (mastery.level === 'ninguno') priority = 3;
      else if (mastery.level === 'familiar') priority = 2;
      else if (mastery.level === 'competente') priority = 1;
      
      return { topic: prereq, priority };
    })
    .filter(p => p.priority > 0)
    .sort((a, b) => b.priority - a.priority);
}
