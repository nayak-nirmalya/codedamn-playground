import React from "react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs";

export default async function DashboardPage() {
  const user = await currentUser();
  console.log(user);

  return (
    <div>
      <h1>DashboardPage (Protected)</h1>
      <SignedIn>
        <UserButton afterSignOutUrl="/" />
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
