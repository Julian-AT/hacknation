CREATE TABLE IF NOT EXISTS "ChatDocument" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chatId" uuid NOT NULL,
	"userId" uuid NOT NULL,
	"name" text NOT NULL,
	"contentType" text NOT NULL,
	"url" text NOT NULL,
	"textContent" text,
	"createdAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Provider" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"specialty" text,
	"address" text,
	"city" text,
	"region" text,
	"country" text,
	"lat" double precision,
	"lng" double precision,
	"phone" text,
	"email" text,
	"website" text,
	"rating" double precision,
	"reviewCount" integer,
	"hours" text,
	"insuranceAccepted" json,
	"imageUrl" text,
	"sourceUrl" text,
	"rawData" json,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ChatDocument" ADD CONSTRAINT "ChatDocument_chatId_Chat_id_fk" FOREIGN KEY ("chatId") REFERENCES "public"."Chat"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ChatDocument" ADD CONSTRAINT "ChatDocument_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_chat_document_chat" ON "ChatDocument" USING btree ("chatId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_provider_city" ON "Provider" USING btree ("city");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_provider_specialty" ON "Provider" USING btree ("specialty");