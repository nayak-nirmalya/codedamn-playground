import { create } from "zustand";

export interface CreateFileOrFolderStore {
  path: string | null;
  setPath: (path: string | null) => void;
  isFile: number;
  setIsFile: (isFile: number) => void;
}

export const createFileOrFolderStore = create<CreateFileOrFolderStore>()(
  (set) => ({
    path: null,
    setPath: (path) => set({ path: path }),
    isFile: -1,
    setIsFile: (isFile) => set({ isFile: isFile }),
  })
);
