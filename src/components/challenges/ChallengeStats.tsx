import { CalendarIcon, UserGroupIcon } from '@heroicons/react/20/solid';

type Props = {
  endDate: string; // TODO use date, add startDate
  players: number;
};

const formatter = Intl.NumberFormat('en-US', {
  style: 'decimal',
});

export const ChallengeStats = ({ endDate, players }: Props) => {
  return (
    <div className="mt-2 sm:justify-between">
      <div className="mb-2 sm:flex">
        <p className="flex items-center text-sm text-gray-600">
          <UserGroupIcon className="mr-1.5 h-5 w-5 shrink-0 text-gray-500" aria-hidden="true" />
          {formatter.format(players)} players
        </p>
        {/* <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                <MapPinIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                {position.location}
              </p> */}
      </div>
      <div className="mt-2 flex items-center text-sm text-gray-600 sm:mt-0">
        <CalendarIcon className="mr-1.5 h-5 w-5 shrink-0 text-gray-500" aria-hidden="true" />
        <p>
          Closing on <time dateTime={endDate}>{endDate}</time>
        </p>
      </div>
    </div>
  );
};
