"use server";

import { ECSClient, RunTaskCommand } from "@aws-sdk/client-ecs";

const ecsClient = new ECSClient({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const runTask = async () => {
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

  return { data: "Success", status: "QUEUED" };
};
