import { LeaderBoardListRow } from '@/components/challenges/details/';
import { classNames } from '@/const';
import { InformationCircleIcon, TrophyIcon } from '@heroicons/react/20/solid';
import type { Challenge } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

type Props = {
  challenge: Challenge;
};

// TODO use translation keys
const tabs = [
  {
    name: 'Overview',
    icon: InformationCircleIcon,
  },
  {
    name: 'Leaderboard',
    icon: TrophyIcon,
  },
] as const;

export const ChallengeDetailsMobileContent = ({ challenge }: Props) => {
  const { data: session } = useSession();
  const [selectedTab, setSelectedTab] = useState<typeof tabs[number]['name']>(tabs[0].name);

  // TODO use actual values/query
  const tempLeaderboardContent = [
    { name: 'John Smith', username: 'jsmith', score: 75, image: session?.user?.image },
    { name: 'Emily Davis', username: 'edavis', score: 92, image: session?.user?.image },
    { name: 'Tom Johnson', username: 'tjohnson', score: 81, image: session?.user?.image },
    { name: 'Sarah Lee', username: 'slee', score: 67, image: session?.user?.image },
  ];
  tempLeaderboardContent.sort((a, b) => b.score - a.score);

  return (
    <div className="w-full px-3">
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
        <p className="text-sm sm:text-base">{challenge.description}</p>
      )}
      {selectedTab === 'Leaderboard' && (
        <ol className="flex flex-col gap-1">
          {tempLeaderboardContent.map((user, index) => (
            <LeaderBoardListRow
              key={user.username}
              position={index + 1}
              image={user.image ?? ''}
              name={user.name}
              username={user.username}
              score={user.score}
            />
          ))}
        </ol>
      )}
    </div>
  );
};
