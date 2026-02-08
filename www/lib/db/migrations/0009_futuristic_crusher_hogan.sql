CREATE TABLE IF NOT EXISTS "ConversationMessage" (
	"id" serial PRIMARY KEY NOT NULL,
	"chat_id" text NOT NULL,
	"user_id" text,
	"role" text NOT NULL,
	"content" text NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "WorkingMemory" (
	"id" text PRIMARY KEY NOT NULL,
	"scope" text NOT NULL,
	"chat_id" text,
	"user_id" text,
	"content" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "facilities" (
	"id" serial PRIMARY KEY NOT NULL,
	"pk_unique_id" integer,
	"name" text NOT NULL,
	"source_url" text,
	"facility_type" text,
	"operator_type" text,
	"organization_type" text,
	"address_line1" text,
	"address_city" text,
	"address_region" text,
	"address_country" text DEFAULT 'Ghana',
	"country_code" text DEFAULT 'GH',
	"lat" double precision,
	"lng" double precision,
	"num_doctors" integer,
	"capacity" integer,
	"area_sqm" integer,
	"year_established" integer,
	"phone" text,
	"email" text,
	"website" text,
	"official_website" text,
	"facebook" text,
	"twitter" text,
	"specialties_raw" text,
	"procedures_raw" text,
	"equipment_raw" text,
	"capabilities_raw" text,
	"description" text,
	"mission_statement" text,
	"org_description" text,
	"specialties" text[],
	"procedures" text[],
	"equipment" text[],
	"capabilities" text[],
	"affiliation_types" text[],
	"accepts_volunteers" boolean,
	"embedding" vector(1536),
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "facilities_pk_unique_id_unique" UNIQUE("pk_unique_id")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_conv_messages_chat" ON "ConversationMessage" USING btree ("chat_id","timestamp");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_working_memory_scope" ON "WorkingMemory" USING btree ("scope","chat_id","user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_fac_region" ON "facilities" USING btree ("address_region");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_fac_city" ON "facilities" USING btree ("address_city");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_fac_type" ON "facilities" USING btree ("facility_type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_fac_geo" ON "facilities" USING btree ("lat","lng");