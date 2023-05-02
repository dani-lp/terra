import { z } from 'zod';

import type { OrganizationData } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { playerProcedure, protectedProcedure, router } from '../trpc';

export const userRouter = router({
  getSelfPoints: playerProcedure.query(async ({ ctx }) => {
    const { user } = ctx.session;

    const userDetails = await ctx.prisma.userDetails.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (!userDetails) {
      throw new TRPCError({ code: 'NOT_FOUND' });
    }

    const playerData = await ctx.prisma.playerData.findUnique({
      where: {
        userDetailsId: userDetails.id,
      },
    });

    if (!playerData) {
      throw new TRPCError({ code: 'NOT_FOUND' });
    }

    return playerData.experience;
  }),

  /**
   * Get data of a player to be shown in a overview modal, card, or similar
   */
  getPlayerOverviewData: protectedProcedure
    .input(z.object({ playerId: z.string().nullable() }))
    .query(async ({ ctx, input }) => {
      if (!input.playerId) {
        return null;
      }

      const { playerId } = input;

      const playerData = await ctx.prisma.playerData.findUnique({
        where: {
          id: playerId,
        },
      });

      if (!playerData) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          cause: `Player playerData with id ${playerId} not found`,
        });
      }

      const playerUserDetails = await ctx.prisma.userDetails.findUnique({
        where: {
          userId: playerData.userDetailsId,
        },
      });

      if (!playerUserDetails) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          cause: `Player userDetails with id ${playerData.userDetailsId} not found`,
        });
      }

      const user = await ctx.prisma.user.findUnique({
        where: {
          id: playerUserDetails.userId,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          cause: `Player user with id ${playerUserDetails.userId} not found`,
        });
      }

      const challengeEnrollmentCount = await ctx.prisma.challenge.count({
        where: {
          enrolledPlayers: {
            some: {
              id: playerId,
            },
          },
        },
      });

      return {
        playerId: playerData.id,
        userDetailsId: playerData.userDetailsId,
        name: user.name,
        username: playerUserDetails.username,
        image: user.image,
        about: playerUserDetails.about ?? '',
        experiencePoints: playerData.experience,
        challengeEnrollmentCount,
      };
    }),

  /**
   * Get a player's playerData ID from their base user ID
   */
  getPlayerDataId: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { userId } = input;

      if (!userId) {
        return null;
      }

      if (ctx.session.user.role !== 'PLAYER') {
        return null;
      }

      const playerData = await ctx.prisma.playerData.findUnique({
        where: {
          userDetailsId: userId,
        },
      });

      if (!playerData) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          cause: `Player playerData with userDetailsId ${userId} not found`,
        });
      }

      return playerData.id;
    }),

  /**
   * Get a list of all orgs, ordered by name, divided by initial.
   */
  getAllOrgsData: protectedProcedure.query(async ({ ctx }) => {
    const orgs = await ctx.prisma.organizationData.findMany({
      orderBy: { name: 'asc' },
      where: {
        userDetails: {
          role: {
            equals: 'ORGANIZATION',
          },
        },
      },
      include: {
        userDetails: {
          select: {
            user: {
              select: {
                image: true,
              },
            },
          },
        },
      },
    });

    const orgsData: Record<string, (OrganizationData & { image: string })[]> = {};

    orgs.forEach((org) => {
      const initial = org.name[0]?.toUpperCase();
      if (!initial) {
        return;
      }
      if (!orgsData[initial]) {
        orgsData[initial] = [];
      }
      const { userDetails, ...rest } = org;
      orgsData[initial]?.push({ ...rest, image: userDetails.user.image ?? '' });
    });

    return orgsData;
  }),

  /**
   * Get the details of an organization, to show in their details page
   */
  getOrgDetails: protectedProcedure
    .input(z.object({ orgDetailsId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { orgDetailsId } = input;

      const orgDetails = await ctx.prisma.organizationData.findUnique({
        where: {
          id: orgDetailsId,
        },
      });

      if (!orgDetails) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      const orgUserDetails = await ctx.prisma.userDetails.findUnique({
        where: {
          userId: orgDetails.userDetailsId,
        },
      });

      if (!orgUserDetails) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      const orgChallengeCount = await ctx.prisma.challenge.count({
        where: {
          organizationDataId: orgDetailsId,
        },
      });

      // TODO fallback image URL
      return { orgDetails, about: orgUserDetails.about ?? '', challengeCount: orgChallengeCount };
    }),
});
