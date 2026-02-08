<a href="https://meridian-ai.vercel.app">
  <img alt="Meridian AI — Intelligent Healthcare Facility Analyzer for Ghana" src="assets/screenshots/hero-banner.png">
  <h1 align="center">Meridian AI</h1>
</a>

<p align="center">
  An intelligent multi-agent system that analyzes 987 healthcare facilities across Ghana, helping NGO coordinators, volunteer doctors, and healthcare planners bridge medical deserts.
</p>

<p align="center">
  <a href="https://meridian-ai.vercel.app"><img src="https://img.shields.io/badge/Live_Demo-▶_Try_It-blue?style=flat-square" alt="Live Demo"></a>
  <a href="#architecture"><img src="https://img.shields.io/badge/Agents-Multi--Agent_System-purple?style=flat-square" alt="Multi-Agent"></a>
  <a href="#tech-stack"><img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=nextdotjs" alt="Next.js 16"></a>
  <a href="#tech-stack"><img src="https://img.shields.io/badge/AI_SDK-v6-orange?style=flat-square" alt="AI SDK v6"></a>
  <a href="#tech-stack"><img src="https://img.shields.io/badge/deck.gl-3D_Globe-green?style=flat-square" alt="deck.gl"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square" alt="MIT License"></a>
</p>

<p align="center">
  <a href="#what-is-meridian-ai"><strong>What is Meridian AI?</strong></a> ·
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#architecture"><strong>Architecture</strong></a> ·
  <a href="#tech-stack"><strong>Tech Stack</strong></a> ·
  <a href="#getting-started"><strong>Getting Started</strong></a>
</p>
<br/>

<p align="center">
  <a href="https://meridian-ai.vercel.app">
    <img alt="Meridian AI screenshot showing the chat interface with an interactive 3D globe visualization of healthcare facilities in Ghana" src="assets/screenshots/app-screenshot.png" width="100%">
  </a>
</p>

## What is Meridian AI?

**Meridian AI** is an AI-powered healthcare intelligence platform built for the [Virtue Foundation](https://virtuefoundation.org/) as part of the Databricks **Bridging Medical Deserts** hackathon.

Ghana's healthcare infrastructure is unevenly distributed — rural communities often lack basic medical services while urban centers are over-concentrated. Meridian AI gives decision-makers the tools to **find gaps, plan missions, and allocate resources** where they matter most.

The platform combines a **conversational AI interface** with an **interactive 3D globe**, letting users ask natural-language questions about healthcare access and instantly see the results visualized on a map.

<p align="center">
  <img alt="Split-pane interface showing the AI chat on the left and the 3D globe with facility markers on the right" src="assets/screenshots/split-pane.png" width="100%">
</p>

## Features

### 🤖 Multi-Agent Orchestration

An orchestrator agent coordinates four specialized sub-agents, each with domain-specific tools and reasoning capabilities:

| Agent | Purpose | Tools |
|---|---|---|
| **Database Agent** | SQL queries, semantic search, facility lookups | `queryDatabase` · `searchFacilities` · `getFacility` |
| **Geospatial Agent** | Proximity search, gap analysis, mission planning | `findNearby` · `findMedicalDeserts` · `compareRegions` · `planMission` |
| **Medical Reasoning Agent** | Anomaly detection, claim validation, classification | `detectAnomalies` · `classifyServices` · `crossValidateClaims` |
| **Web Research Agent** | Live web search, scraping, structured extraction | `firecrawlSearch` · `firecrawlScrape` · `firecrawlExtract` |

### 🌍 Interactive 3D Globe

A real-time, WebGL-powered globe built with **deck.gl** and **MapLibre GL** that renders facility markers, medical desert zones, proximity radii, and mission routes directly on a 3D map of Ghana.

<p align="center">
  <img alt="3D globe visualization showing healthcare facility density across Ghana with color-coded markers" src="assets/screenshots/globe-visualization.png" width="100%">
</p>

### 📊 Streaming Artifacts

Four typed, streaming artifacts that build in real-time as the AI reasons:

- **Facility Map** — Interactive map with facility pins, tooltips, and clustering
- **Medical Desert Map** — Visualizes underserved zones with gap analysis overlays
- **Stats Dashboard** — Aggregate metrics grid (facility counts, coverage ratios, equipment)
- **Mission Plan** — Volunteer deployment timeline with routing and logistics

<p align="center">
  <img alt="Streaming artifacts showing a medical desert analysis and stats dashboard" src="assets/screenshots/artifacts.png" width="100%">
</p>

### 🔍 Semantic Vector Search

Facility descriptions are embedded with **OpenAI text-embedding-3-small** and stored in **pgvector**, enabling natural-language queries like *"find clinics with surgical capability near Tamale"* to return semantically relevant results — not just keyword matches.

### 🛡️ Tool Call Transparency

Every AI decision is traceable. The **ToolTrace** component shows users exactly which tools were called, what parameters were used, and what data was returned — building trust in AI-driven recommendations.

<p align="center">
  <img alt="Tool trace panel showing the chain of agent tool calls with parameters and results" src="assets/screenshots/tool-trace.png" width="100%">
</p>

### Additional Capabilities

- **15 specialized tool result renderers** — Rich cards for every tool type
- **10+ AI model support** — Gemini, Claude, GPT-4.1, GPT-5.2, Grok via AI Gateway
- **Chat history & persistence** — Full conversation management with Redis-backed resumable streams
- **Guest & authenticated modes** — Instant access or persistent accounts via NextAuth
- **PWA support** — Installable on mobile and desktop
- **Dark & light themes** — Respects system preference

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                   │
│  ┌──────────────┐  ┌──────────────────────────────────┐ │
│  │   Chat UI    │  │        3D Globe (deck.gl)        │ │
│  │              │  │                                  │ │
│  │  Messages    │  │   Facility Markers               │ │
│  │  Tool Traces │  │   Medical Desert Zones           │ │
│  │  Artifacts   │  │   Proximity Radii                │ │
│  │  Model Picker│  │   Mission Routes                 │ │
│  └──────┬───────┘  └──────────────┬───────────────────┘ │
│         │                         │                      │
│         └────────────┬────────────┘                      │
│                      │                                   │
├──────────────────────┼───────────────────────────────────┤
│              Orchestrator Agent                           │
│         (15-step limit, tool routing)                    │
│                      │                                   │
│    ┌─────────┬───────┼───────┬──────────┐               │
│    │         │       │       │          │               │
│    ▼         ▼       ▼       ▼          ▼               │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐          │
│ │  DB  │ │ Geo  │ │ Med  │ │ Web  │ │Stats │          │
│ │Agent │ │Agent │ │Agent │ │Agent │ │Tools │          │
│ └──┬───┘ └──┬───┘ └──┬───┘ └──┬───┘ └──┬───┘          │
│    │        │        │        │        │               │
├────┼────────┼────────┼────────┼────────┼───────────────┤
│    ▼        ▼        ▼        ▼        ▼               │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐    │
│ │  PostgreSQL   │ │   pgvector   │ │  Firecrawl   │    │
│ │  + Drizzle    │ │  Embeddings  │ │  Web Search  │    │
│ └──────────────┘ └──────────────┘ └──────────────┘    │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐    │
│ │    Redis      │ │ Vercel Blob  │ │  World Bank  │    │
│ │   Streams     │ │   Storage    │ │     API      │    │
│ └──────────────┘ └──────────────┘ └──────────────┘    │
└─────────────────────────────────────────────────────────┘
```

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org) (App Router, Turbopack) · React 19 · TypeScript |
| **AI** | [Vercel AI SDK v6](https://ai-sdk.dev) · AI Gateway (multi-provider routing) · Gemini · Claude · GPT · Grok |
| **Database** | PostgreSQL · [pgvector](https://github.com/pgvector/pgvector) · [Drizzle ORM](https://orm.drizzle.team) · [Neon](https://neon.tech) |
| **Maps** | [deck.gl](https://deck.gl) · [MapLibre GL](https://maplibre.org) · react-map-gl |
| **Cache** | [Redis](https://redis.io) (resumable streams + tool result caching) |
| **Auth** | [NextAuth v5](https://authjs.dev) (email/password + guest mode) |
| **Storage** | [Vercel Blob](https://vercel.com/storage/blob) |
| **Web Research** | [Firecrawl](https://firecrawl.dev) (search, scrape, structured extract) |
| **UI** | [Tailwind CSS](https://tailwindcss.com) · [Radix UI](https://radix-ui.com) · [shadcn/ui](https://ui.shadcn.com) · [CodeMirror 6](https://codemirror.net) |
| **Quality** | [Biome](https://biomejs.dev) · [Ultracite](https://ultracite.dev) · [Playwright](https://playwright.dev) |

## Getting Started

### Prerequisites

- **Node.js** 20+
- **pnpm** 9.12+
- **PostgreSQL** with the [pgvector](https://github.com/pgvector/pgvector) extension
- **Redis** (optional, for production caching & resumable streams)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/meridian-ai.git
cd meridian-ai/www

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials (see below)
```

### Environment Variables

```env
# Auth
AUTH_SECRET=              # openssl rand -base64 32

# AI (Vercel AI Gateway)
AI_GATEWAY_API_KEY=       # Required for non-Vercel deployments

# Database
POSTGRES_URL=             # PostgreSQL connection string (with pgvector)

# Storage
BLOB_READ_WRITE_TOKEN=    # Vercel Blob Store

# Optional
REDIS_URL=                # Redis (resumable streams + cache)
FIRECRAWL_API_KEY=        # Firecrawl (web research tools)
ORS_API_KEY=              # OpenRouteService (travel time calculations)
```

### Database Setup

```bash
# Run migrations
pnpm db:migrate

# Seed the 987 Ghana healthcare facilities
npx tsx scripts/seed-facilities.ts

# Generate vector embeddings
npx tsx scripts/seed-embeddings.ts
```

### Development

```bash
pnpm dev        # Start dev server on http://localhost:3000
```

### Available Commands

| Command | Description |
|---|---|
| `pnpm dev` | Start development server (Turbopack) |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run Biome/Ultracite checks |
| `pnpm format` | Auto-fix formatting |
| `pnpm db:migrate` | Run database migrations |
| `pnpm db:studio` | Open Drizzle Studio (DB browser) |
| `pnpm test` | Run Playwright E2E tests |

## Data

The platform analyzes **987 healthcare facilities** across Ghana, sourced from the Virtue Foundation dataset:

- **Hospitals, clinics, pharmacies** with 60+ data columns
- **Geolocation** (latitude/longitude) for 104+ cities
- **Specialties, procedures, and equipment** as structured arrays
- **Vector embeddings** for semantic search over facility descriptions

## Hackathon Context

This project was built for the **Databricks Bridging Medical Deserts** challenge at Hack Nation, addressing the uneven distribution of healthcare resources in Ghana.

| Criteria | Weight | Approach |
|---|---|---|
| **Technical Accuracy** | 35% | 14 AI tools with multi-agent orchestration and type-safe schemas |
| **IDP Innovation** | 30% | Three-layer IDP: structured extraction → pgvector semantic search → cross-signal reasoning |
| **Social Impact** | 25% | Medical desert detection, gap analysis, volunteer mission planning |
| **User Experience** | 10% | Conversational AI + interactive 3D globe with streaming artifacts |

## License

Licensed under the [MIT License](LICENSE).
