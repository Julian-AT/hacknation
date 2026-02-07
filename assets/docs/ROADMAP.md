# VFMatch AI Agent — Project Roadmap

Based on `technical-blueprint-v2.md`.

## Phase 1: Foundation (Current)
- [x] Initialize Next.js 16 project (App Router, No Src Dir, Tailwind)
- [x] Install dependencies (Vercel AI SDK, Drizzle, Postgres, Leaflet, etc.)
- [ ] Set up Drizzle Config & Schema (`db/schema.ts`, `drizzle.config.ts`)
- [ ] Configure Database Connection (`db/index.ts`)
- [ ] Run Migrations & Add pgvector extension
- [ ] Seed Data (`scripts/seed-facilities.ts`)
- [ ] Generate Embeddings (`scripts/seed-embeddings.ts`)

## Phase 2: Core Utilities & Tools
- [ ] `lib/geo.ts` (Haversine, bounding box)
- [ ] `lib/ghana.ts` (Region list, cities, population)
- [ ] `lib/medical-knowledge.ts` (Procedure mappings)
- [ ] Implement AI Tools (`lib/tools/`):
    - [ ] `queryDatabase` (Text-to-SQL)
    - [ ] `searchFacilities` (Vector search)
    - [ ] `getFacility` (Deep dive)
    - [ ] `findNearby` (Geospatial)
    - [ ] `findMedicalDeserts` (Impact analysis)
    - [ ] `detectAnomalies` (Data quality)
    - [ ] `getStats` (Overview)
    - [ ] `planMission` (Volunteer planner)

## Phase 3: AI Agent Logic (Vercel AI SDK)
- [ ] `lib/prompts/system.ts` (System prompt)
- [ ] `app/api/chat/route.ts` (Chat API with `streamText` & tools)
- [ ] `hooks/use-chat.ts` (Custom hook wrapping AI SDK `useChat` if needed)
- [ ] Test Agent reasoning and tool usage

## Phase 4: Frontend Implementation
- [ ] `app/layout.tsx` & `app/page.tsx` (Split pane layout)
- [ ] `components/chat/ChatPanel.tsx` (Chat interface using AI SDK `useChat`)
- [ ] `components/map/FacilityMap.tsx` (Leaflet map integration)
- [ ] `components/map/MapMarkers.tsx` & `MapLegend.tsx`
- [ ] `components/chat/ToolTrace.tsx` (Citation/Traceability via `toolInvocations`)
- [ ] `components/chat/SuggestedQueries.tsx`
- [ ] `components/layout/Header.tsx`

## Phase 5: Polish & Refinement
- [ ] End-to-end testing of "Must-Have" questions
- [ ] Refine anomaly detection rules
- [ ] UI Polish (Loading states, mobile responsiveness, dark mode)
- [ ] Deployment to Vercel
