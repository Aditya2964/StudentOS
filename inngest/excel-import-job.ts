import { inngest } from "@/lib/inngest/client";
import { processNormalizedAttendance } from "@/lib/attendance/service";
import { logAttendanceImport } from "@/lib/attendance/import-logger";

export const asyncExcelImportJob = inngest.createFunction(
  {
    id: "async-excel-attendance-import",
    name: "Async Large Excel Attendance Import Job",
    triggers: [{ event: "studentos/attendance.excel-import" }],
  },
  async ({ event, step }: { event: any; step: any }) => {
    const { importId, fileName, importedBy, rawRecords } = event.data as any;

    const normalizedRecords = rawRecords.map((r: any) => ({
      studentId: r.studentId,
      date: r.date,
      checkIn: r.checkIn ?? undefined,
      checkOut: r.checkOut ?? undefined,
      status: r.status,
      source: "EXCEL_IMPORT" as const,
    }));

    const result = await step.run("process-excel-batch", async () => {
      return await processNormalizedAttendance(normalizedRecords, importId);
    });

    await step.run("log-excel-import-report", async () => {
      await logAttendanceImport(fileName, importedBy, result);
    });

    return { success: true, ...result };
  }
);
