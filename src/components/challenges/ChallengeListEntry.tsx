import { classNames } from '@/const';
import { QUERY_PARAM_CHALLENGE } from '@/const/queryParams';
import Link from 'next/link';
import { ChallengeStats } from './ChallengeStats';

// TEMP
export type Challenge = {
  id: number;
  name: string;
  players: number;
  date: string;
  status: 'open' | 'ended';
}

type Props = {
  challenge: Challenge;
}

export const ChallengeListEntry = ({ challenge }: Props) => {
  return (
    <li>
      <Link href={{ query: { [QUERY_PARAM_CHALLENGE]: challenge.id } }} className="block hover:bg-gray-50">
        <div className="p-4 sm:px-6">
          <div className="flex items-center justify-between">
            <p className="truncate text-sm font-medium text-indigo-600">{challenge.name}</p>
            <div className="ml-2 flex shrink-0">
              <p className={classNames(
                'inline-block shrink-0 rounded-full px-2 py-0.5 text-xs font-medium capitalize ',
                challenge.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              )}>
                {/* TODO i18n */}
                {challenge.status}
              </p>
            </div>
          </div>
          <ChallengeStats endDate={challenge.date} players={challenge.players} />
        </div>
      </Link>
    </li>
  );
};