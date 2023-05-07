// import type { inferProcedureInput } from '@trpc/server';
// import { createContextInner } from './context';
// import { appRouter, type AppRouter } from './router/_app';

// test('app router', async () => {
//   const ctx = await createContextInner({ session: null });
//   const caller = appRouter.createCaller(ctx);

//   type Input = inferProcedureInput<AppRouter['health']['pingInput']>;
//   const input: Input = { message: 'hello' };

//   const result = await caller.health.pingInput(input);

//   expect(result).toMatchObject(input.message);
// });

test('mock test', () => {
  expect(1).toBe(1);
})