import { challengesRouter } from '@/server/trpc/router/challenges';
import { router } from '../trpc';
import { authRouter } from './auth';
import { devRouter } from './dev';
import { exampleRouter } from './example';
import { userRouter } from './user';

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  user: userRouter,
  dev: devRouter,
  challenges: challengesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
