CREATE TABLE "knowledge_base_items" (
	"id" text PRIMARY KEY NOT NULL,
	"knowledge_base_id" text NOT NULL,
	"page_content" text NOT NULL,
	"metadata" json NOT NULL,
	"content_hash" text NOT NULL,
	"origin_ref" text,
	"product_name" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "knowledge_base" ADD COLUMN "dataset_version" text;--> statement-breakpoint
ALTER TABLE "knowledge_base" ADD COLUMN "content_hash" text;--> statement-breakpoint
ALTER TABLE "knowledge_base" ADD COLUMN "item_count" text;--> statement-breakpoint
ALTER TABLE "knowledge_base_items" ADD CONSTRAINT "knowledge_base_items_knowledge_base_id_knowledge_base_id_fk" FOREIGN KEY ("knowledge_base_id") REFERENCES "public"."knowledge_base"("id") ON DELETE cascade ON UPDATE no action;