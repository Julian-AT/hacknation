// Database tools
export { queryDatabase } from "./queryDatabase";
export { searchFacilities } from "./searchFacilities";
export { getFacility } from "./getFacility";

// Geospatial tools
export { findNearby } from "./findNearby";
export { findMedicalDeserts } from "./findMedicalDeserts";
export { planMission } from "./planMission";
export { compareRegions } from "./compareRegions";

// Artifact-enhanced geospatial tools (stream visualizations to canvas)
export {
  findNearbyArtifact,
  findMedicalDesertsArtifact,
  getStatsArtifact,
  planMissionArtifact,
} from "./artifact-tools";

// Medical reasoning tools
export { detectAnomalies } from "./detectAnomalies";
export { crossValidateClaims } from "./medical/crossValidateClaims";
export { classifyServices } from "./medical/classifyServices";

// Web research tools
export { firecrawlSearch } from "./web/firecrawl-search";
export { firecrawlScrape } from "./web/firecrawl-scrape";
export { firecrawlExtract } from "./web/firecrawl-extract";

// Legacy (kept for backwards compat, handled by database agent via SQL)
export { getStats } from "./getStats";
