import { sanitizeWebsite } from '@/utils/utils';
import { OrganizationAcceptanceState } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { adminProcedure, organizationProcedure, router } from '../trpc';

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

  /**
   * Get all organization data for admin organization view
   */
  getAdminOrgData: adminProcedure.query(async ({ ctx }) => {
    const allOrgsRawData = await ctx.prisma.organizationData.findMany({
      include: {
        userDetails: {
          include: {
            user: {
              select: {
                email: true,
                image: true,
              },
            },
          },
        },
      },
    });

    const organizations = allOrgsRawData.map((org) => ({
      id: org.id,
      name: org.name,
      username: org.userDetails.username,
      email: org.userDetails.user.email,
      website: sanitizeWebsite(org.website),
      image: org.userDetails.user.image,
      status: org.approvalState,
    }));

    return organizations;
  }),

  getAdminOrgDetails: adminProcedure
    .input(z.object({ organizationId: z.string().nullable() }))
    .query(async ({ ctx, input }) => {
      const { organizationId } = input;

      if (!organizationId) {
        return null;
      }

      const orgRawData = await ctx.prisma.organizationData.findUnique({
        where: { id: organizationId },
        include: {
          userDetails: {
            include: {
              user: {
                select: {
                  email: true,
                  image: true,
                },
              },
            },
          },
        },
      });

      if (!orgRawData) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Organization not found',
        });
      }

      const organization = {
        id: orgRawData.id,
        name: orgRawData.name,
        username: orgRawData.userDetails.username,
        about: orgRawData.userDetails.about,
        email: orgRawData.userDetails.user.email,
        website: sanitizeWebsite(orgRawData.website),
        image: orgRawData.userDetails.user.image,
        status: orgRawData.approvalState,
        rejectionMessage: orgRawData.rejectionMessage,
        country: orgRawData.country,
        address: orgRawData.address,
        city: orgRawData.city,
        state: orgRawData.state,
        zip: orgRawData.zip,
        phone: orgRawData.phone,
      };

      return organization;
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

  changeOrganizationStatus: adminProcedure
    .input(
      z.object({
        organizationId: z.string().nullable(),
        newStatus: z.nativeEnum(OrganizationAcceptanceState),
        message: z.string().min(10),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!input.organizationId) {
        return false;
      }
      
      if (input.newStatus === 'PENDING' || input.newStatus === 'UNSUBMITTED') {
        return false;
      }

      const organization = await ctx.prisma.organizationData.findUnique({
        where: { id: input.organizationId },
        select: {
          approvalState: true,
        },
      });

      if (!organization) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Organization not found',
        });
      }

      const oldStatus = organization.approvalState;

      if (oldStatus === 'UNSUBMITTED') {
        return false;
      }

      await ctx.prisma.organizationData.update({
        where: { id: input.organizationId },
        data: {
          approvalState: input.newStatus,
          rejectionMessage: input.message,
        },
      });

      return true;
    }),
});
