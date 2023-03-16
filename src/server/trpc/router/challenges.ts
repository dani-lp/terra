import { organizationProcedure, playerProcedure, router } from '@/server/trpc/trpc';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const challengesRouter = router({
  // queries

  /**
   * Get a organization's (own) challenges, only available for logged in users.
   */
  created: organizationProcedure.query(async ({ ctx }) => {
    const organization = await ctx.prisma.userDetails.findUnique({
      where: {
        userId: ctx.session.user.id,
      },
      select: {
        organizationData: true,
      },
    });

    const challenges = await ctx.prisma.challenge.findMany({
      where: {
        organizationDataId: organization?.organizationData?.id,
      },
    });

    return challenges;
  }),

  /**
   * Get challenges that a player is enrolled in, only available for player users.
   */
  enrolled: playerProcedure.query(async ({ ctx }) => {
    const player = await ctx.prisma.userDetails.findUnique({
      where: {
        userId: ctx.session.user.id,
      },
      select: {
        playerData: true,
      },
    });

    const enrolledChallenges = await ctx.prisma.challenge.findMany({
      where: {
        enrolledPlayers: {
          some: {
            id: player?.playerData?.id,
          },
        },
      },
    });

    return enrolledChallenges;
  }),

  /**
   * Get challenges that a player is not enrolled in yet, only available for player users.
   */
  available: playerProcedure.query(async ({ ctx }) => {
    const player = await ctx.prisma.userDetails.findUnique({
      where: {
        userId: ctx.session.user.id,
      },
      select: {
        playerData: true,
      },
    });

    const availableChallenges = await ctx.prisma.challenge.findMany({
      where: {
        enrolledPlayers: {
          every: {
            id: {
              not: player?.playerData?.id,
            },
          },
        },
      },
    });

    return availableChallenges;
  }),

  // mutations

  /**
   * Create a new challenge, only available for organization users.
   */
  create: organizationProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { name, description } = input;

      const organizationUserDetails = await ctx.prisma.userDetails.findUnique({
        where: {
          userId: ctx.session.user.id,
        },
        select: {
          id: true,
        },
      });

      const organizationData = await ctx.prisma.organizationData.upsert({
        where: {
          userDetailsId: organizationUserDetails?.id,
        },
        update: {},
        create: {
          name: '',
          image: '',
          website: '',
          country: '',
          userDetails: {
            connect: {
              id: organizationUserDetails?.id,
            },
          },
        },
      });

      const challenge = await ctx.prisma.challenge.create({
        data: {
          name,
          description,
          startDate: new Date(),
          endDate: new Date(),
          organizationDataId: organizationData.id,
        },
      });

      return challenge;
    }),

  /**
   * Enroll a player in a challenge, only available for player users.
   */
  enroll: playerProcedure
    .input(
      z.object({
        challengeId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { challengeId } = input;
      const playerId = ctx.session.user.id;

      const challenge = await ctx.prisma.challenge.findUnique({
        where: {
          id: challengeId,
        },
        include: {
          enrolledPlayers: true,
        },
      });

      if (!challenge) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          cause: `Challenge with id '${challengeId} not found'`,
        });
      }

      const isPlayerEnrolled = challenge?.enrolledPlayers.some((player) => player.id === playerId);

      if (isPlayerEnrolled) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          cause: `Player with id '${playerId} is already enrolled in challenge with id '${challengeId}'`,
        });
      }

      const userDetails = await ctx.prisma.userDetails.findUnique({
        where: {
          userId: ctx.session.user.id,
        },
        select: {
          id: true,
        },
      });

      if (!userDetails) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          cause: `User details with id '${playerId} not found'`,
        });
      }

      const playerData = await ctx.prisma.playerData.findUnique({
        where: {
          userDetailsId: userDetails.id,
        },
        select: {
          id: true,
        },
      });

      if (!playerData) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          cause: `Player with id '${playerId} not found'`,
        });
      }

      const updatedChallenge = await ctx.prisma.challenge.update({
        where: {
          id: challengeId,
        },
        data: {
          enrolledPlayers: {
            connect: {
              id: playerData.id,
            },
          },
        },
      });

      return updatedChallenge;
    }),
});
