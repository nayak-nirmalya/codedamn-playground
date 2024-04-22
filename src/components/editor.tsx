"use client";

import React from "react";
import { Editor } from "@monaco-editor/react";
import { useClerk } from "@clerk/nextjs";

import dracula from "@/assets/dracula.json";

import { activeTabStore } from "@/store/active-tab";
import { websocketStore } from "@/store/websocket";

export function EditorComponent() {
  const clerk = useClerk();
  const activeTab = activeTabStore((state) => state.activeTab);
  const ws = websocketStore((state) => state.ws);

  let eventToEmit: number | null = null;

  const handleChange = (value: string | undefined, e: any) => {
    if (eventToEmit !== null) clearTimeout(eventToEmit);
    eventToEmit = setTimeout(() => {
      const writeFile = {
        type: "writeFile",
        payload: {
          data: value,
          path: activeTab?.path,
        },
      };
      ws?.send(JSON.stringify(writeFile));
    }, 2000);
  };

  return (
    <>
      {clerk.loaded && (
        <Editor
          saveViewState={true}
          height="74vh"
          width="100%"
          path={activeTab ? activeTab.path : ""}
          defaultLanguage={undefined}
          defaultValue={
            activeTab
              ? activeTab.value
              : "Click on a file and start editing"
          }
          onChange={handleChange}
          onMount={(_editor, monaco) => {
            monaco.editor.defineTheme(
              "dracula",
              dracula as unknown as any
            );
            monaco.editor.setTheme("dracula");
          }}
          options={{
            readOnly: activeTab ? false : true,
            fontSize: 14,
            fontFamily: "Droid Sans Mono",
          }}
        />
      )}
    </>
  );
}
