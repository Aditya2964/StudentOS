import { inngest } from "@/lib/inngest/client";
import { db } from "@/lib/db";
import { attendanceRecords, streaks, studentAchievements } from "@/db/schema";
import { eq } from "drizzle-orm";
import { calculateAttendanceStreak } from "@/lib/analytics/streak-engine";
import { MASTER_ACHIEVEMENTS } from "@/lib/gamification/achievement-evaluator";

export const postAttendanceTriggerJob = inngest.createFunction(
  {
    id: "post-attendance-streak-achievement-trigger",
    name: "Post-Attendance Streak & Achievement Trigger",
    triggers: [{ event: "studentos/attendance.updated" }],
  },
  async ({ event, step }) => {
    const { studentId } = (event.data || {}) as { studentId: string };

    // 1. Fetch student attendance records
    const records = await step.run("fetch-student-records", async () => {
      return await db
        .select({ date: attendanceRecords.date, status: attendanceRecords.status })
        .from(attendanceRecords)
        .where(eq(attendanceRecords.studentId, studentId));
    });

    // 2. Calculate updated streak
    const streakResult = await step.run("recalculate-streak", async () => {
      return calculateAttendanceStreak(records);
    });

    // 3. Update streak table in PostgreSQL
    await step.run("update-streak-record", async () => {
      const existing = await db.select().from(streaks).where(eq(streaks.studentId, studentId)).limit(1);
      if (existing.length > 0) {
        await db
          .update(streaks)
          .set({
            currentStreak: streakResult.currentStreak,
            longestStreak: Math.max(existing[0].longestStreak, streakResult.longestStreak),
            lastPresentDate: streakResult.lastPresentDate,
            updatedAt: new Date(),
          })
          .where(eq(streaks.studentId, studentId));
      } else {
        await db.insert(streaks).values({
          studentId,
          currentStreak: streakResult.currentStreak,
          longestStreak: streakResult.longestStreak,
          lastPresentDate: streakResult.lastPresentDate,
        });
      }
    });

    // 4. Check for attendance achievement unlocks
    await step.run("evaluate-achievements", async () => {
      const attendanceAchievements = MASTER_ACHIEVEMENTS.filter((a) => a.category === "ATTENDANCE");
      const unlocked = await db.select().from(studentAchievements).where(eq(studentAchievements.studentId, studentId));
      const unlockedIds = new Set(unlocked.map((u) => u.achievementId));

      for (const ach of attendanceAchievements) {
        if (!unlockedIds.has(ach.id) && streakResult.currentStreak >= ach.requirementCount) {
          await db.insert(studentAchievements).values({
            studentId,
            achievementId: ach.id,
          });
        }
      }
    });

    return { success: true, currentStreak: streakResult.currentStreak };
  }
);
