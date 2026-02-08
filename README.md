# VFMatch AI Agent

## Project Structure

This project is organized as follows:

- **/www**: The Next.js application (Vercel AI Chat SDK). All application code, configuration, and scripts live here.
- **/assets**: Project assets, documentation, raw data, and reference models.
  - **data/**: Raw CSV data (e.g., `ghana-facilities.csv`).
  - **docs/**: Project documentation and technical blueprints.
  - **python_models/**: Reference Python implementations and Pydantic models.

## Getting Started

1. Navigate to the application directory:
   ```bash
   cd www
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up your environment variables (`.env.local`).

4. Run the development server:
   ```bash
   pnpm dev
   ```

For detailed architecture and implementation plans, see [assets/docs/technical-blueprint-v2.md](assets/docs/technical-blueprint-v2.md).


TODO: