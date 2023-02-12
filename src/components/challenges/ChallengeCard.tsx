import { classNames } from '@/const';
import { CalendarIcon, QrCodeIcon, RocketLaunchIcon, UserGroupIcon } from '@heroicons/react/20/solid';

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

const formatter = Intl.NumberFormat('en-US', {
  style: 'decimal',
});

export const ChallengeCard = ({ challenge }: Props) => {

  return (
    <li>
      <a href={`/challenges/${challenge.id}`} className="block hover:bg-gray-50">
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
          <div className="mt-2 sm:flex sm:justify-between">
            <div className="sm:flex">
              <p className="flex items-center text-sm text-gray-500">
                <UserGroupIcon className="mr-1.5 h-5 w-5 shrink-0 text-gray-400" aria-hidden="true" />
                {formatter.format(challenge.players)} players
              </p>
              {/* <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                <MapPinIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                {position.location}
              </p> */}
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
              <CalendarIcon className="mr-1.5 h-5 w-5 shrink-0 text-gray-400" aria-hidden="true" />
              <p>
                Closing on <time dateTime={challenge.date}>{challenge.date}</time>
              </p>
            </div>
          </div>
        </div>
      </a>
    </li>
  );
};