"use client";

import React from "react";

import { availableTabsStore } from "@/store/available-tabs";

import { EditorButton } from "./editor-button";

export const EditorTabs = () => {
  const availableTabs = availableTabsStore((state) => state.availableTabs);

  return (
    <div
      style={{
        display: "flex",
        paddingTop: "5px",
        paddingBottom: "5px",
        height: "30px",
        borderBottom: "1px solid #1f1f1f",
      }}
    >
      {Object.keys(availableTabs).length > 0 &&
        Object.entries(availableTabs).map((entries) => {
          return (
            <EditorButton
              path={entries[0]}
              isActive={entries[1]}
              key={entries[0]}
            />
          );
        })}
    </div>
  );
};
