# VFMatch AI Agent — Technical Blueprint v2

> Single source of truth. Aligned line-by-line with the Databricks challenge brief and VF Agent Questions document.

---

## Challenge Alignment Matrix

Before anything else — here's exactly how our features map to evaluation criteria:

### Evaluation Criteria → Our Features

| Criteria | Weight | What Judges Want | Our Answer |
|----------|--------|-----------------|------------|
| **Technical Accuracy** | 35% | Reliably handle "Must Have" queries + detect anomalies | 7 AI tools covering all 13 Must-Have questions. Multi-step tool chains. Anomaly detection with medical reasoning. |
| **IDP Innovation** | 30% | Extract and synthesize from unstructured free-form text | pgvector semantic search over raw procedure/equipment/capability text. Parsed arrays for structured filtering. Cross-field synthesis (procedures ↔ equipment ↔ capacity). |
| **Social Impact** | 25% | Identify medical deserts for resource allocation | Medical desert finder by specialty. Coverage gap quantification (distance + population). Volunteer deployment planner. |
| **User Experience** | 10% | Intuitive for non-technical NGO planners using natural language | Chat interface with suggested queries. Map highlights results. Tool call transparency. Planning wizard. |

### Core MVP Features (from Challenge Brief)

| # | MVP Requirement | Status | Our Implementation |
|---|----------------|--------|-------------------|
| 1 | **Unstructured Feature Extraction**: Process free-form text fields (procedure, equipment, capability) to identify specific medical data | ✅ | `searchFacilities` tool — pgvector semantic search. Parsed arrays for exact matching. Cross-field validation in `detectAnomalies`. |
| 2 | **Intelligent Synthesis**: Combine unstructured insights with structured facility schemas for comprehensive regional view | ✅ | Agent uses multiple tools per query — SQL for structure, vector search for free-text, then synthesizes. `analyzeRegion` combines stats + capabilities + gaps. |
| 3 | **Planning System**: Easily accessible, adopted across experience levels and age groups | ✅ | `planMission` tool — interactive deployment planner for volunteer doctors. Guided flow: input specialty + availability → get ranked locations with reasoning. |

### Stretch Goals (from Challenge Brief)

| # | Stretch Goal | Status | Our Implementation |
|---|-------------|--------|-------------------|
| 1 | **Citations**: Row-level citations indicating what data supported each claim | ✅ | Every tool response includes `facilityId` + `facilityName`. Agent cites these in responses. Tool call cards show which data was used at each step. |
| 2 | **Map Visualization** | ✅ | Leaflet map with color-coded markers. Chat→Map highlighting. Fly-to on query results. |
| 3 | **Real-Impact Bonus**: Tackle VF Agent Questions | ✅ | All 13 Must-Have questions + 6 Should-Have questions targeted. |

### Must-Have Questions Coverage (from VF Agent Questions doc)

| # | Question | Tool(s) Used |
|---|----------|-------------|
| 1.1 | How many hospitals have cardiology? | `queryDatabase` |
| 1.2 | How many hospitals in [region] can perform [procedure]? | `queryDatabase` + `searchFacilities` |
| 1.3 | What services does [Facility Name] offer? | `getFacility` |
| 1.4 | Are there any clinics in [Area] that do [Service]? | `searchFacilities` (with region filter) |
| 1.5 | Which region has the most [Type] hospitals? | `queryDatabase` |
| 2.1 | How many hospitals treating [condition] within [X] km of [location]? | `findNearby` |
| 2.3 | Largest geographic cold spots where procedure absent within X km? | `findMedicalDeserts` |
| 4.4 | Facilities claiming unrealistic procedures relative to size? | `detectAnomalies` |
| 4.7 | Correlations between facility characteristics that move together? | `detectAnomalies` + `queryDatabase` |
| 4.8 | Facilities with high breadth of claimed procedures vs infrastructure? | `detectAnomalies` |
| 4.9 | "Things that shouldn't move together" (large beds + minimal equipment)? | `detectAnomalies` |
| 6.1 | Where is the workforce for [subspecialty] practicing in [region]? | `searchFacilities` + `queryDatabase` |
| 7.5 | Which procedures depend on very few facilities (1-2 only)? | `queryDatabase` |
| 7.6 | Oversupply of low-complexity vs scarcity of high-complexity? | `queryDatabase` + `searchFacilities` |
| 8.3 | Gaps where no organizations working despite evident need? | `findMedicalDeserts` + `queryDatabase` |

---

## Stack

| Layer | Choice | Why |
|-------|--------|-----|
| **Framework** | Next.js 15+ (App Router) | SSR, Server Actions, fast dev |
| **Foundation** | Vercel AI Chat SDK (chat-sdk.dev) | Production-ready Chatbot Template |
| **Database** | PostgreSQL + pgvector | Structured queries + vector search in one DB |
| **ORM** | Drizzle ORM | Type-safe queries, schema-first, lightweight, great DX |
| **AI** | Vercel AI SDK + Claude Sonnet 3.5 | Streaming, tool calling, multi-step reasoning |
| **Embeddings** | OpenAI text-embedding-3-small | Cheap, fast, 1536 dims |
| **Maps** | react-leaflet + CartoDB dark tiles | Free, no API key, looks great |
| **Styling** | Tailwind CSS | Speed |
| **Hosting** | Vercel + Neon Postgres | Free tier, pgvector built-in, instant deploy |

---

## Project Structure

```
vf-agent/
├── www/                               # Next.js Application (Vercel AI Chat SDK)
│   ├── .env.local
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.ts
│   ├── drizzle.config.ts
│   ├── biome.jsonc
│   │
│   ├── app/
│   │   ├── (auth)/                    # Auth routes
│   │   ├── (chat)/                    # Chat interface
│   │   ├── layout.tsx
│   │   └── globals.css
│   │
│   ├── lib/
│   │   ├── ai/                        # AI Logic
│   │   ├── db/                        # Database Logic
│   │   │   ├── index.ts               # DB Client export
│   │   │   ├── schema.ts              # App Schema
│   │   │   ├── schema.facilities.ts   # Facilities Schema
│   │   │   └── queries.ts             # Queries
│   │   └── utils.ts
│   │
│   ├── scripts/                       # Database Scripts
│   │   ├── seed-facilities.ts         # Seeding script
│   │   └── migrate.ts                 # Migration script
│   │
│   └── public/
│
├── assets/                            # Project Assets
│   ├── data/
│   │   └── ghana-facilities.csv       # Source Data
│   ├── docs/                          # Documentation
│   │   └── technical-blueprint-v2.md
│   └── python_models/                 # Reference Python Code
│
└── README.md                          # Root README
```

---

## Database: Drizzle Schema

### `src/db/schema.ts`

```typescript
import { pgTable, serial, integer, text, boolean, doublePrecision, timestamp, index } from 'drizzle-orm/pg-core';
import { vector } from 'drizzle-orm/pg-core'; // pgvector support

export const facilities = pgTable('facilities', {
  id:                serial('id').primaryKey(),
  pkUniqueId:        integer('pk_unique_id').unique(),
  name:              text('name').notNull(),
  sourceUrl:         text('source_url'),

  // Classification
  facilityType:      text('facility_type'),       // hospital | clinic | doctor | pharmacy | dentist
  operatorType:      text('operator_type'),        // public | private
  organizationType:  text('organization_type'),

  // Location
  addressLine1:      text('address_line1'),
  addressCity:       text('address_city'),
  addressRegion:     text('address_region'),
  addressCountry:    text('address_country').default('Ghana'),
  countryCode:       text('country_code').default('GH'),
  lat:               doublePrecision('lat'),
  lng:               doublePrecision('lng'),

  // Capacity signals
  numDoctors:        integer('num_doctors'),
  capacity:          integer('capacity'),          // beds
  areaSqm:           integer('area_sqm'),
  yearEstablished:   integer('year_established'),

  // Contact
  phone:             text('phone'),
  email:             text('email'),
  website:           text('website'),
  officialWebsite:   text('official_website'),
  facebook:          text('facebook'),
  twitter:           text('twitter'),

  // === FREE-TEXT FIELDS (the IDP core) ===
  specialtiesRaw:    text('specialties_raw'),
  proceduresRaw:     text('procedures_raw'),
  equipmentRaw:      text('equipment_raw'),
  capabilitiesRaw:   text('capabilities_raw'),
  description:       text('description'),
  missionStatement:  text('mission_statement'),
  orgDescription:    text('org_description'),

  // === PARSED ARRAYS (structured from free-text during seeding) ===
  specialties:       text('specialties').array(),
  procedures:        text('procedures').array(),
  equipment:         text('equipment').array(),
  capabilities:      text('capabilities').array(),

  // Affiliations
  affiliationTypes:  text('affiliation_types').array(),
  acceptsVolunteers: boolean('accepts_volunteers'),

  // === VECTOR EMBEDDING (pgvector) ===
  // embedding:      vector('embedding', { dimensions: 1536 }),
  // Note: Drizzle pgvector support may need raw SQL for the column.
  // We handle embedding column via raw migration SQL.

  createdAt:         timestamp('created_at').defaultNow(),
}, (table) => ({
  regionIdx:      index('idx_fac_region').on(table.addressRegion),
  cityIdx:        index('idx_fac_city').on(table.addressCity),
  typeIdx:        index('idx_fac_type').on(table.facilityType),
  geoIdx:         index('idx_fac_geo').on(table.lat, table.lng),
}));
```

### Additional Migration SQL (for pgvector + GIN indexes)

```sql
-- Run after Drizzle migration
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

ALTER TABLE facilities ADD COLUMN IF NOT EXISTS embedding vector(1536);

CREATE INDEX IF NOT EXISTS idx_fac_embedding ON facilities
    USING ivfflat (embedding vector_cosine_ops) WITH (lists = 10);

CREATE INDEX IF NOT EXISTS idx_fac_specialties ON facilities USING GIN(specialties);
CREATE INDEX IF NOT EXISTS idx_fac_procedures ON facilities USING GIN(procedures);
CREATE INDEX IF NOT EXISTS idx_fac_equipment ON facilities USING GIN(equipment);
CREATE INDEX IF NOT EXISTS idx_fac_name_trgm ON facilities USING GIN(name gin_trgm_ops);
```

### Drizzle Config

```typescript
// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

### Why Drizzle

| vs Raw SQL | vs Prisma |
|-----------|-----------|
| Type-safe queries (autocomplete, no typos) | Much lighter (no engine binary) |
| Still allows raw SQL when needed (pgvector queries) | Schema lives in code, not separate .prisma file |
| Zero runtime overhead (compiles to SQL) | Faster cold starts (important for Vercel) |
| `.select()`, `.where()`, `.groupBy()` feel like SQL | Better for hybrid raw+ORM approach we need |

---

## AI Tools — Detailed Goals

### Tool 1: `queryDatabase`
**Purpose: Structured queries over the facilities table**

This is the workhorse for any question that can be answered with SQL — counts, aggregations, groupings, rankings, filters. The agent receives the user's natural language question and writes a SQL query.

**What it must achieve:**
- Answer count questions: "How many hospitals have cardiology?" → count where 'cardiology' is in specialties array
- Answer regional breakdowns: "Which region has the most hospitals?" → group by region, order by count desc
- Answer comparative queries: "How do Northern and Ashanti regions compare in clinic count?" → grouped counts with region filter
- Handle array queries: since specialties, procedures, equipment are Postgres arrays, the agent must know to use `ANY()` or `@>` operators
- Handle null-safe logic: many fields are sparse (733 null regions, most have null doctors/beds). Agent must use COALESCE or IS NOT NULL filters appropriately
- Return structured results: column names + rows + row count, so the agent can format a table or summary

**What it must NOT do:**
- Execute anything other than SELECT (we validate this server-side)
- Hallucinate column names (system prompt includes exact schema)
- Assume data exists in columns that are mostly null

**Questions it answers (from VF doc):**
- 1.1: "How many hospitals have cardiology?" 
- 1.2: "How many hospitals in [region] can perform [procedure]?"
- 1.5: "Which region has the most [Type] hospitals?"
- 4.7: "What correlations exist between facility characteristics that move together?"
- 7.5: "Which procedures depend on very few facilities?"
- 7.6: "Oversupply concentration vs scarcity of high-complexity procedures?"

---

### Tool 2: `searchFacilities`
**Purpose: Semantic search over unstructured free-text fields**

This is the IDP (Intelligent Document Parsing) showcase tool. The Ghana dataset has rich free-text in `procedures_raw`, `equipment_raw`, `capabilities_raw`, and `description`. These fields contain messy, LLM-extracted text from web scrapes — varying in granularity, format, and reliability. This tool makes all that text searchable by meaning, not just keywords.

**What it must achieve:**
- Find facilities based on *meaning*, not exact string match. "Facilities that do eye surgery" should match a facility whose procedures list says "Performs phacoemulsification and extracapsular cataract extraction" even though the words "eye surgery" don't appear
- Combine semantic search with structured filters: "Hospitals in Ashanti Region that mention MRI" → vector search for "MRI" + WHERE facility_type = 'hospital' AND address_region = 'Ashanti'
- Return the *relevant text* that matched, not just the facility name. This is critical for citations — the user needs to see WHY the facility matched
- Rank by similarity score so the agent can communicate confidence: "Found 3 strong matches and 2 partial matches"
- Handle medical synonyms naturally: "heart surgery" → finds "cardiothoracic", "CABG", "valve replacement", etc.

**How it uses pgvector:**
Each facility has a single embedding (1536 dims) created from the concatenation of all free-text fields. The search embeds the query, then uses cosine similarity (`<=>` operator) to rank. Structured filters (region, type, specialty) are applied as WHERE clauses alongside the vector search.

**What makes this IDP-innovative:**
- It's not just keyword search — it understands medical concepts
- It surfaces *what the facility actually says* about its capabilities, not just metadata
- Combined with `detectAnomalies`, it enables cross-referencing: "this facility SAYS it does neurosurgery in its procedures text, but has no neurological equipment listed"

**Questions it answers (from VF doc):**
- 1.3: "What services does [Facility Name] offer?" (search by name, return full free-text)
- 1.4: "Are there any clinics in [Area] that do [Service]?"
- 6.1: "Where is the workforce for [subspecialty] actually practicing?"

---

### Tool 3: `getFacility`
**Purpose: Complete deep-dive profile for a single facility**

When a user asks about a specific facility by name, this tool returns EVERYTHING we know. It's the "open the folder" action.

**What it must achieve:**
- Fuzzy name matching: users will type "Tamale Hospital" but the DB has "Tamale Teaching Hospital" → use pg_trgm similarity or Drizzle ILIKE with wildcards
- Return ALL fields in a structured way: location, type, capacity signals (beds, doctors, area), ALL free-text fields (procedures, equipment, capabilities, description), contact info, web presence, affiliations
- Flag data quality: highlight which fields are present vs missing. A facility with name + city but no procedures, no equipment, no doctors count = "minimal data profile"
- Provide context: what region is this in? How does this facility's bed count compare to regional average?

**Why this tool matters:**
It's the foundation for the agent's ability to REASON about individual facilities. When the agent needs to assess whether a facility's claims are credible (anomaly detection), it first calls `getFacility` to get the full picture, then applies medical reasoning.

**Questions it answers (from VF doc):**
- 1.3: "What services does [Facility Name] offer?"

---

### Tool 4: `findNearby`
**Purpose: Geospatial proximity search — "What's near me?"**

This is the spatial tool. Given a location (either a city name that we resolve to coordinates, or raw lat/lng), find facilities within a radius, optionally filtered by specialty or type.

**What it must achieve:**
- Accept either city names ("near Tamale") or coordinates. We maintain a lookup table of ~80 Ghana cities → lat/lng
- Calculate haversine distance for each facility and return results sorted by proximity
- Apply filters: specialty, facility type, minimum bed count, etc.
- Return distance in km alongside each facility, so the agent can say "Tamale Teaching Hospital is 12km away, Dagomba Clinic is 34km away"
- Handle the "nothing nearby" case gracefully: "No facilities with ophthalmology within 100km of Bolgatanga. The nearest is Tamale Teaching Hospital at 162km."

**Why this matters for social impact:**
Distance-to-care is the single most important metric for healthcare access in rural Africa. This tool quantifies it. When the agent says "800,000 people in Upper West Region are more than 100km from the nearest eye care facility," that's a finding that directly informs resource allocation.

**Questions it answers (from VF doc):**
- 2.1: "How many hospitals treating [condition] within [X] km of [location]?"

---

### Tool 5: `findMedicalDeserts`
**Purpose: Identify geographic regions where specific healthcare services are absent or dangerously far**

This is the headline social impact feature. A "medical desert" is a populated area where a critical service is beyond a reasonable travel distance. This tool systematically identifies them.

**What it must achieve:**
- For a given specialty or procedure, find ALL facilities in Ghana that offer it
- For each of Ghana's 16 regions (and ~80 major cities), calculate the distance to the nearest matching facility
- Flag locations where the nearest facility exceeds a threshold (default 100km, configurable)
- Rank deserts by severity: distance × estimated population of the underserved area
- Return a structured result that the map can render: list of desert zones with center coordinates, radius of gap, nearest facility name + distance
- Handle the case where NO facilities in the entire country offer a service: "Zero facilities in Ghana list neurosurgery capability. This represents a national-level gap."

**What makes this powerful:**
- It doesn't just say "Northern Region has fewer hospitals" — it says "Northern Region has 4.2 million people and exactly 0 facilities listing emergency surgery capability. The nearest emergency surgery is 215km away in Kumasi."
- The agent can combine this with medical knowledge: "Delayed access to emergency surgery beyond 2 hours significantly increases mortality for trauma patients. At 215km on Ghana's road network, this represents approximately 4-6 hours travel time."

**Questions it answers (from VF doc):**
- 2.3: "Largest geographic cold spots where a critical procedure is absent within X km?"
- 8.3: "Gaps in the international development map where no organizations are working despite evident need?"

---

### Tool 6: `detectAnomalies`
**Purpose: Cross-reference facility claims to find inconsistencies, misrepresentations, and suspicious patterns**

This is the data quality / verification tool, and it's where IDP innovation shines. The free-text fields are LLM-extracted from web scrapes — they can be exaggerated, outdated, or outright wrong. This tool applies medical reasoning to catch things that don't add up.

**What it must achieve:**

*Breadth vs Infrastructure checks:*
- Flag facilities claiming >10 specialties but having <5 doctors or <30 beds. A 20-bed clinic cannot credibly sustain cardiology, neurology, orthopedics, ophthalmology, and pediatric surgery simultaneously.
- Flag facilities with many claimed procedures but minimal or no equipment listed. If you claim 15 surgical procedures but list zero surgical equipment, something is off.

*Equipment-Procedure cross-validation:*
- Apply medical knowledge mappings: cataract surgery requires operating microscope, MRI requires MRI machine, dialysis requires dialysis machines. If a facility claims the procedure but lacks the equipment, flag it.
- This is stored in `medical-knowledge.ts` — a lookup of procedure → minimum required equipment.

*Capacity consistency checks:*
- Doctor-to-bed ratio: a facility claiming 500 beds but 2 doctors is implausible
- Bed-to-specialty ratio: advanced subspecialties (cardiac surgery, neurosurgery) require minimum infrastructure thresholds
- Area-to-capacity: if floor area is listed, check if bed count is physically plausible

*Signal completeness checks:*
- "Ghost facilities": has a name and maybe a city, but no phone, no email, no website, no procedures, no equipment, no description. These may be defunct or never operational.
- "Web-only facilities": has a fancy website/Facebook but no concrete procedures, no equipment, no capacity data. May be purely aspirational.

*Pattern anomalies (VF questions 4.7, 4.9):*
- "Things that should move together" but don't: large bed count + minimal surgical equipment; many specialties + no doctors listed
- "Things that shouldn't move together" but do: very small facility + highly advanced subspecialty claims

**Output format:**
Each anomaly includes: facility ID + name, anomaly type, severity (low/medium/high/critical), human-readable explanation, the specific data points that triggered the flag.

**Questions it answers (from VF doc):**
- 4.4: "Facilities claiming unrealistic procedures relative to size?"
- 4.7: "Correlations between facility characteristics that move together?"
- 4.8: "High breadth of claimed procedures vs stated infrastructure?"
- 4.9: "Things that shouldn't move together?"

---

### Tool 7: `getStats`
**Purpose: Aggregate dashboard statistics and regional breakdowns**

The overview tool. Gives the agent quick access to summary numbers without writing SQL.

**What it must achieve:**
- Total counts: facilities, hospitals, clinics, pharmacies, other
- Regional breakdown: facility count per region, sorted by count
- Specialty coverage: which specialties appear in the data, how many facilities per specialty
- Capacity summary: total beds, total doctors, average per facility, per region
- Data quality summary: how many facilities have procedures listed? Equipment? Description? Coordinates? This surfaces the data completeness picture.
- Top-level signals: busiest regions, emptiest regions, most common specialties, rarest specialties

**Why this matters:**
It's the agent's "situational awareness." When a user asks a broad question like "Tell me about Ghana's healthcare landscape," the agent calls `getStats` first to ground its response in real numbers.

---

### Tool 8: `planMission`
**Purpose: Interactive volunteer deployment planner — the Planning System MVP feature**

This is a Core MVP requirement from the challenge brief: *"Think creatively how you could include a planning system which is easily accessible and could get adopted across experience levels and age groups."*

This tool transforms the agent from a data analyst into a **decision-support system**. Instead of just answering "where are the gaps?", it answers "given YOUR skills and availability, where should YOU go?"

**What it must achieve:**

*Input: Volunteer profile*
- Medical specialty (e.g., "ophthalmologist", "general surgeon", "pediatrician")
- Available duration (e.g., "2 weeks in April")
- Any preferences (region, urban/rural, specific procedures)

*Processing: Multi-step reasoning*
1. **Identify need**: Call `findMedicalDeserts` for the volunteer's specialty → find where the gap is biggest
2. **Find host facilities**: Call `findNearby` around the desert zones → find facilities that COULD support this specialist (have some infrastructure but lack the specialty)
3. **Check capacity**: Call `getFacility` on candidate hosts → verify they have enough beds, basic equipment, and operational signals to host a visiting specialist
4. **Check NGO presence**: Query for NGOs operating in the area → are there existing volunteer programs the doctor could join?
5. **Rank and recommend**: Score candidates by: (a) severity of need, (b) facility readiness to host, (c) existing NGO support infrastructure, (d) accessibility

*Output: Deployment recommendation*
- Top 3 recommended locations, each with:
  - Facility name and location
  - Why this location (the gap it fills)
  - What infrastructure exists (beds, equipment, other staff)
  - Which NGOs operate nearby
  - Estimated patient impact (population served, typical case volume)
  - Practical notes (nearest city, airport accessibility)

**Why this is the killer feature:**
- It's the most tangible demonstration of "agentic AI" — the system doesn't just retrieve data, it REASONS and PLANS
- It directly demonstrates social impact: turning data into action
- It's accessible to non-technical users: a doctor types their situation in plain English and gets actionable recommendations
- It exercises ALL other tools in a single flow, showcasing the full agent capability
- It maps directly to the VF mission: "connect the right medical expertise with the right hospitals at the right moment"

**Questions it supports (from VF doc):**
- 6.1: "Where is the workforce for [subspecialty] actually practicing?"
- 8.3: "Gaps where no organizations working despite evident need?"
- Implicitly supports unmet needs analysis (Category 9)

---

## Citations System

The challenge brief explicitly calls out citations as Stretch Goal #1, with bonus points for agentic-step-level tracing.

### Design

**Level 1: Row-level citations (in every tool response)**

Every tool returns results that include `facilityId` and `facilityName`. The agent is instructed (via system prompt) to always cite these when making claims:

```
"Tamale Teaching Hospital (ID: 342) reports cardiology and general surgery 
capabilities, with 200 beds and 45 doctors."
```

**Level 2: Tool-call tracing (in the UI)**

Each agent response in the chat shows collapsible `ToolTrace` cards underneath. These show:
- Which tool was called
- What parameters were passed
- What data came back (summarized)
- How long the call took

Example:
```
🔧 searchFacilities("ophthalmology", region: "Northern") → 3 results (0.8s)
🔧 findNearby(lat: 9.40, lng: -0.84, 100km, specialty: "ophthalmology") → 1 result (0.3s)  
🔧 getFacility(id: 342) → Tamale Teaching Hospital (0.2s)
```

This gives judges transparency into the agent's reasoning chain at each step.

**Implementation:**
The Vercel AI SDK's `onToolCall` / `toolResult` events already expose this data. We capture it in the chat state and render it in `ToolTrace.tsx`.

---

## IDP Innovation — Our Story for Judges

Since IDP is 30% of the score, here's how we frame our approach:

### The Problem
The Ghana dataset has 987 facilities. The structured fields (name, city, type) are clean. But the REAL intelligence lives in four free-text columns that were LLM-extracted from web scrapes:
- `procedures_raw`: "Offers hemodialysis treatment 3 times weekly, cataract surgery, general surgery..."
- `equipment_raw`: "Has Siemens SOMATOM CT scanner, digital X-ray, ultrasound machine..."  
- `capabilities_raw`: "Level II trauma center, 24/7 emergency department, NICU..."
- `description`: freeform paragraph about the facility

These fields are messy, inconsistent, and sometimes unreliable. Most systems would just do keyword search. We do better.

### Our Three-Layer IDP Approach

**Layer 1: Structured Extraction (Seeding)**
During data seeding, we parse the raw comma-separated strings into Postgres arrays. This enables exact-match SQL queries: `WHERE 'cardiology' = ANY(specialties)`.

**Layer 2: Semantic Understanding (pgvector)**
We embed the concatenated free-text into 1536-dimensional vectors. This enables meaning-based search: "eye surgery" matches "phacoemulsification" even though the words are different.

**Layer 3: Cross-Signal Reasoning (Anomaly Detection)**
We apply medical domain knowledge to CROSS-REFERENCE fields against each other. Procedures ↔ Equipment ↔ Capacity ↔ Specialties. This is where we detect: "This facility claims cataract surgery but lists no operating microscope in its equipment."

**This three-layer approach directly addresses the evaluation criteria:** "How well does the solution extract and synthesize information from unstructured free-form text?"

---

## System Prompt Structure

```
You are VFMatch AI — an intelligent healthcare analyst for the Virtue Foundation.
You help healthcare planners, volunteer doctors, and NGO coordinators understand
Ghana's healthcare landscape by analyzing facility data.

## Your Data
987 healthcare facilities in Ghana (hospitals, clinics, pharmacies, other).
Data was extracted from web scrapes using LLMs — treat as CLAIMS, not verified facts.

## Database Schema
Table: facilities
Columns: [full schema with types and descriptions]
Key arrays: specialties, procedures, equipment, capabilities (use ANY() for filtering)
Important: ~733 null regions, ~600 null doctor counts, ~700 null bed counts.

## Your Tools (8)
[name, description, when to use, what it returns — for each tool]

## Multi-Tool Reasoning
For complex questions, use multiple tools in sequence:
1. Start with getStats or queryDatabase for overview
2. Use searchFacilities for free-text investigation
3. Use getFacility for deep-dives on specific facilities
4. Use findNearby or findMedicalDeserts for spatial analysis
5. Use detectAnomalies to verify claims
6. Use planMission for deployment recommendations

## Citation Rules
- ALWAYS cite facility names and IDs when referencing specific facilities
- When reporting numbers, mention the SQL query or tool that produced them
- If data is missing or unreliable, say so explicitly
- Distinguish between what the data CLAIMS and what is VERIFIED

## Medical Knowledge
[Specialty hierarchy, procedure→equipment mappings, capacity benchmarks]
- Cataract surgery requires: operating microscope, phaco machine or ECCE kit, IOL inventory
- Credible cardiology program: >50 beds, ECG, echocardiography, at minimum
- "Visiting surgeon" language implies itinerant, not permanent service
- <5 doctors cannot sustain >8 subspecialties
- Neurosurgery requires: CT/MRI capability, dedicated OR, ICU beds, >100 bed facility minimum

## Ghana Context
16 Regions: Greater Accra, Ashanti, Northern, Western, Eastern, Central, Volta,
  Upper East, Upper West, Brong-Ahafo, Savannah, North East, Oti, Bono East,
  Ahafo, Western North
Major cities with coordinates: [lookup table]
Population estimates by region: [approximate figures for gap analysis]

## Response Style
- Be concise — these are busy professionals
- Lead with the answer, then provide evidence
- Use numbers and specifics, not vague statements
- When showing facilities on the map, mention it so the user looks at the map
- For planning queries, think step-by-step and show your reasoning
```

---

## Frontend Layout

```
┌──────────────────────────────────────────────────────────────┐
│  🏥 VFMatch AI    │ 987 Facilities │ 16 Regions │ Ghana    │
├─────────────────────────────┬────────────────────────────────┤
│                             │                                │
│     Chat Panel (45%)        │      Map Panel (55%)           │
│                             │                                │
│  ┌───────────────────────┐  │  ┌──────────────────────────┐  │
│  │  Message history       │  │  │                          │  │
│  │  (scrollable)          │  │  │   Leaflet Map            │  │
│  │                        │  │  │   - Dark tiles            │  │
│  │  User: "Where are..."  │  │  │   - Color markers         │  │
│  │  Agent: "Based on..."  │  │  │   - Click popups          │  │
│  │                        │  │  │   - Fly-to on query       │  │
│  │  🔧 queryDB ▾          │  │  │   - Desert overlay        │  │
│  │  🔧 searchFacilities ▾ │  │  │                          │  │
│  │  🔧 findDeserts ▾      │  │  │                          │  │
│  │                        │  │  └──────────────────────────┘  │
│  │  Agent: "Northern      │  │         [Legend] [Filters]     │
│  │  Region has..."        │  │                                │
│  ├───────────────────────┤  │                                │
│  │ Suggested queries      │  │                                │
│  │ [chips in 2 rows]      │  │                                │
│  ├───────────────────────┤  │                                │
│  │ [  Ask about Ghana's   │  │                                │
│  │    healthcare... ]     │  │                                │
│  └───────────────────────┘  │                                │
└─────────────────────────────┴────────────────────────────────┘
```

### Suggested Queries (8 chips, 2 rows)

Row 1 — Exploration:
```
"How are hospitals distributed across Ghana's regions?"
"Which facilities offer cataract surgery?"
"Find hospitals within 50km of Tamale"
"What eye care exists in Northern Region?"
```

Row 2 — Analysis:
```
"Where are the medical deserts for emergency care?"
"Which facilities have suspicious capability claims?"
"What specialties have only 1-2 facilities in Ghana?"
"I'm an ophthalmologist — where should I volunteer?"
```

Each chip demos a different tool and maps to a VF Must-Have question.

---

## Seed Pipeline

### Step 1: Drizzle Migration
```bash
npx drizzle-kit generate
npx drizzle-kit migrate
# Then run additional SQL for pgvector + GIN indexes
npx tsx scripts/migrate.ts
```

### Step 2: `seed-facilities.ts`
- Parse CSV with `csv-parse`
- Normalize region names (handle 733 nulls: infer from city using lookup)
- Geocode cities (hardcoded lookup table of ~80 Ghana cities → lat/lng)
- Parse comma-separated strings into arrays: `"cardiology, pediatrics"` → `['cardiology', 'pediatrics']`
- Batch insert via Drizzle: `db.insert(facilities).values([...]).onConflictDoNothing()`

### Step 3: `seed-embeddings.ts`
- For each facility: concatenate specialties_raw + procedures_raw + equipment_raw + capabilities_raw + description
- Skip facilities with no free-text (just structured data)
- Call OpenAI in batches of 50 (text-embedding-3-small)
- Update via raw SQL: `UPDATE facilities SET embedding = $1 WHERE id = $2`
- ~20 batches, ~2 minutes total

---

## Dependencies

```json
{
  "dependencies": {
    "next": "^15.1",
    "react": "^19",
    "react-dom": "^19",
    "ai": "^4.1",
    "@ai-sdk/anthropic": "^1.1",
    "openai": "^4.77",
    "drizzle-orm": "^0.38",
    "postgres": "^3.4",
    "zod": "^3.24",
    "react-leaflet": "^4.2",
    "leaflet": "^1.9",
    "react-markdown": "^9.0",
    "lucide-react": "^0.468"
  },
  "devDependencies": {
    "@types/node": "^22",
    "@types/react": "^19",
    "@types/leaflet": "^1.9",
    "drizzle-kit": "^0.30",
    "typescript": "^5.7",
    "tsx": "^4.19",
    "csv-parse": "^5.6",
    "tailwindcss": "^3.4",
    "postcss": "^8.4",
    "autoprefixer": "^10.4"
  }
}
```

Note: Using `postgres` (postgres.js) as the driver — it's what Drizzle recommends for Neon and it supports native pgvector.

---

## Build Order

### Phase 1: Foundation (0–3 hours)
1. Clone Vercel AI Chat SDK (`git clone https://github.com/vercel/ai-chatbot.git`)
2. Install dependencies (`pnpm install`)
3. Create Neon Postgres → get `DATABASE_URL`
4. Set up Drizzle schema + run migrations + add pgvector indexes
5. Run `seed-facilities.ts` → 987 rows
6. Run `seed-embeddings.ts` → vectors for all facilities with free-text
7. Verify data: query a few facilities via Drizzle in a test script

### Phase 2: Tools (3–8 hours)
1. `db/index.ts` — Drizzle client singleton
2. `embed.ts` — OpenAI embedding helper
3. `geo.ts` — haversine function
4. `ghana.ts` — region list, city coords, population estimates
5. `medical-knowledge.ts` — procedure→equipment mappings
6. Build each tool one at a time, test with a simple script:
   `queryDatabase` → `searchFacilities` → `getFacility` → `findNearby` → `findMedicalDeserts` → `detectAnomalies` → `getStats` → `planMission`
7. `tools/index.ts` — export all tools as Vercel AI SDK format

### Phase 3: Agent (8–11 hours)
1. `prompts/system.ts` — comprehensive system prompt
2. `api/chat/route.ts` — streamText with all 8 tools, maxSteps: 10
3. Test all 8 Must-Have questions via curl or simple frontend
4. Iterate on system prompt until:
   - SQL queries are correct (handles arrays, nulls, aggregations)
   - Semantic search returns relevant results
   - Multi-tool chains work (desert finder → nearby → get facility)
   - Anomaly detection produces meaningful flags

### Phase 4: Frontend (11–17 hours)
1. `page.tsx` — split pane layout
2. `ChatPanel.tsx` + `useChat` hook → streaming messages
3. `FacilityMap.tsx` — dynamic import, dark tiles, color-coded markers
4. `SuggestedQueries.tsx` — 8 chips in 2 rows
5. `ToolTrace.tsx` — collapsible tool call cards (citations!)
6. `MessageList.tsx` — markdown rendering + facility ID highlighting
7. Chat → Map integration: highlight facilities from agent response
8. `Header.tsx` + stats bar
9. `MapLegend.tsx` + marker popups

### Phase 5: Polish (17–21 hours)
1. Test all 8 suggested queries end-to-end
2. Refine anomaly detection rules with real data patterns
3. Add loading states, error handling, empty states
4. Mobile responsive (stack chat above map)
5. Dark theme polish

### Phase 6: Deploy + Demo Prep (21–24 hours)
1. Push to GitHub → Vercel auto-deploy
2. Set env vars in Vercel
3. Test live URL end-to-end
4. Rehearse 5-minute demo
5. Record backup video

---

## Demo Script (5 min)

| Time | What | Criteria Hit |
|------|------|-------------|
| 0:00–0:30 | **Hook**: "4.8B people lack safe surgery. VFMatch maps facilities in 72 countries. But the data is static — you browse, you can't reason. We built the intelligence layer." | Social Impact |
| 0:30–1:15 | **Q1**: "How are hospitals distributed across Ghana?" → Stats breakdown, map lights up. Shows SQL tool working. | Technical Accuracy |
| 1:15–2:15 | **Q2**: "Where are the medical deserts for ophthalmology?" → Agent identifies gaps, quantifies distance + population. Map shows desert zones. Expand tool trace to show reasoning chain. | Social Impact + IDP + Citations |
| 2:15–3:15 | **Q3**: "Which facilities have suspicious capability claims?" → Flags mismatches. "Facility X claims neurosurgery with 3 doctors and 20 beds." Shows cross-field reasoning. | Technical Accuracy + IDP Innovation |
| 3:15–4:15 | **Q4**: "I'm an ophthalmologist with 2 weeks in April. Where should I go?" → Planning system kicks in. Multi-tool chain: deserts → nearby → facility check → recommendation. | Planning System (MVP!) + Social Impact + UX |
| 4:15–5:00 | **Close**: Show tool traces expanded. "Every claim is cited. Every step is traceable. Hours of manual analysis → seconds. This is the intelligence layer for global healthcare." | Citations + UX |

**Every demo moment maps to at least 2 evaluation criteria.**

---

## What We Exclude

| Excluded | Why |
|----------|-----|
| MongoDB | Unnecessary for 987 rows |
| CARTO | Leaflet does everything we need |
| Separate vector store | pgvector handles it in-DB |
| LangGraph / LlamaIndex | Vercel AI SDK handles tool calling + multi-step natively |
| MLFlow | No model training, just inference |
| Docker | Neon gives us hosted Postgres instantly |
| Auth | Demo app |
| i18n | English only |
