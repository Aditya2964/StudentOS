import { db } from "@/lib/db";
import { attendanceRecords, students } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NormalizedAttendanceRecord, AttendanceImportResult } from "./types";

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

  // Pre-fetch all active students to map biometric studentId to database UUID
  const allStudents = await db.select({ id: students.id, studentId: students.studentId }).from(students);
  const studentMap = new Map<string, string>();
  allStudents.forEach((s) => {
    studentMap.set(s.studentId.trim().toUpperCase(), s.id);
    studentMap.set(s.id, s.id); // also allow direct UUID matching
  });

  const recordsToInsert: (typeof attendanceRecords.$inferInsert)[] = [];

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

    // Check duplicate in database
    const existing = await db
      .select({ id: attendanceRecords.id })
      .from(attendanceRecords)
      .where(and(eq(attendanceRecords.studentId, dbStudentId), eq(attendanceRecords.date, rec.date)))
      .limit(1);

    if (existing.length > 0) {
      result.duplicateCount++;
      continue;
    }

    recordsToInsert.push({
      studentId: dbStudentId,
      date: rec.date,
      checkIn: rec.checkIn ?? null,
      checkOut: rec.checkOut ?? null,
      status: rec.status,
      source: rec.source,
      importId: importId ?? null,
    });
  }

  if (recordsToInsert.length > 0) {
    await db.insert(attendanceRecords).values(recordsToInsert);
    result.importedCount = recordsToInsert.length;
  }

  return result;
}
