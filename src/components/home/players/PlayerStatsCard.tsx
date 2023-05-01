import { Skeleton } from '@/components/common/skeleton';
import { HomeCard } from '@/components/home/HomeCard';
import { trpc } from '@/utils/trpc';
import { useTranslation } from 'next-i18next';

export const PlayerStatsCard = () => {
  const { t } = useTranslation('home');
  const { data, isLoading, isError, error } = trpc.home.getSelfStats.useQuery();

  const stats = [
    {
      name: t('players.stats.participationsThisMonth'),
      stat: data?.participationsThisMonth ?? (isError ? '<error>' : 0),
    },
    {
      name: t('players.stats.enrolledChallenges'),
      stat: data?.enrolledChallengesCount ?? (isError ? '<error>' : 0),
    },
  ];

  if (error) {
    console.error(error);
  }

  return (
    <HomeCard title={t('players.stats.title')} subtitle={t('players.stats.subtitle')}>
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
