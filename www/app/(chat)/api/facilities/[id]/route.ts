import { eq } from "drizzle-orm";
import { auth } from "@/app/(auth)/auth";
import { db } from "@/lib/db";
import { facilities } from "@/lib/db/schema.facilities";
import { computeAnomalyConfidence } from "@/lib/ai/tools/computeAnomalyConfidence";
import { ChatSDKError } from "@/lib/errors";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user) {
    return new ChatSDKError("unauthorized:chat").toResponse();
  }

  const { id } = await params;
  const numericId = Number.parseInt(id, 10);

  if (Number.isNaN(numericId) || numericId <= 0) {
    return Response.json({ error: "Invalid facility ID" }, { status: 400 });
  }

  try {
    const [facility] = await db
      .select()
      .from(facilities)
      .where(eq(facilities.id, numericId))
      .limit(1);

    if (!facility) {
      return Response.json({ error: "Facility not found" }, { status: 404 });
    }

    const { embedding: _, ...facilityWithoutEmbedding } = facility;

    const fields = [
      facility.numDoctors,
      facility.capacity,
      facility.proceduresRaw,
      facility.equipmentRaw,
      facility.email,
    ];
    const presentFields = fields.filter(
      (f: unknown) => f !== null && f !== ""
    ).length;
    const dataQualityScore = `${Math.round((presentFields / fields.length) * 100)}%`;

    const anomalyConfidence = computeAnomalyConfidence(facility);

    return Response.json(
      {
        facility: facilityWithoutEmbedding,
        dataQualityScore,
        missingCriticalData:
          !facility.numDoctors && !facility.capacity
            ? "Missing Capacity Data"
            : null,
        anomalyConfidence,
      },
      {
        status: 200,
        headers: { "Cache-Control": "public, max-age=300, s-maxage=600" },
      }
    );
  } catch (error) {
    console.error(
      "[Facilities API] Error:",
      error instanceof Error ? error.message : error
    );
    return Response.json(
      { error: "Failed to fetch facility" },
      { status: 500 }
    );
  }
}
