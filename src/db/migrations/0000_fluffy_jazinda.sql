DO $$ BEGIN
 CREATE TYPE "playground" AS ENUM('Node', 'Next.js', 'Python');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "status" AS ENUM('QUEUE', 'PROGRESS', 'READY', 'FAILED', 'DESTROYED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "project" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"project_name" varchar(255) NOT NULL,
	"playground" "playground" NOT NULL,
	"status" "status",
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "project_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "project_project_name_unique" UNIQUE("project_name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"user_id" varchar(255) PRIMARY KEY NOT NULL,
	"username" varchar(255) NOT NULL,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"email" text NOT NULL,
	CONSTRAINT "user_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "user_username_unique" UNIQUE("username"),
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project" ADD CONSTRAINT "project_user_id_user_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
