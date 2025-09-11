ALTER TABLE "knowledge_base" DROP CONSTRAINT "knowledge_base_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "knowledge_base" ALTER COLUMN "userId" SET DEFAULT 'demo-user';