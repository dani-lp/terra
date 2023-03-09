import { organizationProcedure, protectedProcedure, router } from '@/server/trpc/trpc';
import { z } from 'zod';

export const challengesRouter = router({
  all: protectedProcedure.query(async ({ ctx }) => {
    // TODO filter by participants, use DisplayChallenge as return
    const challenges = await ctx.prisma.challenge.findMany();
    return challenges; 
  }),
  create: organizationProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { name, description } = input;
       
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
          startDate: new Date(),
          endDate: new Date(),
          organizationDataId: organizationData.id,
        },
      });

      return challenge;
    }),
});
