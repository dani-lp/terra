import {
  useChallengeSearch,
  useChallengeSearchPlayerNumber,
  useChallengeSearchStatus,
} from '@/store/useChallengeSearchStore';
import type { DisplayChallenge } from '@/types';
import type { trpc } from '@/utils/trpc';

type QueryType =
  | typeof trpc.challenges.created
  | typeof trpc.challenges.enrolled
  | typeof trpc.challenges.available;

export const useChallenges = (query: QueryType) => {
  const { data, isLoading, isError, error } = query.useQuery();

  const search = useChallengeSearch();
  const playerNumber = useChallengeSearchPlayerNumber();
  const challengeStatus = useChallengeSearchStatus();

  const challenges: DisplayChallenge[] =
    data?.map((challenge) => ({
      ...challenge,
      startDate: challenge.startDate.toLocaleDateString(),
      endDate: challenge.endDate.toLocaleDateString(),
      players: challenge.enrolledPlayersCount,
      status: Math.random() > 0.5 ? 'open' : 'ended',
    })) ?? [];

  const filteredChallenges = challenges
    .filter((challenge) =>
      !search ? challenges : challenge.name.toLowerCase().includes(search.toLowerCase()),
    )
    .filter((challenge) => {
      switch (challengeStatus.id) {
        case 'open':
          return challenge.status === 'open';
        case 'ended':
          return challenge.status === 'ended';
        default:
          return true;
      }
    })
    .filter((challenge) => (playerNumber === '' ? true : challenge.players >= playerNumber));

  return { filteredChallenges, isLoading, isError, error };
};
