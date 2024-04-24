import { WebSocketServer } from "ws";
import chokidar from "chokidar";

import { handleMonacoWebSocketEvents } from "./_utils/monacoHandler";
import { handleShellCreation } from "./_utils/handleShellCreation";
import { handleContainerCreate } from "./_utils/handleContainerCreate";

const wsForMonaco = new WebSocketServer({
  noServer: true,
});

const wsForShell = new WebSocketServer({
  noServer: true,
});

export async function GET(
  request: Request,
  { params: { playgroundId } }: { params: { playgroundId: string } }
) {
  wsForMonaco.on("connection", (ws, req) => {
    if (playgroundId) {
      const watcher = chokidar.watch(
        `${__dirname}/playgrounds/${playgroundId}/`,
        {
          persistent: true,
          ignoreInitial: true,
          ignored: (path) => path.includes("node_modules"),
          awaitWriteFinish: { stabilityThreshold: 2000 },
        }
      );
      watcher.on("all", (event, path) => {
        if (event !== "change") {
          const message = {
            type: "validateFolderStructure",
            payload: {
              data: null,
              path: null,
            },
          };
          ws.send(JSON.stringify(message));
        }
      });
      ws.on("message", (message) => {
        const finalMessage = JSON.parse(message.toString());
        handleMonacoWebSocketEvents(
          ws,
          finalMessage.type,
          finalMessage.payload.data,
          finalMessage.payload.path
        );
      });
      ws.on("close", async () => {
        await watcher.close();
        console.log("Connection Closed for monaco");
      });
    }
  });

  wsForShell.on("connection", (ws, req, container) => {
    handleShellCreation(container, ws);
    ws.on("close", () => {
      container.remove({ force: true }, (err, data) => {
        if (err) console.log(err);
        else console.log(`Killed container ${container.id} with no error`);
      });
    });
  });

  // server.on("upgrade", (req, socket, head) => {
  //   const isShell = req.url.includes("/shell");

  //   if (!isShell) {
  //     wsForMonaco.handleUpgrade(req, socket, head, (ws) => {
  //       wsForMonaco.emit("connection", ws, req);
  //     });
  //   } else {
  //     handleContainerCreate(playgroundId, wsForShell, req, socket, head);
  //   }
  // });
}
