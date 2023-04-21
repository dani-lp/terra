import {
  useChallengeSearch,
  useChallengeSearchPlayerNumber,
  useChallengeSearchStatus,
} from '@/store/useChallengeSearchStore';
import type { trpc } from '@/utils/trpc';
import type { Challenge } from '@prisma/client';

type QueryType =
  | typeof trpc.challenges.created
  | typeof trpc.challenges.enrolled
  | typeof trpc.challenges.available;

type ChallengeWithPlayerCount = Challenge & { enrolledPlayersCount: number };

export const useChallenges = (query: QueryType) => {
  const { data, isLoading, isError, error } = query.useQuery();

  const search = useChallengeSearch();
  const playerNumber = useChallengeSearchPlayerNumber();
  const challengeStatus = useChallengeSearchStatus();

  const challenges: ChallengeWithPlayerCount[] = data ?? [];

  const filteredChallenges = challenges
    .filter((challenge) =>
      !search ? challenges : challenge.name.toLowerCase().includes(search.toLowerCase()),
    )
    .filter((challenge) => {
      const status = new Date() < challenge.endDate ? 'open' : 'ended';

      switch (challengeStatus.id) {
        case 'open':
          return status === 'open';
        case 'ended':
          return status === 'ended';
        default:
          return true;
      }
    })
    .filter((challenge) =>
      playerNumber === '' ? true : challenge.enrolledPlayersCount >= playerNumber,
    );

  return { filteredChallenges, isLoading, isError, error };
};
