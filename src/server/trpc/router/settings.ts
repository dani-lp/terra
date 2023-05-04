import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { organizationProcedure, playerProcedure, router } from '../trpc';

export const settingsRouter = router({
  // queries
  getPlayerProfileInfo: playerProcedure.query(async ({ ctx }) => {
    const userDetails = await ctx.prisma.userDetails.findUnique({
      where: {
        userId: ctx.session.user.id,
      },
      select: {
        about: true,
        username: true,
        user: {
          select: {
            name: true,
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

    return {
      name: userDetails.user.name,
      username: userDetails.username,
      about: userDetails.about,
    };
  }),

  getOrgProfileInfo: organizationProcedure.query(async ({ ctx }) => {
    const userDetails = await ctx.prisma.userDetails.findUnique({
      where: {
        userId: ctx.session.user.id,
      },
      select: {
        about: true,
        username: true,
        organizationData: {
          select: {
            name: true,
            website: true,
            country: true,
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

    const organizationData = userDetails.organizationData;

    if (!organizationData) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        cause: 'Organization details not found',
      });
    }

    return {
      organizationName: organizationData.name,
      username: userDetails.username,
      about: userDetails.about,
      website: organizationData.website,
      country: organizationData.country,
      image: organizationData.image,
    };
  }),

  getOrgPrivateInfo: organizationProcedure.query(async ({ ctx }) => {
    const userDetails = await ctx.prisma.userDetails.findUnique({
      where: {
        userId: ctx.session.user.id,
      },
      select: {
        organizationData: {
          select: {
            phone: true,
            address: true,
            city: true,
            state: true,
            zip: true,
          },
        },
      },
    });

    if (!userDetails?.organizationData) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        cause: 'User details not found',
      });
    }

    return userDetails.organizationData;
  }),

  // mutations
  updatePlayerProfile: playerProcedure
    .input(
      z.object({
        name: z.string().min(3),
        username: z.string().min(3).regex(/^\S+$/),
        about: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.userDetails.update({
        where: {
          userId: ctx.session.user.id,
        },
        data: {
          about: input.about,
          username: input.username,
          user: {
            update: {
              name: input.name,
            },
          },
        },
      });

      return true;
    }),

  updateOrgProfile: organizationProcedure
    .input(
      z.object({
        organizationName: z.string().min(3),
        username: z.string().min(3).regex(/^\S+$/),
        about: z.string().optional(),
        website: z.string().regex(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/), // TODO revise this monstrosity
        country: z.string().min(3),
        pfpUrl: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.userDetails.update({
        where: {
          userId: ctx.session.user.id,
        },
        data: {
          username: input.username,
          about: input.about,
          organizationData: {
            update: {
              name: input.organizationName,
              website: input.website,
              country: input.country,
              image: input.pfpUrl,
            },
          },
        },
      });

      return null;
    }),

  updateOrgPrivate: organizationProcedure
    .input(
      z.object({
        phone: z.string(),
        address: z.string(),
        city: z.string(),
        state: z.string(),
        zip: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userDetails = await ctx.prisma.userDetails.findUnique({
        where: {
          userId: ctx.session.user.id,
        },
        select: {
          id: true,
        },
      });

      if (!userDetails) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          cause: 'User details not found',
        });
      }

      await ctx.prisma.organizationData.update({
        where: {
          userDetailsId: userDetails.id,
        },
        data: {
          phone: input.phone,
          address: input.address,
          city: input.city,
          state: input.state,
          zip: input.zip,
        },
      });

      return true;
    }),
});
