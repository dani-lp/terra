import { TRPCError } from '@trpc/server';
import { organizationProcedure, playerProcedure, router } from '../trpc';

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

    await new Promise((p) => setTimeout(p, 2000));

    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    oneMonthAgo.setHours(0, 0, 0, 0);

    const participationsThisMonth = await ctx.prisma.participation.count({
      where: {
        playerDataId: userDetails.playerData?.id,
        date: {
          gte: oneMonthAgo.toISOString(),
          lte: today.toISOString(),
        },
      },
    });

    const enrolledChallengesCount = await ctx.prisma.challenge.count({
      where: {
        enrolledPlayers: {
          some: {
            id: userDetails.playerData?.id,
          },
        },
        endDate: {
          gte: new Date(),
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

  // orgs
  getSelfOrgDetails: organizationProcedure.query(async ({ ctx }) => {
    const userDetails = await ctx.prisma.userDetails.findUnique({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        user: {
          select: {
            email: true,
            image: true,
          },
        },
      },
    });

    if (!userDetails) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        cause: 'User details not found',
      });
    }

    const organizationData = await ctx.prisma.organizationData.findUnique({
      where: {
        userDetailsId: userDetails.id,
      },
    });

    if (!organizationData) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        cause: 'Organization details not found',
      });
    }

    const activeChallengesCount = await ctx.prisma.challenge.count({
      where: {
        organizationDataId: organizationData.id,
        startDate: {
          lte: new Date(),
        },
        endDate: {
          gte: new Date(),
        },
      },
    });

    const totalParticipationCount = await ctx.prisma.participation.count({
      where: {
        challenge: {
          organizationDataId: organizationData.id,
        },
      },
    });

    return {
      username: userDetails.username,
      website: organizationData.website,
      country: organizationData.country,
      image: userDetails.user.image,
      joinedOn: organizationData.createdAt,
      activeChallengesCount,
      totalParticipationCount,
    };
  }),
});
