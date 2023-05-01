import { TRPCError } from '@trpc/server';
import { playerProcedure, router } from '../trpc';

export const homeRouter = router({
  /**
   * Get a player's self stats for the home page:
   * - Number of participations in the last month
   * - Number of active enrolled challenges
   */
  getSelfStats: playerProcedure.query(async ({ ctx }) => {
    const userDetails = await ctx.prisma.userDetails.findUnique({
      where: {
        userId: ctx.session.user.id,
      },
      select: {
        playerData: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!userDetails) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User details not found',
      });
    }

    const participationsThisMonth = await ctx.prisma.participation.count({
      where: {
        playerDataId: userDetails.playerData?.id,
        date: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    });

    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    d.setHours(0, 0, 0, 0);

    const enrolledChallengesCount = await ctx.prisma.challenge.count({
      where: {
        enrolledPlayers: {
          some: {
            id: userDetails.playerData?.id,
          },
        },
        endDate: {
          gte: d,
        },
      },
    });

    return {
      participationsThisMonth,
      enrolledChallengesCount,
    };
  }),

  getLatestActivityPlayer: playerProcedure.query(async ({ ctx }) => {
    const userDetails = await ctx.prisma.userDetails.findUnique({
      where: {
        userId: ctx.session.user.id,
      },
      select: {
        playerData: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!userDetails) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User details not found',
      });
    }

    const latestParticipations = await ctx.prisma.participation.findMany({
      where: {
        playerDataId: userDetails.playerData?.id,
      },
      orderBy: {
        date: 'desc',
      },
      include: {
        challenge: {
          select: {
            name: true,
          },
        },
      },
      take: 3,
    });

    return latestParticipations;
  }),
});
