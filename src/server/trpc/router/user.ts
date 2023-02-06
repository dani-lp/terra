import { TRPCError } from '@trpc/server';
import { router, protectedProcedure } from '../trpc';
import type { UserData } from '@/types';

export const userRouter = router({
  getUserData: protectedProcedure.query(async ({ ctx }) => {
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
});