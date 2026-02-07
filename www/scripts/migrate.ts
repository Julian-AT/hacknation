
import dotenv from 'dotenv';
import postgres from 'postgres';

dotenv.config({ path: '.env.local' });

const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error('POSTGRES_URL environment variable is not set');
}

const sql = postgres(connectionString, { max: 1 });

async function main() {
  console.log('Running custom migrations...');

  try {
    // 1. Enable extensions
    console.log('Enabling extensions...');
    await sql`CREATE EXTENSION IF NOT EXISTS vector`;
    await sql`CREATE EXTENSION IF NOT EXISTS pg_trgm`;

    // 2. Add embedding column if not exists (Drizzle schema has it, but good to ensure type)
    // Drizzle schema definition: embedding: vector('embedding', { dimensions: 1536 }),
    // Drizzle kit should handle the column creation, but we need to ensure the vector type is correct.
    // We will rely on Drizzle for the column creation, but we can verify here.
    
    // 3. Create Indexes
    console.log('Creating indexes...');
    
    // IVFFlat index for embeddings (cosine distance)
    await sql`
      CREATE INDEX IF NOT EXISTS idx_fac_embedding ON facilities
      USING ivfflat (embedding vector_cosine_ops) WITH (lists = 10);
    `;

    // GIN indexes for array columns and trigram search
    await sql`CREATE INDEX IF NOT EXISTS idx_fac_specialties ON facilities USING GIN(specialties)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_fac_procedures ON facilities USING GIN(procedures)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_fac_equipment ON facilities USING GIN(equipment)`;
    
    // Trigram index for name search
    await sql`CREATE INDEX IF NOT EXISTS idx_fac_name_trgm ON facilities USING GIN(name gin_trgm_ops)`;

    console.log('Custom migrations completed successfully.');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

main();
