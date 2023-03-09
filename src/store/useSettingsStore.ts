import create from 'zustand';

export type Settings = {
  name: string;
  username: string;
  image: string;
  about: string;
  actions: {
    setName: (name: string) => void;
    setUsername: (username: string) => void;
    setImage: (image: string) => void;
    setAbout: (about: string) => void;
    load: (data: Omit<Settings, 'actions'>) => void;
    clear: () => void;
  };
};

const useSettingsStore = create<Settings>((set) => ({
  name: '',
  username: '',
  image: '',
  about: '',
  actions: {
    setName: (name: string) => set({ name }),
    setUsername: (username: string) => set({ username }),
    setImage: (image: string) => set({ image }),
    setAbout: (about: string) => set({ about }),
    load: (data: Omit<Settings, 'actions'>) => set(data),
    clear: () =>
      set({
        name: '',
        username: '',
        image: '',
        about: '',
      }),
  },
}));

// selectors
// TODO add new selectors as needed
export const useUsername = () => useSettingsStore((state) => state.username);
export const useAbout = () => useSettingsStore((state) => state.about);
export const useSettingsActions = () => useSettingsStore((state) => state.actions);
