import React from "react";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

import db from "@/db/drizzle";
import { user } from "@/db/schema";

import { Playground } from "./_component/playground";

export default async function DashboardPage() {
  const { userId } = auth();

  const playgrounds = await db.query.project.findMany({
    where: eq(user.userId, userId),
  });

  return (
    <>
      <div className="flex flex-row items-center justify-between p-3 bg-slate-700">
        <h1 className="text-white text-lg font-semibold">
          <a href="/">CodeDamn</a>
        </h1>
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>

      <Playground playgrounds={playgrounds} />
    </>
  );
}
