import type { Challenge, ChallengeTag } from '@prisma/client';

export type DisplayChallenge = Omit<Challenge, 'createdAt'> & {
  tags: ChallengeTag[];
  enrolledPlayersCount: number;
};
