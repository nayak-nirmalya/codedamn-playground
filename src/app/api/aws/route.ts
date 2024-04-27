import { ECSClient, RunTaskCommand } from "@aws-sdk/client-ecs";
import {
  S3Client,
  CreateBucketCommand,
  DeleteBucketCommand,
} from "@aws-sdk/client-s3";
import { auth } from "@clerk/nextjs/server";

import db from "@/db/drizzle";
import { user, project } from "@/db/schema";

export async function GET() {
  const { userId } = auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const s3Client = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  const projectRes = await db
    .insert(project)
    .values({
      userId: userId,
      projectName: "test",
      playground: "Node",
      status: "QUEUE",
    })
    .returning();

  const bucketName = projectRes[0].id;

  try {
    await s3Client.send(
      new CreateBucketCommand({
        Bucket: bucketName,
      })
    );
    console.log("Bucket Created!");
  } catch (error: any) {
    if (error["$metadata"].httpStatusCode === 409) {
      console.log("Bucket has been created already");
    }
  }

  await s3Client.send(new DeleteBucketCommand({ Bucket: bucketName }));
  console.log("Bucket Deleted!");

  const ecsClient = new ECSClient({
    region: process.env.AWS_REGION!,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });
  const command = new RunTaskCommand({
    cluster: process.env.AWS_CLUSTER_ARN,
    taskDefinition: process.env.AWS_TASK_ARN,
    launchType: "FARGATE",
    count: 1,
    networkConfiguration: {
      awsvpcConfiguration: {
        assignPublicIp: "ENABLED",
        subnets: [
          process.env.AWS_SUBNET_1!,
          process.env.AWS_SUBNET_2!,
          process.env.AWS_SUBNET_3!,
        ],
        securityGroups: [process.env.AWS_SG!],
      },
    },
  });
  await ecsClient.send(command);

  return Response.json({ data: "Success", status: "QUEUED" });
}
