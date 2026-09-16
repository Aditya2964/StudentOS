import { db } from "@/lib/db";
import { attendanceImports, attendanceSyncLogs } from "@/db/schema";
import { AttendanceImportResult } from "./types";

export async function logAttendanceImport(
  fileName: string,
  importedBy: string,
  result: AttendanceImportResult
) {
  try {
    const [record] = await db
      .insert(attendanceImports)
      .values({
        fileName,
        importedBy,
        totalRecords: result.totalProcessed,
        successfulRecords: result.importedCount,
        failedRecords: result.failedCount,
        duplicateRecords: result.duplicateCount,
      })
      .returning({ id: attendanceImports.id });

    return record.id;
  } catch (err) {
    console.error("❌ Error logging attendance import batch:", err);
    return null;
  }
}

export async function logAttendanceSync(
  syncType: "API" | "CRON" | "MANUAL",
  status: "SUCCESS" | "FAILED" | "PARTIAL",
  recordsProcessed: number,
  errorLog?: string
) {
  try {
    const [log] = await db
      .insert(attendanceSyncLogs)
      .values({
        syncType,
        status,
        recordsProcessed,
        errorLog,
      })
      .returning({ id: attendanceSyncLogs.id });

    return log.id;
  } catch (err) {
    console.error("❌ Error logging attendance sync:", err);
    return null;
  }
}
