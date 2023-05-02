import { useTranslation } from 'next-i18next';
import * as React from 'react';

import { Skeleton } from '@/components/common/skeleton';
import { HomeCard } from '@/components/home/HomeCard';
import { PlayerDetailsSlideOver } from '@/components/users';
import { classNames } from '@/const';
import { TrophyIcon } from '@heroicons/react/20/solid';

type DisplayParticipation = {
  id: string;
  challengeName: string;
  challengeId: string;
  date: Date;
  isValid: boolean;
  playerDataId: string;
  playerUsername: string;
};

type Props = {
  isLoading: boolean;
  participations: DisplayParticipation[];
};

export const RecentActivityCard = ({ isLoading, participations }: Props) => {
  const { t } = useTranslation('home');
  const [activePlayerId, setActivePlayerId] = React.useState<string | null>(null);

  return (
    <>
      <HomeCard title={t('orgs.recentActivity.title')} subtitle={t('orgs.recentActivity.subtitle')}>
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
                            participation.isValid ? 'bg-green-500' : 'bg-red-500',
                            'flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-white',
                          )}
                        >
                          <TrophyIcon className="h-5 w-5 text-white" aria-hidden="true" />
                        </span>
                      </div>
                      <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                        <div>
                          <p className="text-sm text-gray-500">
                            <a
                              href={`/challenges/${participation.challengeId}`}
                              className="font-medium text-gray-900"
                            >
                              {participation.challengeName}
                            </a>
                            {t('orgs.recentActivity.by')}
                            <button
                              onClick={() => setActivePlayerId(participation.playerDataId)}
                              className="font-medium"
                            >
                              @{participation.playerUsername}
                            </button>
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

      <PlayerDetailsSlideOver
        playerId={activePlayerId}
        open={activePlayerId !== null}
        setOpen={() => setActivePlayerId(null)}
      />
    </>
  );
};
