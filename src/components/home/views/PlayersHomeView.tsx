import { useTranslation } from 'next-i18next';

import {
  LatestActivityCard,
  LevelCard,
  PlayerQuickLinksCard,
  PlayerStatsCard,
} from '@/components/home/players';

export const PlayersHomeView = () => {
  const { t } = useTranslation('home');

  return (
    <div className="h-full min-h-full py-4">
      <div className="mb-4 min-w-0 flex-1">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          {t('players.title')}
        </h2>
      </div>

      <div className="divide-y sm:grid sm:grid-cols-2 sm:gap-4 sm:divide-y-0">
        <LevelCard />
        <PlayerQuickLinksCard />
        <PlayerStatsCard />
        <LatestActivityCard />
      </div>
    </div>
  );
};
