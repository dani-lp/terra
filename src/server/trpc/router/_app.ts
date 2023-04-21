import { challengesRouter } from '@/server/trpc/router/challenges';
import { router } from '../trpc';
import { authRouter } from './auth';
import { devRouter } from './dev';
import { userRouter } from './user';
import { participationRouter } from '@/server/trpc/router/participation';

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  dev: devRouter,
  challenges: challengesRouter,
  participation: participationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
