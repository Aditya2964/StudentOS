export interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
  category: "ATTENDANCE" | "ASSIGNMENT" | "LEARNING" | "ACADEMIC";
  icon: string;
  requirementCount: number;
  xpReward: number;
}

export const MASTER_ACHIEVEMENTS: AchievementDefinition[] = [
  // Attendance Milestones
  { id: "ach-1", title: "First Flame", description: "Maintained a 7-day attendance streak", category: "ATTENDANCE", icon: "🔥", requirementCount: 7, xpReward: 50 },
  { id: "ach-2", title: "Two Week Streak", description: "Maintained a 14-day attendance streak", category: "ATTENDANCE", icon: "⚡", requirementCount: 14, xpReward: 100 },
  { id: "ach-3", title: "Monthly Master", description: "Maintained a 30-day attendance streak", category: "ATTENDANCE", icon: "🏆", requirementCount: 30, xpReward: 200 },
  { id: "ach-4", title: "Consistency Champion", description: "Maintained a 60-day attendance streak", category: "ATTENDANCE", icon: "👑", requirementCount: 60, xpReward: 500 },
  { id: "ach-5", title: "Unstoppable", description: "Maintained a 90-day attendance streak", category: "ATTENDANCE", icon: "💎", requirementCount: 90, xpReward: 800 },
  { id: "ach-6", title: "Half-Year Hero", description: "Maintained a 180-day attendance streak", category: "ATTENDANCE", icon: "🌟", requirementCount: 180, xpReward: 1500 },

  // Assignment Milestones
  { id: "ach-7", title: "First Submission", description: "Submitted your first assignment on time", category: "ASSIGNMENT", icon: "📝", requirementCount: 1, xpReward: 50 },
  { id: "ach-8", title: "5 Assignments", description: "Completed and submitted 5 assignments", category: "ASSIGNMENT", icon: "📚", requirementCount: 5, xpReward: 150 },
  { id: "ach-9", title: "Perfect On-Time Record", description: "Submitted 10 assignments before the deadline", category: "ASSIGNMENT", icon: "🎯", requirementCount: 10, xpReward: 300 },

  // Academic & Learning
  { id: "ach-10", title: "First Study Session", description: "Completed your first AI study session", category: "LEARNING", icon: "🧠", requirementCount: 1, xpReward: 50 },
  { id: "ach-11", title: "Quiz Master", description: "Completed 5 practice quizzes with >80% score", category: "ACADEMIC", icon: "🥇", requirementCount: 5, xpReward: 250 },
];

export interface StudentAchievementProgress {
  achievement: AchievementDefinition;
  isUnlocked: boolean;
  currentCount: number;
  requirementCount: number;
  progressPercentage: number; // 0 - 100
  unlockedAt?: string;
}

export function evaluateStudentAchievements(
  currentStreak: number,
  submittedAssignmentsCount: number,
  unlockedIds: string[] = ["ach-1", "ach-2", "ach-3", "ach-7"]
): StudentAchievementProgress[] {
  return MASTER_ACHIEVEMENTS.map((ach) => {
    const isUnlocked = unlockedIds.includes(ach.id);
    let currentCount = 0;

    if (ach.category === "ATTENDANCE") {
      currentCount = currentStreak;
    } else if (ach.category === "ASSIGNMENT") {
      currentCount = submittedAssignmentsCount;
    } else {
      currentCount = isUnlocked ? ach.requirementCount : 0;
    }

    const progressPercentage = Math.min(100, Math.round((currentCount / ach.requirementCount) * 100));

    return {
      achievement: ach,
      isUnlocked,
      currentCount,
      requirementCount: ach.requirementCount,
      progressPercentage,
      unlockedAt: isUnlocked ? "2026-08-01" : undefined,
    };
  });
}
