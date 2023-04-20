import type { UserData } from '@/types';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
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
    } as UserData;
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
    });

    const orgsData: Record<string, typeof orgs> = {};

    orgs.forEach((org) => {
      const initial = org.name[0]?.toUpperCase();
      if (!initial) {
        return;
      }
      if (!orgsData[initial]) {
        orgsData[initial] = [];
      }
      orgsData[initial]?.push(org);
    });

    return orgsData;
  }),
});
