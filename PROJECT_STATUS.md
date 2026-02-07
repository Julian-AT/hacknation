# VFMatch AI Agent - Project Status

**Last Updated:** February 7, 2026  
**Status:** Phases 1-4 Complete, Phase 5 Debugging & Polish In Progress

---

## Project Overview

The **VFMatch AI Agent** is an intelligent healthcare facility analyzer for the Virtue Foundation, designed to help NGO coordinators, volunteer doctors, and healthcare planners understand Ghana's medical infrastructure landscape.

### Core Features
- **987 Healthcare Facilities** across Ghana (hospitals, clinics, pharmacies)
- **8 VF-Specific AI Tools** for facility analysis, gap detection, and volunteer planning
- **4 Platform Tools** for documents, weather, and suggestions
- **Semantic Search** via pgvector embeddings (OpenAI `text-embedding-3-small`)
- **Interactive Map Visualization** using Leaflet (split-screen UI)
- **Multi-Tool Reasoning** (up to 10-step chains for complex queries)
- **Multi-Provider Model Selection** (Google Gemini, Anthropic, OpenAI, xAI)
- **Artifact System** (code, image, sheet, text document creation)
- **Authentication** with NextAuth (guest + registered users)
- **Resumable Streams** via Redis for chat continuity

---

## Architecture

### Monorepo Layout
```
hacknation/
├── www/                    # Next.js 16 application (primary codebase)
│   ├── app/                # App Router (auth, chat, API routes)
│   ├── artifacts/          # Artifact renderers (code, image, sheet, text)
│   ├── components/         # React components (~100+ files)
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Core libraries (AI, DB, utilities)
│   ├── scripts/            # DB migration & seeding scripts
│   ├── tests/              # Playwright E2E tests
│   └── public/             # Static assets
├── lib/                    # Standalone logic (prompts, Ghana data, tool stubs)
├── assets/                 # Documentation & raw data
│   ├── data/               # ghana-facilities.csv (source data)
│   ├── docs/               # Technical blueprint, roadmap, scheme docs
│   └── python_models/      # Reference Pydantic extraction models
├── scripts/                # Python reference models
└── .github/workflows/      # CI (lint + Playwright)
```

### Key Architectural Decisions
- **Vercel AI SDK v6** (`ai@^6.0.37`) for streaming, tool calls, and multi-step reasoning
- **Vercel AI Gateway** for multi-provider model routing (not direct API keys)
- **Drizzle ORM** (`^0.34.1`) with PostgreSQL + pgvector for structured + vector queries
- **Google Gemini** as runtime model (hardcoded in `providers.ts`, see Known Issues)
- **OpenAI** for embeddings only (`text-embedding-3-small`, 1536 dimensions)
- **Radix UI** primitives for accessible component foundations
- **Biome** (`2.3.11`) + **Ultracite** (`^7.0.11`) for linting/formatting

---

## Implementation Status

### Phase 1: Database & Seeding (COMPLETE)
**Deliverables:**
- [x] PostgreSQL schema with Drizzle ORM (`facilities` table, 60+ columns)
- [x] pgvector extension enabled (1536-dimension embeddings)
- [x] Seeded 987 facilities from `assets/data/ghana-facilities.csv`
- [x] Generated embeddings for all facilities
- [x] 9 Drizzle migrations (`0000`–`0008`)
- [x] Indexes for region, city, type, geolocation (lat/lng)

**Key Files:**
- `www/lib/db/schema.facilities.ts` — Facility table schema (60+ columns including arrays, vectors)
- `www/lib/db/schema.ts` — Core tables (user, chat, message, vote, document, suggestion, stream)
- `www/lib/db/index.ts` — Drizzle client initialization
- `www/lib/db/queries.ts` — CRUD operations (users, chats, messages, voting, documents, streams)
- `www/lib/db/migrations/` — 9 migration SQL files + snapshots
- `www/scripts/migrate.ts` — Migration runner
- `www/scripts/seed-facilities.ts` — CSV import script
- `www/scripts/seed-embeddings.ts` — Embedding generation script

---

### Phase 2: AI Tool Implementation (COMPLETE)
**Deliverables:**
- [x] 8 VF-specific tools with Zod schemas
- [x] 4 platform tools (documents, weather, suggestions)
- [x] Debug logging utility (`createToolLogger`)
- [x] Medical knowledge base (`www/lib/medical-knowledge.ts`)
- [x] Ghana geographic data — 104+ city coordinates (`www/lib/ghana.ts`)
- [x] System prompt with full medical context (`www/lib/ai/prompts.ts`)

**VF Tools (8):**
| Tool | File | Description |
|------|------|-------------|
| `queryDatabase` | `queryDatabase.ts` | Read-only SQL execution with safety checks (blocks DROP/DELETE/UPDATE) |
| `searchFacilities` | `searchFacilities.ts` | Semantic vector search via embeddings (cosine distance) |
| `getFacility` | `getFacility.ts` | Single facility lookup (exact ID or fuzzy name ILIKE) |
| `findNearby` | `findNearby.ts` | Geospatial proximity search (Haversine formula, city name or lat/lng) |
| `findMedicalDeserts` | `findMedicalDeserts.ts` | Geographic gap analysis (checks major cities vs providers) |
| `detectAnomalies` | `detectAnomalies.ts` | Data quality checks (infrastructure mismatches, missing data) |
| `getStats` | `getStats.ts` | Aggregated statistics (group by region/type/specialty) |
| `planMission` | `planMission.ts` | Volunteer deployment planner (orchestrates findMedicalDeserts + findNearby) |

**Platform Tools (4):**
| Tool | File | Description |
|------|------|-------------|
| `getWeather` | `get-weather.ts` | Weather lookup via Open-Meteo (requires user approval) |
| `createDocument` | `create-document.ts` | Artifact creation (code, image, sheet, text) |
| `updateDocument` | `update-document.ts` | Artifact updates with real-time streaming |
| `requestSuggestions` | `request-suggestions.ts` | AI-powered writing suggestions for documents |

**Tool Selection Logic:**
- Reasoning models (e.g., Claude 3.7 Thinking, Grok Code): Limited to 4 platform tools, `maxSteps: 1`
- Regular models: All 12 tools available, `maxSteps: 10`

---

### Phase 3: Agent Integration (COMPLETE)
**Deliverables:**
- [x] VFMatch persona system prompt (`vfAgentPrompt` in `www/lib/ai/prompts.ts`)
- [x] Tool registration in chat API route with conditional tool sets
- [x] Multi-step reasoning (up to 10 steps for non-reasoning models)
- [x] Comprehensive debug logging (`[ChatRoute]` prefix throughout)
- [x] Error handling with `ChatSDKError` classes
- [x] Geolocation context injection via `@vercel/functions`
- [x] Resumable stream support via Redis
- [x] Message persistence (save, update, title generation)
- [x] Rate limiting by user type (guest: 20/day, regular: 50/day)

**Key Files:**
- `www/app/(chat)/api/chat/route.ts` — Main POST/DELETE chat endpoint
- `www/lib/ai/prompts.ts` — System prompts (VF agent, artifacts, code, sheet, title)
- `www/lib/ai/providers.ts` — Model provider functions (currently hardcoded to Gemini)
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

### Phase 4: Frontend UI (COMPLETE)
**Deliverables:**
- [x] Split-pane layout (Chat left, Map right)
- [x] Leaflet map with dark theme tiles
- [x] VF Context for shared state management
- [x] Tool trace visualization with expandable details
- [x] Suggested queries component (8 preset queries)
- [x] Full artifact system (code editor, image editor, sheet editor, text editor)
- [x] Sidebar with chat history
- [x] Model selector UI
- [x] Authentication forms (login, register, guest)
- [x] Theme provider (dark/light)

**Component Architecture:**

| Directory | Count | Purpose |
|-----------|-------|---------|
| `components/vf-ui/` | 4 | VFMatch-specific (FacilityMap, MapUpdater, SuggestedQueries, ToolTrace) |
| `components/ai-elements/` | 28 | AI chat UI (reasoning, sources, chain-of-thought, tool vis, etc.) |
| `components/elements/` | 15 | Core rendering elements (message, loader, suggestion, task, etc.) |
| `components/ui/` | 25 | Radix/shadcn primitives (button, dialog, select, sidebar, etc.) |
| `components/` (root) | 40+ | Top-level (chat, messages, multimodal-input, artifact, sidebar, etc.) |

**VF-Specific Components:**
- `FacilityMap.tsx` — Interactive Leaflet map with dynamic markers, popups, medical desert visualization, and fly-to
- `MapUpdater.tsx` — Syncs map view when center/zoom changes via `useMap()` hook
- `SuggestedQueries.tsx` — 8 preset query chips for common healthcare questions
- `ToolTrace.tsx` — Expandable tool call display with per-tool icons, formatted args, JSON output, and "View on Map" button

**Map Features:**
- Dynamic markers for `findNearby` results
- Medical desert visualization from `findMedicalDeserts`
- Automatic fly-to on tool results
- Legend overlay for marker types
- SSR-safe dynamic imports

**Artifact Types:**
- Code (Python) — CodeMirror editor with syntax highlighting
- Image — Image editor/viewer
- Sheet — Spreadsheet via `react-data-grid`
- Text — ProseMirror rich text editor

---

### Phase 5: Runtime Debugging & Polish (IN PROGRESS)

**Resolved Issues:**
- [x] Context provider missing — Added `VFProvider` to both chat routes
- [x] `message.parts.filter` crash — Added optional chaining
- [x] Type errors in tool definitions — Added `as any` workarounds
- [x] Build compilation errors — All resolved
- [x] Comprehensive debug logging added to chat route (`[ChatRoute]` prefix)
- [x] Error stream reporting for `streamText` failures
- [x] Tool call/result logging in `onStepFinish` callback
- [x] AI Gateway credit card error detection and user-facing message

**Open Issues:**

1. **Model Provider Hardcoding** (Bug)
   - **Severity:** High
   - **Location:** `www/lib/ai/providers.ts`
   - **Problem:** `getLanguageModel()` ignores the `modelId` parameter and always returns `google("gemini-flash-latest")`. Users can select different models in the UI, but the backend always uses Gemini.
   - **Impact:** Model selector is non-functional; all chats use Google Gemini regardless of selection.
   - **Fix:** Implement proper model routing based on `modelId` parameter (use `@ai-sdk/gateway` or provider-specific imports).

2. **Root `lib/` Stubs** (Cleanup)
   - **Severity:** Low
   - **Location:** `lib/logic/findMedicalDeserts.ts`, `lib/logic/findNearby.ts`
   - **Problem:** These files are empty stubs. The actual implementations live in `www/lib/ai/tools/`.
   - **Impact:** Confusing project structure; dead code.
   - **Fix:** Remove empty stubs or consolidate.

3. **Type Safety** (Tech Debt)
   - **Severity:** Medium
   - **Locations:** `www/app/(chat)/api/chat/route.ts` (lines 161, 230)
   - **Problem:** `tools: any` type assertion and `streamText()` result cast as `as any` to bypass AI SDK type incompatibilities.
   - **Impact:** No compile-time type checking for tool definitions.

4. **SQL Injection Surface** (Security)
   - **Severity:** Medium
   - **Location:** `www/lib/ai/tools/queryDatabase.ts`
   - **Problem:** Accepts raw SQL from the LLM. Safety checks exist (blocks DROP/DELETE/UPDATE/INSERT/ALTER) but pattern matching could be bypassed.
   - **Impact:** Potential for malicious queries if LLM is manipulated.

5. **City Resolution Gaps** (Data)
   - **Severity:** Low
   - **Location:** `www/lib/ai/tools/findNearby.ts`
   - **Problem:** `findNearby` resolves city names via `CITY_COORDS` (104 entries). Unknown cities fail silently.
   - **Impact:** Geospatial searches for unlisted cities return no results.

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
REDIS_URL="..."             # Redis (resumable streams)
```

### Database Schema

**Core Tables** (in `www/lib/db/schema.ts`):
- `user` — Authentication (email, password, type)
- `chat` — Conversations (title, visibility, userId)
- `message` — Messages with `parts` JSON (v2 schema)
- `vote` — User feedback on messages
- `document` — Artifact storage (title, kind, content)
- `suggestion` — AI-generated document suggestions
- `stream` — Resumable stream tracking

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
- Installs Playwright browsers, runs `pnpm test`
- Uploads test reports as artifacts
- Secrets: `AUTH_SECRET`, `POSTGRES_URL`, `BLOB_READ_WRITE_TOKEN`, `REDIS_URL`

### E2E Tests (`www/tests/e2e/`):
- `api.test.ts` — API endpoint tests
- `auth.test.ts` — Authentication flow tests
- `chat.test.ts` — Chat functionality tests
- `model-selector.test.ts` — Model selector UI tests

---

## Next Steps

### Immediate (High Priority)
1. **Fix Model Provider Routing:**
   - [ ] Update `www/lib/ai/providers.ts` to respect the `modelId` parameter
   - [ ] Route to correct provider SDK (`@ai-sdk/google`, `@ai-sdk/openai`, `@ai-sdk/gateway`)
   - [ ] Test each available model end-to-end

2. **Verify Runtime Stability:**
   - [ ] Test all 8 VF tools via the chat interface
   - [ ] Confirm map updates work for `findNearby`, `findMedicalDeserts`, `getFacility`
   - [ ] Check embedding generation (OpenAI `text-embedding-3-small`)
   - [ ] Validate database connectivity under load

### Short-Term (Polish)
3. **Code Cleanup:**
   - [ ] Remove empty stubs in root `lib/logic/`
   - [ ] Resolve `as any` type assertions in chat route
   - [ ] Consolidate duplicate Ghana data / prompt files between root `lib/` and `www/lib/`

4. **UI Enhancements:**
   - [ ] Add loading states to map component
   - [ ] Improve tool trace styling
   - [ ] Add error boundaries for map component
   - [ ] Mobile responsive layout for split-pane view

5. **Tool Refinements:**
   - [ ] Add result caching for `getStats`
   - [ ] Improve `planMission` recommendation logic
   - [ ] Add more medical knowledge mappings
   - [ ] Strengthen SQL injection prevention in `queryDatabase`

### Long-Term (Features)
6. **Advanced Capabilities:**
   - [ ] Export tool results to CSV/PDF
   - [ ] Save favorite facilities
   - [ ] Multi-region comparison views
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
```

### Database
```bash
cd www
pnpm db:generate            # Generate Drizzle migrations
pnpm db:migrate             # Run migrations (npx tsx lib/db/migrate.ts)
pnpm db:studio              # Open Drizzle Studio (DB browser)
pnpm db:push                # Push schema to DB
pnpm db:pull                # Pull schema from DB
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
| `www/lib/db/schema.ts` | Core tables (user, chat, message, vote, document, suggestion, stream) |
| `www/lib/db/index.ts` | Drizzle client initialization |
| `www/lib/db/queries.ts` | All CRUD operations |
| `www/lib/db/migrations/` | 9 SQL migration files |
| `www/drizzle.config.ts` | Drizzle configuration |

### AI & Tools
| File | Purpose |
|------|---------|
| `www/lib/ai/tools/` | 8 VF tools + 4 platform tools + debug utility |
| `www/lib/ai/prompts.ts` | System prompts (VF agent, artifacts, code, sheet, title) |
| `www/lib/ai/providers.ts` | Model provider functions |
| `www/lib/ai/models.ts` | 10 model definitions (Anthropic, OpenAI, Google, xAI) |
| `www/lib/ai/entitlements.ts` | Rate limits by user type |
| `www/app/(chat)/api/chat/route.ts` | Main chat API endpoint |

### Frontend
| File | Purpose |
|------|---------|
| `www/components/chat.tsx` | Main chat with split-pane map integration |
| `www/components/messages.tsx` | Message list with tool trace rendering |
| `www/components/vf-ui/` | VFMatch components (map, traces, queries) |
| `www/lib/vf-context.tsx` | React Context for map state |
| `www/components/ai-elements/` | AI chat UI components (28 files) |
| `www/components/ui/` | shadcn/Radix primitives (25 files) |

### Utilities
| File | Purpose |
|------|---------|
| `www/lib/embed.ts` | OpenAI embedding wrapper |
| `www/lib/ghana.ts` | Ghana city coordinates (104+ cities) |
| `www/lib/medical-knowledge.ts` | Medical procedure/equipment mappings |
| `www/lib/errors.ts` | ChatSDKError error classes |
| `www/lib/types.ts` | Shared TypeScript types |

### Reference Data
| File | Purpose |
|------|---------|
| `assets/data/ghana-facilities.csv` | Raw facility data (987 rows, 40+ columns) |
| `assets/docs/technical-blueprint-v2.md` | Architecture blueprint and evaluation criteria |
| `assets/docs/ROADMAP.md` | Original development roadmap |
| `scripts/python_models/` | 4 Pydantic extraction models (organizations, specialties, facts, fields) |

---

## Known Limitations

1. **Data Quality:**
   - Facility data is LLM-scraped from web sources (not verified)
   - ~733 facilities missing region data
   - ~600 facilities missing doctor counts
   - ~700 facilities missing bed capacity

2. **Model Routing:**
   - `providers.ts` ignores selected model — always uses Google Gemini
   - Model selector UI is cosmetic only until routing is fixed

3. **Geographic Coverage:**
   - City coordinates limited to 104 known cities/neighborhoods
   - Medical desert analysis may miss rural areas without known coordinates

4. **Type Safety:**
   - Tools use `as any` due to AI SDK type incompatibilities
   - `streamText` result cast as `as any`

5. **Performance:**
   - Embedding generation is slow (~10 facilities/batch)
   - Vector search may be slow on large result sets (use limits)
   - `queryDatabase` results capped at 100 rows

6. **Security:**
   - `queryDatabase` accepts raw LLM-generated SQL with keyword-based safety checks
   - No parameterized queries for LLM-generated SQL

---

## External Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| Next.js | `16.0.10` | App framework |
| React | `19.0.1` | UI library |
| Vercel AI SDK | `^6.0.37` | Streaming, tools, multi-step |
| `@ai-sdk/google` | `^3.0.22` | Google Gemini provider |
| `@ai-sdk/openai` | `^3.0.26` | OpenAI provider (embeddings) |
| `@ai-sdk/gateway` | `^3.0.15` | Vercel AI Gateway routing |
| Drizzle ORM | `^0.34.1` | Database ORM |
| PostgreSQL (`postgres`) | `^3.4.8` | DB driver |
| NextAuth | `5.0.0-beta.25` | Authentication |
| Leaflet | `^1.9.4` | Map rendering |
| React Leaflet | `^5.0.0` | React Leaflet bindings |
| Redis | `^5.0.0` | Resumable streams |
| Zod | `^3.25.76` | Schema validation |
| Biome | `2.3.11` | Linter/formatter |
| Ultracite | `^7.0.11` | Code quality presets |
| Playwright | `^1.50.1` | E2E testing |
| TypeScript | `^5.6.3` | Type checking |

---

## Contact & Contribution

**Project Type:** Virtue Foundation NGO Healthcare Analysis Tool  
**Tech Stack:** Next.js 16, Vercel AI SDK v6, Drizzle ORM, PostgreSQL + pgvector, Leaflet, Google Gemini  
**Package Name:** `vf-match-agent@0.1.0`

For issues or questions, check the runtime logs (`[ChatRoute]` prefix) and refer to the blueprint at `assets/docs/technical-blueprint-v2.md`.
