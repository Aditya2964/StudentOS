import { db } from "@/lib/db";
import { attendanceRecords, students } from "@/db/schema";
import { inArray } from "drizzle-orm";
import { NormalizedAttendanceRecord, AttendanceImportResult } from "./types";
import { formatErrorMessage } from "@/lib/utils/error-formatter";
import { parseExcelAttendance } from "./adapters/excel-adapter";
import { logAttendanceImport } from "./import-logger";
import { assertAdmin } from "@/lib/auth/rbac";
import { revalidatePath } from "next/cache";
import { inngest } from "@/lib/inngest/client";

const BATCH_CHUNK_SIZE = 500;

/**
 * High-performance batch processor for normalized attendance records.
 * Solves N+1 query bottleneck by fetching existing records in a single batch query
 * and writing in chunked database transactions.
 */
export async function processNormalizedAttendance(
  records: NormalizedAttendanceRecord[],
  importId?: string
): Promise<AttendanceImportResult> {
  const result: AttendanceImportResult = {
    importId,
    totalProcessed: records.length,
    importedCount: 0,
    duplicateCount: 0,
    failedCount: 0,
    errors: [],
  };

  if (records.length === 0) {
    return result;
  }

  try {
    // 1. Pre-fetch all active students into an in-memory map (O(1) lookups)
    const allStudents = await db.select({ id: students.id, studentId: students.studentId }).from(students);
    const studentMap = new Map<string, string>();
    allStudents.forEach((s) => {
      studentMap.set(s.studentId.trim().toUpperCase(), s.id);
      studentMap.set(s.id, s.id);
    });

    // 2. Resolve database UUIDs and collect valid student IDs
    const resolvedRows: Array<{
      dbStudentId: string;
      originalStudentId: string;
      rec: NormalizedAttendanceRecord;
      rowNumber: number;
    }> = [];

    for (let i = 0; i < records.length; i++) {
      const rec = records[i];
      const normalizedId = rec.studentId.trim().toUpperCase();
      const dbStudentId = studentMap.get(normalizedId);

      if (!dbStudentId) {
        result.failedCount++;
        result.errors.push({
          rowNumber: i + 1,
          studentId: rec.studentId,
          reason: `Student ID "${rec.studentId}" not found in institutional directory`,
        });
        continue;
      }

      resolvedRows.push({
        dbStudentId,
        originalStudentId: rec.studentId,
        rec,
        rowNumber: i + 1,
      });
    }

    if (resolvedRows.length === 0) {
      return result;
    }

    // 3. Batch query existing records for duplicate check in 1 round-trip (Eliminates N+1 query loop)
    const uniqueStudentIds = Array.from(new Set(resolvedRows.map((r) => r.dbStudentId)));
    
    // Chunk student IDs if querying a large batch
    const existingKeySet = new Set<string>();
    for (let i = 0; i < uniqueStudentIds.length; i += 1000) {
      const studentChunk = uniqueStudentIds.slice(i, i + 1000);
      const existingRecords = await db
        .select({
          studentId: attendanceRecords.studentId,
          date: attendanceRecords.date,
        })
        .from(attendanceRecords)
        .where(inArray(attendanceRecords.studentId, studentChunk));

      for (const row of existingRecords) {
        existingKeySet.add(`${row.studentId}_${row.date}`);
      }
    }

    // 4. Filter duplicates and prepare insertion list
    const recordsToInsert: (typeof attendanceRecords.$inferInsert)[] = [];
    const internalBatchKeys = new Set<string>();
    const affectedStudentIds = new Set<string>();

    for (const row of resolvedRows) {
      const key = `${row.dbStudentId}_${row.rec.date}`;

      if (existingKeySet.has(key) || internalBatchKeys.has(key)) {
        result.duplicateCount++;
        continue;
      }

      internalBatchKeys.add(key);
      affectedStudentIds.add(row.dbStudentId);

      recordsToInsert.push({
        studentId: row.dbStudentId,
        date: row.rec.date,
        checkIn: row.rec.checkIn ?? null,
        checkOut: row.rec.checkOut ?? null,
        status: row.rec.status,
        source: row.rec.source,
        importId: importId ?? null,
      });
    }

    // 5. Chunked transactional bulk insert
    if (recordsToInsert.length > 0) {
      await db.transaction(async (tx) => {
        for (let i = 0; i < recordsToInsert.length; i += BATCH_CHUNK_SIZE) {
          const chunk = recordsToInsert.slice(i, i + BATCH_CHUNK_SIZE);
          await tx.insert(attendanceRecords).values(chunk);
        }
      });
      result.importedCount = recordsToInsert.length;

      // 6. Asynchronously trigger Inngest events for streak & achievement re-evaluation
      try {
        const events = Array.from(affectedStudentIds).map((studentId) => ({
          name: "studentos/attendance.updated" as const,
          data: { studentId },
        }));

        if (events.length > 0) {
          // Send in batches of 100 to avoid event size limit
          for (let i = 0; i < events.length; i += 100) {
            await inngest.send(events.slice(i, i + 100)).catch((inngestErr) => {
              console.warn("Inngest streak trigger notice:", inngestErr);
            });
          }
        }
      } catch (evtErr) {
        console.warn("Failed to dispatch Inngest streak events:", evtErr);
      }
    }
  } catch (err) {
    console.error("Attendance process error:", err);
    result.errors.push({
      rowNumber: 0,
      studentId: "SYSTEM",
      reason: formatErrorMessage(err, "Database processing error occurred during attendance import."),
    });
  }

  return result;
}

/**
 * Server Action for importing biometric spreadsheet files (.xlsx, .xls, .csv).
 * Enforces admin authorization, parses files via SheetJS, executes batch insertion,
 * and records import audit logs.
 */
export async function importExcelAttendanceAction(formData: FormData) {
  try {
    const admin = await assertAdmin();

    const file = formData.get("file") as File | null;
    if (!file) {
      return { success: false, error: "Please select a valid spreadsheet file to upload." };
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse records using SheetJS
    const normalizedRecords = parseExcelAttendance(buffer);

    if (normalizedRecords.length === 0) {
      return {
        success: false,
        error: "No valid attendance records found in the uploaded file. Please verify columns (Student ID, Date, Status).",
      };
    }

    // Process records into DB
    const result = await processNormalizedAttendance(normalizedRecords);

    // Log the import batch
    const importLogId = await logAttendanceImport(file.name, admin.name || "Administrator", result);
    result.importId = importLogId || undefined;

    try {
      revalidatePath("/admin/attendance/import");
      revalidatePath("/admin/attendance/logs");
      revalidatePath("/admin/dashboard");
      revalidatePath("/student/attendance");
      revalidatePath("/student/dashboard");
    } catch {
      // Ignored outside Next.js request context
    }

    return {
      success: true,
      report: result,
    };
  } catch (err: unknown) {
    console.error("Excel import action error:", err);
    return {
      success: false,
      error: formatErrorMessage(err, "Failed to import spreadsheet attendance data."),
    };
  }
}
