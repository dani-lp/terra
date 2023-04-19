import { classNames } from '@/const';
import type { DisplayChallenge } from '@/types';
import { ChallengeStats } from './ChallengeStats';

type Props = {
  challenge: DisplayChallenge;
  onClick: () => void;
};

export const ChallengeListEntry = ({ challenge, onClick }: Props) => {
  return (
    <li onClick={onClick} className="block cursor-pointer hover:bg-gray-50">
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
        <ChallengeStats endDate={challenge.endDate} players={challenge.players} />
      </div>
    </li>
  );
};
