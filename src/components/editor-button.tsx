"use client";

import React from "react";

import { websocketStore } from "@/store/websocket";
import { availableTabsStore } from "@/store/available-tabs";

export interface EditorButtonComponentProps {
  path: string;
  isActive: boolean;
}

export const EditorButton = ({
  path,
  isActive,
}: EditorButtonComponentProps) => {
  const ws = websocketStore((state) => state.ws);
  const addOrUpdateAvailableTabs = availableTabsStore(
    (state) => state.addOrUpdateAvailableTabs
  );

  const handleClick = () => {
    const message = {
      type: "readFile",
      payload: {
        data: null,
        path: path,
      },
    };
    ws?.send(JSON.stringify(message));
    addOrUpdateAvailableTabs(path);
  };

  return (
    <button
      style={{
        outline: "none",
        minWidth: "100px",
        height: "25px",
        backgroundColor: isActive ? "#282a36" : "#22212c",
        fontSize: "14px",
        borderLeft: "none",
        borderBottom: "none",
        borderRight: "2px solid #191921",
        fontFamily: "Droid Sans Mono, monospace",
        borderTop: isActive ? "1px solid #ff79c6" : "none",
        color: isActive ? "white" : "#6272a4",
        paddingLeft: "5px",
        paddingRight: "5px",
        // marginRight: "5px",
      }}
      disabled={isActive}
      onClick={handleClick}
    >
      {path.replace(/\\/g, "/").split("/").pop()}
    </button>
  );
};
