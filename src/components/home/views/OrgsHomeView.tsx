import { useTranslation } from 'next-i18next';

import {
  OrgInfoCard,
  OrgQuickLinksCard,
  OrgStatsCard,
  RecentActivityCard,
} from '@/components/home/orgs';
import { trpc } from '@/utils/trpc';

export const OrgsHomeView = () => {
  const { t } = useTranslation('home');
  const { data, isLoading } = trpc.home.getSelfOrgDetails.useQuery();

  return (
    <div className="h-full min-h-full p-4">
      <div className="mb-4 min-w-0 flex-1">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          {t('orgs.title')}
        </h2>
      </div>

      <div className="space-y-4 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
        <OrgInfoCard
          username={data?.username ?? ''}
          website={data?.website ?? ''}
          country={data?.country ?? ''}
          image={data?.image ?? ''}
          joinedOn={data?.joinedOn ?? new Date()}
          loading={isLoading}
        />
        <OrgQuickLinksCard />
        <OrgStatsCard />
        <RecentActivityCard />
      </div>
    </div>
  );
};
