import { useTranslation } from 'next-i18next';

import { HomeCard } from '@/components/home/HomeCard';

export const OrgStatsCard = () => {
  const { t } = useTranslation('home');

  return (
    <HomeCard title={t('orgs.stats.title')} subtitle={t('orgs.stats.subtitle')}>
      Placeholder
    </HomeCard>
  );
};
