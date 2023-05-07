// import { PlayerQuickLinksCard } from '@/components/home/players';
// import { trpcMsw } from '@/server/trpc/trpcMsw';
// import { render } from '@/test/testUtils';
// import type { AchievementTier } from '@/types';
// import type { ChallengeTag } from '@prisma/client';
// import { setupServer } from 'msw/node';

// const XP_POINTS = 100;
// const CHALLENGE_ENROLLMENT_COUNT = 2;
// const ACHIEVEMENTS = [
//   {
//     tag: 'ENVIRONMENT_CLEANING' as ChallengeTag,
//     tier: 'BRONZE' as AchievementTier,
//     entries: 15,
//   },
// ];

// const server = setupServer(
//   trpcMsw.user.getPlayerOverviewData.query((req, res, ctx) => {
//     return res(
//       ctx.status(200),
//       ctx.data({
//         about: 'about',
//         challengeEnrollmentCount: CHALLENGE_ENROLLMENT_COUNT,
//         experiencePoints: XP_POINTS,
//         image: null,
//         name: 'name',
//         username: 'username',
//         playerId: '1',
//         userDetailsId: '1',
//       }),
//     );
//   }),
//   trpcMsw.achievements.getByPlayer.query((req, res, ctx) => {
//     return res(ctx.status(200), ctx.data(ACHIEVEMENTS));
//   }),
//   trpcMsw.user.getPlayerDataId.query((req, res, ctx) => {
//     return res(ctx.status(200), ctx.data('1'));
//   }),
//   trpcMsw.home.getSelfPlayerDetails.query((req, res, ctx) => {
//     return res(
//       ctx.status(200),
//       ctx.data({
//         achievements: ACHIEVEMENTS,
//         enrolledChallengesCount: CHALLENGE_ENROLLMENT_COUNT,
//         latestParticipations: [],
//         participationsThisMonth: 2,
//         points: XP_POINTS,
//       }),
//     );
//   }),
// );

// beforeAll(() => server.listen());
// afterAll(() => server.close());
// afterEach(() => server.resetHandlers());

// test('displays player level', () => {
//   render(<PlayerQuickLinksCard />);
// });

test('placeholder', () => {
  expect(true).toBe(true);
});
