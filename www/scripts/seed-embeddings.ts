import dotenv from "dotenv";
import { eq, isNull } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { facilities } from "../lib/db/schema.facilities";
import { embed } from "../lib/embed";

dotenv.config({ path: ".env.local" });

const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error("POSTGRES_URL environment variable is not set");
}

const client = postgres(connectionString);
const db = drizzle(client);

async function main() {
  console.log("Generating embeddings for facilities...");

  // 1. Fetch facilities needing embeddings
  // We check where embedding is null
  // Note: 'embedding' column might not be in Drizzle schema type if it was added via raw SQL migration
  // But we added it to schema.facilities.ts as `vector('embedding', { dimensions: 1536 })`
  // So we can query it.

  const facilitiesToEmbed = await db
    .select()
    .from(facilities)
    .where(isNull(facilities.embedding));

  console.log(
    `Found ${facilitiesToEmbed.length} facilities without embeddings.`
  );

  if (facilitiesToEmbed.length === 0) {
    console.log("Nothing to do.");
    await client.end();
    return;
  }

  // 2. Process in batches
  const batchSize = 10;
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < facilitiesToEmbed.length; i += batchSize) {
    const batch = facilitiesToEmbed.slice(i, i + batchSize);

    await Promise.all(
      batch.map(async (facility) => {
        try {
          // Construct meaningful text for embedding
          // We want to capture: Name, Description, Specialties, Procedures, Equipment
          // We use the raw text if available, or join the arrays

          const parts = [
            `Facility: ${facility.name}`,
            facility.description ? `Description: ${facility.description}` : "",
            facility.specialtiesRaw
              ? `Specialties: ${facility.specialtiesRaw}`
              : "",
            facility.proceduresRaw
              ? `Procedures: ${facility.proceduresRaw}`
              : "",
            facility.equipmentRaw ? `Equipment: ${facility.equipmentRaw}` : "",
            facility.capabilitiesRaw
              ? `Capabilities: ${facility.capabilitiesRaw}`
              : "",
            facility.addressCity ? `City: ${facility.addressCity}` : "",
            facility.addressRegion ? `Region: ${facility.addressRegion}` : "",
          ].filter(Boolean);

          const textToEmbed = parts.join("\n");

          if (!textToEmbed || textToEmbed.length < 10) {
            console.log(`Skipping facility ${facility.id} (insufficient text)`);
            return;
          }

          const embeddingVector = await embed(textToEmbed);

          // Update DB
          await db
            .update(facilities)
            .set({ embedding: embeddingVector })
            .where(eq(facilities.id, facility.id));

          successCount++;
        } catch (error) {
          console.error(`Error embedding facility ${facility.id}:`, error);
          errorCount++;
        }
      })
    );

    console.log(
      `Processed ${Math.min(i + batchSize, facilitiesToEmbed.length)}/${facilitiesToEmbed.length} (Success: ${successCount}, Errors: ${errorCount})`
    );
  }

  console.log("Embedding generation complete.");
  await client.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
