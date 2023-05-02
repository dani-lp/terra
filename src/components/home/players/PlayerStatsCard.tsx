import { Skeleton } from '@/components/common/skeleton';
import { HomeCard } from '@/components/home/HomeCard';
import { useTranslation } from 'next-i18next';

type Props = {
  participationsThisMonth: number;
  enrolledChallengesCount: number;
  isLoading: boolean;
  isError: boolean;
};

export const PlayerStatsCard = ({
  participationsThisMonth,
  enrolledChallengesCount,
  isLoading,
  isError,
}: Props) => {
  const { t } = useTranslation('home');

  const stats = [
    {
      name: t('players.stats.participationsThisMonth'),
      stat: participationsThisMonth ?? (isError ? '<error>' : 0),
    },
    {
      name: t('players.stats.enrolledChallenges'),
      stat: enrolledChallengesCount ?? (isError ? '<error>' : 0),
    },
  ];

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
