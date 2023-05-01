import { HomeCard } from '@/components/home/HomeCard';
import { useTranslation } from 'next-i18next';

export const LatestActivityCard = () => {
  const { t } = useTranslation('home');

  return (
    <HomeCard
      title={t('players.latestActivity.title')}
      subtitle={t('players.latestActivity.subtitle')}
    >
      test
    </HomeCard>
  );
};
