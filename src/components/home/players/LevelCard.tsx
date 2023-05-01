import { useTranslation } from 'next-i18next';

import { PlayerLevel } from '@/components/common';
import { HomeCard } from '@/components/home/HomeCard';
import { AchievementCardSmall } from '@/components/users';
import { trpc } from '@/utils/trpc';

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
      <div className="py-4">
        {!isLoading && !isError && (
          <>
            <PlayerLevel points={points ?? 0} className="col-span-2 w-full" />

            {achievements.length > 0 && (
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
          </>
        )}
      </div>
    </HomeCard>
  );
};
