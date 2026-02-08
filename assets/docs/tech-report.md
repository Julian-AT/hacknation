# Meridian AI: Agentic Intelligence for Healthcare Infrastructure Analysis

**Technical Report** | Hack Nation Hackathon | Databricks "Bridging Medical Deserts" Track | Virtue Foundation

---

## Problem

The Virtue Foundation maintains a dataset of 987 healthcare facilities across Ghana's 16 regions. The dataset mixes clean structured fields (name, city, facility type) with four free-text columns (`specialties_raw`, `procedures_raw`, `equipment_raw`, `capabilities_raw`) that were LLM-extracted from web scrapes. These text fields are the richest source of clinical capability data, but they are inconsistent, sometimes exaggerated, and unsearchable by conventional means. Meanwhile, NGO coordinators, volunteer doctors, and healthcare planners need fast, trustworthy answers to questions like "Where are the medical deserts for emergency surgery?" or "Which facilities claim neurosurgery but lack the infrastructure?" Manual analysis of 987 rows across 60+ columns is infeasible.

## Approach

Meridian AI is a multi-agent system that treats the dataset as a knowledge base and exposes it through natural language. The architecture is built on three technical pillars:

**1. Three-Layer Intelligent Document Parsing.** During data seeding, raw comma-separated free-text is parsed into PostgreSQL arrays for exact-match SQL (`WHERE 'cardiology' = ANY(specialties)`). All free-text fields are concatenated and embedded into 1536-dimensional vectors using OpenAI `text-embedding-3-small`, stored via the pgvector extension, enabling semantic search where "eye surgery" matches "phacoemulsification." A third layer applies domain-specific cross-signal reasoning: a medical knowledge base of 60+ procedure-to-equipment mappings flags facilities that claim cataract surgery but list no operating microscope, or report 500 beds with 2 doctors.

**2. Multi-Agent Orchestration.** A central orchestrator agent (Vercel AI SDK v6 `ToolLoopAgent`, 15-step limit) delegates to four specialized sub-agents. The **Database Agent** writes validated read-only SQL and runs pgvector semantic search. The **Geospatial Agent** computes Haversine proximity across 104 geocoded cities and identifies medical deserts by measuring distance-to-nearest-provider against configurable thresholds. The **Medical Reasoning Agent** runs six anomaly detection checks (infrastructure mismatch, capacity ratios, equipment-procedure cross-validation, signal completeness, pattern anomalies) and classifies services as permanent, itinerant, or referral-based. The **Web Research Agent** corroborates facility claims against WHO Global Health Observatory data, OpenStreetMap, and live web sources via Firecrawl. A fifth agent, the **Mission Planner**, chains desert detection, proximity search, facility verification, and NGO presence checks into ranked volunteer deployment recommendations. All sub-agents stream intermediate results to the client as they execute.

**3. Visual Artifact System.** Tool results render as interactive artifacts in a split-pane interface: a deck.gl 3D globe (ScatterplotLayer, fly-to transitions, hover tooltips) on the right, chat with expandable tool traces on the left. Eight artifact types stream to the canvas with progress states: facility maps, medical desert overlays, statistics dashboards, mission plans, heatmaps, regional choropleths, data quality maps, and accessibility isochrone maps (via OpenRouteService travel time API). Every tool response includes `facilityId` and `facilityName` for row-level citation; `ToolTrace` components expose the full reasoning chain (which tool, what parameters, what data returned) at each agentic step.

## Implementation

| Layer | Technology | Detail |
|-------|-----------|--------|
| Frontend | Next.js 16, React 19, TypeScript | App Router, SSR, Turbopack |
| AI | Vercel AI SDK v6, Vercel AI Gateway | 100+ models (Gemini, Claude, GPT, Grok), streaming SSE, resumable streams via Redis |
| Database | PostgreSQL, pgvector, Drizzle ORM | 10 migrations, 60+ column schema, vector cosine search, 4 strategic indexes |
| Visualization | deck.gl 9.2, MapLibre GL 5.17 | 3D globe, ScatterplotLayer, dark CARTO basemap |
| Auth | NextAuth 5 (beta) | Guest (100 msg/day) and registered users, bcrypt password hashing |
| Tooling | 18 AI tools total | 3 database, 4 geospatial, 3 medical reasoning, 3 web research, 1 statistics, 4 platform |
| Safety | SQL validation, 15s timeouts, 100-row caps | Comment stripping, keyword blocking, system table protection, input clamping |
| Testing | Playwright E2E, Biome/Ultracite linting | CI via GitHub Actions (lint + Playwright on push) |
| Deployment | Vercel, Neon Postgres, Vercel Blob | CSP headers, HSTS, PWA via Serwist service worker |

## Results

The system covers all 15 Must-Have questions from the Virtue Foundation evaluation criteria across 11 query categories (basic lookups, geospatial queries, validation, anomaly detection, service classification, workforce distribution, resource gaps, NGO analysis, unmet needs, benchmarking, data quality). The `findMedicalDeserts` tool quantifies access gaps with specific distance and population figures. The `detectAnomalies` tool flags infrastructure mismatches with severity levels and the exact data points that triggered each flag. The `planMission` tool converts a volunteer's specialty and availability into ranked deployment recommendations with facility readiness scores and NGO presence data. Working memory persists user context across conversations. Tool results are cached with configurable TTL (30-60 min) to reduce redundant computation.

## Known Limitations

Data quality is the binding constraint: ~733 facilities lack region data, ~600 lack doctor counts, ~700 lack bed capacity. The city coordinate lookup covers 104 cities; rural areas outside this set are invisible to geospatial tools. The `queryDatabase` tool accepts LLM-generated SQL with keyword-based safety checks rather than parameterized queries. Artifact tool boundaries use `as any` casts due to a Zod v3/v4 incompatibility. Sub-agent calls are sequential per delegation, adding latency on complex multi-agent queries.

---

**Live demo**: [meridian-ai.vercel.app](https://meridian-ai.vercel.app) | **Stack**: Next.js 16, Vercel AI SDK v6, PostgreSQL + pgvector, deck.gl, Drizzle ORM | **Data**: 987 Ghana healthcare facilities (Virtue Foundation)
