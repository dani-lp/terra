import { LeaderBoardList } from '@/components/challenges/details/';
import { Skeleton } from '@/components/common/skeleton';
import { classNames } from '@/const';
import { InformationCircleIcon, TrophyIcon } from '@heroicons/react/20/solid';
import type { Challenge } from '@prisma/client';
import { useState } from 'react';

type Props = {
  challenge: Challenge | undefined;
  loading: boolean;
};

// TODO use translation keys
const tabs = [
  {
    name: 'Leaderboard',
    icon: TrophyIcon,
  },
  {
    name: 'Overview',
    icon: InformationCircleIcon,
  },
] as const;

export const ChallengeDetailsMobileContent = ({ challenge, loading }: Props) => {
  const [selectedTab, setSelectedTab] = useState<typeof tabs[number]['name']>(tabs[0].name);

  return (
    <div className="w-full px-3 md:hidden">
      <div className="mb-2 border-b border-gray-200">
        <nav className="flex justify-around" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              className={classNames(
                tab.name === selectedTab
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                'group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium',
              )}
              onClick={() => setSelectedTab(tab.name)}
              aria-current={tab.name === selectedTab ? 'true' : 'false'}
            >
              <tab.icon
                className={classNames(
                  tab.name === selectedTab
                    ? 'text-black'
                    : 'text-gray-400 group-hover:text-gray-500',
                  '-ml-0.5 mr-2 h-5 w-5',
                )}
                aria-hidden="true"
              />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {selectedTab === 'Overview' && (
        <>
          {loading ? (
            <Skeleton className="h-48" />
          ) : (
            <p className="text-sm sm:text-base">{challenge?.description ?? ''}</p>
          )}
        </>
      )}

      {selectedTab === 'Leaderboard' && (
        <LeaderBoardList loading={loading} />
      )}
    </div>
  );
};
