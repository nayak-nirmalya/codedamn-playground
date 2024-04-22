import { create } from "zustand";

export interface FolderStructure {
  path: string;
  name: string;
  children: FolderStructure[];
}

export interface FolderStructureStore {
  folderStructure: FolderStructure | null;
  setFolderStructure: (playgroundId: string) => void;
}

export const folderStructureStore = create<FolderStructureStore>()(
  (set) => ({
    folderStructure: null,
    setFolderStructure: async (playgroundId) => {
      const response = await fetch(`/api/tree/${playgroundId}`);
      set({ folderStructure: await response.json() });
    },
  })
);
