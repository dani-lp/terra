import { TRPCError } from '@trpc/server';
import { protectedProcedure, router } from '../trpc';
import { z } from 'zod';
import { Role } from '@prisma/client';
import { env } from '@/env/server.mjs';

export const devRouter = router({
  changeRole: protectedProcedure
    .input(z.object({ role: z.enum([Role.ADMIN, Role.ORGANIZATION, Role.PLAYER]) }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx.session;
     
      if (user.email !== env.ADMIN_EMAIL) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      const { role } = input;
      const userDetails = await ctx.prisma.userDetails.findUnique({
        where: {
          userId: user.id,
        },
      });
      if (!userDetails) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }
      await ctx.prisma.userDetails.update({
        where: {
          userId: user.id,
        },
        data: {
          role,
        },
      });
      return role;
    }),
});