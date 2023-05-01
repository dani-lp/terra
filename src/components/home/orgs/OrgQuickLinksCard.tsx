import { useTranslation } from 'next-i18next';

import { HomeCard } from '@/components/home/HomeCard';

export const OrgQuickLinksCard = () => {
  const { t } = useTranslation('home');

  return (
    <HomeCard title={t('orgs.quickLinks.title')} subtitle={t('orgs.quickLinks.subtitle')}>
      Placeholder
    </HomeCard>
  );
};
