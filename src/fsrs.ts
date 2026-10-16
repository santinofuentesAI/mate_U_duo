// FSRS (Free Spaced Repetition Scheduler) implementation
// Based on SM-2+ algorithm with optimized parameters

import type { Progress } from './types';
import { dayKey } from './progress';

export interface FSRSCard {
  questionId: string;
  lessonTopic: string;
  difficulty: number; // 0-10 (higher = harder for this user)
  stability: number; // Days until retention drops to 90%
  lastReview: string; // ISO date
  nextReview: string; // ISO date
  reviewCount: number;
  lapses: number; // Times forgotten
  state: 'new' | 'learning' | 'review' | 'relearning';
}

export interface FSRSReviewResult {
  rating: 1 | 2 | 3 | 4; // 1=again, 2=hard, 3=good, 4=easy
  correct: boolean;
  hintsUsed: number;
}

// FSRS parameters (optimized for educational content)
const FSRS_PARAMS = {
  requestRetention: 0.9, // Target 90% retention
  maxInterval: 365, // Max 1 year between reviews
  w: [
    0.4, 0.6, 2.4, 5.8, // Initial stability for ratings
    4.93, 0.94, 0.86, 0.01, // Difficulty/stability relationship
    1.49, 0.14, 0.94, 2.18, // Forgetting curve
    0.05, 0.34, 1.26, 0.29, // Retrievability
    2.61 // Stability after success
  ]
};

function calculateStability(
  difficulty: number,
  stability: number,
  rating: 1 | 2 | 3 | 4,
  state: FSRSCard['state']
): number {
  if (state === 'new') {
    // Initial stability based on rating
    return FSRS_PARAMS.w[rating - 1];
  }

  // Stability increase for successful reviews
  if (rating >= 3) {
    const stabilityFactor = Math.exp(FSRS_PARAMS.w[8]) *
      (11 - difficulty) *
      Math.pow(stability, -FSRS_PARAMS.w[9]) *
      (Math.exp((1 - FSRS_PARAMS.requestRetention) * FSRS_PARAMS.w[10]) - 1);
    return stability * (1 + stabilityFactor);
  }

  // Stability decrease for failures/hard
  return FSRS_PARAMS.w[11] * Math.pow(difficulty, -FSRS_PARAMS.w[12]) *
    (Math.pow(stability + 1, FSRS_PARAMS.w[13]) - 1) *
    Math.exp((1 - FSRS_PARAMS.requestRetention) * FSRS_PARAMS.w[14]);
}

function calculateDifficulty(
  currentDifficulty: number,
  rating: 1 | 2 | 3 | 4
): number {
  const difficultyChange = FSRS_PARAMS.w[6] * (rating - 3);
  return Math.max(1, Math.min(10, currentDifficulty + difficultyChange));
}

function calculateInterval(stability: number, requestRetention: number): number {
  // Days until retention drops to requested level
  const interval = stability / requestRetention * Math.log(0.9 / requestRetention);
  return Math.max(1, Math.min(FSRS_PARAMS.maxInterval, Math.round(interval)));
}

export function initializeFSRSCard(questionId: string, lessonTopic: string): FSRSCard {
  return {
    questionId,
    lessonTopic,
    difficulty: 5, // Start at medium difficulty
    stability: 0,
    lastReview: dayKey(new Date()),
    nextReview: dayKey(new Date()),
    reviewCount: 0,
    lapses: 0,
    state: 'new'
  };
}

export function reviewFSRSCard(
  card: FSRSCard,
  result: FSRSReviewResult
): FSRSCard {
  const { rating, correct, hintsUsed } = result;
  
  // Adjust rating based on hints
  let effectiveRating = rating;
  if (hintsUsed > 0 && rating > 1) {
    effectiveRating = Math.max(1, rating - 1) as 1 | 2 | 3 | 4;
  }

  const newDifficulty = calculateDifficulty(card.difficulty, effectiveRating);
  const newStability = calculateStability(
    newDifficulty,
    card.stability,
    effectiveRating,
    card.state
  );

  const interval = calculateInterval(newStability, FSRS_PARAMS.requestRetention);
  const today = new Date();
  const nextReviewDate = new Date(today);
  nextReviewDate.setDate(today.getDate() + interval);

  let newState: FSRSCard['state'] = 'review';
  let newLapses = card.lapses;

  if (!correct || effectiveRating === 1) {
    newState = card.state === 'new' ? 'learning' : 'relearning';
    newLapses += 1;
  } else if (card.state === 'new') {
    newState = 'learning';
  }

  return {
    ...card,
    difficulty: newDifficulty,
    stability: newStability,
    lastReview: dayKey(today),
    nextReview: dayKey(nextReviewDate),
    reviewCount: card.reviewCount + 1,
    lapses: newLapses,
    state: newState
  };
}

export function getDueCards(progress: Progress): FSRSCard[] {
  const today = dayKey(new Date());
  const cards = progress.fsrsCards || {};
  
  return Object.values(cards).filter(card => card.nextReview <= today);
}

export function getCardForQuestion(progress: Progress, questionId: string): FSRSCard | null {
  return progress.fsrsCards?.[questionId] || null;
}

export function updateFSRSCard(progress: Progress, card: FSRSCard): Progress {
  return {
    ...progress,
    fsrsCards: {
      ...(progress.fsrsCards || {}),
      [card.questionId]: card
    }
  };
}
