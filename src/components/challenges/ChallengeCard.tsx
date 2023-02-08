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
    <li className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow">
      <div className="flex w-full items-center justify-between space-x-6 p-6">
        <div className="flex-1 truncate">
          <div className="flex items-center space-x-3">
            <h3 className="truncate text-sm font-medium text-gray-900">{challenge.name}</h3>
            <span className={classNames(
              'inline-block shrink-0 rounded-full px-2 py-0.5 text-xs font-medium capitalize ',
              challenge.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            )}>
              {/* TODO i18n */}
              {challenge.status}
            </span>
          </div>
          <p className="mt-1 flex items-center justify-start gap-2 truncate text-sm text-gray-500">
            <UserGroupIcon className="inline-block h-4 w-4 text-gray-400" aria-hidden="true" />
            <span>{formatter.format(challenge.players)} players</span>
          </p>
          {/* TODO purpose of the date unclear */}
          <p className="mt-1 flex items-center justify-start gap-2 truncate text-sm text-gray-500">
            <CalendarIcon className="inline-block h-4 w-4 text-gray-400" aria-hidden="true" />
            <span>{challenge.date}</span>
          </p>
        </div>
      </div>
      <div>
        <div className="-mt-px flex divide-x divide-gray-200">
          <div className="flex w-0 flex-1">
            <button
              className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center rounded-bl-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500"
            >
              <QrCodeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              <span className="ml-3">QR Code</span>
            </button>
          </div>
          <div className="-ml-px flex w-0 flex-1">
            <a
              href={`/challenges/${challenge.id}`}
              className="relative inline-flex w-0 flex-1 items-center justify-center rounded-br-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500"
            >
              <RocketLaunchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              <span className="ml-3">Open</span>
            </a>
          </div>
        </div>
      </div>
    </li>
  );
};