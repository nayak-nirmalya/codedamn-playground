"use client";

import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";

export function EditorComponent() {
  const [theme, setTheme] = useState(null);

  return (
    <Editor
      saveViewState={true}
      height="74vh"
      width="100%"
      // path={activeTab ? activeTab.path : ""}
      defaultLanguage={undefined}
      // defaultValue={
      //   activeTab ? activeTab.value : "Click on a file and start editing"
      // }
      // onChange={handleChange}
      // onMount={(editor, monaco) => {
      //   monaco.editor.defineTheme("dracula", theme);
      //   monaco.editor.setTheme("dracula");
      // }}
      options={{
        // readOnly: activeTab ? false : true,
        fontSize: 14,
        fontFamily: "Droid Sans Mono",
      }}
    />
  );
}
