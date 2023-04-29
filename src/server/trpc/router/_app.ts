import { router } from '../trpc';
import { achievementsRouter } from './achievements';
import { authRouter } from './auth';
import { challengesRouter } from './challenges';
import { devRouter } from './dev';
import { participationRouter } from './participation';
import { userRouter } from './user';

export const appRouter = router({
  user: userRouter,
  dev: devRouter,
  challenges: challengesRouter,
  participation: participationRouter,
  achievements: achievementsRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
