import { z } from 'zod';
import { publicProcedure, router } from '../trpc';

export const healthRouter = router({
  ping: publicProcedure.query(() => {
    return 'ok';
  }),
  pingInput: publicProcedure
    .input(
      z.object({
        message: z.string(),
      }),
    )
    .query(({ input }) => {
      return input.message;
    }),
});
