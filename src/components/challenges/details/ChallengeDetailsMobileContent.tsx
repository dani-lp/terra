import { InformationCircleIcon, TrophyIcon } from '@heroicons/react/20/solid';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';

import { LeaderBoardList } from '@/components/challenges/details/';
import { Skeleton } from '@/components/common/skeleton';
import { classNames } from '@/const';
import type { Challenge } from '@prisma/client';

type Props = {
  challengeId: string;
  challenge: Challenge | undefined;
  loading: boolean;
};

const tabs = [
  {
    key: 'leaderboard',
    icon: TrophyIcon,
  },
  {
    key: 'overview',
    icon: InformationCircleIcon,
  },
] as const;

export const ChallengeDetailsMobileContent = ({ challengeId, challenge, loading }: Props) => {
  const { t } = useTranslation('challenges');
  const [selectedTab, setSelectedTab] = useState<typeof tabs[number]['key']>(tabs[0].key);

  return (
    <div className="w-full px-3 md:hidden">
      <div className="mb-2 border-b border-gray-200">
        <nav className="flex justify-around" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={classNames(
                tab.key === selectedTab
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                'group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium',
              )}
              onClick={() => setSelectedTab(tab.key)}
              aria-current={tab.key === selectedTab ? 'true' : 'false'}
            >
              <tab.icon
                className={classNames(
                  tab.key === selectedTab
                    ? 'text-black'
                    : 'text-gray-400 group-hover:text-gray-500',
                  '-ml-0.5 mr-2 h-5 w-5',
                )}
                aria-hidden="true"
              />
              <span>{t(`challenges.details.tabs.${tab.key}`)}</span>
            </button>
          ))}
        </nav>
      </div>

      {selectedTab === 'overview' && (
        <>
          {loading ? (
            <Skeleton className="h-48" />
          ) : (
            <p className="text-sm sm:text-base">{challenge?.description ?? ''}</p>
          )}
        </>
      )}

      {selectedTab === 'leaderboard' && (
        <LeaderBoardList challengeId={challengeId} loading={loading} />
      )}
    </div>
  );
};
