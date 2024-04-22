import { create } from "zustand";

export interface ShellSocketStore {
  wsForShell: WebSocket | null;
  setWs: (ws: WebSocket) => void;
}

export const shellSocketStore = create<ShellSocketStore>()((set) => ({
  wsForShell: null,
  setWs: (ws) => set({ wsForShell: ws }),
}));
