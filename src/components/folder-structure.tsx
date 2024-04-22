import React, { Dispatch, useState } from "react";
import { ChevronUp, ChevronDown, File } from "lucide-react";

import {
  FolderStructure,
  folderStructureStore,
} from "@/store/folder-structure";
import { availableTabsStore } from "@/store/available-tabs";
import { websocketStore } from "@/store/websocket";

import { IconPack } from "@/assets/icon-pack";

import { ContextForFiles } from "./file-context";
import { ContextForFolders } from "./folder-context";

export interface VisibleState {
  [key: string]: boolean;
}

export interface TreeProps {
  data: FolderStructure;
  ws: WebSocket;
  addOrUpdateAvailableTabs: (path: string) => void;
  setX: Dispatch<number>;
  setY: Dispatch<number>;
  setContextForFileOpen: Dispatch<boolean>;
  setContextForFolderOpen: Dispatch<boolean>;
  setPath: Dispatch<string>;
}

const Tree = ({
  data,
  ws,
  addOrUpdateAvailableTabs,
  setX,
  setY,
  setContextForFileOpen,
  setContextForFolderOpen,
  setPath,
}: TreeProps) => {
  const [visible, setVisible] = useState<VisibleState>({});

  const toggleVisibility = (name: string) => {
    setVisible({ ...visible, [name]: !visible[name] });
  };

  const handleDoubleClick = (path: string) => {
    const readFileRequest = {
      type: "readFile",
      payload: {
        path: path,
        data: null,
      },
    };
    addOrUpdateAvailableTabs(path);
    ws.send(JSON.stringify(readFileRequest));
  };

  const handleContextForFolders = (
    e: React.MouseEvent<HTMLButtonElement>,
    path: string
  ) => {
    e.preventDefault();
    setContextForFolderOpen(true);
    setX(e.clientX);
    setY(e.clientY);
    setPath(path);
  };

  const handleContextForFiles = (
    e: React.MouseEvent<HTMLParagraphElement>,
    path: string
  ) => {
    e.preventDefault();
    setContextForFileOpen(true);
    setX(e.clientX);
    setY(e.clientY);
    setPath(path);
  };

  return (
    <div style={{ paddingLeft: "10px", color: "white" }}>
      {data.children ? (
        <button
          onContextMenu={(e) => handleContextForFolders(e, data.path)}
          onClick={() => toggleVisibility(data.name)}
          style={{
            paddingTop: "6px",
            fontSize: "15px",
            backgroundColor: "transparent",
            color: "white",
            outline: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          {visible[data.name] ? (
            <ChevronUp className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          )}
          &nbsp;
          {data.name}
        </button>
      ) : (
        <div style={{ display: "flex", alignItems: "center" }}>
          {IconPack.hasOwnProperty(data.name.split(".").pop()!) ? (
            IconPack[data.name.split(".").pop()!]
          ) : (
            <File
              color="gray"
              display="block"
              style={{ marginTop: "7px" }}
            />
          )}
          <p
            onContextMenu={(e) => handleContextForFiles(e, data.path)}
            onDoubleClick={() => handleDoubleClick(data.path)}
            style={{
              fontSize: "15px",
              cursor: "pointer",
              marginLeft: "5px",
              paddingTop: "6px",
            }}
          >
            {data.name}
          </p>
        </div>
      )}
      {visible[data.name] &&
        data.children &&
        data.children.map((child) => (
          <Tree
            key={child.name}
            data={child}
            ws={ws}
            addOrUpdateAvailableTabs={addOrUpdateAvailableTabs}
            setX={setX}
            setY={setY}
            setContextForFileOpen={setContextForFileOpen}
            setContextForFolderOpen={setContextForFolderOpen}
            setPath={setPath}
          />
        ))}
    </div>
  );
};

export const FolderStructureComponent = () => {
  const folderStructure = folderStructureStore(
    (state) => state.folderStructure
  );
  const addOrUpdateAvailableTabs = availableTabsStore(
    (state) => state.addOrUpdateAvailableTabs
  );

  const [x, setX] = useState<number | null>(null);
  const [y, setY] = useState<number | null>(null);
  const [contextForFolderOpen, setContextForFolderOpen] = useState(false);
  const [contextForFileOpen, setContextForFileOpen] = useState(false);
  const [path, setPath] = useState<string>("");

  const ws = websocketStore((state) => state.ws);

  return (
    <>
      {contextForFileOpen && x && y && (
        <ContextForFiles
          x={x}
          y={y}
          setOpen={setContextForFileOpen}
          path={path}
        />
      )}
      {contextForFolderOpen && x && y && (
        <ContextForFolders
          x={x}
          y={y}
          setOpen={setContextForFolderOpen}
          path={path}
        />
      )}
      {folderStructure && (
        <Tree
          data={folderStructure}
          ws={ws!}
          addOrUpdateAvailableTabs={addOrUpdateAvailableTabs}
          setX={setX}
          setY={setY}
          setContextForFileOpen={setContextForFileOpen}
          setContextForFolderOpen={setContextForFolderOpen}
          setPath={setPath}
        />
      )}
    </>
  );
};