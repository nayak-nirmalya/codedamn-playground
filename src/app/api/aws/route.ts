import { ECSClient, RunTaskCommand } from "@aws-sdk/client-ecs";
import {
  S3Client,
  PutObjectCommand,
  CreateBucketCommand,
  DeleteObjectCommand,
  DeleteBucketCommand,
  paginateListObjectsV2,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { auth } from "@clerk/nextjs/server";

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

  const bucketName = userId.toLowerCase().replace("_", "-");

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

  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: "randomUUID/",
    })
  );
  console.log("Text File Created!");

  // await s3Client.send(new DeleteBucketCommand({ Bucket: bucketName }));
  // console.log("Bucket Deleted!");

  // const ecsClient = new ECSClient({
  //   region: process.env.AWS_REGION!,
  //   credentials: {
  //     accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  //     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  //   },
  // });
  // const command = new RunTaskCommand({
  //   cluster: process.env.AWS_CLUSTER_ARN,
  //   taskDefinition: process.env.AWS_TASK_ARN,
  //   launchType: "FARGATE",
  //   count: 1,
  //   networkConfiguration: {
  //     awsvpcConfiguration: {
  //       assignPublicIp: "ENABLED",
  //       subnets: [
  //         process.env.AWS_SUBNET_1!,
  //         process.env.AWS_SUBNET_2!,
  //         process.env.AWS_SUBNET_3!,
  //       ],
  //       securityGroups: [process.env.AWS_SG!],
  //     },
  //   },
  // });
  // await ecsClient.send(command);
  // return Response.json({ data: "Success", status: "QUEUED" });

  // await s3Client.send(
  //   new PutObjectCommand({
  //     Bucket: bucketName,
  //     Key: "my-first-object.txt",
  //     Body: "Hello JavaScript SDK!",
  //   })
  // );
  // console.log("Text File Created!");
  // const { Body } = await s3Client.send(
  //   new GetObjectCommand({
  //     Bucket: bucketName,
  //     Key: "my-first-object.txt",
  //   })
  // );
  // console.log("Read File!");
  // console.log(await Body?.transformToString());
  // const paginator = paginateListObjectsV2(
  //   { client: s3Client },
  //   { Bucket: bucketName }
  // );
  // for await (const page of paginator) {
  //   const objects = page.Contents;
  //   if (objects) {
  //     // For every object in each page, delete it.
  //     for (const object of objects) {
  //       await s3Client.send(
  //         new DeleteObjectCommand({ Bucket: bucketName, Key: object.Key })
  //       );
  //       console.log("File Deleted!");
  //     }
  //   }
  // }

  // return Response.json({ data: "Success", status: "CreatedDeleted" });

  return Response.json({ data: "Success", bucketName });
}
