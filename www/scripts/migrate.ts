
import { db } from '../db';
import { sql } from 'drizzle-orm';

async function main() {
  console.log('Running additional migrations (pgvector + indexes)...');

  try {
    // 1. Enable Extensions
    await db.execute(sql`CREATE EXTENSION IF NOT EXISTS vector;`);
    await db.execute(sql`CREATE EXTENSION IF NOT EXISTS pg_trgm;`);

    // 2. Add embedding column if it doesn't exist (Drizzle schema has it, but we need to ensure the type exists)
    // Note: If Drizzle migration added the column, this might be redundant or fail if type mismatch.
    // Drizzle's 'vector' type usually requires the extension to be enabled first.
    // We'll rely on Drizzle Kit for the column creation, but we need the extension.
    
    // 3. Create Indexes
    console.log('Creating indexes...');
    
    // IVFFlat index for vector search (approximate nearest neighbor)
    // Note: IVFFlat is good for static data. HNSW is better for dynamic.
    // The blueprint suggests IVFFlat.
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_fac_embedding ON facilities
      USING ivfflat (embedding vector_cosine_ops) WITH (lists = 10);
    `);

    // GIN indexes for array columns (search efficiency)
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_fac_specialties ON facilities USING GIN(specialties);`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_fac_procedures ON facilities USING GIN(procedures);`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_fac_equipment ON facilities USING GIN(equipment);`);
    
    // Trigram index for fuzzy name search
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_fac_name_trgm ON facilities USING GIN(name gin_trgm_ops);`);

    console.log('Migrations complete!');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

main();
