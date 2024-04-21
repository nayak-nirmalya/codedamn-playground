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
        <a href="/api/aws">Run Task</a>
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
