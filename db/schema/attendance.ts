import { pgTable, text, timestamp, uuid, pgEnum, integer, index } from "drizzle-orm/pg-core";
import { students } from "./users";

export const attendanceStatusEnum = pgEnum("attendance_status", ["PRESENT", "ABSENT", "HALF_DAY", "HOLIDAY"]);
export const attendanceSourceEnum = pgEnum("attendance_source", ["API_SYNC", "EXCEL_IMPORT", "MANUAL"]);

export const attendanceImports = pgTable("attendance_imports", {
  id: uuid("id").defaultRandom().primaryKey(),
  fileName: text("file_name").notNull(),
  importedBy: text("imported_by").notNull(),
  totalRecords: integer("total_records").notNull(),
  successfulRecords: integer("successful_records").notNull(),
  failedRecords: integer("failed_records").notNull(),
  duplicateRecords: integer("duplicate_records").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const attendanceRecords = pgTable(
  "attendance_records",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    studentId: uuid("student_id").references(() => students.id, { onDelete: "cascade" }).notNull(),
    date: text("date").notNull(), // ISO YYYY-MM-DD
    checkIn: text("check_in"), // e.g. "08:52"
    checkOut: text("check_out"), // e.g. "16:30"
    status: attendanceStatusEnum("status").default("PRESENT").notNull(),
    source: attendanceSourceEnum("source").default("EXCEL_IMPORT").notNull(),
    importId: uuid("import_id").references(() => attendanceImports.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("attendance_student_date_idx").on(table.studentId, table.date),
  ]
);

export const attendanceSyncLogs = pgTable("attendance_sync_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  syncType: text("sync_type").notNull(), // "API" | "CRON" | "MANUAL"
  status: text("status").notNull(), // "SUCCESS" | "FAILED" | "PARTIAL"
  recordsProcessed: integer("records_processed").default(0).notNull(),
  errorLog: text("error_log"),
  syncedAt: timestamp("synced_at").defaultNow().notNull(),
});
