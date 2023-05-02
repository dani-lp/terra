import { TrophyIcon } from '@heroicons/react/20/solid';
import { useTranslation } from 'next-i18next';

import { Skeleton } from '@/components/common/skeleton';
import { HomeCard } from '@/components/home/HomeCard';
import { classNames } from '@/const';
import type { Participation } from '@prisma/client';

type Props = {
  latestParticipations: (Participation & {
    challenge: {
      name: string;
    };
  })[];
  isLoading: boolean;
};

export const LatestActivityCard = ({ latestParticipations, isLoading }: Props) => {
  const { t } = useTranslation('home');

  const participations = latestParticipations.map((participation) => ({
    id: participation.id,
    challengeName: participation.challenge.name,
    challengeId: participation.challengeId,
    date: participation.date,
    isValid: participation.isValid,
    icon: TrophyIcon,
    iconBackground: participation.isValid ? 'bg-green-500' : 'bg-red-500',
  }));

  return (
    <HomeCard
      title={t('players.latestActivity.title')}
      subtitle={t('players.latestActivity.subtitle')}
    >
      <div className="flow-root ">
        <ul role="list">
          {isLoading &&
            [...Array(3)].map((_, i) => (
              <li key={i}>
                <div className={classNames('relative', i === 2 ? 'pb-0' : 'pb-8')}>
                  <div className="relative flex space-x-3">
                    <div>
                      <Skeleton className="h-8 w-8" rounded />
                    </div>
                    <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                      <div className="text-sm text-gray-500">
                        <Skeleton className="h-3 w-72" />
                      </div>
                      <div className="whitespace-nowrap text-right text-sm text-gray-500">
                        <Skeleton className="h-3 w-11" />
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          {!isLoading &&
            participations.map((participation, i) => (
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
