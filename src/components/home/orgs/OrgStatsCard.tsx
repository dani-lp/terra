import { useTranslation } from 'next-i18next';

import { HomeCard } from '@/components/home/HomeCard';
import { Skeleton } from '@/components/common/skeleton';

type Props = {
  activeChallenges: number;
  totalParticipations: number;
  isLoading: boolean;
  isError: boolean;
};

export const OrgStatsCard = ({
  activeChallenges,
  totalParticipations,
  isLoading,
  isError,
}: Props) => {
  const { t } = useTranslation('home');

  const stats = [
    {
      name: t('orgs.stats.activeChallenges'),
      stat: activeChallenges ?? (isError ? '<error>' : 0),
    },
    {
      name: t('orgs.stats.challengeParticipations'),
      stat: totalParticipations ?? (isError ? '<error>' : 0),
    },
  ];

  return (
    <HomeCard title={t('orgs.stats.title')} subtitle={t('orgs.stats.subtitle')}>
      <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {stats.map((item) => (
          <div
            key={item.name}
            className="overflow-hidden rounded-lg border border-gray-200 px-4 py-5 shadow-sm sm:p-6"
          >
            <dt className="truncate text-sm font-medium text-gray-500">{item.name}</dt>
            {isLoading ? (
              <div className="mt-2.5">
                <Skeleton className="h-7 w-16" />
              </div>
            ) : (
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                {item.stat}
              </dd>
            )}
          </div>
        ))}
      </dl>
    </HomeCard>
  );
};
