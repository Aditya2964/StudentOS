import { pgTable, text, timestamp, uuid, boolean, integer } from "drizzle-orm/pg-core";

export const semesters = pgTable("semesters", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(), // e.g. "Semester 5"
  academicYear: text("academic_year").notNull(), // e.g. "2026-2027"
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  isCurrent: boolean("is_current").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const classes = pgTable("classes", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(), // e.g. "CS-A 3rd Year"
  department: text("department").notNull(),
  semesterId: uuid("semester_id").references(() => semesters.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const subjects = pgTable("subjects", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(), // e.g. "Database Management Systems"
  code: text("code").notNull().unique(), // e.g. "CS501"
  credits: integer("credits").default(3).notNull(),
  semesterId: uuid("semester_id").references(() => semesters.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
