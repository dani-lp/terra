import { router } from '../trpc';
import { achievementsRouter } from './achievements';
import { authRouter } from './auth';
import { challengesRouter } from './challenges';
import { devRouter } from './dev';
import { healthRouter } from './health';
import { homeRouter } from './home';
import { participationRouter } from './participation';
import { settingsRouter } from './settings';
import { userRouter } from './user';

export const appRouter = router({
  health: healthRouter,
  user: userRouter,
  dev: devRouter,
  challenges: challengesRouter,
  participation: participationRouter,
  achievements: achievementsRouter,
  auth: authRouter,
  home: homeRouter,
  settings: settingsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
