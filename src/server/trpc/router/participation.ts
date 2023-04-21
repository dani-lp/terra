import { playerProcedure, router } from '@/server/trpc/trpc';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const participationRouter = router({
  // queries

  /**
   * Register a player participation in a challenge
   */
  register: playerProcedure
    .input(
      z.object({
        challengeId: z.string(),
        comments: z.string().optional(),
        date: z.date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { challengeId, comments, date } = input;
      const { session } = ctx;

      // 1. Check if the challenge exists and is active
      const challenge = await ctx.prisma.challenge.findFirst({
        where: {
          id: challengeId,
        },
      });

      if (!challenge) {
        throw new Error('Challenge not found');
      }

      if (new Date() > new Date(challenge.endDate)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          cause: `Challenge with id '${challengeId} has already ended'`,
        });
      }

      // 2. Check if the player is already enrolled
      const userDetails = await ctx.prisma.userDetails.findUnique({
        where: {
          userId: session.user.id,
        },
        select: {
          playerData: true,
        },
      });

      if (!userDetails?.playerData) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          cause: 'Player data not found',
        });
      }

      const isPlayerEnrolled =
        (await ctx.prisma.playerData.count({
          where: {
            id: userDetails?.playerData?.id,
            enrolledChallenges: {
              some: {
                id: challengeId,
              },
            },
          },
        })) > 0;

      if (!isPlayerEnrolled) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          cause: 'Player is not enrolled in this challenge',
        });
      }

      // 3. TODO Get resulting points from gamification engine

      // 3.5. TODO Save the file proof in EC2

      // 4. Create participation
      await ctx.prisma.participation.create({
        data: {
          challengeId,
          comments,
          date,
          playerDataId: userDetails?.playerData?.id,
        },
      });

      return true;
    }),
});
