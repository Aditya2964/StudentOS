import { inngest } from "@/lib/inngest/client";
import { db } from "@/lib/db";
import { notifications, students, attendanceRecords } from "@/db/schema";
import { calculateAttendanceStats } from "@/lib/analytics/attendance-stats";

export const scheduledNotificationDispatcherJob = inngest.createFunction(
  {
    id: "scheduled-notification-dispatcher",
    name: "Scheduled Notification Dispatcher",
    triggers: [{ cron: "0 8 * * *" }],
  },
  async ({ step }) => {
    const allStudents = await step.run("fetch-active-students", async () => {
      return await db.select({ id: students.id, userId: students.userId }).from(students);
    });

    let dispatchedCount = 0;

    for (const student of allStudents) {
      // Check attendance status for low attendance warning
      await step.run(`check-attendance-warning-${student.id}`, async () => {
        const records = await db.select().from(attendanceRecords);
        const stats = calculateAttendanceStats(records);

        if (stats.percentage < 75 && stats.workingDays > 5) {
          await db.insert(notifications).values({
            userId: student.userId,
            title: "⚠️ Attendance Alert: Below 75%",
            message: `Your current attendance is ${stats.percentage}%. Please attend upcoming classes to avoid short attendance penalties.`,
            type: "ATTENDANCE",
          });
          dispatchedCount++;
        }
      });
    }

    return { success: true, dispatchedNotifications: dispatchedCount };
  }
);
