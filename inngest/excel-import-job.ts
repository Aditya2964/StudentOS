import { inngest } from "@/lib/inngest/client";
import { processNormalizedAttendance } from "@/lib/attendance/service";
import { logAttendanceImport } from "@/lib/attendance/import-logger";

interface ExcelImportEventData {
  importId?: string;
  fileName: string;
  importedBy: string;
  rawRecords: Array<{
    studentId: string;
    date: string;
    checkIn?: string | null;
    checkOut?: string | null;
    status: "PRESENT" | "ABSENT" | "HALF_DAY" | "HOLIDAY";
  }>;
}

export const asyncExcelImportJob = inngest.createFunction(
  {
    id: "async-excel-attendance-import",
    name: "Async Large Excel Attendance Import Job",
    triggers: [{ event: "studentos/attendance.excel-import" }],
  },
  async ({ event, step }) => {
    const { importId, fileName, importedBy, rawRecords } = event.data as unknown as ExcelImportEventData;

    const normalizedRecords = (rawRecords || []).map((r) => ({
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
