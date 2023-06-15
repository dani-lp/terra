import { LeaderBoardList } from '@/components/challenges/details/LeaderBoardList';
import { ParticipationList } from '@/components/challenges/details/ParticipationList';
import {
  tabs,
  useChallengeTabStoreActions,
  useSelectedTab,
} from '@/components/challenges/store/useChallengeTabStore';
import { classNames } from '@/const';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';

type Props = {
  challengeId: string;
  isLoading: boolean;
};

export const ChallengeDetailsDesktopContent = ({ challengeId, isLoading }: Props) => {
  const { t } = useTranslation('challenges');
  const { data: session, status } = useSession();
  const selectedTab = useSelectedTab();
  const { setSelectedTab } = useChallengeTabStoreActions();

  const isSessionLoaded = status !== 'loading';

  const filteredTabs = isSessionLoaded
    ? tabs.filter((tab) => {
        if (tab.key === 'participations') {
          return session?.user?.role !== 'PLAYER';
        }
        return true;
      })
    : [tabs[0]];

  return (
    <div className="hidden rounded-lg bg-white px-4 py-2 shadow md:col-span-1 md:block">
      <nav className="mb-2 flex justify-around" aria-label="Tabs">
        {filteredTabs.map((tab) => (
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
                tab.key === selectedTab ? 'text-black' : 'text-gray-400 group-hover:text-gray-500',
                '-ml-0.5 mr-2 h-5 w-5',
              )}
              aria-hidden="true"
            />
            <span>{t(`challenges.details.tabs.${tab.key}`)}</span>
          </button>
        ))}
      </nav>
      {selectedTab === 'leaderboard' && (
        <LeaderBoardList challengeId={challengeId} loading={isLoading} />
      )}
      {selectedTab === 'participations' && <ParticipationList challengeId={challengeId} />}
    </div>
  );
};
