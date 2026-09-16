import { pgTable, text, timestamp, uuid, integer } from "drizzle-orm/pg-core";
import { classes, subjects } from "./academic";
import { teachers } from "./users";

export const timetables = pgTable("timetables", {
  id: uuid("id").defaultRandom().primaryKey(),
  classId: uuid("class_id").references(() => classes.id, { onDelete: "cascade" }).notNull(),
  subjectId: uuid("subject_id").references(() => subjects.id, { onDelete: "cascade" }).notNull(),
  teacherId: uuid("teacher_id").references(() => teachers.id, { onDelete: "set null" }),
  dayOfWeek: integer("day_of_week").notNull(), // 1 = Monday ... 7 = Sunday
  startTime: text("start_time").notNull(), // "09:00"
  endTime: text("end_time").notNull(), // "10:00"
  room: text("room").notNull(), // "Room 302" / "Lab 2"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const exams = pgTable("exams", {
  id: uuid("id").defaultRandom().primaryKey(),
  examType: text("exam_type").notNull(), // "Midterm", "Final", "Quiz"
  subjectId: uuid("subject_id").references(() => subjects.id, { onDelete: "cascade" }).notNull(),
  date: text("date").notNull(), // ISO YYYY-MM-DD
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  room: text("room").notNull(),
  instructions: text("instructions"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
