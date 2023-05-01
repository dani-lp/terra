import { useTranslation } from 'next-i18next';

import { PlayerLevel } from '@/components/common';
import { Skeleton } from '@/components/common/skeleton';
import { HomeCard } from '@/components/home/HomeCard';
import { AchievementCardSmall } from '@/components/users';
import { trpc } from '@/utils/trpc';
import { BoltIcon } from '@heroicons/react/20/solid';

export const LevelCard = () => {
  const { t } = useTranslation('home');
  const {
    data: achievementsData,
    isLoading: isAchievementsLoading,
    isError: isAchievementsError,
    error: achievementsError,
  } = trpc.achievements.getSelf.useQuery();
  const {
    data: points,
    isLoading: isPointsLoading,
    isError: isPointsError,
    error: pointsError,
  } = trpc.user.getSelfPoints.useQuery();

  const isLoading = isAchievementsLoading || isPointsLoading;
  const isError = isAchievementsError || isPointsError;

  if (isError) {
    if (isAchievementsError) {
      console.error(achievementsError);
    }
    if (isPointsError) {
      console.error(pointsError);
    }
  }

  const achievements = (achievementsData ?? []).slice(0, 3);

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
              <h6 className="mb-1 font-semibold leading-6 text-gray-900">
                {t('players.level.achievements')}
              </h6>
              <li className="grid grid-cols-1 gap-2 py-2">
                {achievements.map((achievement) => (
                  <AchievementCardSmall
                    key={`${achievement.tag}-${achievement.tier}`}
                    tag={achievement.tag}
                    tier={achievement.tier}
                    entries={achievement.entries}
                    noShadow
                  />
                ))}
              </li>
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
