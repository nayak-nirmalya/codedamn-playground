"use client";

import React from "react";

import { EditorComponent } from "@/components/editor";

import { activeTabStore } from "@/store/active-tab";
import { websocketStore } from "@/store/websocket";
import { portStore } from "@/store/port";
import { createFileOrFolderStore } from "@/store/create-file-or-folder";
import { folderStructureStore } from "@/store/folder-structure";
import { Shell } from "@/components/shell";

export default function PlaygroundIdPage({
  params: { playgroundId },
}: {
  params: { playgroundId: string };
}) {
  const setActiveTab = activeTabStore((state) => state.setActiveTab);
  const setWs = websocketStore((state) => state.setWs);
  const setPort = portStore((state) => state.setPort);
  const setPath = createFileOrFolderStore((state) => state.setPath);
  const setIsFile = createFileOrFolderStore((state) => state.setIsFile);
  const setFolderStructure = folderStructureStore(
    (state) => state.setFolderStructure
  );

  if (playgroundId) setFolderStructure(playgroundId);

  const ws = new WebSocket(
    "ws://localhost:3000/?playgroundId=" + playgroundId
  );

  ws.onopen = () => {
    setWs(ws);
    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      switch (data.type) {
        case "readFile":
          const payload = data.payload.data;
          const path = data.payload.path;
          setActiveTab(path, undefined, payload);
          break;
        case "registerPort":
          const port = data.payload.port;
          setPort(port);
          break;
        case "validateFolderStructure":
          if (playgroundId) setFolderStructure(playgroundId);
          setPath(null);
          setIsFile(-1);
          break;
      }
    };
  };

  return (
    ws && (
      <>
        <EditorComponent />
        <Shell playgroundId="99dc20f9-64d4-4330-b5c1-4bb0ed1b3e99" />
      </>
    )
  );
}
