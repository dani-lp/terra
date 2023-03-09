import create from 'zustand';

export type SidebarStore = {
  sidebarOpen: boolean;
  actions: {
    setSidebarOpen: (isOpen: boolean) => void;
  };
};

const useSidebarStore = create<SidebarStore>((set) => ({
  sidebarOpen: false,
  actions: {
    setSidebarOpen: (isOpen) => set({ sidebarOpen: isOpen }),
  },
}));

// selectors
export const useSidebarOpen = () => useSidebarStore((state) => state.sidebarOpen);
export const useSidebarActions = () => useSidebarStore((state) => state.actions);
