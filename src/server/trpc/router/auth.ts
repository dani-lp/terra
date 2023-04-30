import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { organizationProcedure, router } from '../trpc';

export const authRouter = router({
  // Queries
  getProfileOrgData: organizationProcedure.query(async ({ ctx }) => {
    const orgUserDetails = await ctx.prisma.userDetails.findUnique({
      where: { userId: ctx.session.user?.id },
      include: { organizationData: true },
    });

    if (!orgUserDetails) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User details not found',
      });
    }

    return {
      organizationDataId: orgUserDetails.organizationData?.id,
      name: orgUserDetails.organizationData?.name,
      username: orgUserDetails.username,
      website: orgUserDetails.organizationData?.website,
      about: orgUserDetails.about,
      status: orgUserDetails.organizationData?.approvalState,
      rejectionMessage: orgUserDetails.organizationData?.rejectionMessage,
    };
  }),

  getPrivateOrgData: organizationProcedure.query(async ({ ctx }) => {
    const orgUserDetails = await ctx.prisma.userDetails.findUnique({
      where: { userId: ctx.session.user?.id },
      include: { organizationData: true },
    });

    if (!orgUserDetails) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User details not found',
      });
    }

    return {
      organizationDataId: orgUserDetails.organizationData?.id,
      country: orgUserDetails.organizationData?.country,
      address: orgUserDetails.organizationData?.address,
      city: orgUserDetails.organizationData?.city,
      state: orgUserDetails.organizationData?.state,
      zip: orgUserDetails.organizationData?.zip,
      phone: orgUserDetails.organizationData?.phone,
    };
  }),

  // Mutations
  updateProfileOrgData: organizationProcedure
    .input(
      z.object({
        name: z.string(),
        username: z.string(),
        website: z.string().regex(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/), // TODO revise this monstrosity
        about: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const orgUserDetails = await ctx.prisma.userDetails.upsert({
        where: { userId: ctx.session.user?.id },
        update: {
          username: input.username,
          about: input.about,
        },
        create: {
          role: 'ORGANIZATION',
          userId: ctx.session.user?.id,
          username: input.username,
          about: input.about,
        },
      });

      if (!orgUserDetails) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User details not found',
        });
      }

      const organizationData = await ctx.prisma.organizationData.upsert({
        where: { userDetailsId: orgUserDetails.id },
        update: {
          name: input.name,
          website: input.website,
        },
        create: {
          userDetails: {
            connect: {
              id: orgUserDetails.id,
            },
          },
          name: input.name,
          website: input.website,
          image: '',
          country: '',
        },
      });

      return {
        organizationDataId: organizationData?.id,
        name: organizationData.name,
        username: orgUserDetails.username,
        website: organizationData.website,
        about: orgUserDetails.about,
      };
    }),

  updatePrivateOrgData: organizationProcedure
    .input(
      z.object({
        country: z.string(),
        address: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        zip: z.string().optional(),
        phone: z.string().optional(), // TODO better validation
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const orgUserDetails = await ctx.prisma.userDetails.upsert({
        where: { userId: ctx.session.user?.id },
        select: { id: true },
        update: {},
        create: {
          role: 'ORGANIZATION',
          userId: ctx.session.user?.id,
          username: '',
          about: '',
        },
      });

      const organizationData = await ctx.prisma.organizationData.upsert({
        where: { userDetailsId: orgUserDetails.id },
        update: {
          country: input.country,
          address: input.address,
          city: input.city,
          state: input.state,
          zip: input.zip,
          phone: input.phone,
        },
        create: {
          userDetails: {
            connect: {
              id: orgUserDetails.id,
            },
          },
          name: '',
          website: '',
          image: '',
          country: input.country,
          address: input.address,
          city: input.city,
          state: input.state,
          zip: input.zip,
          phone: input.phone,
        },
      });

      return {
        organizationDataId: organizationData.id,
        country: organizationData.country,
        address: organizationData.address,
        city: organizationData.city,
        state: organizationData.state,
        zip: organizationData.zip,
        phone: organizationData.phone,
      };
    }),

  submitRegistrationRequest: organizationProcedure
    .input(
      z.object({
        name: z.string().min(3),
        username: z.string().min(3).regex(/^\S+$/),
        website: z.string().regex(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/), // TODO revise this monstrosity
        about: z.string().min(10),
        country: z.string().min(3),
        address: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        zip: z.string().optional(),
        phone: z.string().optional(), // TODO better validation
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const orgUserDetails = await ctx.prisma.userDetails.update({
        where: { userId: ctx.session.user?.id },
        data: {
          about: input.about,
          username: input.username,
        },
        select: { id: true },
      });

      if (!orgUserDetails) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User details not found',
        });
      }

      await ctx.prisma.organizationData.update({
        where: { userDetailsId: orgUserDetails.id },
        data: {
          approvalState: 'PENDING',
          website: input.website,
          name: input.name,
          country: input.country,
          address: input.address,
          city: input.city,
          state: input.state,
          zip: input.zip,
          phone: input.phone,
        },
      });

      return true;
    }),
});
