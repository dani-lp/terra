import { z } from 'zod';
import { organizationProcedure, router } from '../trpc';

export const authRouter = router({
  updateProfileOrgData: organizationProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        username: z.string(),
        website: z.string().regex(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/), // TODO revise this monstrosity
        about: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      return null;
    }),

  updatePrivateOrgData: organizationProcedure
    .input(
      z.object({
        id: z.string(),
        country: z.string(),
        address: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        zip: z.string().optional(),
        phone: z.string().optional(), // TODO better validation
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      return null;
    }),
});
