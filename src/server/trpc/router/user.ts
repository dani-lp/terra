import { z } from 'zod';

import type { OrganizationData } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { protectedProcedure, router } from '../trpc';

export const userRouter = router({
  /**
   * Get the user's own data
   */
  getSelfData: protectedProcedure.query(async ({ ctx }) => {
    const { user } = ctx.session;
    const userDetails = await ctx.prisma.userDetails.findUnique({
      where: {
        userId: user.id,
      },
    });
    if (!userDetails) {
      throw new TRPCError({ code: 'NOT_FOUND' });
    }
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      username: userDetails.username,
      image: user.image,
      role: userDetails.role,
      about: userDetails.about,
    };
  }),

  /**
   * Get data of an organization to be shown in a overview modal, card, or similar
   */
  getOrganizationOverviewData: protectedProcedure
    .input(z.object({ organizationId: z.string() }))
    .query(async ({ input }) => {
      const { organizationId } = input;

      // TODO

      return organizationId;
    }),

  /**
   * Get data of a player to be shown in a overview modal, card, or similar
   */
  getPlayerOverviewData: protectedProcedure
    .input(z.object({ playerId: z.string() }))
    .query(async ({ input }) => {
      const { playerId } = input;

      // TODO

      return playerId;
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
