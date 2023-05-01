import { HomeCard } from '@/components/home/HomeCard';
import { useTranslation } from 'next-i18next';

export const RecentActivityCard = () => {
  const { t } = useTranslation('home');

  return (
    <HomeCard title={t('orgs.recentActivity.title')} subtitle={t('orgs.recentActivity.subtitle')}>
      Placeholder
    </HomeCard>
  );
};
