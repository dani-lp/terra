import { HomeCard } from '@/components/home/HomeCard';
import { classNames } from '@/const';
import { trpc } from '@/utils/trpc';
import { TrophyIcon } from '@heroicons/react/20/solid';
import { useTranslation } from 'next-i18next';

export const LatestActivityCard = () => {
  const { t } = useTranslation('home');
  const { data, isLoading, isError, error } = trpc.home.getLatestActivityPlayer.useQuery();

  const rawParticipations = data ?? [];
  const participations = rawParticipations.map((participation) => ({
    id: participation.id,
    challengeName: participation.challenge.name,
    challengeId: participation.challengeId,
    date: participation.date,
    isValid: participation.isValid,
    icon: TrophyIcon,
    iconBackground: participation.isValid ? 'bg-green-500' : 'bg-red-500',
  }));

  if (error) {
    console.error(error);
  }

  return (
    <HomeCard
      title={t('players.latestActivity.title')}
      subtitle={t('players.latestActivity.subtitle')}
    >
      <div className="flow-root ">
        <ul role="list">
          {participations.map((participation, i) => (
            <li key={participation.id}>
              <div
                className={classNames(
                  'relative',
                  i === participations.length - 1 ? 'pb-0' : 'pb-8',
                )}
              >
                {i !== participations.length - 1 ? (
                  <span
                    className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex space-x-3">
                  <div>
                    <span
                      className={classNames(
                        participation.iconBackground,
                        'flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-white',
                      )}
                    >
                      <participation.icon className="h-5 w-5 text-white" aria-hidden="true" />
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <p className="text-sm text-gray-500">
                        {participation.isValid
                          ? t('players.latestActivity.participatedOn')
                          : t('players.latestActivity.participatedOnInvalid')}
                        <a
                          href={`/challenges/${participation.challengeId}`}
                          className="font-medium text-gray-900"
                        >
                          {participation.challengeName}
                        </a>
                      </p>
                    </div>
                    <div className="whitespace-nowrap text-right text-sm text-gray-500">
                      <time dateTime={participation.date.toISOString()}>
                        {participation.date.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </time>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </HomeCard>
  );
};
