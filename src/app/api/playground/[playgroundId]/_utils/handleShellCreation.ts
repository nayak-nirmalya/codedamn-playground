import { processOutput } from "./processOutput";

export const handleShellCreation = (container, ws) => {
  container.exec(
    {
      Cmd: ["/bin/bash"],
      AttachStdin: true,
      AttachStdout: true,
      AttachStderr: true,
      Tty: true,
      User: "codefiddle",
    },
    (err, exec) => {
      exec.start(
        {
          stdin: false,
          hijack: true,
        },
        (err, stream) => {
          processOutput(stream, ws);
          ws.on("message", (message) => {
            stream.write(message);
          });
        }
      );
    }
  );
};
