import { CheckBadgeIcon, TrophyIcon } from '@heroicons/react/20/solid';
import { create } from 'zustand';

export const tabs = [
  {
    key: 'leaderboard',
    icon: TrophyIcon,
  },
  {
    key: 'participations',
    icon: CheckBadgeIcon,
  },
] as const;

type Tab = typeof tabs[number]['key'];

type ChallengeTabStore = {
  selectedTab: Tab;
  actions: {
    setSelectedTab: (tab: Tab) => void;
  };
};

const challengeTabStore = create<ChallengeTabStore>((set) => ({
  selectedTab: 'leaderboard',
  actions: {
    setSelectedTab: (tab) => set({ selectedTab: tab }),
  },
}));

export const useSelectedTab = () => challengeTabStore((state) => state.selectedTab);
export const useChallengeTabStoreActions = () => challengeTabStore((state) => state.actions);
