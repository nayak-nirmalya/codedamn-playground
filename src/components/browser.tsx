import React, { useEffect, useRef } from "react";
import { RotateCw } from "lucide-react";

import { portStore } from "@/store/port";
import { shellSocketStore } from "@/store/shell-socket";
import { websocketStore } from "@/store/websocket";

export const Browser = ({ playgroundId }: { playgroundId: string }) => {
  const port = portStore((state) => state.port);
  const wsForShell = shellSocketStore((state) => state.wsForShell);
  const ws = websocketStore((state) => state.ws);

  const browser = useRef<HTMLIFrameElement>(null);
  const inputRef = useRef(null);

  const handleRefresh = () => {
    if (browser.current) browser.current.src = browser.current.src;
  };

  // useEffect(() => {
  //   if (port && inputRef.current)
  //     //@ts-ignore:disable-next-line
  //     inputRef.current.input.style.color = "white";
  // }, [port]);

  if (wsForShell) {
    const message = {
      type: "registerPort",
      payload: {
        data: playgroundId,
      },
    };
    ws?.send(JSON.stringify(message));
  }

  return port ? (
    <div style={{ backgroundColor: "#22212c" }}>
      <input
        ref={inputRef}
        // bordered={false}
        // prefix={<RotateCw onClick={handleRefresh} />}
        defaultValue={`http://localhost:${port}`}
        style={{
          width: "100%",
          backgroundColor: "#282a36",
          color: "white",
          height: "30px",
          fontFamily: "Ubuntu Mono, monospace",
        }}
      />
      <iframe
        frameBorder={0}
        ref={browser}
        src={`http://localhost:${port}`}
        style={{ width: "100%", height: "97vh" }}
      />
    </div>
  ) : (
    <h3>Loading...</h3>
  );
};
