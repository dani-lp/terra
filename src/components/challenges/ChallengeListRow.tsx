import { useTranslation } from 'next-i18next';
import Link from 'next/link';

import { Chip } from '@/components/common';
import { classNames, difficultyIconColors } from '@/const';
import type { DisplayChallenge } from '@/types';
import { StarIcon } from '@heroicons/react/20/solid';
import { ChallengeStats } from './ChallengeStats';

type Props = {
  challenge: DisplayChallenge;
  onClick?: () => void;
  asLink?: boolean;
};

const Content = ({ challenge }: Pick<Props, 'challenge'>) => {
  const { t } = useTranslation('challenges');
  const status = new Date() < challenge.endDate ? 'open' : 'ended';

  return (
    <div className="flex items-start justify-between p-4 sm:px-6">
      <div>
        <div className="flex items-center justify-between">
          <p className="truncate text-sm font-medium text-indigo-600">{challenge.name}</p>
        </div>
        <ChallengeStats
          endDate={challenge.endDate.toLocaleDateString()}
          players={challenge.enrolledPlayersCount}
        />
      </div>

      <div className="ml-2 flex shrink-0 flex-col items-end justify-center gap-2">
        <div className="flex items-center text-xs font-medium text-gray-500">
          <StarIcon
            className={classNames(
              'mr-1 h-5 w-5 shrink-0',
              difficultyIconColors[challenge.difficulty ?? 'EASY'],
            )}
            aria-hidden="true"
          />
          {t(`challenges.creation.difficulties.${challenge.difficulty.toLowerCase() ?? 'easy'}`)}
        </div>
        <Chip
          label={
            status === 'open'
              ? t('challenges.details.header.open')
              : t('challenges.details.header.closed')
          }
          className={status === 'open' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}
        />
      </div>
    </div>
  );
};

export const ChallengeListRow = ({ challenge, onClick, asLink = false }: Props) => {
  if (asLink) {
    return (
      <Link href={`/challenges/${challenge.id}`} className="block cursor-pointer hover:bg-gray-50">
        <Content challenge={challenge} />
      </Link>
    );
  }

  return (
    <li onClick={onClick} className="block cursor-pointer hover:bg-gray-50">
      <Content challenge={challenge} />
    </li>
  );
};
