import React from "react";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";

import db from "@/db/drizzle";
import { project } from "@/db/schema";

import PlaygroundPage from "./_component/playground";

export default async function PlaygroundIDPage({
  params: { playgroundId },
}: {
  params: { playgroundId: string };
}) {
  const { userId } = auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    await db.query.project.findFirst({
      where: and(eq(project.id, playgroundId), eq(project.userId, userId)),
    });
  } catch (error) {
    notFound();
  }

  return <PlaygroundPage playgroundId={playgroundId} />;
}
