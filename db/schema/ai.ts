import { pgTable, text, timestamp, uuid, integer, jsonb } from "drizzle-orm/pg-core";
import { users } from "./users";
import { notes } from "./notes";

export const aiConversations = pgTable("ai_conversations", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  title: text("title").notNull(),
  messages: jsonb("messages").default([]).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const studyPlans = pgTable("study_plans", {
  id: uuid("id").defaultRandom().primaryKey(),
  studentId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  title: text("title").notNull(),
  planDetails: jsonb("plan_details").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const noteEmbeddings = pgTable("note_embeddings", {
  id: uuid("id").defaultRandom().primaryKey(),
  noteId: uuid("note_id").references(() => notes.id, { onDelete: "cascade" }).notNull(),
  chunkIndex: integer("chunk_index").notNull(),
  chunkContent: text("chunk_content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
