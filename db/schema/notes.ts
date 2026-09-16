import { pgTable, text, timestamp, uuid, integer } from "drizzle-orm/pg-core";
import { semesters, subjects } from "./academic";
import { users } from "./users";

export const notes = pgTable("notes", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  semesterId: uuid("semester_id").references(() => semesters.id, { onDelete: "cascade" }).notNull(),
  subjectId: uuid("subject_id").references(() => subjects.id, { onDelete: "cascade" }).notNull(),
  unit: text("unit").notNull(), // e.g. "Unit 1: Introduction to SQL"
  fileKey: text("file_key").notNull(), // Cloudflare R2 object key
  fileType: text("file_type").default("pdf").notNull(),
  fileSize: integer("file_size"), // bytes
  uploadedBy: uuid("uploaded_by").references(() => users.id, { onDelete: "cascade" }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
