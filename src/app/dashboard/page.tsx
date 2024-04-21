import React, { useTransition } from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";

import { runTask } from "@/actions/aws";

export default async function DashboardPage() {
  return (
    <div>
      <h1>DashboardPage (Protected)</h1>
      <SignedIn>
        <UserButton afterSignOutUrl="/" />
        <button className="text-4xl font-bold" onClick={runTask}>
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
