import { useTranslation } from 'next-i18next';

import { PlayerLevel } from '@/components/common';
import { Skeleton } from '@/components/common/skeleton';
import { HomeCard } from '@/components/home/HomeCard';
import { AchievementCardSmall } from '@/components/users';
import type { AchievementTier } from '@/types';
import { BoltIcon } from '@heroicons/react/20/solid';
import type { ChallengeTag } from '@prisma/client';

type DisplayAchievement = {
  tag: ChallengeTag;
  entries: number;
  tier: AchievementTier;
};

type Props = {
  achievements: DisplayAchievement[];
  points: number;
  isLoading: boolean;
  isError: boolean;
};

export const LevelCard = ({ achievements, points, isLoading, isError }: Props) => {
  const { t } = useTranslation('home');

  return (
    <HomeCard title={t('players.level.title')} subtitle={t('players.level.subtitle')}>
      {!isError && (
        <>
          {isLoading && (
            <div className="flex gap-3">
              <span className="inline-flex rounded-lg bg-purple-100 p-3 text-purple-700 ring-4 ring-white">
                <BoltIcon className="h-6 w-6" aria-hidden="true" />
              </span>
              <div className="flex w-full flex-col items-start justify-center gap-2">
                <Skeleton className="h-5 w-14" />
                <Skeleton className="h-3" widthFull />
              </div>
            </div>
          )}
          {!isLoading && <PlayerLevel points={points ?? 0} className="col-span-2 w-full" />}

          {isLoading && (
            <div className="mt-4 flex flex-col items-center justify-center gap-2">
              <Skeleton className="h-12" widthFull />
              <Skeleton className="h-12" widthFull />
            </div>
          )}
          {!isLoading && achievements.length > 0 && (
            <div className="col-span-3 mt-4">
              <h4 className="mb-1 font-semibold leading-6 text-gray-900">
                {t('players.level.achievements')}
              </h4>
              <ul className="grid grid-cols-1 gap-2 py-2">
                {achievements.map((achievement) => (
                  <AchievementCardSmall
                    key={`${achievement.tag}-${achievement.tier}`}
                    tag={achievement.tag}
                    tier={achievement.tier}
                    entries={achievement.entries}
                    noShadow
                  />
                ))}
              </ul>
            </div>
          )}
          {!isLoading && achievements.length === 0 && (
            <p className="mt-2 w-full py-10 text-center">{t('players.level.noAchievements')}</p>
          )}
        </>
      )}
    </HomeCard>
  );
};
