import {
  organizationProcedure,
  playerProcedure,
  protectedProcedure,
  router,
} from '@/server/trpc/trpc';
import { ChallengeDifficulty, ChallengeTag } from '@prisma/client';
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

    const organization = await ctx.prisma.organizationData.findUnique({
      where: {
        id: challenge.organizationDataId,
      },
      select: {
        name: true,
      },
    });

    const challengeTagsQuery = await ctx.prisma.challengeCategory.findMany({
      where: {
        challengeId: challenge.id,
      },
      select: {
        tag: true,
      },
    });

    const challengeTags = challengeTagsQuery.map((challengeTag) => challengeTag.tag);

    return {
      challenge,
      challengeTags,
      enrolledPlayerCount,
      userIsAuthor,
      isPlayerEnrolled,
      organizationName: organization?.name,
    };
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

    const rawChallenges = await ctx.prisma.challenge.findMany({
      where: {
        organizationDataId: organization?.organizationData?.id,
      },
      select: {
        id: true,
        name: true,
        description: true,
        image: true,
        startDate: true,
        endDate: true,
        location: true,
        isDraft: true,
        organizationDataId: true,
        difficulty: true,
        challengeCategories: {
          select: {
            tag: true,
          },
        },
        _count: {
          select: {
            enrolledPlayers: true,
          },
        },
      },
    });

    const challenges = rawChallenges.map((challenge) => {
      const { challengeCategories, ...challengeWithoutCategories } = challenge;

      return {
        ...challengeWithoutCategories,
        tags: challengeCategories.map((category) => category.tag),
      };
    });

    const challengesWithPlayerCount = challenges.map((challenge) => {
      const { _count, ...challengeWithoutCount } = challenge;
      return {
        ...challengeWithoutCount,
        enrolledPlayersCount: _count.enrolledPlayers,
      };
    });

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

    const rawChallenges = await ctx.prisma.challenge.findMany({
      where: {
        enrolledPlayers: {
          some: {
            id: player?.playerData?.id,
          },
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        image: true,
        startDate: true,
        endDate: true,
        location: true,
        isDraft: true,
        organizationDataId: true,
        difficulty: true,
        challengeCategories: {
          select: {
            tag: true,
          },
        },
        _count: {
          select: {
            enrolledPlayers: true,
          },
        },
      },
    });

    const challenges = rawChallenges.map((challenge) => {
      const { challengeCategories, ...challengeWithoutCategories } = challenge;

      return {
        ...challengeWithoutCategories,
        tags: challengeCategories.map((category) => category.tag),
      };
    });

    const enrolledChallengesWithPlayerCount = challenges.map((challenge) => {
      const { _count, ...challengeWithoutCount } = challenge;
      return {
        ...challengeWithoutCount,
        enrolledPlayersCount: _count.enrolledPlayers,
      };
    });

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

    const rawChallenges = await ctx.prisma.challenge.findMany({
      where: {
        enrolledPlayers: {
          every: {
            id: {
              not: player?.playerData?.id,
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        image: true,
        startDate: true,
        endDate: true,
        location: true,
        isDraft: true,
        organizationDataId: true,
        difficulty: true,
        challengeCategories: {
          select: {
            tag: true,
          },
        },
        _count: {
          select: {
            enrolledPlayers: true,
          },
        },
      },
    });

    const challenges = rawChallenges.map((challenge) => {
      const { challengeCategories, ...challengeWithoutCategories } = challenge;

      return {
        ...challengeWithoutCategories,
        tags: challengeCategories.map((category) => category.tag),
      };
    });

    const availableChallengesWithPlayerCount = challenges.map((challenge) => {
      const { _count, ...challengeWithoutCount } = challenge;
      return {
        ...challengeWithoutCount,
        enrolledPlayersCount: _count.enrolledPlayers,
      };
    });

    return availableChallengesWithPlayerCount;
  }),

  // mutations

  /**
   * Create a new challenge, only available for organization users.
   */
  create: organizationProcedure
    .input(
      z.object({
        name: z.string().min(5),
        description: z.string(),
        startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        location: z.string(),
        privacy: z.enum(['public', 'private']),
        tags: z
          .array(
            z.enum([
              ChallengeTag.FITNESS,
              ChallengeTag.RECYCLING,
              ChallengeTag.ENVIRONMENT_CLEANING,
              ChallengeTag.NUTRITION,
              ChallengeTag.MOBILITY,
              ChallengeTag.WELLNESS,
              ChallengeTag.COMMUNITY_INVOLVEMENT,
              ChallengeTag.OTHER,
            ]),
          )
          .min(1),
        difficulty: z.enum([
          ChallengeDifficulty.EASY,
          ChallengeDifficulty.MEDIUM,
          ChallengeDifficulty.HARD,
        ]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { name, description, startDate, endDate, location, privacy, tags, difficulty } = input;

      if (new Date(startDate) > new Date(endDate)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Start date must be before end date',
        });
      }
      if (new Date(endDate) < new Date()) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'End date must be in the future',
        });
      }

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
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          difficulty,
          location,
          isDraft: privacy === 'private',
          challengeCategories: {
            create: tags.map((tag) => ({
              tag,
            })),
          },

          organizationDataId: organizationData.id,
        },
      });

      return challenge;
    }),

  /**
   * Edit a challenge, only available for organization users.
   */
  edit: organizationProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(5),
        description: z.string(),
        startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        location: z.string(),
        tags: z
          .array(
            z.enum([
              ChallengeTag.FITNESS,
              ChallengeTag.RECYCLING,
              ChallengeTag.ENVIRONMENT_CLEANING,
              ChallengeTag.NUTRITION,
              ChallengeTag.MOBILITY,
              ChallengeTag.WELLNESS,
              ChallengeTag.COMMUNITY_INVOLVEMENT,
              ChallengeTag.OTHER,
            ]),
          )
          .min(1),
        difficulty: z.enum([
          ChallengeDifficulty.EASY,
          ChallengeDifficulty.MEDIUM,
          ChallengeDifficulty.HARD,
        ]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, name, description, startDate, endDate, location, tags, difficulty } = input;

      if (new Date(startDate) > new Date(endDate)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Start date must be before end date',
        });
      }
      if (new Date(endDate) < new Date()) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'End date must be in the future',
        });
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
          difficulty,
          challengeCategories: {
            deleteMany: {},
            create: tags.map((tag) => ({
              tag,
            })),
          },
          location,
        },
      });

      return updatedChallenge;
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

      if (new Date() > new Date(challenge.endDate)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          cause: `Challenge with id '${challengeId} has already ended'`,
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

  createdByOrganization: protectedProcedure
    .input(
      z.object({
        orgDetailsId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { orgDetailsId } = input;

      const rawChallenges = await ctx.prisma.challenge.findMany({
        where: {
          organizationDataId: orgDetailsId,
        },
        select: {
          id: true,
          name: true,
          description: true,
          image: true,
          startDate: true,
          endDate: true,
          location: true,
          organizationDataId: true,
          difficulty: true,
          challengeCategories: {
            select: {
              tag: true,
            },
          },
          isDraft: true,
          _count: {
            select: {
              enrolledPlayers: true,
            },
          },
        },
      });

      const challenges = rawChallenges.map((challenge) => {
        const { challengeCategories, ...challengeWithoutCategories } = challenge;

        return {
          ...challengeWithoutCategories,
          tags: challengeCategories.map((category) => category.tag),
        };
      });

      const challengesWithEnrolledPlayers = challenges.map((challenge) => {
        const { _count, ...rest } = challenge;
        return {
          ...rest,
          enrolledPlayersCount: _count.enrolledPlayers,
        };
      });

      return challengesWithEnrolledPlayers;
    }),
});
