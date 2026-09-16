export interface XPActivity {
  type: "ATTENDANCE" | "ASSIGNMENT_SUBMISSION" | "EARLY_SUBMISSION" | "QUIZ_COMPLETED" | "ACHIEVEMENT_UNLOCKED";
  label: string;
  points: number;
}

export const XP_VALUES = {
  ATTENDANCE: 10,
  ASSIGNMENT_SUBMISSION: 20,
  EARLY_SUBMISSION: 30,
  QUIZ_COMPLETED: 15,
  ACHIEVEMENT_UNLOCKED: 50,
};

export function calculateTotalXP(activities: { type: keyof typeof XP_VALUES; count: number }[]): number {
  return activities.reduce((sum, act) => {
    const value = XP_VALUES[act.type] || 10;
    return sum + value * act.count;
  }, 0);
}
