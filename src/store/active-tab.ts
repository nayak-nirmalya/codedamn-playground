import { create } from "zustand";

export interface ActiveTabStore {
  activeTab: {
    path: string | undefined;
    extension: string | undefined;
    value: string;
  } | null;
  setActiveTab: (
    path: string,
    extension: string | undefined,
    value: string
  ) => void;
}

export const activeTabStore = create<ActiveTabStore>()((set) => ({
  activeTab: null,
  setActiveTab: (path, extension, value) =>
    set({ activeTab: { path: path, extension: extension, value: value } }),
}));
