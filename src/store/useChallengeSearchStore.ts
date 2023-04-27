import type { SelectOption } from '@/components/common';
import type { ChallengeTag } from '@prisma/client';
import { create } from 'zustand';

export const statusOptions: Readonly<SelectOption[]> = [
  { id: 'all', label: 'All' },
  { id: 'open', label: 'Open' },
  { id: 'ended', label: 'Ended' },
] as const;

interface ChallengeSearchStore {
  playerNumber: number | '';
  status: SelectOption;
  searchString: string;
  tags: ChallengeTag[];
  actions: {
    clearFilters: () => void;
    setPlayerNumber: (playerNumber: number | '') => void;
    setStatus: (status: SelectOption) => void;
    setSearchString: (searchString: string) => void;
    setTags: (tags: ChallengeTag[]) => void;
  };
}

const useChallengeSearchStore = create<ChallengeSearchStore>((set) => ({
  playerNumber: '',
  status: statusOptions[0] as SelectOption,
  searchString: '',
  tags: [],
  actions: {
    clearFilters: () =>
      set(() => ({
        playerNumber: '',
        searchString: '',
        status: statusOptions[0],
        tags: [], 
      })),
    setPlayerNumber: (playerNumber: number | '') => set(() => ({ playerNumber })),
    setStatus: (status: SelectOption) => set(() => ({ status })),
    setSearchString: (searchString: string) => set(() => ({ searchString })),
    setTags: (tags: ChallengeTag[]) => set(() => ({ tags })),
  },
}));

export const useChallengeSearchPlayerNumber = () =>
  useChallengeSearchStore((state) => state.playerNumber);
export const useChallengeSearchStatus = () => useChallengeSearchStore((state) => state.status);
export const useChallengeSearch = () => useChallengeSearchStore((state) => state.searchString);
export const useChallengeSearchTags = () => useChallengeSearchStore((state) => state.tags);
export const useChallengeSearchActions = () => useChallengeSearchStore((state) => state.actions);
