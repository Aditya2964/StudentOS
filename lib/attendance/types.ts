import { z } from "zod";

export const attendanceStatusSchema = z.enum(["PRESENT", "ABSENT", "HALF_DAY", "HOLIDAY"]);
export type AttendanceStatus = z.infer<typeof attendanceStatusSchema>;

export const attendanceSourceSchema = z.enum(["API_SYNC", "EXCEL_IMPORT", "MANUAL"]);
export type AttendanceSource = z.infer<typeof attendanceSourceSchema>;

export const attendanceRecordSchema = z.object({
  studentId: z.string().min(1, "Student ID is required"), // Can be biometric Student ID or UUID
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  checkIn: z.string().nullable().optional(), // "08:52"
  checkOut: z.string().nullable().optional(), // "16:30"
  status: attendanceStatusSchema.default("PRESENT"),
  source: attendanceSourceSchema.default("EXCEL_IMPORT"),
});

export type NormalizedAttendanceRecord = z.infer<typeof attendanceRecordSchema>;

export interface AttendanceImportResult {
  importId?: string;
  totalProcessed: number;
  importedCount: number;
  duplicateCount: number;
  failedCount: number;
  errors: {
    rowNumber?: number;
    studentId?: string;
    reason: string;
  }[];
}
