import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';

import { type Context } from './context';
import { Role } from '@prisma/client';

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

export const router = t.router;

/**
 * Unprotected procedure
 **/
export const publicProcedure = t.procedure;

/**
 * Reusable middleware to ensure
 * users are logged in
 */
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

/**
 * Protected procedure
 **/
export const protectedProcedure = t.procedure.use(isAuthed);

/**
 * Middleware for user roles
 */

const createRoleMiddleware = (role: Role) => {
  return t.middleware(({ ctx, next }) => {
    if (!ctx.session || !ctx.session.user || ctx.session?.user?.role !== role) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return next({
      ctx: {
        session: { ...ctx.session, user: ctx.session.user },
      },
    });
  });
};

export const playerProcedure = t.procedure.use(createRoleMiddleware(Role.PLAYER));
export const organizationProcedure = t.procedure.use(createRoleMiddleware(Role.ORGANIZATION));
export const adminProcedure = t.procedure.use(createRoleMiddleware(Role.ADMIN));