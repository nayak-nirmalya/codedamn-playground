import { create } from "zustand";

export interface WebsocketStore {
  ws: WebSocket | null;
  setWs: (ws: WebSocket) => void;
}

export const websocketStore = create<WebsocketStore>()((set) => ({
  ws: null,
  setWs: (ws) => set({ ws: ws }),
}));
