# Meridian AI — Project Status

**Last Updated:** February 8, 2026  
**Status:** Phases 1-5 Complete, Phase 6 Polish & Hardening In Progress

---

## Project Overview

**Meridian AI** is an intelligent healthcare facility analyzer for the Virtue Foundation, designed to help NGO coordinators, volunteer doctors, and healthcare planners understand Ghana's medical infrastructure landscape.

### Core Features
- **987 Healthcare Facilities** across Ghana (hospitals, clinics, pharmacies)
- **Multi-Agent Orchestrator** with 4 specialized sub-agents (database, geospatial, medical reasoning, web research)
- **14 Domain Tools** for facility analysis, gap detection, statistics, volunteer planning, web research, and medical validation
- **4 Platform Tools** for documents, weather, and suggestions
- **Typed Artifact System** with streaming progress states (facility map, medical desert, stats dashboard, mission plan)
- **Semantic Search** via pgvector embeddings (OpenAI `text-embedding-3-small`)
- **Interactive 3D Globe** using deck.gl + MapLibre (split-screen UI)
- **Working Memory** — persistent user context across conversations via Drizzle-backed provider
- **Tool Result Caching** with configurable TTL (`@ai-sdk-tools/cache`)
- **Multi-Provider Model Selection** via Vercel AI Gateway (Google Gemini, Anthropic, OpenAI, xAI)
- **Authentication** with NextAuth (guest + registered users)
- **Resumable Streams** via Redis for chat continuity
- **PWA Support** via Serwist service worker

---

## Challenge Alignment

### Evaluation Criteria Mapping

| Criteria | Weight | What Judges Want | Our Implementation |
|----------|--------|-----------------|-------------------|
| **Technical Accuracy** | 35% | Reliably handle Must-Have queries + detect anomalies | 14 AI tools covering all 15 Must-Have questions. Multi-agent tool chains. Anomaly detection with medical reasoning. Cross-field validation. |
| **IDP Innovation** | 30% | Extract and synthesize from unstructured free-form text | Three-layer IDP: (1) Structured extraction into Postgres arrays during seeding, (2) pgvector semantic search over raw procedure/equipment/capability text, (3) Cross-signal reasoning via anomaly detection and medical validation tools. |
| **Social Impact** | 25% | Identify medical deserts for resource allocation | `findMedicalDeserts` tool with geographic gap analysis. Coverage gap quantification (distance + population). `planMission` volunteer deployment planner. |
| **User Experience** | 10% | Intuitive for non-technical NGO planners using natural language | Chat interface with suggested queries. Interactive 3D globe (deck.gl) highlights results. Tool call transparency via ToolTrace. Artifact streaming with progress states. |

### Core MVP Requirements

| # | MVP Requirement | Status | Implementation |
|---|----------------|--------|---------------|
| 1 | **Unstructured Feature Extraction** | Done | `searchFacilities` (pgvector semantic search), parsed arrays for exact matching, cross-field validation in `detectAnomalies` and `crossValidateClaims` |
| 2 | **Intelligent Synthesis** | Done | Multi-agent orchestrator uses multiple tools per query — SQL for structure, vector search for free-text, then synthesizes. `getStats` combines stats + capabilities + gaps. |
| 3 | **Planning System** | Done | `planMission` — interactive deployment planner for volunteer doctors. Guided flow: input specialty + availability → ranked locations with reasoning. |

### Stretch Goals

| # | Stretch Goal | Status | Implementation |
|---|-------------|--------|---------------|
| 1 | **Citations** | Done | Every tool response includes `facilityId` + `facilityName`. Agent cites these in responses. `ToolTrace` component shows which data was used at each agentic step. |
| 2 | **Map Visualization** | Done | deck.gl 3D globe with ScatterplotLayer markers, fly-to transitions on query results, color-coded facilities and desert zones. |
| 3 | **Real-Impact Bonus** (VF Agent Questions) | Done | All 15 Must-Have questions covered. Additional coverage of Should-Have questions via `classifyServices`, `crossValidateClaims`, and web research tools. |

### Must-Have Question Coverage (15 of 15)

| # | Question | Tool(s) Used |
|---|----------|-------------|
| 1.1 | How many hospitals have cardiology? | `queryDatabase` |
| 1.2 | How many hospitals in [region] can perform [procedure]? | `queryDatabase` + `searchFacilities` |
| 1.3 | What services does [Facility Name] offer? | `getFacility` |
| 1.4 | Are there any clinics in [Area] that do [Service]? | `searchFacilities` |
| 1.5 | Which region has the most [Type] hospitals? | `queryDatabase` |
| 2.1 | How many hospitals treating [condition] within [X] km of [location]? | `findNearby` |
| 2.3 | Largest geographic cold spots where procedure absent within X km? | `findMedicalDeserts` |
| 4.4 | Facilities claiming unrealistic procedures relative to size? | `detectAnomalies` |
| 4.7 | Correlations between facility characteristics that move together? | `detectAnomalies` + `queryDatabase` |
| 4.8 | High breadth of claimed procedures vs infrastructure? | `detectAnomalies` |
| 4.9 | "Things that shouldn't move together"? | `detectAnomalies` |
| 6.1 | Where is the workforce for [subspecialty] in [region]? | `searchFacilities` + `queryDatabase` |
| 7.5 | Which procedures depend on very few facilities (1-2 only)? | `queryDatabase` |
| 7.6 | Oversupply of low-complexity vs scarcity of high-complexity? | `queryDatabase` + `searchFacilities` |
| 8.3 | Gaps where no organizations working despite evident need? | `findMedicalDeserts` + `queryDatabase` |

---

## Architecture

### Monorepo Layout
```
hacknation/
├── www/                    # Next.js 16 application (primary codebase)
│   ├── app/                # App Router (auth, chat, API routes)
│   ├── artifacts/          # Artifact renderers (code, image, sheet, text)
│   ├── components/         # React components (~134 files)
│   │   ├── ai-elements/    # AI chat UI (28 files)
│   │   ├── artifacts/      # Domain artifact renderers (4 files)
│   │   ├── elements/       # Core rendering elements (15 files)
│   │   ├── tool-results/   # Tool result card renderers (15 files)
│   │   ├── ui/             # Radix/shadcn primitives (25 files)
│   │   └── vf-ui/          # Meridian-specific (DeckMap, ToolTrace)
│   ├── hooks/              # Custom React hooks (6 files)
│   ├── lib/                # Core libraries
│   │   ├── ai/
│   │   │   ├── agents/     # Multi-agent system (orchestrator + 4 sub-agents)
│   │   │   ├── artifacts/  # Typed artifact schemas (@ai-sdk-tools/artifacts)
│   │   │   ├── tools/      # 14 domain tools + 4 platform tools + utilities
│   │   │   │   ├── medical/  # classifyServices, crossValidateClaims, validateEnrichment
│   │   │   │   └── web/      # firecrawlSearch, firecrawlScrape, firecrawlExtract
│   │   │   ├── cache.ts    # Tool result caching (@ai-sdk-tools/cache)
│   │   │   ├── memory.ts   # Working memory provider (@ai-sdk-tools/memory)
│   │   │   ├── models.ts   # 10 model definitions
│   │   │   ├── prompts.ts  # System prompts (artifacts, code, sheet, title)
│   │   │   └── providers.ts # AI Gateway model routing
│   │   ├── db/             # Drizzle ORM (schema, migrations, queries)
│   │   └── editor/         # ProseMirror editor config
│   ├── scripts/            # DB migration & seeding scripts
│   ├── tests/              # Playwright E2E tests
│   └── public/             # Static assets (icons, manifest, logo)
├── lib/                    # Standalone logic (original implementations, Ghana data, tool stubs)
├── assets/                 # Documentation & raw data
│   ├── data/               # ghana-facilities.csv (source data)
│   └── docs/               # Challenge brief, VF questions, blueprint, schema docs
├── scripts/                # Python reference models
└── .github/workflows/      # CI (lint + Playwright)
```

### Key Architectural Decisions
- **Multi-Agent Architecture** via `ToolLoopAgent` from Vercel AI SDK v6 — orchestrator delegates to specialized sub-agents
- **Vercel AI Gateway** for multi-provider model routing (proper `gateway(modelId)` dispatch)
- **Vercel AI SDK v6** (`ai@^6.0.37`) for streaming, tool calls, agent loops, and artifact streaming
- **@ai-sdk-tools/artifacts** for typed streaming artifacts with progress states
- **@ai-sdk-tools/cache** for tool result caching (Redis in production, LRU in dev)
- **@ai-sdk-tools/memory** for persistent working memory across conversations
- **Drizzle ORM** (`^0.34.1`) with PostgreSQL + pgvector for structured + vector queries
- **deck.gl** (`^9.2.6`) + **MapLibre GL** (`^5.17.0`) for 3D globe visualization (replaced Leaflet)
- **Google Gemini 2.5 Flash Lite** as default model; sub-agents also use Gemini Flash Lite
- **OpenAI** for embeddings only (`text-embedding-3-small`, 1536 dimensions)
- **Firecrawl** (`@mendable/firecrawl-js@^4.12.0`) for web research (search, scrape, extract)
- **Radix UI** primitives for accessible component foundations
- **Serwist** (`^9.5.5`) for PWA / service worker support
- **Biome** (`2.3.11`) + **Ultracite** (`^7.0.11`) for linting/formatting

---

## Implementation Status

### Phase 1: Database & Seeding (COMPLETE)
**Deliverables:**
- [x] PostgreSQL schema with Drizzle ORM (`facilities` table, 60+ columns)
- [x] pgvector extension enabled (1536-dimension embeddings)
- [x] Seeded 987 facilities from `assets/data/ghana-facilities.csv`
- [x] Generated embeddings for all facilities
- [x] 10 Drizzle migrations (`0000`–`0009`)
- [x] Indexes for region, city, type, geolocation (lat/lng)

**Key Files:**
- `www/lib/db/schema.facilities.ts` — Facility table schema (60+ columns including arrays, vectors)
- `www/lib/db/schema.ts` — Core tables (user, chat, message, vote, document, suggestion, stream, workingMemory, conversationMessages)
- `www/lib/db/index.ts` — Drizzle client initialization
- `www/lib/db/queries.ts` — CRUD operations (users, chats, messages, voting, documents, streams)
- `www/lib/db/migrations/` — 10 migration SQL files + snapshots
- `www/scripts/migrate.ts` — Migration runner
- `www/scripts/seed-facilities.ts` — CSV import script
- `www/scripts/seed-embeddings.ts` — Embedding generation script

---

### Phase 2: AI Tool Implementation (COMPLETE)
**Deliverables:**
- [x] 14 domain tools with Zod schemas (database, geospatial, statistics, medical, web research)
- [x] 4 artifact-enhanced tool wrappers (stream typed artifacts to client canvas)
- [x] 4 platform tools (documents, weather, suggestions)
- [x] Safeguards module (`safeguards.ts`) for timeout, truncation, SQL validation, input clamping
- [x] Debug logging utility (`createToolLogger`)
- [x] Medical knowledge base (`www/lib/medical-knowledge.ts`)
- [x] Ghana geographic data — 104+ city coordinates (`www/lib/ghana.ts`)
- [x] System prompts with full medical context (`www/lib/ai/prompts.ts`, `www/lib/ai/agents/prompts.ts`)

**Database Tools (3):**
| Tool | File | Description |
|------|------|-------------|
| `queryDatabase` | `queryDatabase.ts` | Read-only SQL execution with enhanced safety checks (comment stripping, system table blocking, length limits) |
| `searchFacilities` | `searchFacilities.ts` | Semantic vector search via embeddings (cosine distance) |
| `getFacility` | `getFacility.ts` | Single facility lookup (exact ID or fuzzy name ILIKE) |

**Geospatial Tools (4):**
| Tool | File | Description |
|------|------|-------------|
| `findNearby` | `findNearby.ts` | Geospatial proximity search (Haversine formula, city name or lat/lng) |
| `findMedicalDeserts` | `findMedicalDeserts.ts` | Geographic gap analysis (checks major cities vs providers) |
| `compareRegions` | `compareRegions.ts` | Side-by-side metrics comparison for 2–5 Ghana regions |
| `planMission` | `planMission.ts` | Volunteer deployment planner (orchestrates gap analysis + proximity search) |

**Medical Reasoning Tools (3):**
| Tool | File | Description |
|------|------|-------------|
| `detectAnomalies` | `detectAnomalies.ts` | Data quality checks (infrastructure mismatches, missing data) |
| `classifyServices` | `medical/classifyServices.ts` | Classify services as permanent, itinerant/visiting, or referral-based |
| `crossValidateClaims` | `medical/crossValidateClaims.ts` | Cross-reference procedure claims against equipment/infrastructure |

**Web Research Tools (3):**
| Tool | File | Description |
|------|------|-------------|
| `firecrawlSearch` | `web/firecrawl-search.ts` | Search the web for real-time health data, WHO reports, news |
| `firecrawlScrape` | `web/firecrawl-scrape.ts` | Read full content from a specific URL |
| `firecrawlExtract` | `web/firecrawl-extract.ts` | Extract structured data from web pages using AI |

**Statistics Tools (1):**
| Tool | File | Description |
|------|------|-------------|
| `getStats` | `getStats.ts` | Aggregate dashboard statistics: facility counts, regional breakdowns, specialty coverage, capacity summaries, data quality metrics |

**Artifact-Enhanced Tool Wrappers (4):**
| Tool | File | Description |
|------|------|-------------|
| `findNearbyArtifact` | `artifact-tools.ts` | Streams `FacilityMapArtifact` to client canvas with progress |
| `findMedicalDesertsArtifact` | `artifact-tools.ts` | Streams `MedicalDesertArtifact` to client canvas with progress |
| `getStatsArtifact` | `artifact-tools.ts` | Streams `StatsDashboardArtifact` to client canvas with progress |
| `planMissionArtifact` | `artifact-tools.ts` | Streams `MissionPlanArtifact` to client canvas with progress |

**Platform Tools (4):**
| Tool | File | Description |
|------|------|-------------|
| `getWeather` | `get-weather.ts` | Weather lookup via Open-Meteo (requires user approval) |
| `createDocument` | `create-document.ts` | Artifact creation (code, image, sheet, text) |
| `updateDocument` | `update-document.ts` | Artifact updates with real-time streaming |
| `requestSuggestions` | `request-suggestions.ts` | AI-powered writing suggestions for documents |

**Safeguards (`safeguards.ts`):**
- `withTimeout()` — Wraps async operations with configurable timeout + abort signal
- `truncateResults()` — Caps result arrays with metadata for LLM context
- `stripEmbeddings()` — Removes 1536-dim vectors from results to save tokens
- `validateReadOnlySQL()` — Enhanced SQL validation: comment stripping, keyword blocking, system table protection, statement count limits
- `clampNumber()` / `isValidCoordinates()` — Input validation helpers
- Constants: `DB_QUERY_TIMEOUT_MS` (15s), `MAX_RESULT_ROWS` (100), `MAX_SEARCH_ROWS` (50)

---

### Phase 3: Multi-Agent System (COMPLETE)
**Deliverables:**
- [x] Orchestrator agent (`ToolLoopAgent`, 15-step limit) that delegates to specialized sub-agents
- [x] 4 sub-agents: database, geospatial, medical reasoning, web research (each 6-step limit)
- [x] Delegation tools with streaming — sub-agent output streams to client as preliminary results
- [x] Working memory system — persistent user context stored in PostgreSQL via Drizzle
- [x] Tool result caching with TTL (30min for findNearby/getStats, 60min for findMedicalDeserts)
- [x] Artifact-enhanced geospatial tools available at orchestrator level for direct canvas streaming
- [x] Per-agent system prompts with domain-specific instructions
- [x] `updateWorkingMemory` tool for agents to persist important facts about users

**Agent Architecture:**

| Agent | Model | Tools | Max Steps | Description |
|-------|-------|-------|-----------|-------------|
| **Orchestrator** | User-selected via Gateway | 13 (4 direct + 4 artifact + 4 delegation + 1 memory) | 15 | Coordinates sub-agents, handles artifacts, manages memory |
| `databaseAgent` | Gemini 2.5 Flash Lite | queryDatabase, searchFacilities, getFacility | 6 | Database queries and analysis |
| `geospatialAgent` | Gemini 2.5 Flash Lite | findNearby, findMedicalDeserts, compareRegions, planMission | 6 | Geographic coverage analysis |
| `medicalReasoningAgent` | Gemini 2.5 Flash Lite | detectAnomalies, crossValidateClaims, classifyServices | 6 | Medical data validation |
| `webResearchAgent` | Gemini 2.5 Flash Lite | firecrawlSearch, firecrawlScrape, firecrawlExtract | 6 | Real-time web data retrieval |

**Key Files:**
- `www/lib/ai/agents/orchestrator.ts` — Main orchestrator agent (creates delegation tools, loads memory)
- `www/lib/ai/agents/database-agent.ts` — Database sub-agent
- `www/lib/ai/agents/geospatial-agent.ts` — Geospatial sub-agent
- `www/lib/ai/agents/medical-reasoning-agent.ts` — Medical reasoning sub-agent
- `www/lib/ai/agents/web-research-agent.ts` — Web research sub-agent
- `www/lib/ai/agents/prompts.ts` — All agent-specific system prompts
- `www/lib/ai/agents/index.ts` — Agent exports
- `www/lib/ai/memory.ts` — `MeridianMemoryProvider` (Drizzle-backed working memory)
- `www/lib/ai/cache.ts` — Tool caching factory (`@ai-sdk-tools/cache`)

---

### Phase 4: Agent Integration & API (COMPLETE)
**Deliverables:**
- [x] Chat API route creates orchestrator agent with session/dataStream context
- [x] Proper model routing via `gateway(modelId)` — respects user-selected model
- [x] `@ai-sdk/devtools` middleware wraps models in development for debugging
- [x] Comprehensive debug logging (`[ChatRoute]` prefix throughout)
- [x] Error handling with `ChatSDKError` classes
- [x] Geolocation context injection via `@vercel/functions`
- [x] Resumable stream support via Redis
- [x] Message persistence (save, update, title generation)
- [x] Tool approval flow support
- [x] Rate limiting by user type (guest: 20/day, regular: 50/day)
- [x] AI Gateway credit card error detection and user-facing message

**Key Files:**
- `www/app/(chat)/api/chat/route.ts` — Main POST/DELETE chat endpoint (uses `createOrchestratorAgent`)
- `www/app/(chat)/api/chat/schema.ts` — Request body validation schema
- `www/lib/ai/prompts.ts` — System prompts (artifacts, code, sheet, title)
- `www/lib/ai/providers.ts` — Model provider functions (`getLanguageModel`, `getTitleModel`, `getArtifactModel`)
- `www/lib/ai/models.ts` — 10 model definitions across 5 providers
- `www/lib/ai/entitlements.ts` — Rate limits by user type

**Available Models (10):**
| Provider | Model | ID |
|----------|-------|----|
| Anthropic | Claude Haiku 4.5 | `anthropic/claude-haiku-4.5` |
| Anthropic | Claude Sonnet 4.5 | `anthropic/claude-sonnet-4.5` |
| Anthropic | Claude Opus 4.5 | `anthropic/claude-opus-4.5` |
| OpenAI | GPT-4.1 Mini | `openai/gpt-4.1-mini` |
| OpenAI | GPT-5.2 | `openai/gpt-5.2` |
| Google | Gemini 2.5 Flash Lite (default) | `google/gemini-2.5-flash-lite` |
| Google | Gemini 3 Pro | `google/gemini-3-pro-preview` |
| xAI | Grok 4.1 Fast | `xai/grok-4.1-fast-non-reasoning` |
| Reasoning | Claude 3.7 Sonnet Thinking | `anthropic/claude-3.7-sonnet-thinking` |
| Reasoning | Grok Code Fast Thinking | `xai/grok-code-fast-1-thinking` |

---

### Phase 5: Frontend UI (COMPLETE)
**Deliverables:**
- [x] Split-pane layout (Chat left, 3D Globe right)
- [x] deck.gl + MapLibre 3D globe with dark CARTO basemap tiles
- [x] VF Context for shared state management
- [x] 15 specialized tool result card renderers
- [x] Full artifact system with streaming progress (facility map, medical desert, stats dashboard, mission plan)
- [x] Traditional artifact types (code editor, image editor, sheet editor, text editor)
- [x] Sidebar with chat history
- [x] Model selector UI
- [x] Authentication forms (login, register, guest)
- [x] Theme provider (dark/light)
- [x] PWA manifest and service worker (Serwist)

**Component Architecture:**

| Directory | Count | Purpose |
|-----------|-------|---------|
| `components/ai-elements/` | 28 | AI chat UI (reasoning, sources, chain-of-thought, tool vis, canvas, nodes, edges, etc.) |
| `components/tool-results/` | 15 | Specialized tool result cards (nearby, deserts, stats, missions, anomalies, web, regions, etc.) |
| `components/elements/` | 15 | Core rendering elements (message, loader, suggestion, task, etc.) |
| `components/ui/` | 25 | Radix/shadcn primitives (button, dialog, select, sidebar, etc.) |
| `components/artifacts/` | 4 | Domain artifact renderers (facility-map, medical-desert, mission-plan, stats-dashboard) |
| `components/vf-ui/` | 2 | Meridian-specific (DeckMap, ToolTrace) |
| `components/` (root) | 40+ | Top-level (chat, messages, multimodal-input, artifact, sidebar, etc.) |

**Meridian-Specific Components:**
- `DeckMap.tsx` — Interactive deck.gl 3D globe with ScatterplotLayer, fly-to transitions, hover tooltips, desert/facility color coding, and highlighted facility support
- `ToolTrace.tsx` — Expandable tool call display with per-tool icons, agent delegation awareness, formatted args, JSON output, and "View on Map" integration

**Tool Result Cards (15):**
- `agent-delegation-card.tsx` — Sub-agent delegation status
- `anomaly-alerts-result.tsx` — Data anomaly findings
- `claims-validation-result.tsx` — Cross-validation results
- `facility-profile-card.tsx` — Single facility deep-dive
- `medical-deserts-result.tsx` — Medical desert visualization
- `mission-plan-result.tsx` — Volunteer mission recommendations
- `nearby-facilities-result.tsx` — Proximity search results
- `query-database-result.tsx` — Raw SQL query results
- `region-comparison-result.tsx` — Side-by-side region metrics
- `search-facilities-result.tsx` — Semantic search results
- `service-classification-result.tsx` — Service type classifications
- `stats-overview-result.tsx` — Aggregated statistics
- `web-search-result.tsx` — Web search results
- `web-scrape-result.tsx` — Web scrape results
- `web-extract-result.tsx` — Web extract results

**Typed Artifact Schemas (4):**
- `FacilityMapArtifact` — Interactive deck.gl map with markers, center, radius, progress
- `MedicalDesertArtifact` — Desert zones with providers, threshold, progress
- `StatsDashboardArtifact` — Metrics grid with groupBy, stats array, progress
- `MissionPlanArtifact` — Timeline with volunteer profile, recommendations, progress

**Map Features (deck.gl):**
- `ScatterplotLayer` for facility/desert markers with color coding (blue=facility, red=desert)
- `FlyToInterpolator` transitions when map context center/zoom changes
- Auto-highlight on hover with tooltips (name, type, city, distance)
- Highlighted facility ring for active selections
- Dark CARTO basemap via MapLibre GL
- SSR-safe via client-only rendering

**Traditional Artifact Types:**
- Code (Python) — CodeMirror editor with syntax highlighting
- Image — Image editor/viewer
- Sheet — Spreadsheet via `react-data-grid`
- Text — ProseMirror rich text editor

---

### Phase 6: Runtime Debugging & Polish (IN PROGRESS)

**Resolved Issues:**
- [x] Model provider routing fixed — `gateway(modelId)` properly dispatches to selected model
- [x] Context provider missing — Added `VFProvider` to both chat routes
- [x] `message.parts.filter` crash — Added optional chaining
- [x] Build compilation errors — All resolved
- [x] Comprehensive debug logging added to chat route (`[ChatRoute]` prefix)
- [x] Error stream reporting for agent failures
- [x] AI Gateway credit card error detection and user-facing message
- [x] Enhanced SQL safety (comment stripping, system table blocking, multiple statement prevention)
- [x] Tool result caching to reduce redundant queries
- [x] DevTools middleware for development debugging

**Open Issues:**

1. **Root `lib/` Stubs** (Cleanup)
   - **Severity:** Low
   - **Location:** `lib/logic/findMedicalDeserts.ts`, `lib/logic/findNearby.ts`, `lib/tools/index.ts`
   - **Problem:** These contain standalone implementations from an earlier architecture phase. The actual AI tools (with Zod schemas, safeguards, and agent integration) live in `www/lib/ai/tools/`.
   - **Impact:** Confusing project structure; duplicated logic.
   - **Fix:** Remove or consolidate into the `www/lib/ai/tools/` implementations.

2. **Type Safety** (Tech Debt)
   - **Severity:** Medium
   - **Locations:** `www/lib/ai/tools/artifact-tools.ts`, various tool files
   - **Problem:** `as any` type assertions used to bridge zod v3 → v4 boundary in artifact schemas and raw tool result types.
   - **Impact:** No compile-time type checking at artifact boundaries.

3. **SQL Injection Surface** (Security)
   - **Severity:** Medium
   - **Location:** `www/lib/ai/tools/queryDatabase.ts`, `www/lib/ai/tools/safeguards.ts`
   - **Problem:** Accepts raw SQL from the LLM. Enhanced safety checks exist (comment stripping, keyword blocking, system table protection, length limits) but pattern matching could still be bypassed.
   - **Impact:** Potential for malicious queries if LLM is manipulated.

4. **City Resolution Gaps** (Data)
   - **Severity:** Low
   - **Location:** `www/lib/ai/tools/findNearby.ts`
   - **Problem:** `findNearby` resolves city names via `CITY_COORDS` (104 entries). Unknown cities fail silently.
   - **Impact:** Geospatial searches for unlisted cities return no results.

5. **Missing FIRECRAWL_API_KEY in .env.example** (Config)
   - **Severity:** Low
   - **Location:** `www/.env.example`
   - **Problem:** Web research tools require `FIRECRAWL_API_KEY` but it is not listed in the env example file.
   - **Impact:** Web research agent tools fail at runtime without the key.

---

## Environment Setup

### Required Environment Variables
Create `www/.env.local` based on `www/.env.example`:

```env
# Auth (NextAuth)
AUTH_SECRET="..."           # Generate: openssl rand -base64 32

# AI (Vercel AI Gateway — NOT direct provider keys)
AI_GATEWAY_API_KEY="..."    # Required for non-Vercel deployments
                            # Vercel deployments use OIDC tokens automatically

# Storage
BLOB_READ_WRITE_TOKEN="..." # Vercel Blob Store (file uploads)
POSTGRES_URL="..."          # PostgreSQL with pgvector (Neon/Vercel Postgres)

# Optional
REDIS_URL="..."             # Redis (resumable streams + production cache)
FIRECRAWL_API_KEY="..."     # Firecrawl (web research agent tools)
```

### Database Schema

**Core Tables** (in `www/lib/db/schema.ts`):
- `User` — Authentication (email, password)
- `Chat` — Conversations (title, visibility, userId)
- `Message_v2` — Messages with `parts` JSON (v2 schema)
- `Message` — Deprecated v1 messages (kept for migration)
- `Vote_v2` — User feedback on messages
- `Vote` — Deprecated v1 votes (kept for migration)
- `Document` — Artifact storage (title, kind, content)
- `Suggestion` — AI-generated document suggestions
- `Stream` — Resumable stream tracking
- `WorkingMemory` — Persistent user/chat memory for the AI agent
- `ConversationMessage` — Conversation message log for memory context

**Facilities Table** (in `www/lib/db/schema.facilities.ts`):
- 987 rows seeded from CSV
- 60+ columns including: `id`, `name`, `facilityType`, `operatorType`, `addressRegion`, `addressCity`, `lat`, `lng`, `numDoctors`, `capacity`
- Text fields: `specialtiesRaw`, `proceduresRaw`, `equipmentRaw`, `description`
- Parsed arrays: `specialties`, `procedures`, `equipment`, `capabilities`
- Vector: `embedding` (1536 dimensions, pgvector)
- Indexes: region, city, type, geolocation

---

## CI/CD

### GitHub Actions Workflows

**Lint** (`.github/workflows/lint.yml`):
- Trigger: Push to any branch
- Node 20, pnpm 9.12.3
- Runs `pnpm lint` (Ultracite/Biome)

**Playwright** (`.github/workflows/playwright.yml`):
- Trigger: Push or PR to main/master
- Timeout: 30 minutes
- Installs Playwright browsers (chromium only), runs `pnpm test`
- Uploads test reports as artifacts (7-day retention)
- Secrets: `AUTH_SECRET`, `POSTGRES_URL`, `BLOB_READ_WRITE_TOKEN`, `REDIS_URL`

### E2E Tests (`www/tests/`):
- `e2e/api.test.ts` — API endpoint tests
- `e2e/auth.test.ts` — Authentication flow tests
- `e2e/chat.test.ts` — Chat functionality tests
- `e2e/model-selector.test.ts` — Model selector UI tests
- `fixtures.ts` — Test fixtures
- `helpers.ts` — Test utilities
- `pages/chat.ts` — Page object model
- `prompts/utils.ts` — Prompt testing utilities

---

## Next Steps

### Immediate (High Priority)
1. **Verify Runtime Stability:**
   - [ ] Test all 4 sub-agents via the chat interface
   - [ ] Confirm artifact streaming works for findNearby, findMedicalDeserts, getStats, planMission
   - [ ] Test deck.gl globe updates and fly-to transitions
   - [ ] Check embedding generation (OpenAI `text-embedding-3-small`)
   - [ ] Validate working memory persistence across conversations
   - [ ] Test web research agent (Firecrawl) end-to-end

2. **Add Missing Config:**
   - [ ] Add `FIRECRAWL_API_KEY` to `www/.env.example`
   - [ ] Document Firecrawl setup in README

### Short-Term (Polish)
3. **Code Cleanup:**
   - [ ] Remove or consolidate root `lib/logic/` and `lib/tools/` stubs
   - [ ] Resolve `as any` type assertions in artifact-tools.ts
   - [ ] Consolidate duplicate Ghana data between root `lib/` and `www/lib/`

4. **UI Enhancements:**
   - [ ] Add loading states to deck.gl globe component
   - [ ] Improve tool result card styling
   - [ ] Add error boundaries for map and artifact components
   - [ ] Mobile responsive layout for split-pane view

5. **Tool Refinements:**
   - [ ] Improve `planMission` recommendation logic
   - [ ] Add more medical knowledge mappings
   - [ ] Strengthen SQL injection prevention in `queryDatabase`
   - [ ] Add caching to web research tools

### Long-Term (Features)
6. **Advanced Capabilities:**
   - [ ] Export tool results to CSV/PDF
   - [ ] Save favorite facilities
   - [ ] Multi-region comparison views on globe
   - [ ] Historical data tracking

7. **Data Quality:**
   - [ ] Facility verification workflow
   - [ ] User-submitted corrections
   - [ ] Data freshness indicators
   - [ ] Fill missing region data (~733 null regions)

---

## Development Commands

### Application
```bash
cd www
pnpm dev                    # Start dev server (Turbopack, http://localhost:3000)
pnpm build                  # Production build
pnpm start                  # Production server
pnpm lint                   # Ultracite/Biome check
pnpm format                 # Ultracite/Biome fix
pnpm devtools               # AI SDK DevTools
```

### Database
```bash
cd www
pnpm db:generate            # Generate Drizzle migrations
pnpm db:migrate             # Run migrations (npx tsx lib/db/migrate.ts)
pnpm db:studio              # Open Drizzle Studio (DB browser)
pnpm db:push                # Push schema to DB
pnpm db:pull                # Pull schema from DB
pnpm db:check               # Check migration consistency
pnpm db:up                  # Update snapshots
npx tsx scripts/seed-facilities.ts  # Seed facility data
npx tsx scripts/seed-embeddings.ts  # Generate embeddings
```

### Testing
```bash
cd www
pnpm test                   # Run Playwright E2E tests
```

---

## Key Files Reference

### Database & Schema
| File | Purpose |
|------|---------|
| `www/lib/db/schema.facilities.ts` | Facility table (60+ columns, pgvector) |
| `www/lib/db/schema.ts` | Core tables (user, chat, message, vote, document, suggestion, stream, workingMemory, conversationMessages) |
| `www/lib/db/index.ts` | Drizzle client initialization |
| `www/lib/db/queries.ts` | All CRUD operations |
| `www/lib/db/utils.ts` | Database utilities |
| `www/lib/db/helpers/01-core-to-parts.ts` | Migration helper (v1 → v2 message schema) |
| `www/lib/db/migrations/` | 10 SQL migration files |
| `www/drizzle.config.ts` | Drizzle configuration |

### AI Agents
| File | Purpose |
|------|---------|
| `www/lib/ai/agents/orchestrator.ts` | Main orchestrator agent (delegation + direct tools + memory) |
| `www/lib/ai/agents/database-agent.ts` | Database sub-agent (queryDatabase, searchFacilities, getFacility) |
| `www/lib/ai/agents/geospatial-agent.ts` | Geospatial sub-agent (findNearby, findMedicalDeserts, compareRegions, planMission) |
| `www/lib/ai/agents/medical-reasoning-agent.ts` | Medical reasoning sub-agent (detectAnomalies, crossValidateClaims, classifyServices) |
| `www/lib/ai/agents/web-research-agent.ts` | Web research sub-agent (firecrawlSearch, firecrawlScrape, firecrawlExtract) |
| `www/lib/ai/agents/prompts.ts` | All agent-specific system prompts |

### AI Tools & Infrastructure
| File | Purpose |
|------|---------|
| `www/lib/ai/tools/` | 14 domain tools + 4 platform tools + artifact wrappers + utilities |
| `www/lib/ai/tools/safeguards.ts` | Timeout, truncation, SQL validation, input clamping |
| `www/lib/ai/tools/artifact-tools.ts` | Artifact-enhanced tool wrappers (stream to canvas) |
| `www/lib/ai/tools/getStats.ts` | Aggregate statistics tool (facility counts, regional breakdowns, data quality) |
| `www/lib/ai/tools/getSchema.ts` | Schema introspection utility for agent context |
| `www/lib/ai/tools/schema-map.ts` | Schema-to-tool mapping helper |
| `www/lib/ai/tools/medical/validateEnrichment.ts` | Medical data enrichment validation utility |
| `www/lib/ai/artifacts/schemas.ts` | Typed artifact schemas (4 domain artifacts) |
| `www/lib/ai/prompts.ts` | System prompts (artifacts, code, sheet, title) |
| `www/lib/ai/providers.ts` | Model provider functions (gateway routing, devtools) |
| `www/lib/ai/models.ts` | 10 model definitions (Anthropic, OpenAI, Google, xAI) |
| `www/lib/ai/entitlements.ts` | Rate limits by user type |
| `www/lib/ai/cache.ts` | Tool result caching factory |
| `www/lib/ai/memory.ts` | MeridianMemoryProvider (Drizzle-backed working memory) |
| `www/app/(chat)/api/chat/route.ts` | Main chat API endpoint (creates orchestrator agent) |

### Frontend
| File | Purpose |
|------|---------|
| `www/components/chat.tsx` | Main chat with split-pane globe integration |
| `www/components/messages.tsx` | Message list with tool trace rendering |
| `www/components/vf-ui/DeckMap.tsx` | deck.gl 3D globe (ScatterplotLayer, fly-to, tooltips) |
| `www/components/vf-ui/ToolTrace.tsx` | Expandable tool call display with agent delegation awareness |
| `www/components/tool-results/` | 15 specialized tool result card renderers |
| `www/components/artifacts/` | 4 domain artifact renderers (facility-map, medical-desert, mission-plan, stats-dashboard) |
| `www/lib/vf-context.tsx` | React Context for map state (facilities, center, zoom, highlight) |
| `www/components/ai-elements/` | AI chat UI components (28 files) |
| `www/components/elements/` | Core rendering elements (15 files) |
| `www/components/ui/` | shadcn/Radix primitives (25 files) |

### Utilities
| File | Purpose |
|------|---------|
| `www/lib/embed.ts` | OpenAI embedding wrapper |
| `www/lib/ghana.ts` | Ghana city coordinates (104+ cities) |
| `www/lib/medical-knowledge.ts` | Medical procedure/equipment mappings |
| `www/lib/errors.ts` | ChatSDKError error classes |
| `www/lib/types.ts` | Shared TypeScript types |
| `www/lib/constants.ts` | Environment constants |
| `www/lib/utils.ts` | General utilities |

### Reference Data
| File | Purpose |
|------|---------|
| `assets/data/ghana-facilities.csv` | Raw facility data (987 rows, 40+ columns) |
| `assets/docs/technical-blueprint-v2.md` | Architecture blueprint, tool designs, and implementation plan |
| `assets/docs/Virtue Foundation Agent Questions - Hack Nation.md` | 59 questions across 11 categories (15 Must-Have, 14 Should-Have, etc.) |
| `assets/docs/1. Databricks_ Bridging Medical Deserts...md` | Official Databricks challenge brief (MVP requirements, evaluation criteria, stretch goals) |
| `assets/docs/Virtue Foundation Scheme Documentation.md` | Schema definitions for facility data (field types, descriptions, enums) |
| `scripts/python_models/` | 4 Pydantic extraction models (organizations, specialties, facts, fields) |

---

## Known Limitations

1. **Data Quality:**
   - Facility data is LLM-scraped from web sources (not verified)
   - ~733 facilities missing region data
   - ~600 facilities missing doctor counts
   - ~700 facilities missing bed capacity

2. **Geographic Coverage:**
   - City coordinates limited to 104 known cities/neighborhoods
   - Medical desert analysis may miss rural areas without known coordinates

3. **Type Safety:**
   - Artifact tools use `as any` due to zod v3/v4 boundary incompatibility
   - Some tool result types cast through `any`

4. **Performance:**
   - Embedding generation is slow (~10 facilities/batch)
   - Vector search may be slow on large result sets (use limits)
   - `queryDatabase` results capped at 100 rows
   - Sub-agents each make their own model calls (increases latency for complex queries)

5. **Security:**
   - `queryDatabase` accepts raw LLM-generated SQL with enhanced keyword-based safety checks
   - No parameterized queries for LLM-generated SQL
   - Comment stripping and system table blocking mitigate but don't eliminate risk

6. **Web Research:**
   - Requires `FIRECRAWL_API_KEY` not documented in `.env.example`
   - Web scraping results vary in quality depending on target site
   - No rate limiting on Firecrawl API calls

---

## External Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| Next.js | `16.0.10` | App framework |
| React | `19.0.1` | UI library |
| Vercel AI SDK | `^6.0.37` | Streaming, agents, tool loops, multi-step |
| `@ai-sdk/gateway` | `^3.0.15` | Vercel AI Gateway routing |
| `@ai-sdk/google` | `^3.0.22` | Google Gemini provider |
| `@ai-sdk/openai` | `^3.0.26` | OpenAI provider (embeddings) |
| `@ai-sdk/react` | `3.0.39` | React hooks for AI SDK |
| `@ai-sdk/devtools` | `^0.0.12` | Development debugging middleware |
| `@ai-sdk-tools/artifacts` | `^1.2.0` | Typed streaming artifacts |
| `@ai-sdk-tools/cache` | `^1.2.0` | Tool result caching |
| `@ai-sdk-tools/memory` | `^1.2.0` | Working memory provider |
| `@ai-sdk-tools/store` | `^1.2.0` | Storage abstraction |
| `@mendable/firecrawl-js` | `^4.12.0` | Web research (search, scrape, extract) |
| Drizzle ORM | `^0.34.1` | Database ORM |
| PostgreSQL (`postgres`) | `^3.4.8` | DB driver |
| NextAuth | `5.0.0-beta.25` | Authentication |
| deck.gl | `^9.2.6` | 3D globe visualization |
| MapLibre GL | `^5.17.0` | Map rendering engine |
| react-map-gl | `^8.1.0` | React MapLibre bindings |
| Redis | `^5.0.0` | Resumable streams + production cache |
| Zod | `^3.25.76` | Schema validation |
| Serwist | `^9.5.5` | PWA / service worker |
| motion | `^12.23.26` | Animation library |
| Zustand | `^5.0.11` | State management |
| Biome | `2.3.11` | Linter/formatter |
| Ultracite | `^7.0.11` | Code quality presets |
| Playwright | `^1.50.1` | E2E testing |
| TypeScript | `^5.6.3` | Type checking |

---

## Contact & Contribution

**Project Type:** Virtue Foundation NGO Healthcare Analysis Tool  
**Tech Stack:** Next.js 16, Vercel AI SDK v6 (multi-agent), Drizzle ORM, PostgreSQL + pgvector, deck.gl + MapLibre, Firecrawl, Vercel AI Gateway  
**Package Name:** `meridian@0.1.0`

For issues or questions, check the runtime logs (`[ChatRoute]` prefix) and refer to the blueprint at `assets/docs/technical-blueprint-v2.md`.
