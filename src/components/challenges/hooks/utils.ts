import type { SelectOption } from '@/components/common';
import type { DisplayChallenge } from '@/types';
import type { ChallengeTag } from '@prisma/client';

type FilterOptions = {
  search: string;
  playerNumber: number | '';
  status: SelectOption;
  tags: ChallengeTag[];
};

export const getFilteredChallenges = (
  challenges: DisplayChallenge[],
  filterOptions: FilterOptions,
) => {
  const {
    search = '',
    playerNumber = '',
    status = { id: '', label: '' },
    tags = [],
  } = filterOptions;

  const filteredChallenges = challenges
    .filter((challenge) =>
      !search ? true : challenge.name.toLowerCase().includes(search.toLowerCase()),
    )
    .filter((challenge) => {
      const challengeStatus = new Date() < challenge.endDate ? 'open' : 'ended';

      switch (status.id) {
        case 'open':
          return challengeStatus === 'open';
        case 'ended':
          return challengeStatus === 'ended';
        default:
          return true;
      }
    })
    .filter((challenge) =>
      playerNumber === '' ? true : challenge.enrolledPlayersCount >= playerNumber,
    )
    .filter((challenge) =>
      tags.length === 0 ? true : tags.some((tag) => challenge.tags.includes(tag)),
    );

  return filteredChallenges;
};
