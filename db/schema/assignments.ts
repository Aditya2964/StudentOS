import { pgTable, text, timestamp, uuid, pgEnum, integer } from "drizzle-orm/pg-core";
import { subjects, classes } from "./academic";
import { teachers, students } from "./users";

export const submissionStatusEnum = pgEnum("submission_status", ["PENDING", "SUBMITTED", "GRADED", "LATE"]);

export const assignments = pgTable("assignments", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  subjectId: uuid("subject_id").references(() => subjects.id, { onDelete: "cascade" }).notNull(),
  teacherId: uuid("teacher_id").references(() => teachers.id, { onDelete: "cascade" }).notNull(),
  classId: uuid("class_id").references(() => classes.id, { onDelete: "cascade" }).notNull(),
  deadline: timestamp("deadline").notNull(),
  maxMarks: integer("max_marks").default(100).notNull(),
  attachmentKey: text("attachment_key"), // Cloudflare R2 file key
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const submissions = pgTable("submissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  assignmentId: uuid("assignment_id").references(() => assignments.id, { onDelete: "cascade" }).notNull(),
  studentId: uuid("student_id").references(() => students.id, { onDelete: "cascade" }).notNull(),
  fileKey: text("file_key").notNull(), // Cloudflare R2 submission file key
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  status: submissionStatusEnum("status").default("SUBMITTED").notNull(),
  grade: integer("grade"),
  feedback: text("feedback"),
});
