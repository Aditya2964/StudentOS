import * as XLSX from "xlsx";
import { NormalizedAttendanceRecord, attendanceStatusSchema } from "../types";

export function parseDateString(val: unknown): string {
  if (!val) return new Date().toISOString().split("T")[0];

  // Case 1: Excel Serial Date Number
  if (typeof val === "number") {
    const parsed = XLSX.SSF.parse_date_code(val);
    if (parsed) {
      const yyyy = parsed.y;
      const mm = String(parsed.m).padStart(2, "0");
      const dd = String(parsed.d).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    }
  }

  const str = String(val).trim();

  // Case 2: DD-MM-YYYY or DD/MM/YYYY
  if (/^\d{1,2}[-/]\d{1,2}[-/]\d{4}$/.test(str)) {
    const parts = str.split(/[-/]/);
    const dd = parts[0].padStart(2, "0");
    const mm = parts[1].padStart(2, "0");
    const yyyy = parts[2];
    return `${yyyy}-${mm}-${dd}`;
  }

  // Case 3: YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    return str;
  }

  // Fallback ISO Parse
  const d = new Date(str);
  if (!isNaN(d.getTime())) {
    return d.toISOString().split("T")[0];
  }

  return new Date().toISOString().split("T")[0];
}

export function parseExcelAttendance(fileBuffer: Buffer): NormalizedAttendanceRecord[] {
  const workbook = XLSX.read(fileBuffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  const rawRows: Record<string, unknown>[] = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

  const normalizedRecords: NormalizedAttendanceRecord[] = [];

  for (const row of rawRows) {
    // Flexible column header mapping
    const studentIdRaw =
      row["Student ID"] || row["student_id"] || row["StudentId"] || row["Roll No"] || row["ID"] || row["STUDENT_ID"];
    const dateRaw = row["Date"] || row["date"] || row["ATTENDANCE_DATE"] || row["Day"];
    const checkInRaw = row["Check In"] || row["check_in"] || row["CHECK_IN"] || row["Time In"];
    const checkOutRaw = row["Check Out"] || row["check_out"] || row["CHECK_OUT"] || row["Time Out"];
    const statusRaw = String(row["Status"] || row["status"] || "Present").toUpperCase();

    if (!studentIdRaw) continue;

    let status: "PRESENT" | "ABSENT" | "HALF_DAY" | "HOLIDAY" = "PRESENT";
    if (statusRaw.includes("ABSENT") || statusRaw === "A") status = "ABSENT";
    else if (statusRaw.includes("HALF")) status = "HALF_DAY";
    else if (statusRaw.includes("HOLIDAY")) status = "HOLIDAY";

    normalizedRecords.push({
      studentId: String(studentIdRaw).trim(),
      date: parseDateString(dateRaw),
      checkIn: checkInRaw ? String(checkInRaw).trim() : undefined,
      checkOut: checkOutRaw ? String(checkOutRaw).trim() : undefined,
      status,
      source: "EXCEL_IMPORT",
    });
  }

  return normalizedRecords;
}
