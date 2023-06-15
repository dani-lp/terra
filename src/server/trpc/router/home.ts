import { getAchievementTier } from '@/server/trpc/router/achievements';
import type { ChallengeTag } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { organizationProcedure, playerProcedure, router } from '../trpc';

export const homeRouter = router({
  // players
  getSelfPlayerDetails: playerProcedure.query(async ({ ctx }) => {
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
        playerData: {
          select: {
            id: true,
            experience: true,
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

    const playerData = userDetails.playerData;

    if (!playerData) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        cause: 'Player details not found',
      });
    }

    const participations = await ctx.prisma.participation.findMany({
      where: {
        playerDataId: playerData?.id,
      },
      select: {
        challenge: {
          select: {
            challengeCategories: {
              select: {
                tag: true,
              },
            },
          },
        },
      },
    });

    const tagCounts: Record<ChallengeTag, number> = {
      FITNESS: 0,
      RECYCLING: 0,
      ENVIRONMENT_CLEANING: 0,
      NUTRITION: 0,
      MOBILITY: 0,
      WELLNESS: 0,
      COMMUNITY_INVOLVEMENT: 0,
      OTHER: 0,
    };

    for (const participation of participations) {
      for (const category of participation.challenge.challengeCategories) {
        tagCounts[category.tag]++;
      }
    }

    const unsortedAchievements = Object.entries(tagCounts)
      .filter((value) => value[1] >= 10)
      .map(([tag, count]) => ({
        tag: tag as ChallengeTag,
        entries: count,
        tier: getAchievementTier(count),
      }));

    // TODO check sorting is carried out properly
    const achievements = unsortedAchievements.sort((a, b) => b.entries - a.entries);

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

    return {
      points: playerData.experience,
      achievements: achievements.slice(0, 3),
      participationsThisMonth,
      enrolledChallengesCount,
      latestParticipations,
    };
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

    const rawLatestParticipations = await ctx.prisma.participation.findMany({
      where: {
        challenge: {
          organizationDataId: organizationData.id,
        },
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
        playerData: {
          select: {
            id: true,
            userDetails: {
              select: {
                username: true,
              },
            },
          },
        },
      },
      take: 3,
    });

    const latestParticipations = rawLatestParticipations.map((p) => ({
      id: p.id,
      challengeId: p.challengeId,
      challengeName: p.challenge.name,
      playerDataId: p.playerData.id,
      playerUsername: p.playerData.userDetails.username ?? '',
      date: p.date,
      isValid: p.isValid,
      proof: p.proofUrl,
    }));

    return {
      username: userDetails.username,
      website: organizationData.website,
      country: organizationData.country,
      image: organizationData.image ?? userDetails.user.image,
      joinedOn: organizationData.createdAt,
      activeChallengesCount,
      totalParticipationCount,
      latestParticipations,
    };
  }),
});
