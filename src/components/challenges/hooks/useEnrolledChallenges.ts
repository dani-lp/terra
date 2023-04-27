import { getFilteredChallenges } from '@/components/challenges/hooks/utils';
import {
  useChallengeSearch,
  useChallengeSearchPlayerNumber,
  useChallengeSearchStatus,
  useChallengeSearchTags,
} from '@/store/useChallengeSearchStore';
import { trpc } from '@/utils/trpc';

export const useEnrolledChallenges = () => {
  const { data, isLoading, isError, error } = trpc.challenges.enrolled.useQuery();

  const search = useChallengeSearch();
  const playerNumber = useChallengeSearchPlayerNumber();
  const challengeStatus = useChallengeSearchStatus();
  const challengeTags = useChallengeSearchTags();

  const challenges = data ?? [];

  const filteredChallenges = getFilteredChallenges(challenges, {
    search,
    playerNumber,
    status: challengeStatus,
    tags: challengeTags,
  });

  return {
    challenges: filteredChallenges,
    isLoading,
    isError,
    error,
  };
};
