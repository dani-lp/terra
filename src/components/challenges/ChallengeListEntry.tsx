import { classNames } from '@/const';
import { QUERY_PARAM_CHALLENGE } from '@/const/queryParams';
import Link from 'next/link';
import { ChallengeStats } from './ChallengeStats';
import { useQueryParams } from '@/hooks/useQueryParams';
import type { DisplayChallenge } from '@/types';

type Props = {
  challenge: DisplayChallenge;
};

export const ChallengeListEntry = ({ challenge }: Props) => {
  const { addParam } = useQueryParams();

  const handleOpenModal = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    addParam(QUERY_PARAM_CHALLENGE, challenge.id.toString());
  };

  return (
    <li>
      <Link href="" onClick={handleOpenModal} className="block hover:bg-gray-50">
        <div className="p-4 sm:px-6">
          <div className="flex items-center justify-between">
            <p className="truncate text-sm font-medium text-indigo-600">{challenge.name}</p>
            <div className="ml-2 flex shrink-0">
              <p
                className={classNames(
                  'inline-block shrink-0 rounded-full px-2 py-0.5 text-xs font-medium capitalize ',
                  challenge.status === 'open'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800',
                )}
              >
                {/* TODO i18n */}
                {challenge.status}
              </p>
            </div>
          </div>
          <ChallengeStats endDate={challenge.startDate} players={challenge.players} />
        </div>
      </Link>
    </li>
  );
};
