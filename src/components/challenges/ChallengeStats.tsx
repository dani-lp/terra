import { CalendarIcon, MapPinIcon, UserGroupIcon } from '@heroicons/react/20/solid';
import { useTranslation } from 'next-i18next';

type Props = {
  endDate: string;
  players: number;
  location?: string;
};

const formatter = Intl.NumberFormat('en-US', {
  style: 'decimal',
});

export const ChallengeStats = ({ endDate, players, location }: Props) => {
  const { t } = useTranslation('challenges');

  return (
    <div className="flex flex-col">
      <div className="mt-2 flex items-center text-sm text-gray-600">
        <UserGroupIcon className="mr-1.5 h-5 w-5 shrink-0 text-gray-500" aria-hidden="true" />
        {formatter.format(players)} players
      </div>
      <div className="mt-2 flex items-center text-sm text-gray-600">
        <CalendarIcon className="mr-1.5 h-5 w-5 shrink-0 text-gray-500" aria-hidden="true" />
        {t('challenges.common.closingOn', { date: endDate })}
      </div>
      {location && (
        <div className="mt-2 flex items-center text-sm text-gray-600">
          <MapPinIcon className="mr-1.5 h-5 w-5 shrink-0 text-gray-500" aria-hidden="true" />
          {location}
        </div>
      )}
    </div>
  );
};
