import { useTranslation } from 'next-i18next';

import {
  LatestActivityCard,
  LevelCard,
  PlayerQuickLinksCard,
  PlayerStatsCard,
} from '@/components/home/players';
import { DataTestIds } from '@/const/dataTestIds';
import { trpc } from '@/utils/trpc';

export const PlayersHomeView = () => {
  const { t } = useTranslation('home');
  const { data, isLoading, isError, error } = trpc.home.getSelfPlayerDetails.useQuery();

  if (isError) {
    console.error(error);
  }

  return (
    <div className="h-full min-h-full p-4" data-cy={DataTestIds.home.postLoginSelector}>
      <div className="mb-4 min-w-0 flex-1">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          {t('players.title')}
        </h2>
      </div>

      <div className="space-y-4 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
        <LevelCard
          points={data?.points ?? 0}
          achievements={data?.achievements ?? []}
          isLoading={isLoading}
          isError={isError}
        />
        <PlayerQuickLinksCard />
        <PlayerStatsCard
          enrolledChallengesCount={data?.enrolledChallengesCount ?? 0}
          participationsThisMonth={data?.participationsThisMonth ?? 0}
          isLoading={isLoading}
          isError={isError}
        />
        <LatestActivityCard
          latestParticipations={data?.latestParticipations ?? []}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
