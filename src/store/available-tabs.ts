import { create } from "zustand";

export interface AvailableTabs {
  [key: string]: boolean;
}

export interface AvailableTabsStore {
  availableTabs: AvailableTabs;
  addOrUpdateAvailableTabs: (path: string) => void;
}

export const availableTabsStore = create<AvailableTabsStore>()(
  (set, get) => ({
    availableTabs: {},
    addOrUpdateAvailableTabs: (path) => {
      const availableTabs = get().availableTabs;
      Object.keys(availableTabs).forEach((key) => {
        availableTabs[key] = false;
      });
      const newState = { ...availableTabs, [path]: true };
      set({ availableTabs: newState });
    },
  })
);
