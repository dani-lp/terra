import { classNames } from '@/const';
import type { Challenge } from '@prisma/client';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { ChallengeStats } from './ChallengeStats';

type Props = {
  challenge: Challenge & { enrolledPlayersCount: number };
  onClick?: () => void;
  asLink?: boolean;
};

const Content = ({ challenge }: Pick<Props, 'challenge'>) => {
  const { t } = useTranslation('challenges');
  const status = new Date() < challenge.endDate ? 'open' : 'ended';

  return (
    <div className="p-4 sm:px-6">
      <div className="flex items-center justify-between">
        <p className="truncate text-sm font-medium text-indigo-600">{challenge.name}</p>
        <div className="ml-2 flex shrink-0">
          <p
            className={classNames(
              'inline-block shrink-0 rounded-full px-2 py-0.5 text-xs font-medium capitalize ',
              status === 'open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
            )}
          >
            {status === 'open'
              ? t('challenges.details.header.open')
              : t('challenges.details.header.closed')}
          </p>
        </div>
      </div>
      <ChallengeStats
        endDate={challenge.endDate.toLocaleDateString()}
        players={challenge.enrolledPlayersCount}
      />
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
