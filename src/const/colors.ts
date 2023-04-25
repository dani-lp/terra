import type { ChallengeTag } from '@prisma/client';

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
