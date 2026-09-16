import { pgTable, text, timestamp, uuid, integer } from "drizzle-orm/pg-core";
import { students } from "./users";

export const achievements = pgTable("achievements", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // "ATTENDANCE" | "ASSIGNMENT" | "LEARNING" | "ACADEMIC"
  icon: text("icon").notNull(), // Lucide icon name or emoji
  requirementCount: integer("requirement_count").notNull(), // e.g. 7 for 7-day streak
  xpReward: integer("xp_reward").default(50).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const studentAchievements = pgTable("student_achievements", {
  id: uuid("id").defaultRandom().primaryKey(),
  studentId: uuid("student_id").references(() => students.id, { onDelete: "cascade" }).notNull(),
  achievementId: uuid("achievement_id").references(() => achievements.id, { onDelete: "cascade" }).notNull(),
  unlockedAt: timestamp("unlocked_at").defaultNow().notNull(),
});

export const streaks = pgTable("streaks", {
  id: uuid("id").defaultRandom().primaryKey(),
  studentId: uuid("student_id").references(() => students.id, { onDelete: "cascade" }).notNull().unique(),
  currentStreak: integer("current_streak").default(0).notNull(),
  longestStreak: integer("longest_streak").default(0).notNull(),
  lastPresentDate: text("last_present_date"), // YYYY-MM-DD
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const xpTransactions = pgTable("xp_transactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  studentId: uuid("student_id").references(() => students.id, { onDelete: "cascade" }).notNull(),
  xpAmount: integer("xp_amount").notNull(),
  reason: text("reason").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
