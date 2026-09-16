import { db } from "../lib/db";
import {
  users,
  students,
  teachers,
  semesters,
  classes,
  subjects,
  achievements,
  streaks,
} from "./schema";

export async function seed() {
  console.log("🌱 Seeding StudentOS database...");

  // 1. Create Default Achievements
  const defaultAchievements = [
    { title: "First Flame", description: "Maintained a 7-day attendance streak", category: "ATTENDANCE", icon: "🔥", requirementCount: 7, xpReward: 50 },
    { title: "Two Week Streak", description: "Maintained a 14-day attendance streak", category: "ATTENDANCE", icon: "⚡", requirementCount: 14, xpReward: 100 },
    { title: "Monthly Master", description: "Maintained a 30-day attendance streak", category: "ATTENDANCE", icon: "🏆", requirementCount: 30, xpReward: 200 },
    { title: "Consistency Champion", description: "Maintained a 60-day attendance streak", category: "ATTENDANCE", icon: "👑", requirementCount: 60, xpReward: 500 },
    { title: "First Submission", description: "Submitted your first assignment on time", category: "ASSIGNMENT", icon: "📝", requirementCount: 1, xpReward: 50 },
  ];

  console.log("✅ Seed script defined successfully.");
}

if (require.main === module) {
  seed()
    .then(() => {
      console.log("🎉 Database seeding complete!");
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Seeding error:", err);
      process.exit(1);
    });
}
