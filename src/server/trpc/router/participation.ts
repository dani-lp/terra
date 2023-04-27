import { z } from 'zod';

import { playerProcedure, protectedProcedure, router } from '@/server/trpc/trpc';
import { TRPCError } from '@trpc/server';

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

      // 3. Get resulting points from gamification engine
      let points: number;
      switch (challenge.difficulty) {
        case 'EASY':
          points = 5;
          break;
        case 'MEDIUM':
          points = 10;
          break;
        case 'HARD':
          points = 15;
          break;
        default:
          points = 0;
          break;
      }

      await ctx.prisma.playerData.update({
        where: {
          id: userDetails?.playerData?.id,
        },
        data: {
          experience: {
            increment: points,
          },
        },
      });

      // TODO 4. Check for possible achievements

      // TODO 4.5. Save the file proof in EC2

      // 5. Create participation
      const participation = await ctx.prisma.participation.create({
        data: {
          challengeId,
          comments,
          date,
          playerDataId: userDetails?.playerData?.id,
        },
      });

      return participation;
    }),

  /**
   * Get the participations on a challenge. Used for rankings
   */
  getByChallenge: protectedProcedure
    .input(
      z.object({
        challengeId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { challengeId } = input;

      const rawParticipations = await ctx.prisma.participation.groupBy({
        by: ['playerDataId'],
        where: {
          challengeId,
          isValid: true,
        },
        _count: {
          playerDataId: true,
        },
        orderBy: {
          _count: {
            playerDataId: 'desc',
          },
        },
      });

      const participationsWithUserData = await Promise.all(
        rawParticipations.map(async (p) => {
          const playerData = await ctx.prisma.playerData.findUnique({
            where: {
              id: p.playerDataId,
            },
            select: {
              id: true,
              userDetails: {
                select: {
                  user: {
                    select: {
                      name: true,
                      image: true,
                    },
                  },
                  username: true,
                },
              },
            },
          });

          return {
            playerId: p.playerDataId,
            points: p._count.playerDataId,
            name: playerData?.userDetails.user.name,
            username: playerData?.userDetails.username,
            image: playerData?.userDetails.user.image,
          };
        }),
      );

      return participationsWithUserData;
    }),
});
