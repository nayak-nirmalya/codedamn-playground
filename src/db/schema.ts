import {
  text,
  pgTable,
  varchar,
  pgEnum,
  uuid,
  timestamp,
} from "drizzle-orm/pg-core";

export const playgroundEnum = pgEnum("playground", [
  "Node",
  "Next.js",
  "Python",
]);

export const statusEnum = pgEnum("status", [
  "QUEUE",
  "PROGRESS",
  "READY",
  "FAILED",
  "DESTROYED",
]);

export const user = pgTable("user", {
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .unique()
    .primaryKey(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  email: text("email").notNull().unique(),
});

export const project = pgTable("project", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => user.userId, { onDelete: "cascade" }),
  projectName: varchar("project_name", { length: 255 }).notNull().unique(),
  playground: playgroundEnum("playground").notNull(),
  status: statusEnum("status"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
