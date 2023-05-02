import type { ChallengeTag } from '@prisma/client';
import { z } from 'zod';

import type { AchievementTier } from '@/types';
import { publicProcedure, router } from '../trpc';

export const getAchievementTier = (participationsCount: number): AchievementTier => {
  if (participationsCount >= 40) {
    return 'PLATINUM';
  }
  if (participationsCount >= 30) {
    return 'GOLD';
  }
  if (participationsCount >= 20) {
    return 'SILVER';
  }
  return 'BRONZE';
};

export const achievementsRouter = router({
  /**
   *  Get all achievements by a player
   */
  getByPlayer: publicProcedure
    .input(
      z.object({
        playerDataId: z.string().nullable(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { playerDataId } = input;

      if (!playerDataId) {
        return [];
      }

      const participations = await ctx.prisma.participation.findMany({
        where: {
          playerDataId,
        },
        select: {
          challenge: {
            select: {
              challengeCategories: {
                select: {
                  tag: true,
                },
              },
            },
          },
        },
      });

      const tagCounts: Record<ChallengeTag, number> = {
        FITNESS: 0,
        RECYCLING: 0,
        ENVIRONMENT_CLEANING: 0,
        NUTRITION: 0,
        MOBILITY: 0,
        WELLNESS: 0,
        COMMUNITY_INVOLVEMENT: 0,
        OTHER: 0,
      };

      for (const participation of participations) {
        for (const category of participation.challenge.challengeCategories) {
          tagCounts[category.tag]++;
        }
      }

      const result = Object.entries(tagCounts)
        .filter((value) => value[1] >= 10)
        .map(([tag, count]) => ({
          tag: tag as ChallengeTag,
          entries: count,
          tier: getAchievementTier(count),
        }));

      return result;
    }),
});
