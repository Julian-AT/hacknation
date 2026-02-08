# Bridging Medical Deserts: Intelligent Document Parsing for Healthcare

<p align="center">
  <strong>An AI agent system for analyzing healthcare facility capabilities and identifying medical deserts</strong>
</p>

<p align="center">
  <a href="https://meridian-ai.vercel.app"><img src="https://img.shields.io/badge/Live_Demo-View-blue?style=flat-square" alt="Live Demo"></a>
  <img src="https://img.shields.io/badge/Hackathon-Hack_Nation_(MIT)-purple?style=flat-square" alt="Hack Nation MIT">
  <img src="https://img.shields.io/badge/Track-Databricks_Medical_Deserts-orange?style=flat-square" alt="Databricks Track">
  <img src="https://img.shields.io/badge/Client-Virtue_Foundation-green?style=flat-square" alt="Virtue Foundation">
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square" alt="MIT License">
</p>

## Overview

This project addresses a critical global healthcare challenge: by 2030, the world will face a shortage of over 10 million healthcare workers. This is not due to a lack of expertise, but a failure to intelligently coordinate existing resources.

Built for the **Hack Nation Hackathon at MIT** in the **Databricks "Bridging Medical Deserts"** track, in collaboration with the **Virtue Foundation**, this system serves as an **agentic AI intelligence layer for healthcare** — extracting, verifying, and reasoning over medical facility data to connect patients with lifesaving care.

## The Challenge

Skilled doctors remain disconnected from hospitals and communities that urgently need them. This system aims to **reduce the time for patients to receive lifesaving treatment by 100×** through intelligent document parsing and analysis.

### Goals

- Extract and verify medical facility capabilities from unstructured data
- Identify infrastructure gaps and medical deserts
- Detect incomplete or suspicious claims about hospital capabilities
- Map where critical expertise is available — and where lives are at risk due to lack of access

## Core Features

### MVP (Required)

1. **Unstructured Feature Extraction**: Process free-form text fields (procedures, equipment, capabilities) to identify specific medical data
2. **Intelligent Synthesis**: Combine unstructured insights with structured facility schemas for comprehensive regional capability analysis
3. **Planning System**: Accessible interface for NGO coordinators and healthcare planners across all experience levels

### Stretch Goals

- **Citations**: Row-level citations indicating what data supported each claim
- **Geospatial Visualization**: Interactive map demonstrating findings (inspired by [VF Match](https://vfmatch.org/explore))
- **Real-World Impact**: Addressing actual questions being explored by the Databricks and Virtue Foundation teams

## Agent Capabilities

The system answers 59 categorized questions across 11 query types:

| Category | Count | Description |
|----------|-------|-------------|
| Basic Queries & Lookups | 6 | Finding and counting facilities |
| Geospatial Queries | 4 | Location, distance, geographic analysis |
| Validation & Verification | 5 | Verify facility claims and detect inconsistencies |
| Misrepresentation & Anomaly Detection | 11 | Identify suspicious or inconsistent claims |
| Service Classification & Inference | 5 | Classify and understand service nature |
| Workforce Distribution | 6 | Healthcare workforce availability |
| Resource Distribution & Gaps | 6 | Equipment and infrastructure analysis |
| NGO & International Organization Analysis | 4 | NGO presence and impact |
| Unmet Needs & Demand Analysis | 6 | Identify underserved populations |
| Benchmarking & Comparative Analysis | 4 | Compare against standards |
| Data Quality & Freshness | 2 | Data reliability assessment |

### Sample Queries

**Must-Have (Required)**:
- "How many hospitals have cardiology?"
- "How many hospitals in [region] can perform [procedure]?"
- "What areas are medical deserts for [procedure] within [X] km?"

**Should-Have**:
- "Which facilities claim [service] but lack required equipment?"
- "Which regions have the most facilities with unrealistic procedure claims?"

**Could-Have**:
- "What areas have disease prevalence for [condition] but no treating facilities within [X] km?"
- "Where do NGOs provide temporary vs. permanent services?"

## Dataset

**Source**: Virtue Foundation Ghana Healthcare Dataset
- **987 healthcare facilities** across Ghana
- Real-world facility reports and medical notes
- Mix of structured and unstructured data fields

**Access**:
- [Ghana Dataset](https://drive.google.com/file/d/1qgmLHrJYu8TKY2UeQ-VFD4PQ_avPoZ3d/view?usp=sharing)
- [Schema Documentation](https://docs.google.com/document/d/1UDkH0WLmm3ppE3OpzSuZQC9_7w3HO1PupDLFVqzS_2g/edit?usp=sharing)
- [Prompts and Pydantic Models](https://drive.google.com/file/d/1CvMTA2DtwZxa9-sBsw57idCkIlnrN32r/view?usp=drive_link)

## Technology Stack

**Primary Stack**:
- **Agentic Orchestrator**: LangGraph, LlamaIndex, or CrewAI
- **ML Lifecycle**: MLflow
- **RAG**: Databricks, FAISS, or LanceDB
- **Text-to-SQL**: Genie
- **Environment**: Databricks Free Edition compatible

**Implementation**:
- Next.js 16 + React 19 + TypeScript
- Vercel AI SDK v6
- PostgreSQL + pgvector
- deck.gl + MapLibre GL for visualization

## Evaluation Criteria

| Criteria | Weight | Description |
|----------|--------|-------------|
| Technical Accuracy | 35% | Reliably handle "Must Have" queries and detect anomalies |
| IDP Innovation | 30% | Extract and synthesize information from unstructured text |
| Social Impact | 25% | Effectively identify medical deserts for resource allocation |
| User Experience | 10% | Intuitive interface for non-technical NGO planners |

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9.12+
- PostgreSQL with pgvector extension
- Databricks account (free tier compatible)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/hacknation.git
cd hacknation/www

# Install dependencies
pnpm install

# Set up environment
cp .env.example .env.local
# Configure your credentials
```

### Environment Variables

```env
# Required
DATABRICKS_HOST=
DATABRICKS_TOKEN=
POSTGRES_URL=

# AI Gateway
AI_GATEWAY_API_KEY=

# Optional
REDIS_URL=
FIRECRAWL_API_KEY=
```

### Database Setup

```bash
# Run migrations
pnpm db:migrate

# Seed facilities data
npx tsx scripts/seed-facilities.ts

# Generate embeddings
npx tsx scripts/seed-embeddings.ts
```

### Development

```bash
pnpm dev        # Start dev server
pnpm build      # Production build
pnpm lint       # Run checks
pnpm db:studio  # Open Drizzle Studio
```

## Why This Matters

Every data point extracted represents a patient who could receive care sooner. By automating understanding from medical notes — the most critical AI agent use case in healthcare — this system creates the intelligence layer that can transform scarcity into coordinated action and bring lifesaving expertise to the world's most underserved regions.

At planetary scale, even small improvements in coordination mean millions of patients treated sooner — and countless lives saved.

## Resources

- [Virtue Foundation](https://virtuefoundation.org/)
- [VF Match Platform](https://vfmatch.org/explore)
- [Databricks Documentation](https://docs.databricks.com/)
- [MoSCoW Prioritization](https://www.productplan.com/glossary/moscow-prioritization/)

## License

MIT License - see [LICENSE](LICENSE) for details.

---

<p align="center">
  Built with ❤️ for the Hack Nation Hackathon at MIT
</p>
<p align="center">
  Databricks "Bridging Medical Deserts" Track
</p>
<p align="center">
  In partnership with the Virtue Foundation
</p>
