import React, { useTransition } from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs";
import { toast } from "sonner";

import { runTask } from "@/actions/aws";

export default async function DashboardPage() {
  const user = await currentUser();
  const [isPending, startTransition] = useTransition();

  const runTaskButton = () => {
    startTransition(() => {
      runTask()
        .then(() => {
          toast.success("Connection generated");
        })
        .catch(() => toast.error("Connection generation failed"));
    });
  };

  return (
    <div>
      <h1>DashboardPage (Protected)</h1>
      <SignedIn>
        <UserButton afterSignOutUrl="/" />
        <button className="text-4xl font-bold" onClick={runTaskButton}>
          Run Task
        </button>
      </SignedIn>
      <SignedOut>
        <SignInButton
          mode="modal"
          afterSignInUrl="/dashboard"
          afterSignUpUrl="/dashboard"
        />
      </SignedOut>
    </div>
  );
}
