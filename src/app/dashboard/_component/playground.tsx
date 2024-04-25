"use client";

import React, { useState, useTransition } from "react";
import { Delete } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { deleteProject, renameProject } from "@/actions/project";

interface PropsType {
  playground: "Node" | "Next.js" | "Python";
  status: "QUEUE" | "PROGRESS" | "READY" | "FAILED" | "DESTROYED";
  userId: string;
  id: string;
  projectName: string;
  createdAt: Date;
}

export function Playground({
  playgrounds,
}: {
  playgrounds: PropsType[] | null;
}) {
  // TODO: use zod for name validation
  const [name, setName] = useState("");
  const [dialog, setDialog] = useState<
    "CREATE_PLAYGROUND" | "RENAME_PLAYGROUND" | "DELETE_PLAYGROUND"
  >();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string) => {
    startTransition(() => {
      deleteProject(id)
        .then(() => toast.success("Project Deleted!"))
        .catch(() =>
          toast.error("Something went wrong, failed to delete.")
        );
    });
  };

  const handleRename = (id: string) => {
    startTransition(() => {
      renameProject(id, name)
        .then(() => toast.success("Project Renamed!"))
        .catch(() =>
          toast.error("Something went wrong, failed to rename.")
        )
        .finally(() => setName(""));
    });
  };

  const onClick = async () => {
    try {
      const rawResponse = await fetch("/api/playground", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });
      setName("");
      const content = await rawResponse.json();
      if (content.data) {
        toast.success("Playground created!");
      }

      router.push("/playground/" + content.data.id);
    } catch {
      toast.error("Try differnt name for playground");
    }
  };

  return (
    <Dialog>
      <div className="">
        <div className="border border-black m-2 p-2 rounded-lg">
          <h1 className="font-bold text-2xl text-center border-b-2">
            Available Playgrounds
          </h1>
          {/* TODO: show all available playgrounds from db enum. */}
          <div className="flex m-8">
            <DialogTrigger asChild>
              <Button className="items-center justify-center mx-auto h-16">
                Create New Playground
              </Button>
            </DialogTrigger>
          </div>
        </div>
        <div className="border border-blue-700 m-2 p-2 rounded-lg">
          <h1 className="font-bold text-2xl text-center border-b-2">
            Your Playgrounds
          </h1>
          <div className="flex m-8">
            {playgrounds.length > 0 &&
              playgrounds.map((playground) => (
                <div
                  key={playground.id}
                  className="flex flex-row items-center border-2 m-2"
                >
                  <Link
                    href={`/playground/${playground.id}`}
                    className="text-lg font-bold m-2"
                  >
                    {playground.projectName}
                  </Link>
                  {/* TODO: Show Confirmation Dialog */}
                  {/* TODO: Add Rename Button and Dialog */}
                  <Button
                    onClick={() => handleDelete(playground.id)}
                    variant="destructive"
                  >
                    Delete <Delete className="ml-2" />
                  </Button>
                </div>
              ))}
          </div>
        </div>
      </div>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Playground</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Input
              id="pg-name"
              placeholder="Enter playground name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-black"
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="default" onClick={onClick}>
              Create
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
