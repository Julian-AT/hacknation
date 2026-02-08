<div align="center">

# Meridian AI

**A multi-agent system for analyzing healthcare facility capabilities across Ghana**

![Hack Nation](https://img.shields.io/badge/Hack_Nation-MIT_2026-000000?style=for-the-badge)
![Track](https://img.shields.io/badge/Track-Databricks_%7C_Medical_Deserts-FF3621?style=for-the-badge)
![Client](https://img.shields.io/badge/Client-Virtue_Foundation-2563EB?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Prototype-EAB308?style=for-the-badge)

A RAG-powered multi-agent orchestrator that queries **987 healthcare facilities** in natural language using **Vercel AI SDK v6** (`ToolLoopAgent`), **PostgreSQL + pgvector**, and **Vercel AI Gateway** routing across Google Gemini, Anthropic Claude, OpenAI, and xAI models.

[Watch the Demo Video](#) · ![Dashboard Screenshot](./www/public/opengraph-image.png)

</div>

---

## The Problem

> **72% of Ghana's population** lives in areas classified as "medical deserts" for at least one critical specialty. The Virtue Foundation coordinates volunteer doctors across these gaps, but their planning relies on spreadsheets and tribal knowledge.

The Databricks "Bridging Medical Deserts" challenge asks: **Can an intelligent agent parse unstructured facility data, detect coverage gaps, and recommend where to deploy volunteer specialists?**

Meridian's answer: an orchestrator agent that delegates to 6 specialized sub-agents, each with phased tool-loop execution, operating over a 987-facility PostgreSQL database with vector embeddings and 104+ geocoded city reference points.

---

## Architecture

### System Architecture

```mermaid
graph TB
    User([User / NGO Planner])
    
    subgraph "Next.js 16 App Router"
        ChatRoute["POST /api/chat<br/>maxDuration: 120s"]
        Auth["NextAuth 5<br/>Guest + Registered"]
        Stream["Resumable Streams<br/>Redis SSE"]
    end
    
    subgraph "Vercel AI Gateway"
        Gateway["gateway(modelId)"]
        Gemini["Google Gemini 3 Flash"]
        Claude["Anthropic Claude Sonnet 4.5"]
        GPT["OpenAI GPT-5.2"]
        Grok["xAI Grok 4.1"]
    end
    
    subgraph "Orchestrator Agent (15 steps max)"
        Orch["ToolLoopAgent<br/>User-selected model"]
        
        subgraph "Direct Tools"
            ArtifactTools["findNearby → Map<br/>findMedicalDeserts → Desert Map<br/>getStats → Dashboard<br/>planMission → Plan<br/>getHeatmap → Heatmap<br/>getRegionChoropleth → Choropleth<br/>getDataQualityMap → Quality Map<br/>getAccessibilityMap → Isochrone Map"]
            DocTools["createDocument<br/>updateDocument"]
            MemTool["updateWorkingMemory"]
        end
        
        subgraph "Delegation Tools"
            DB["investigateData<br/>→ Database Agent"]
            Geo["analyzeGeography<br/>→ Geospatial Agent"]
            Med["medicalReasoning<br/>→ Medical Agent"]
            Web["researchWeb<br/>→ Web Research Agent"]
            Mission["planVolunteerMission<br/>→ Mission Planner Agent"]
            Health["searchHealthcare<br/>→ Health Search Agent"]
        end
        
        Parallel["parallelInvestigate<br/>2-4 agents concurrent"]
    end
    
    subgraph "Data Layer"
        PG[(PostgreSQL + pgvector)]
        Embed["OpenAI text-embedding-3-small<br/>1536 dimensions"]
        Memory["Working Memory<br/>Drizzle-backed"]
        Cache["In-Memory TTL Cache<br/>30-60 min"]
    end
    
    subgraph "External APIs"
        Firecrawl["Firecrawl<br/>Search / Scrape / Extract"]
        WHO["WHO GHO API<br/>Live health indicators"]
        OSM["OpenStreetMap Overpass<br/>Facility corroboration"]
        ORS["OpenRouteService<br/>Isochrone / Travel Time"]
    end
    
    User --> ChatRoute
    ChatRoute --> Auth
    ChatRoute --> Orch
    Orch --> Gateway
    Gateway --> Gemini & Claude & GPT & Grok
    
    Orch --> ArtifactTools & DocTools & MemTool
    Orch --> DB & Geo & Med & Web & Mission & Health
    Orch --> Parallel
    
    DB --> PG
    DB --> Embed
    Geo --> PG
    Med --> PG
    Web --> Firecrawl & WHO & OSM
    Geo --> ORS
    
    MemTool --> Memory
    ArtifactTools --> Cache
    Memory --> PG
```

### Agent Workflow (The Agentic Loop)

```mermaid
sequenceDiagram
    participant U as User
    participant O as Orchestrator
    participant PS as prepareStep
    participant D as Database Agent
    participant M as Medical Agent
    participant G as Geospatial Agent
    participant W as Web Research Agent
    participant DB as PostgreSQL + pgvector
    participant Art as Artifact Stream

    U->>O: "Where should we send an ophthalmologist?"
    O->>PS: stepNumber=0, classify query
    PS-->>O: activeTools=[findMedicalDeserts, planMission, ...]
    
    O->>Art: Stream MedicalDesertArtifact (loading)
    O->>DB: findMedicalDeserts("ophthalmology", 100km)
    DB-->>O: 8 desert zones, 3 providers
    O->>Art: Stream MedicalDesertArtifact (complete)
    
    O->>Art: Stream MissionPlanArtifact (loading)
    O->>DB: planMission("ophthalmology")
    DB-->>O: ranked recommendations
    O->>Art: Stream MissionPlanArtifact (complete)
    
    O->>U: Deployment Briefing + 2 visual artifacts in canvas

    Note over O: Complex multi-perspective query
    U->>O: "Verify cardiology claims in Northern Region"
    O->>PS: stepNumber=0, classify → multi-perspective
    O->>O: parallelInvestigate([database, medical])
    
    par Concurrent Execution
        O->>D: "Query cardiology facilities in Northern Region"
        D->>DB: SQL + semantic search
        DB-->>D: 12 facilities found
        D-->>O: Analysis summary
    and
        O->>M: "Cross-validate cardiology claims"
        M->>DB: detectAnomalies + crossValidateClaims
        DB-->>M: 3 anomalies flagged
        M-->>O: Validation report
    end
    
    O->>U: Combined analysis with confidence ratings
```

### Sub-Agent Architecture

```mermaid
graph LR
    subgraph "Database Agent<br/>Gemini 2.5 Flash Lite · 8 steps"
        DA_P1["Phase 1: Schema Discovery<br/>getSchema, queryDatabase, getDemographics"]
        DA_P2["Phase 2: Deep Investigation<br/>searchFacilities, getFacility"]
        DA_P3["Phase 3: Synthesis<br/>No tools — generate text"]
        DA_P1 --> DA_P2 --> DA_P3
    end
    
    subgraph "Geospatial Agent<br/>Gemini 2.5 Flash Lite · 8 steps"
        GA_P1["Phase 1: Gap ID<br/>findMedicalDeserts, findNearby"]
        GA_P2["Phase 2: Impact Analysis<br/>compareRegions, getTravelTime"]
        GA_P3["Phase 3: Synthesis<br/>No tools — generate text"]
        GA_P1 --> GA_P2 --> GA_P3
    end
    
    subgraph "Medical Reasoning Agent<br/>Gemini 2.5 Flash Lite · 8 steps"
        MA_P1["Phase 1: Detection<br/>detectAnomalies, crossValidateClaims"]
        MA_P2["Phase 2: Deep Validation<br/>classifyServices, analyzeTextEvidence"]
        MA_P3["Phase 3: Confidence Scoring<br/>No tools — generate text"]
        MA_P1 --> MA_P2 --> MA_P3
    end
    
    subgraph "Web Research Agent<br/>Gemini 2.5 Flash Lite · 8 steps"
        WA_P1["Phase 1: Search<br/>getWHOData, firecrawlSearch, queryOSM"]
        WA_P2["Phase 2: Deep Dive<br/>firecrawlScrape, corroborateClaims"]
        WA_P3["Phase 3: Synthesis<br/>No tools — generate text"]
        WA_P1 --> WA_P2 --> WA_P3
    end
    
    subgraph "Mission Planner Agent<br/>Gemini 2.5 Flash Lite · 12 steps"
        MP_P1["Phase 1: Gap ID<br/>findMedicalDeserts, findNearby"]
        MP_P2["Phase 2: Candidate Eval<br/>getFacility, detectAnomalies"]
        MP_P3["Phase 3: Quality Check<br/>evaluatePlan — iterate if <7/10"]
        MP_P4["Phase 4: Final Synthesis"]
        MP_P1 --> MP_P2 --> MP_P3 --> MP_P4
    end
    
    subgraph "Health Search Agent<br/>Gemini 2.5 Flash Lite · 12 steps"
        HS_P1["Phase 1: Understanding<br/>askClarifyingQuestion"]
        HS_P2["Phase 2: Search<br/>searchProviders, firecrawl*"]
        HS_P3["Phase 3: Enrichment<br/>getProviderProfile"]
        HS_P4["Phase 4: Recommendation"]
        HS_P1 --> HS_P2 --> HS_P3 --> HS_P4
    end
```

---

## Technical Deep Dive

### How It Reasons

The system uses **Vercel AI SDK v6** `ToolLoopAgent` — not LangChain, not a custom framework. Each agent runs an autonomous tool loop with phased execution controlled by `prepareStep()`:

1. **Query Classification**: The orchestrator's system prompt contains a routing table mapping query patterns to tool strategies (simple lookup, multi-perspective, geographic, verification, mission planning, external research).

2. **Phased Execution**: `prepareStep({ stepNumber })` restricts which tools are available at each phase. Early steps use discovery tools; later steps force synthesis. This prevents the agent from looping indefinitely.

3. **Parallel Investigation**: For complex queries, `parallelInvestigate` runs 2-4 sub-agents concurrently via `Promise.all()`, then merges their streaming output.

4. **Delegation with Streaming**: Sub-agent output streams back to the client in real-time via `readUIMessageStream`. The orchestrator then summarizes sub-agent results via `toModelOutput` to keep its own context window clean.

5. **Evaluator-Optimizer Pattern**: The Mission Planner agent scores its own recommendations via `evaluatePlan` and iterates if the quality score falls below 7/10.

### RAG Implementation

Semantic search is implemented via **pgvector** cosine similarity over **OpenAI `text-embedding-3-small`** (1536 dimensions):

- **Indexing**: All 987 facilities have pre-computed embeddings generated from concatenated free-text fields (specialties, procedures, equipment, capabilities, description).
- **Query**: User input is embedded at query time, then ranked by `1 - cosineDistance(embedding, queryEmbedding)`.
- **Hybrid**: The system combines vector search (`searchFacilities`) with structured SQL queries (`queryDatabase`) and Haversine geospatial queries (`findNearby`). The agent decides which tool to use based on query intent.

### Tool Calling

The orchestrator has access to **20 tools** organized in three tiers:

| Tier | Tools | Execution |
|------|-------|-----------|
| **Direct (Artifact)** | `findNearby`, `findMedicalDeserts`, `getStats`, `planMission`, `getHeatmap`, `getRegionChoropleth`, `getDataQualityMap`, `getAccessibilityMap` | Stream typed artifacts to canvas with progress states |
| **Direct (Document)** | `createDocument`, `updateDocument`, `updateWorkingMemory` | Session-scoped, no delegation |
| **Delegation** | `investigateData`, `analyzeGeography`, `medicalReasoning`, `researchWeb`, `planVolunteerMission`, `searchHealthcare`, `parallelInvestigate` | Spawn sub-agent `ToolLoopAgent` instances |

Each sub-agent has its own tool inventory (5-6 tools each), totaling **38+ distinct tool implementations** across the system.

---

## Key Features (Implemented)

These features are **verified in the codebase** — not aspirational.

- **Natural Language SQL** — `queryDatabase` accepts LLM-generated SQL with auto-correction of camelCase to snake_case column names, read-only validation, comment stripping, system table blocking, and 15-second timeout enforcement.

- **Semantic Vector Search** — `searchFacilities` generates embeddings via `text-embedding-3-small` and performs cosine similarity search over 987 facility embeddings with optional region/type filtering. Results include anomaly confidence scores.

- **Medical Desert Detection** — `findMedicalDeserts` checks 104+ geocoded Ghanaian cities against facility providers for a given specialty, computing Haversine distances and identifying gap zones beyond configurable thresholds (10-500km).

- **8 Typed Streaming Artifacts** — Facility maps, medical desert maps, stats dashboards, mission plans, heatmaps, regional choropleths, data quality maps, and travel-time isochrone maps. All stream progress states (`loading` → `querying`/`analyzing` → `complete`) to a split-pane canvas UI.

- **Parallel Multi-Agent Investigation** — `parallelInvestigate` runs 2-4 sub-agents concurrently via `Promise.all()`, merging their streamed output. Measured execution time logged to console.

- **Medical Claim Cross-Validation** — `crossValidateClaims` checks procedure claims against equipment using 60+ procedure-equipment mappings. `detectAnomalies` flags infrastructure mismatches, bed-to-staff ratio anomalies, subspecialty-size mismatches, and procedure breadth inconsistencies.

- **Service Classification** — `classifyServices` determines if services are permanent, itinerant/visiting, referral-based, or individual-tied. `analyzeTextEvidence` detects temporary equipment patterns, surgical camp evidence, equipment age indicators, and NGO substitution signals.

- **Live WHO Data Integration** — `getWHOData` fetches real-time indicators (physicians/1000, maternal mortality, life expectancy, UHC coverage, etc.) from the WHO Global Health Observatory API. Supports multi-country comparison.

- **Web Research + Corroboration** — Firecrawl-powered search, scrape, and structured extraction. `corroborateClaims` verifies facility claims across independent web sources. `queryOSMFacilities` cross-references against OpenStreetMap data.

- **Travel Time Isochrones** — OpenRouteService integration computes actual road-network travel time polygons (30/60/120 min) for accessibility analysis. Overlaid on medical desert maps when `showTravelTime: true`.

- **Persistent Working Memory** — Drizzle-backed `WorkingMemory` table stores user preferences, regions of interest, and past analysis findings across chat sessions. Loaded into orchestrator context on each request.

- **Tool Result Caching** — In-memory TTL cache (30-60 min) wraps artifact tools to avoid redundant database queries for identical parameters.

- **Demographics + Benchmarking** — `getDemographics` provides population, GDP, age distribution, disease burden, doctors/nurses per 1000, and WHO benchmarks for demand analysis and unmet needs estimation. Regional data for all 16 Ghana regions.

- **Interactive Provider Search** — `healthSearchAgent` runs an interactive refinement loop: reads uploaded medical documents, asks structured clarifying questions with clickable options, searches for providers via web + local cache, and returns rich provider cards.

- **Mission Planning with Quality Gates** — `missionPlannerAgent` runs a 4-phase autonomous workflow: gap identification, candidate evaluation, quality check (with iteration if score < 7/10), and final synthesis with ranked deployment recommendations.

- **Multi-Model Support** — Vercel AI Gateway routes to 100+ models across Anthropic, OpenAI, Google, xAI, DeepSeek, Mistral, Meta, and more. User selects the orchestrator model; sub-agents default to Gemini 2.5 Flash Lite.

- **PWA Support** — Serwist service worker with offline fallback page, web push notification infrastructure, and install prompt.

---

## The Data

### Ghana Facilities Dataset

| Metric | Value |
|--------|-------|
| Total Facilities | 987 |
| Source | Web-scraped, LLM-extracted (treat as **claims**, not verified facts) |
| Types | Hospital, Clinic, Doctor, Pharmacy, Dentist |
| Operators | Public, Private |
| Geocoded | Lat/Lng coordinates + 104 reference cities |
| Columns | 60+ (structured + free-text + parsed arrays + vector embedding) |

**Key fields stored per facility:**

| Category | Fields |
|----------|--------|
| Identity | `name`, `facility_type`, `operator_type`, `organization_type` |
| Location | `address_region`, `address_city`, `lat`, `lng`, `address_country` |
| Capacity | `num_doctors`, `capacity` (beds), `area_sqm`, `year_established` |
| Free-text (IDP core) | `specialties_raw`, `procedures_raw`, `equipment_raw`, `capabilities_raw`, `description` |
| Parsed arrays | `specialties[]`, `procedures[]`, `equipment[]`, `capabilities[]` |
| Vector | `embedding` (1536-dim, `text-embedding-3-small`) |
| Contact | `phone`, `email`, `website`, `official_website` |
| Enrichment | `enrichment_status`, `enriched_at` |

**Data quality caveats** (from actual `NULL` counts in the system prompt):
- ~733 facilities missing `address_region`
- ~600 facilities missing `num_doctors`
- ~700 facilities missing `capacity`

### Demographics Tables

Three additional tables support demand analysis:
- `demographics_countries` — National-level indicators (population, GDP, doctors/1000, maternal mortality, life expectancy)
- `demographics_regions` — 16 Ghana regions with population, urban/rural split, age distribution, disease burden
- `demographics_benchmarks` — WHO reference values for cross-country comparison

---

## Installation & Reproduction

### Prerequisites

- Node.js 20+
- pnpm 9+
- PostgreSQL 15+ with **pgvector** extension enabled
- Redis (optional, for resumable streams)

### Setup

```bash
# Clone the repository
git clone <repo-url> && cd hacknation

# Install dependencies
cd www
pnpm install

# Configure environment
cp .env.example .env.local
```

### Required Environment Variables

```env
# Auth
AUTH_SECRET="$(openssl rand -base64 32)"

# AI — Vercel AI Gateway (NOT direct provider keys)
# Vercel deployments use OIDC tokens automatically
# Non-Vercel deployments need:
AI_GATEWAY_API_KEY="vgw_..."

# Database — PostgreSQL with pgvector
POSTGRES_URL="postgres://user:pass@host:5432/meridian"

# Storage — Vercel Blob (for file uploads)
BLOB_READ_WRITE_TOKEN="vercel_blob_..."

# Optional
REDIS_URL="redis://..."                # Resumable streams
FIRECRAWL_API_KEY="fc-..."             # Web research agent
ORS_API_KEY="..."                       # OpenRouteService isochrones (free 2k req/day)
```

### Database Setup

```bash
cd www

# Run Drizzle migrations (creates all tables + pgvector extension)
pnpm db:migrate

# Seed 987 facilities from CSV
npx tsx scripts/seed-facilities.ts

# Generate vector embeddings (requires OpenAI API via gateway)
npx tsx scripts/seed-embeddings.ts

# Seed demographics data (Ghana regions + WHO benchmarks)
pnpm db:seed-demographics

# Optional: geocode facilities missing coordinates
npx tsx scripts/geocode-facilities.ts
```

### Run

```bash
cd www
pnpm dev          # http://localhost:3000 (Turbopack)
pnpm build        # Production build
pnpm start        # Production server
```

### Verify

```bash
cd www
pnpm lint         # Biome + Ultracite check
pnpm test         # Playwright E2E tests
pnpm db:studio    # Drizzle Studio (visual DB browser)
pnpm devtools     # AI SDK DevTools
```

---

## Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Framework | Next.js (App Router) | `^16.1.5` | Server components, API routes, streaming |
| AI SDK | Vercel AI SDK | `^6.0.37` | `ToolLoopAgent`, streaming, tool calls, artifacts |
| AI Gateway | `@ai-sdk/gateway` | `^3.0.15` | Multi-provider model routing (BYOK) |
| Agent Framework | `ToolLoopAgent` (AI SDK v6) | Built-in | Phased execution, `prepareStep`, `stopWhen` |
| Database | PostgreSQL + pgvector | `postgres ^3.4.8` | Structured queries + vector similarity search |
| ORM | Drizzle ORM | `^0.34.1` | Schema, migrations, type-safe queries |
| Embeddings | OpenAI `text-embedding-3-small` | 1536-dim | Facility semantic search |
| Artifacts | `@ai-sdk-tools/artifacts` | `^1.2.0` | Typed streaming artifacts with progress |
| Web Research | Firecrawl | `^4.12.0` | Search, scrape, structured extraction |
| Visualization | deck.gl + MapLibre GL | `^9.2.6` / `^5.17.0` | 3D globe, maps, isochrones |
| Auth | NextAuth | `5.0.0-beta.30` | Guest + registered user auth |
| UI Primitives | Radix UI | Various | Accessible component foundations |
| State | Zustand | `^5.0.11` | Client state management |
| Cache | Custom in-memory TTL | N/A | Tool result caching |
| Memory | Custom Drizzle provider | N/A | Persistent working memory |
| PWA | Serwist | `^9.5.5` | Service worker, offline support |
| Styling | Tailwind CSS | `^4.1.18` | Utility-first CSS |
| Validation | Zod | `^3.25.76` | Runtime schema validation |
| Linting | Biome + Ultracite | `2.3.11` / `^7.0.11` | Format + lint |
| Testing | Playwright | `^1.50.1` | E2E tests |
| Language | TypeScript | `^5.6.3` | Type safety |
| Runtime | React | `19.0.1` | UI rendering |

---

## Future Roadmap

These features are **not implemented** in the current codebase. They represent stretch goals from the challenge documentation and planned enhancements.

- **Real-time Citation Tracking** — Interactive citations that link directly to source documents and web pages with provenance chains.
- **Live NGO Coordination** — Real-time dashboard showing active volunteer deployments, scheduling conflicts, and mission overlap detection.
- **Facility Verification Workflow** — Crowdsourced verification system where users confirm or correct facility claims, with a trust scoring mechanism.
- **Historical Data Tracking** — Time-series analysis of facility capability changes, enabling trend detection and predictive gap analysis.
- **Export to CSV/PDF** — One-click export of tool results, analysis reports, and mission plans for offline use.
- **Multi-Region Comparison Views** — Side-by-side 3D globe views for comparing healthcare infrastructure across countries.
- **Data Freshness Indicators** — Visual indicators showing when facility data was last verified, with automated staleness warnings.
- **Enrichment Pipeline Automation** — Automated web scraping to fill missing data fields (the `enrichment/` module exists but is not wired into the agent loop).
- **Databricks Integration** — The challenge suggests Databricks for IDP; current implementation uses direct PostgreSQL + pgvector instead.

---

## Repository Structure

```
hacknation/
├── www/                          # Next.js 16 application
│   ├── app/                      # App Router
│   │   ├── (auth)/               # Auth routes + NextAuth config
│   │   ├── (chat)/               # Chat UI + API routes
│   │   │   └── api/chat/route.ts # Main agent endpoint
│   │   └── (marketing)/          # Landing page
│   ├── components/               # ~134 React components
│   │   ├── artifacts/            # 9 domain artifact renderers
│   │   ├── ai-elements/          # 31 AI chat UI components
│   │   ├── elements/             # 15 core rendering elements
│   │   ├── tool-results/         # 4 specialized tool result cards
│   │   ├── ui/                   # Radix/shadcn primitives
│   │   └── vf-ui/                # Meridian-specific (DeckMap, ToolTrace)
│   ├── lib/
│   │   ├── ai/
│   │   │   ├── agents/           # 6 agents + orchestrator + prompts
│   │   │   ├── artifacts/        # Typed artifact schemas
│   │   │   ├── tools/            # 38+ tool implementations
│   │   │   │   ├── medical/      # 4 medical reasoning tools
│   │   │   │   └── web/          # 6 web research tools
│   │   │   ├── cache.ts          # In-memory TTL cache
│   │   │   ├── memory.ts         # Drizzle-backed working memory
│   │   │   ├── models.ts         # 100+ model definitions
│   │   │   └── providers.ts      # AI Gateway routing
│   │   ├── db/
│   │   │   ├── schema.ts              # Core tables (User, Chat, Message, etc.)
│   │   │   ├── schema.facilities.ts   # 987-facility table (60+ columns + pgvector)
│   │   │   ├── schema.demographics.ts # Demographics + WHO benchmarks
│   │   │   └── migrations/            # 12 Drizzle migrations
│   │   ├── embed.ts              # OpenAI embedding wrapper
│   │   ├── ghana.ts              # 104+ city coordinates
│   │   ├── geocode.ts            # City name → lat/lng resolution
│   │   └── medical-knowledge.ts  # 60+ procedure-equipment mappings
│   ├── scripts/                  # Seed + migration scripts
│   └── tests/                    # Playwright E2E
├── assets/
│   ├── data/ghana-facilities.csv # Source dataset (987 rows)
│   └── docs/                     # Challenge briefs, VF questions, schema docs
├── lib/                          # Standalone logic (legacy stubs)
└── scripts/                      # Python reference models
```

---

## License

Built for the Virtue Foundation at Hack Nation (MIT), February 2026.
