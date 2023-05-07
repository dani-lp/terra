import { createTRPCMsw} from 'msw-trpc';
import type { AppRouter } from './router/_app';

export const trpcMsw = createTRPCMsw<AppRouter>();
