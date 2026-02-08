CREATE TABLE IF NOT EXISTS "demographics_benchmarks" (
	"id" serial PRIMARY KEY NOT NULL,
	"benchmark_name" text NOT NULL,
	"doctors_per_1000" double precision,
	"nurses_per_1000" double precision,
	"beds_per_1000" double precision,
	"maternal_mortality_per_100k" double precision,
	"under5_mortality_per_1k" double precision,
	"ophthalmologists_per_capita" double precision,
	"surgeons_per_capita" double precision,
	"operating_rooms_per_100k" double precision,
	"data_source" text,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "demographics_benchmarks_benchmark_name_unique" UNIQUE("benchmark_name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "demographics_countries" (
	"country_code" varchar(3) PRIMARY KEY NOT NULL,
	"country_name" text NOT NULL,
	"total_population" bigint,
	"gdp_per_capita_usd" double precision,
	"doctors_per_1000" double precision,
	"nurses_per_1000" double precision,
	"beds_per_1000" double precision,
	"maternal_mortality_per_100k" double precision,
	"under5_mortality_per_1k" double precision,
	"life_expectancy" double precision,
	"data_source" text,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "demographics_regions" (
	"id" serial PRIMARY KEY NOT NULL,
	"country_code" varchar(3) NOT NULL,
	"region" text NOT NULL,
	"capital" text,
	"population" bigint,
	"urban_percent" double precision,
	"rural_percent" double precision,
	"area_sq_km" double precision,
	"population_density" double precision,
	"classification" text,
	"gdp_per_capita_usd" double precision,
	"age_under15_pct" double precision,
	"age_working_pct" double precision,
	"age_over65_pct" double precision,
	"maternal_mortality_per_100k" double precision,
	"under5_mortality_per_1k" double precision,
	"doctors_per_1000" double precision,
	"nurses_per_1000" double precision,
	"disease_burden" text[],
	"data_source" text,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_demo_region_uniq" ON "demographics_regions" USING btree ("country_code","region");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_demo_region_country" ON "demographics_regions" USING btree ("country_code");