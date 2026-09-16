export interface StreakCalculationResult {
  currentStreak: number;
  longestStreak: number;
  lastPresentDate: string | null;
}

export function isWeekend(dateStr: string): boolean {
  const d = new Date(dateStr);
  const day = d.getUTCDay();
  return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
}

export function calculateAttendanceStreak(
  records: { date: string; status: "PRESENT" | "ABSENT" | "HALF_DAY" | "HOLIDAY" }[]
): StreakCalculationResult {
  if (!records || records.length === 0) {
    return { currentStreak: 0, longestStreak: 0, lastPresentDate: null };
  }

  // Sort records chronologically (oldest to newest)
  const sorted = [...records].sort((a, b) => a.date.localeCompare(b.date));

  let currentStreak = 0;
  let longestStreak = 0;
  let lastPresentDate: string | null = null;

  for (const rec of sorted) {
    // Rule: Weekends & official college holidays do NOT count nor break streaks
    if (rec.status === "HOLIDAY" || isWeekend(rec.date)) {
      continue;
    }

    if (rec.status === "PRESENT" || rec.status === "HALF_DAY") {
      currentStreak++;
      lastPresentDate = rec.date;
      if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
      }
    } else if (rec.status === "ABSENT") {
      // Missing attendance on a required working day breaks the streak
      currentStreak = 0;
    }
  }

  return {
    currentStreak,
    longestStreak,
    lastPresentDate,
  };
}
