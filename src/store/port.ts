import { create } from "zustand";

export interface PortStore {
  port: number | null;
  setPort: (port: number) => void;
}

export const portStore = create<PortStore>()((set) => ({
  port: null,
  setPort: (port) => set({ port: port }),
}));
