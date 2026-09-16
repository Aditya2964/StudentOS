export interface RawAttendanceRecord {
  date: string; // YYYY-MM-DD
  status: "PRESENT" | "ABSENT" | "HALF_DAY" | "HOLIDAY";
  checkIn?: string | null;
  checkOut?: string | null;
}

export interface AttendanceStatsSummary {
  totalRecords: number;
  workingDays: number;
  presentDays: number;
  absentDays: number;
  halfDays: number;
  holidays: number;
  percentage: number; // e.g. 87.5
  formattedPercentage: string; // "87.5%"
  statusLabel: "SAFE" | "WARNING" | "CRITICAL";
}

export function calculateAttendanceStats(
  records: RawAttendanceRecord[],
  targetThreshold: number = 75
): AttendanceStatsSummary {
  if (!records || records.length === 0) {
    return {
      totalRecords: 0,
      workingDays: 0,
      presentDays: 0,
      absentDays: 0,
      halfDays: 0,
      holidays: 0,
      percentage: 100,
      formattedPercentage: "100%",
      statusLabel: "SAFE",
    };
  }

  let workingDays = 0;
  let presentDays = 0;
  let absentDays = 0;
  let halfDays = 0;
  let holidays = 0;

  for (const rec of records) {
    if (rec.status === "HOLIDAY") {
      holidays++;
      continue; // Exclude official college holidays from working days
    }

    workingDays++;

    if (rec.status === "PRESENT") {
      presentDays++;
    } else if (rec.status === "ABSENT") {
      absentDays++;
    } else if (rec.status === "HALF_DAY") {
      halfDays++;
      presentDays += 0.5;
    }
  }

  const percentage = workingDays > 0 ? Math.round((presentDays / workingDays) * 1000) / 10 : 100;

  let statusLabel: "SAFE" | "WARNING" | "CRITICAL" = "SAFE";
  if (percentage < targetThreshold) {
    statusLabel = "CRITICAL";
  } else if (percentage < targetThreshold + 5) {
    statusLabel = "WARNING";
  }

  return {
    totalRecords: records.length,
    workingDays,
    presentDays: Math.floor(presentDays),
    absentDays,
    halfDays,
    holidays,
    percentage,
    formattedPercentage: `${percentage}%`,
    statusLabel,
  };
}
