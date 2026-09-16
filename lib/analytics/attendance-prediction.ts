export interface AttendancePredictionResult {
  currentPercentage: number;
  targetThreshold: number; // e.g. 75%
  canMissDays: number; // How many working days can be missed before dropping below 75%
  requiredDaysToReachTarget: number; // How many future working days must be attended if currently below target
  predictionSentence: string; // PRD actionable sentence
  isSafe: boolean;
}

export function calculateAttendancePrediction(
  presentDays: number,
  workingDays: number,
  targetThreshold: number = 75
): AttendancePredictionResult {
  if (workingDays === 0) {
    return {
      currentPercentage: 100,
      targetThreshold,
      canMissDays: 0,
      requiredDaysToReachTarget: 0,
      predictionSentence: "No official working days recorded yet.",
      isSafe: true,
    };
  }

  const currentPercentage = Math.round((presentDays / workingDays) * 1000) / 10;
  const thresholdRatio = targetThreshold / 100;

  if (currentPercentage >= targetThreshold) {
    // Formula: (P) / (W + M) >= T  =>  P >= T * (W + M)  =>  M <= (P - T*W) / T
    const canMiss = Math.floor((presentDays - thresholdRatio * workingDays) / thresholdRatio);
    const safeMissDays = Math.max(0, canMiss);

    return {
      currentPercentage,
      targetThreshold,
      canMissDays: safeMissDays,
      requiredDaysToReachTarget: 0,
      predictionSentence:
        safeMissDays > 0
          ? `You can miss approximately ${safeMissDays} more working day${safeMissDays === 1 ? "" : "s"} before reaching ${targetThreshold}%.`
          : `You are at the ${targetThreshold}% threshold. Missing the next day will lower your percentage below target.`,
      isSafe: true,
    };
  } else {
    // Formula: (P + R) / (W + R) >= T  =>  P + R >= T*W + T*R  =>  R*(1 - T) >= T*W - P  =>  R >= (T*W - P) / (1 - T)
    const requiredDays = Math.ceil((thresholdRatio * workingDays - presentDays) / (1 - thresholdRatio));
    const safeRequiredDays = Math.max(1, requiredDays);
    const projectedPercentage = Math.round(((presentDays + safeRequiredDays) / (workingDays + safeRequiredDays)) * 1000) / 10;

    return {
      currentPercentage,
      targetThreshold,
      canMissDays: 0,
      requiredDaysToReachTarget: safeRequiredDays,
      predictionSentence: `If you attend the next ${safeRequiredDays} working day${safeRequiredDays === 1 ? "" : "s"}, your attendance will reach approximately ${projectedPercentage}%.`,
      isSafe: false,
    };
  }
}
