import { inngest } from "@/lib/inngest/client";
import { fetchBiometricApiAttendance } from "@/lib/attendance/adapters/api-adapter";
import { processNormalizedAttendance } from "@/lib/attendance/service";
import { logAttendanceSync } from "@/lib/attendance/import-logger";

export const scheduledAttendanceSync = inngest.createFunction(
  {
    id: "scheduled-attendance-api-sync",
    name: "Scheduled Biometric Attendance API Sync",
    triggers: [{ cron: "0 16 * * *" }],
  },
  async ({ step }: { step: any }) => {
    const records = await step.run("fetch-biometric-api-data", async () => {
      const apiUrl = process.env.ATTENDANCE_API_URL;
      const apiKey = process.env.ATTENDANCE_API_KEY || "demo-key";

      if (!apiUrl) {
        return [];
      }

      return await fetchBiometricApiAttendance({ apiUrl, apiKey });
    });

    if (records.length === 0) {
      await step.run("log-empty-sync", async () => {
        await logAttendanceSync("CRON", "SUCCESS", 0, "No new biometric records returned from API.");
      });
      return { status: "SKIPPED", recordsProcessed: 0 };
    }

    const result = await step.run("process-api-records", async () => {
      return await processNormalizedAttendance(records);
    });

    await step.run("log-sync-result", async () => {
      await logAttendanceSync(
        "CRON",
        result.failedCount > 0 ? "PARTIAL" : "SUCCESS",
        result.importedCount,
        result.errors.map((e: { reason: string }) => e.reason).join("; ")
      );
    });

    return { status: "COMPLETED", ...result };
  }
);
