// Database tools

// Artifact-enhanced geospatial tools (stream visualizations to canvas)
export {
  findMedicalDesertsArtifact,
  findNearbyArtifact,
  getStatsArtifact,
  planMissionArtifact,
} from "./artifact-tools";
export { compareRegions } from "./compareRegions";
// Medical reasoning tools
export { detectAnomalies } from "./detectAnomalies";
export { findMedicalDeserts } from "./findMedicalDeserts";
// Geospatial tools
export { findNearby } from "./findNearby";
export { getDemographics } from "./getDemographics";
export { getFacility } from "./getFacility";
export { getSchema } from "./getSchema";
// Legacy (kept for backwards compat, handled by database agent via SQL)
export { getStats } from "./getStats";
export { analyzeTextEvidence } from "./medical/analyzeTextEvidence";
export { classifyServices } from "./medical/classifyServices";
export { crossValidateClaims } from "./medical/crossValidateClaims";
export { validateEnrichment } from "./medical/validateEnrichment";
export { planMission } from "./planMission";
export { queryDatabase } from "./queryDatabase";
export { searchFacilities } from "./searchFacilities";
export { corroborateClaims } from "./web/corroborateClaims";
export { firecrawlExtract } from "./web/firecrawl-extract";
export { firecrawlScrape } from "./web/firecrawl-scrape";
// Web research tools
export { firecrawlSearch } from "./web/firecrawl-search";
export { getTravelTime } from "./web/openrouteservice";
export { queryOSMFacilities } from "./web/overpass-facilities";
export { getWHOData } from "./web/who-gho";
