"use client";

import React, { useEffect, useRef } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { AttachAddon } from "@xterm/addon-attach";
import "@xterm/xterm/css/xterm.css";

import { shellSocketStore } from "@/store/shell-socket";

export function Shell({ playgroundId }: { playgroundId: string }) {
  const setWs = shellSocketStore((state) => state.setWs);
  const terminal = useRef(null);

  // TODO: change ws address
  const ws = new WebSocket(
    "ws://localhost:3000/shell/?playgroundId=" + playgroundId
  );

  useEffect(() => {
    const term = new Terminal({
      cursorBlink: true,
      convertEol: true,
      theme: {
        background: "#282a36",
        foreground: "#f8f8f2",
        cyan: "#8be9fd",
        green: "#50fa7b",
        yellow: "#f1fa8c",
        red: "#ff5555",
        cursor: "#f8f8f2",
        cursorAccent: "#282a36",
      },
      fontSize: 16,
      fontFamily: "Ubuntu Mono, monospace",
    });

    term.open(terminal.current!);

    let fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    fitAddon.fit();

    ws.onopen = () => {
      const attachAddon = new AttachAddon(ws);
      term.loadAddon(attachAddon);
      setWs(ws);
    };

    return () => {
      term.dispose();
    };
  }, []);

  return (
    <div
      ref={terminal}
      className="terminal overflow-auto h-[23vh]"
      id="terminal-container"
    />
  );
}
