import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import db from "@/db/drizzle";
import { project } from "@/db/schema";

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { name } = await req.json();

    if (!name)
      return new NextResponse("Name not provided", { status: 400 });

    const newProject = await db
      .insert(project)
      .values({
        userId: userId,
        projectName: name,
        playground: "Next.js",
        status: "QUEUE",
      })
      .returning();

    return NextResponse.json({ data: newProject[0] });
  } catch (error) {
    console.error("[PLAYGROUND_POST", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
