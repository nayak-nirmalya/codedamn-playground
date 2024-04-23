import React, { useEffect, useRef, useState } from "react";
import { ChevronUp, ChevronDown, File } from "lucide-react";

import {
  FolderStructure,
  folderStructureStore,
} from "@/store/folder-structure";
import { availableTabsStore } from "@/store/available-tabs";
import { createFileOrFolderStore } from "@/store/create-file-or-folder";
import { websocketStore } from "@/store/websocket";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { IconPack } from "@/assets/icon-pack";

export interface VisibleState {
  [key: string]: boolean;
}

export interface TreeProps {
  data: FolderStructure;
  ws: WebSocket;
  addOrUpdateAvailableTabs: (path: string) => void;
}

const Tree = ({ data, ws, addOrUpdateAvailableTabs }: TreeProps) => {
  const [name, setName] = useState("");
  const [visible, setVisible] = useState<VisibleState>({});
  const [dialogState, setDialogState] = useState<
    | "CREATE_FOLDER"
    | "CREATE_FILE"
    | "DELETE_FOLDER"
    | "RENAME_FOLDER"
    | "NONE"
  >("NONE");

  const fileRef = useRef(null);
  const folderRef = useRef(null);

  const path = createFileOrFolderStore((state) => state.path);
  const isFile = createFileOrFolderStore((state) => state.isFile);

  const setPath = createFileOrFolderStore((state) => state.setPath);
  const setIsFile = createFileOrFolderStore((state) => state.setIsFile);

  const createFile = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    ws?.send(
      JSON.stringify({
        type: "createFile",
        payload: {
          path: path + "/" + name,
          data: null,
        },
      })
    );
    setName("");
    setDialogState("NONE");
  };

  const createFolder = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    ws?.send(
      JSON.stringify({
        type: "createFolder",
        payload: {
          path: path + "/" + name,
          data: null,
        },
      })
    );
    setName("");
    setDialogState("NONE");
  };

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

    setPath(path);
  };

  const handleContextForFiles = (
    e: React.MouseEvent<HTMLParagraphElement>,
    path: string
  ) => {
    e.preventDefault();

    setPath(path);
  };

  useEffect(() => toggleVisibility("code"), []);

  return (
    <Dialog>
      <div style={{ paddingLeft: "10px", color: "white" }}>
        {data.children ? (
          // Folders
          <ContextMenu>
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
              <ContextMenuTrigger>
                <div className="flex flex-row items-center gap-x-2 justify-center">
                  {visible[data.name] ? (
                    <ChevronUp className="h-3 w-3" />
                  ) : (
                    <ChevronDown className="h-3 w-3" />
                  )}
                  {data.name}
                </div>
              </ContextMenuTrigger>
            </button>
            <ContextMenuContent>
              <DialogTrigger asChild>
                <ContextMenuItem
                  onClick={() => setDialogState("CREATE_FOLDER")}
                >
                  Create Folder
                </ContextMenuItem>
              </DialogTrigger>
              <DialogTrigger asChild>
                <ContextMenuItem
                  onClick={() => setDialogState("CREATE_FILE")}
                >
                  Create File
                </ContextMenuItem>
              </DialogTrigger>
              <DialogTrigger asChild>
                <ContextMenuItem
                  onClick={() => setDialogState("RENAME_FOLDER")}
                >
                  Rename Folder
                </ContextMenuItem>
              </DialogTrigger>
              <DialogTrigger asChild>
                <ContextMenuItem
                  onClick={() => setDialogState("DELETE_FOLDER")}
                >
                  Delete Folder
                </ContextMenuItem>
              </DialogTrigger>
            </ContextMenuContent>
          </ContextMenu>
        ) : (
          // Files
          <ContextMenu>
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
                onClick={() => handleDoubleClick(data.path)}
                style={{
                  fontSize: "15px",
                  cursor: "pointer",
                  marginLeft: "5px",
                  paddingTop: "6px",
                }}
              >
                <ContextMenuTrigger>{data.name}</ContextMenuTrigger>
              </p>
            </div>
            <ContextMenuContent>
              <ContextMenuItem>Rename File</ContextMenuItem>
              <ContextMenuItem>Delete File</ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        )}
        {visible[data.name] &&
          data.children &&
          data.children.map((child) => (
            <Tree
              key={child.name}
              data={child}
              ws={ws}
              addOrUpdateAvailableTabs={addOrUpdateAvailableTabs}
            />
          ))}
      </div>
      {dialogState === "CREATE_FOLDER" && (
        <DialogContent className="sm:max-w-md" ref={folderRef}>
          <DialogHeader>
            <DialogTitle>Create folder</DialogTitle>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Input
                id="link"
                placeholder="Enter folder name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-black"
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-end">
            <DialogClose asChild>
              <Button
                type="button"
                variant="default"
                onClick={createFolder}
              >
                Create
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      )}
      {dialogState === "CREATE_FILE" && (
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create file</DialogTitle>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Input
                id="link"
                placeholder="Enter file name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-black"
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-end">
            <DialogClose asChild>
              <Button onClick={createFile} type="button" variant="default">
                Create
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      )}
      {dialogState === "RENAME_FOLDER" && (
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rename folder</DialogTitle>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Input
                id="link"
                defaultValue="https://ui.shadcn.com/docs/installation"
                className="border-black"
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-end">
            <DialogClose asChild>
              <Button type="button" variant="default">
                Rename
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      )}
      {dialogState === "DELETE_FOLDER" && (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Are you sure you want to
              permanently delete this folder?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="submit">Confirm</Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
};

export const FolderStructureComponent = () => {
  const folderStructure = folderStructureStore(
    (state) => state.folderStructure
  );
  const addOrUpdateAvailableTabs = availableTabsStore(
    (state) => state.addOrUpdateAvailableTabs
  );
  const ws = websocketStore((state) => state.ws);

  return (
    <>
      {folderStructure && (
        <Tree
          data={folderStructure}
          ws={ws!}
          addOrUpdateAvailableTabs={addOrUpdateAvailableTabs}
        />
      )}
    </>
  );
};
