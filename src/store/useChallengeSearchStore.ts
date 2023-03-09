import type { SelectOption } from '@/components/common';
import create from 'zustand';

export const statusOptions: Readonly<SelectOption[]> = [
  { id: 'all', label: 'All' },
  { id: 'open', label: 'Open' },
  { id: 'ended', label: 'Ended' },
] as const;

interface ChallengeSearchStore {
  playerNumber: number;
  status: SelectOption;
  searchString: string;
  actions: {
    clearFilters: () => void;
    setPlayerNumber: (playerNumber: number) => void;
    setStatus: (status: SelectOption) => void;
    setSearchString: (searchString: string) => void;
  };
}

const useChallengeSearchStore = create<ChallengeSearchStore>((set) => ({
  playerNumber: 0,
  status: statusOptions[0] as SelectOption,
  searchString: '',
  actions: {
    clearFilters: () =>
      set(() => ({
        playerNumber: 0,
        searchString: '',
        status: statusOptions[0],
      })),
    setPlayerNumber: (playerNumber: number) => set(() => ({ playerNumber })),
    setStatus: (status: SelectOption) => set(() => ({ status })),
    setSearchString: (searchString: string) => set(() => ({ searchString })),
  },
}));

export const useChallengeSearchPlayerNumber = () =>
  useChallengeSearchStore((state) => state.playerNumber);
export const useChallengeSearchStatus = () => useChallengeSearchStore((state) => state.status);
export const useChallengeSearch = () => useChallengeSearchStore((state) => state.searchString);
export const useChallengeSearchActions = () => useChallengeSearchStore((state) => state.actions);
