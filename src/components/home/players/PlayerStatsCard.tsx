import { HomeCard } from '@/components/home/HomeCard';
import { useTranslation } from 'next-i18next';

export const PlayerStatsCard = () => {
  const { t } = useTranslation('home');

  return (
    <HomeCard title={t('players.stats.title')} subtitle={t('players.stats.subtitle')}>
      test
    </HomeCard>
  );
};
