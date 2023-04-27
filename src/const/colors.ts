import type { AchievementTier, ChallengeDifficulty, ChallengeTag } from '@prisma/client';

export const tagColors: Record<ChallengeTag, string> = {
  FITNESS: 'bg-indigo-100 text-indigo-700',
  RECYCLING: 'bg-green-100 text-green-700',
  ENVIRONMENT_CLEANING: 'bg-purple-100 text-purple-700',
  NUTRITION: 'bg-pink-100 text-pink-700',
  MOBILITY: 'bg-yellow-100 text-yellow-700',
  WELLNESS: 'bg-blue-100 text-blue-700',
  COMMUNITY_INVOLVEMENT: 'bg-red-100 text-red-700',
  OTHER: 'bg-gray-100 text-gray-600',
};

export const tagDotColors: Record<ChallengeTag, string> = {
  FITNESS: 'bg-indigo-300',
  RECYCLING: 'bg-green-300',
  ENVIRONMENT_CLEANING: 'bg-purple-300',
  NUTRITION: 'bg-pink-300',
  MOBILITY: 'bg-yellow-300',
  WELLNESS: 'bg-blue-300',
  COMMUNITY_INVOLVEMENT: 'bg-red-300',
  OTHER: 'bg-gray-300',
};

export const difficultyColors: Record<ChallengeDifficulty, string> = {
  EASY: 'bg-green-200 text-green-800',
  MEDIUM: 'bg-yellow-200 text-yellow-800',
  HARD: 'bg-red-200 text-red-800',
};

export const difficultyIconColors: Record<ChallengeDifficulty, string> = {
  EASY: 'text-green-500',
  MEDIUM: 'text-yellow-500',
  HARD: 'text-red-500',
};

export const achievementTierColors: Record<AchievementTier, string> = {
  BRONZE: 'bg-yellow-700 text-white',
  SILVER: 'bg-slate-400 text-white',
  GOLD: 'bg-yellow-400 text-white',
};
