import { TRPCError } from '@trpc/server';
import { playerProcedure, router } from '../trpc';

export const homeRouter = router({
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
});
