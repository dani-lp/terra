import {
  organizationProcedure,
  playerProcedure,
  protectedProcedure,
  router,
} from '@/server/trpc/trpc';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const challengesRouter = router({
  // queries

  /**
   * Get a challenge by id.
   */
  get: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    const { id } = input;

    if (!id) {
      return null;
    }

    const challenge = await ctx.prisma.challenge.findUnique({
      where: {
        id,
      },
    });

    if (!challenge) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        cause: `Challenge with id '${id} not found'`,
      });
    }

    const userIsAuthor =
      (await ctx.prisma.userDetails.count({
        where: {
          userId: ctx.session.user.id,
          organizationData: {
            createdChallenges: {
              some: {
                id,
              },
            },
          },
        },
      })) > 0;

    const enrolledPlayerCount = await ctx.prisma.playerData.count({
      where: {
        enrolledChallenges: {
          some: {
            id,
          },
        },
      },
    });

    const userDetails = await ctx.prisma.userDetails.findUnique({
      where: {
        userId: ctx.session.user.id,
      },
      select: {
        playerData: true,
      },
    });

    const isPlayerEnrolled =
      (await ctx.prisma.playerData.count({
        where: {
          id: userDetails?.playerData?.id,
          enrolledChallenges: {
            some: {
              id,
            },
          },
        },
      })) > 0;

    return { challenge, enrolledPlayerCount, userIsAuthor, isPlayerEnrolled };
  }),

  /**
   * Edit a challenge, only available for organization users.
   */
  edit: organizationProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string(),
        startDate: z.string(),
        endDate: z.string(),
        location: z.string().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, name, description, startDate, endDate, location } = input;

      const challenge = await ctx.prisma.challenge.findUnique({
        where: {
          id,
        },
      });

      if (!challenge) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          cause: `Challenge with id '${id} not found'`,
        });
      }

      const organization = await ctx.prisma.userDetails.findUnique({
        where: {
          userId: ctx.session.user.id,
        },
        select: {
          organizationData: true,
        },
      });

      if (!organization) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          cause: `Organization with user id '${ctx.session.user.id} not found'`,
        });
      }

      if (challenge.organizationDataId !== organization.organizationData?.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          cause: `User with id '${ctx.session.user.id} is not allowed to edit challenge with id '${id}'`,
        });
      }

      const updatedChallenge = await ctx.prisma.challenge.update({
        where: {
          id,
        },
        data: {
          name,
          description,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          location,
        },
      });

      return updatedChallenge;
    }),

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

    const challengesWithPlayerCount = await Promise.all(
      challenges.map(async (challenge) => {
        const enrolledPlayers = await ctx.prisma.playerData.findMany({
          where: {
            enrolledChallenges: {
              some: {
                id: challenge.id,
              },
            },
          },
        });

        return {
          ...challenge,
          enrolledPlayersCount: enrolledPlayers.length,
        };
      }),
    );

    return challengesWithPlayerCount;
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

    const enrolledChallengesWithPlayerCount = await Promise.all(
      enrolledChallenges.map(async (challenge) => {
        const enrolledPlayers = await ctx.prisma.playerData.findMany({
          where: {
            enrolledChallenges: {
              some: {
                id: challenge.id,
              },
            },
          },
        });

        return {
          ...challenge,
          enrolledPlayersCount: enrolledPlayers.length,
        };
      }),
    );

    return enrolledChallengesWithPlayerCount;
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

    const availableChallengesWithPlayerCount = await Promise.all(
      availableChallenges.map(async (challenge) => {
        const enrolledPlayers = await ctx.prisma.playerData.findMany({
          where: {
            enrolledChallenges: {
              some: {
                id: challenge.id,
              },
            },
          },
        });

        return {
          ...challenge,
          enrolledPlayersCount: enrolledPlayers.length,
        };
      }),
    );

    return availableChallengesWithPlayerCount;
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
