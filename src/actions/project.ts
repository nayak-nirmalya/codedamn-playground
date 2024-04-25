"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";

import db from "@/db/drizzle";
import { project } from "@/db/schema";

export const deleteProject = async (id: string) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const projectToBeDeleted = await db.query.project.findFirst({
      where: and(eq(project.id, id), eq(project.userId, userId)),
    });

    if (!projectToBeDeleted) throw new Error("Project not found");

    await db
      .delete(project)
      .where(and(eq(project.id, id), eq(project.userId, userId)));

    revalidatePath("/dashboard");
  } catch (error) {
    throw new Error("Internal server error");
  }
};

export const renameProject = async (id: string, newName: string) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const projectToBeRenamed = await db.query.project.findFirst({
      where: and(eq(project.id, id), eq(project.userId, userId)),
    });

    if (!projectToBeRenamed) throw new Error("Project not found");

    await db
      .update(project)
      .set({ projectName: newName })
      .where(and(eq(project.id, id), eq(project.userId, userId)));

    revalidatePath("/dashboard");
  } catch (error) {
    throw new Error("Internal server error");
  }
};
