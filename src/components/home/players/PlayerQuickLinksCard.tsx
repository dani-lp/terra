import { HomeCard } from '@/components/home/HomeCard';
import { useTranslation } from 'next-i18next';

export const PlayerQuickLinksCard = () => {
  const { t } = useTranslation('home');

  return (
    <HomeCard title={t('players.quickLinks.title')} subtitle={t('players.quickLinks.subtitle')}>
      test
    </HomeCard>
  );
};
