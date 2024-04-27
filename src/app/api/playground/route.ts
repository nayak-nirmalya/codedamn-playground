import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { S3Client, CreateBucketCommand } from "@aws-sdk/client-s3";
import { S3SyncClient } from "s3-sync-client";

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

    const projectCreated = newProject[0];

    const bucketName = projectCreated.id;

    const s3Client = new S3Client({
      region: process.env.AWS_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
    const { sync } = new S3SyncClient({ client: s3Client });

    try {
      await s3Client.send(
        new CreateBucketCommand({
          Bucket: bucketName,
        })
      );

      await sync("s3://react-vite-base", `s3://${bucketName}`);
    } catch (error: any) {
      if (error["$metadata"].httpStatusCode === 409) {
        console.error("Bucket has been created already");
      }
    }

    return NextResponse.json({ data: projectCreated });
  } catch (error) {
    console.error("[PLAYGROUND_POST", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
