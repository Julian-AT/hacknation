"use client";

import type { ReactNode } from "react";
import { QueryDatabaseResult } from "./query-database-result";
import { StatsOverviewResult } from "./stats-overview-result";
import { SearchFacilitiesResult } from "./search-facilities-result";
import { FacilityProfileCard } from "./facility-profile-card";
import { NearbyFacilitiesResult } from "./nearby-facilities-result";
import { MedicalDesertsResult } from "./medical-deserts-result";
import { RegionComparisonResult } from "./region-comparison-result";
import { AnomalyAlertsResult } from "./anomaly-alerts-result";
import { ClaimsValidationResult } from "./claims-validation-result";
import { ServiceClassificationResult } from "./service-classification-result";
import { MissionPlanResult } from "./mission-plan-result";
import { WebSearchResult } from "./web-search-result";
import { WebScrapeResult } from "./web-scrape-result";
import { WebExtractResult } from "./web-extract-result";
import { DemographicsResult } from "./demographics-result";
import { WHODataResult } from "./who-data-result";
import { OSMFacilitiesResult } from "./osm-facilities-result";

export function getToolComponent(
  toolName: string,
  args: Record<string, unknown>,
  result: Record<string, unknown>,
): ReactNode | null {
  switch (toolName) {
    case "queryDatabase":
      return <QueryDatabaseResult args={args} result={result} />;
    case "getStats":
      return <StatsOverviewResult result={result} />;
    case "searchFacilities":
      return <SearchFacilitiesResult args={args} result={result} />;
    case "getFacility":
      return <FacilityProfileCard result={result} />;
    case "findNearby":
      return <NearbyFacilitiesResult result={result} />;
    case "findMedicalDeserts":
      return <MedicalDesertsResult result={result} />;
    case "compareRegions":
      return <RegionComparisonResult result={result} />;
    case "detectAnomalies":
      return <AnomalyAlertsResult result={result} />;
    case "crossValidateClaims":
      return <ClaimsValidationResult result={result} />;
    case "classifyServices":
      return <ServiceClassificationResult result={result} />;
    case "planMission":
      return <MissionPlanResult result={result} />;
    case "firecrawlSearch":
      return <WebSearchResult result={result} />;
    case "firecrawlScrape":
      return <WebScrapeResult result={result} />;
    case "firecrawlExtract":
      return <WebExtractResult result={result} />;
    case "getDemographics":
      return <DemographicsResult args={args} result={result} />;
    case "getWHOData":
      return <WHODataResult result={result} />;
    case "queryOSMFacilities":
      return <OSMFacilitiesResult result={result} />;
    default:
      return null;
  }
}
