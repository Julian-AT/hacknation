import { MEDICAL_KNOWLEDGE } from "../../medical-knowledge";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AnomalyFlag = {
  checkId: string;
  severity: "critical" | "high" | "medium" | "low";
  explanation: string;
};

export type AnomalyConfidence = {
  level: "green" | "yellow" | "red";
  score: number;
  summary: string;
  flags: AnomalyFlag[];
};

/** Minimal facility shape required by the scorer. */
export type FacilityInput = {
  facilityType?: string | null;
  capacity?: number | null;
  numDoctors?: number | null;
  specialtiesRaw?: string | null;
  proceduresRaw?: string | null;
  equipmentRaw?: string | null;
  procedures?: string[] | null;
  specialties?: string[] | null;
  equipment?: string[] | null;
};

// ---------------------------------------------------------------------------
// Severity weights used to deduct from a perfect 100
// ---------------------------------------------------------------------------

const SEVERITY_WEIGHT: Record<AnomalyFlag["severity"], number> = {
  critical: 30,
  high: 20,
  medium: 10,
  low: 5,
};

// ---------------------------------------------------------------------------
// Individual check functions
// ---------------------------------------------------------------------------

function checkInfrastructureMismatch(f: FacilityInput): AnomalyFlag[] {
  const flags: AnomalyFlag[] = [];
  const procText = (f.proceduresRaw ?? "").toLowerCase();
  const specText = (f.specialtiesRaw ?? "").toLowerCase();
  const beds = f.capacity ?? 0;

  const claimsSurgery =
    procText.includes("surgery") ||
    specText.includes("surgery") ||
    specText.includes("surgical");

  if (claimsSurgery && beds > 0 && beds < 5) {
    flags.push({
      checkId: "infrastructure_mismatch",
      severity: "high",
      explanation: `Claims surgical capabilities but lists only ${beds} bed${beds === 1 ? "" : "s"} (minimum 5 expected for any surgical facility).`,
    });
  }

  return flags;
}

function checkSpecialtyInfrastructureGap(f: FacilityInput): AnomalyFlag[] {
  const flags: AnomalyFlag[] = [];
  const specText = (f.specialtiesRaw ?? "").toLowerCase();
  const procText = (f.proceduresRaw ?? "").toLowerCase();
  const equipText = (f.equipmentRaw ?? "").toLowerCase();
  const beds = f.capacity ?? 0;
  const doctors = f.numDoctors ?? 0;

  const { specialtyInfrastructure } = MEDICAL_KNOWLEDGE;

  for (const [specialty, thresholds] of Object.entries(
    specialtyInfrastructure
  )) {
    const lowerSpecialty = specialty.toLowerCase();
    if (!specText.includes(lowerSpecialty) && !procText.includes(lowerSpecialty))
      continue;

    const issues: string[] = [];

    if (beds > 0 && beds < thresholds.minBeds) {
      issues.push(`${beds} beds (minimum ${thresholds.minBeds} expected)`);
    }
    if (doctors > 0 && doctors < thresholds.minDoctors) {
      issues.push(
        `${doctors} doctor${doctors === 1 ? "" : "s"} (minimum ${thresholds.minDoctors} expected)`
      );
    }
    if (thresholds.requiredEquipment && equipText.length > 0) {
      const hasAny = thresholds.requiredEquipment.some((eq) =>
        equipText.includes(eq.toLowerCase())
      );
      if (!hasAny) {
        issues.push(
          `none of the required equipment found (needs ${thresholds.requiredEquipment.join(", ")})`
        );
      }
    }

    if (issues.length > 0) {
      flags.push({
        checkId: "specialty_infrastructure_gap",
        severity: issues.length > 1 ? "critical" : "high",
        explanation: `Claims "${specialty}" but has insufficient infrastructure: ${issues.join("; ")}.`,
      });
    }
  }

  return flags;
}

function checkProcedureEquipmentMismatch(f: FacilityInput): AnomalyFlag[] {
  const flags: AnomalyFlag[] = [];
  const procText = (f.proceduresRaw ?? "").toLowerCase();
  const equipText = (f.equipmentRaw ?? "").toLowerCase();

  // Only check if there is some equipment text to compare against
  if (equipText.length === 0) return flags;

  const { procedureRequirements } = MEDICAL_KNOWLEDGE;

  for (const [procedure, requiredEquipment] of Object.entries(
    procedureRequirements
  )) {
    if (!procText.includes(procedure.toLowerCase())) continue;

    const hasEquipment = requiredEquipment.some((eq) =>
      equipText.includes(eq.toLowerCase())
    );

    if (!hasEquipment) {
      flags.push({
        checkId: "procedure_equipment_mismatch",
        severity: "high",
        explanation: `Claims "${procedure}" but none of the required equipment is listed (needs ${requiredEquipment.join(", ")}).`,
      });
    }
  }

  return flags;
}

function checkCapacityStaffingRatio(f: FacilityInput): AnomalyFlag[] {
  const flags: AnomalyFlag[] = [];
  const beds = f.capacity ?? 0;
  const doctors = f.numDoctors ?? 0;

  if (beds <= 0 || doctors <= 0) return flags;

  const { expectedRatios } = MEDICAL_KNOWLEDGE;
  const ratio = beds / doctors;

  if (ratio > expectedRatios.bedsPerDoctor.max) {
    flags.push({
      checkId: "capacity_staffing_ratio",
      severity: "medium",
      explanation: `Bed-to-doctor ratio is ${Math.round(ratio * 10) / 10}:1, which exceeds the expected maximum of ${expectedRatios.bedsPerDoctor.max}:1. Typical ratio is ${expectedRatios.bedsPerDoctor.typical}:1.`,
    });
  }

  // Extreme case: > 100 beds with < 5 doctors
  if (beds > 100 && doctors < 5) {
    flags.push({
      checkId: "unlikely_capacity",
      severity: "critical",
      explanation: `Reports ${beds} beds but only ${doctors} doctor${doctors === 1 ? "" : "s"}, which is implausible for any operational facility.`,
    });
  }

  return flags;
}

function checkMissingCriticalData(f: FacilityInput): AnomalyFlag[] {
  const flags: AnomalyFlag[] = [];
  const type = (f.facilityType ?? "").toLowerCase();

  const isHospital =
    type.includes("hospital") ||
    type.includes("teaching") ||
    type.includes("tertiary");

  if (!isHospital) return flags;

  if (f.numDoctors === null || f.numDoctors === undefined) {
    flags.push({
      checkId: "missing_critical_data",
      severity: "medium",
      explanation:
        "Classified as a hospital but has no doctor count on record. This makes verification of other claims difficult.",
    });
  }

  if (f.capacity === null || f.capacity === undefined) {
    flags.push({
      checkId: "missing_critical_data",
      severity: "medium",
      explanation:
        "Classified as a hospital but has no bed count on record. Capacity claims cannot be validated.",
    });
  }

  return flags;
}

function checkProcedureBreadth(f: FacilityInput): AnomalyFlag[] {
  const flags: AnomalyFlag[] = [];
  const procCount = f.procedures?.length ?? 0;

  if (procCount === 0) return flags;

  const beds = f.capacity ?? 0;
  const doctors = f.numDoctors ?? 0;
  const equipText = (f.equipmentRaw ?? "").toLowerCase();
  const equipLen = equipText.length;
  const { expectedRatios } = MEDICAL_KNOWLEDGE;

  let maxExpected = expectedRatios.maxProceduresLargeFacility;
  let sizeLabel = "large";
  if (beds > 0 && beds < 20) {
    maxExpected = expectedRatios.maxProceduresSmallFacility;
    sizeLabel = "small";
  } else if (beds >= 20 && beds <= 100) {
    maxExpected = expectedRatios.maxProceduresMediumFacility;
    sizeLabel = "medium";
  }

  if (procCount > maxExpected) {
    flags.push({
      checkId: "procedure_breadth_mismatch",
      severity: "medium",
      explanation: `Lists ${procCount} procedures but maximum expected for a ${sizeLabel} facility (${beds > 0 ? `${beds} beds` : "unknown size"}) is ${maxExpected}.`,
    });
  }

  if (procCount > 10 && equipLen < 50) {
    flags.push({
      checkId: "procedure_breadth_mismatch",
      severity: "high",
      explanation: `Lists ${procCount} procedures but has minimal equipment documentation, raising questions about actual capability.`,
    });
  }

  if (procCount > 10 && doctors > 0 && doctors < 3) {
    flags.push({
      checkId: "procedure_breadth_mismatch",
      severity: "high",
      explanation: `Lists ${procCount} procedures with only ${doctors} doctor${doctors === 1 ? "" : "s"}, which is unlikely to sustain that range of services.`,
    });
  }

  return flags;
}

// ---------------------------------------------------------------------------
// Main scoring function
// ---------------------------------------------------------------------------

export function computeAnomalyConfidence(
  facility: FacilityInput
): AnomalyConfidence {
  const flags: AnomalyFlag[] = [
    ...checkInfrastructureMismatch(facility),
    ...checkSpecialtyInfrastructureGap(facility),
    ...checkProcedureEquipmentMismatch(facility),
    ...checkCapacityStaffingRatio(facility),
    ...checkMissingCriticalData(facility),
    ...checkProcedureBreadth(facility),
  ];

  // Compute score: start at 100 and deduct per flag
  let score = 100;
  for (const flag of flags) {
    score -= SEVERITY_WEIGHT[flag.severity];
  }
  score = Math.max(0, Math.min(100, score));

  // Determine level
  let level: AnomalyConfidence["level"] = "green";
  if (score < 40) {
    level = "red";
  } else if (score < 70) {
    level = "yellow";
  }

  // Build plain-English summary
  let summary: string;
  if (flags.length === 0) {
    summary = "No misrepresentation signals detected. Claims appear consistent with reported infrastructure.";
  } else {
    const criticalCount = flags.filter((f) => f.severity === "critical").length;
    const highCount = flags.filter((f) => f.severity === "high").length;

    if (criticalCount > 0) {
      summary = `${criticalCount} critical and ${highCount} high-severity misrepresentation signal${criticalCount + highCount === 1 ? "" : "s"} detected. Claims are inconsistent with reported infrastructure.`;
    } else if (highCount > 0) {
      summary = `${highCount} high-severity issue${highCount === 1 ? "" : "s"} found. Some claims may not be supported by the facility's reported capacity.`;
    } else {
      summary = `${flags.length} minor issue${flags.length === 1 ? "" : "s"} noted. Claims are mostly consistent but some data gaps exist.`;
    }
  }

  return { level, score, summary, flags };
}
