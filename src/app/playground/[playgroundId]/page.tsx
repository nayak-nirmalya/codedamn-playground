"use client";

import React from "react";
import dynamic from "next/dynamic";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { EditorComponent } from "@/components/editor";
import { FolderStructureComponent } from "@/components/folder-structure";
import { EditorTabs } from "@/components/editor-tabs";
const DynamicShell = dynamic(
  () => import("@/components/shell").then((mod) => mod.Shell),
  {
    ssr: false,
  }
);

import { activeTabStore } from "@/store/active-tab";
import { websocketStore } from "@/store/websocket";
import { portStore } from "@/store/port";
import { createFileOrFolderStore } from "@/store/create-file-or-folder";
import { folderStructureStore } from "@/store/folder-structure";
import { Browser } from "@/components/browser";

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

  // TODO: change ws address
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
      <ResizablePanelGroup direction="horizontal" className="min-h-screen">
        <ResizablePanel
          className="bg-[#22212c] min-h-screen"
          defaultSize={20}
        >
          <FolderStructureComponent />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={60}>
          <ResizablePanelGroup
            direction="vertical"
            className="bg-[#282a36]"
          >
            <ResizablePanel defaultSize={75}>
              <EditorTabs />
              <EditorComponent />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={25}>
              <DynamicShell playgroundId="99dc20f9-64d4-4330-b5c1-4bb0ed1b3e99" />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={40}>
          <div className="bg-black h-screen">
            <Browser playgroundId={playgroundId} />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    )
  );
}
