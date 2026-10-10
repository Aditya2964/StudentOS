"use server";

import { db } from "@/lib/db";
import { announcements, notifications, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/session";
import { assertTeacherOrAdmin } from "@/lib/auth/rbac";
import { formatErrorMessage } from "@/lib/utils/error-formatter";

export interface CreateAnnouncementData {
  title: string;
  content: string;
  category?: "General" | "Assignment" | "Exam" | "Emergency";
  audience?: string; // "ALL" | "STUDENTS" | "TEACHERS"
}

export async function getAnnouncementsAction() {
  try {
    const rawAnnouncements = await db
      .select({
        id: announcements.id,
        title: announcements.title,
        content: announcements.content,
        authorId: announcements.authorId,
        audience: announcements.audience,
        category: announcements.category,
        createdAt: announcements.createdAt,
        authorName: users.name,
        authorRole: users.role,
      })
      .from(announcements)
      .innerJoin(users, eq(announcements.authorId, users.id))
      .orderBy(desc(announcements.createdAt));

    return rawAnnouncements.map((a) => ({
      id: a.id,
      title: a.title,
      content: a.content,
      author: a.authorName,
      authorRole: a.authorRole,
      category: a.category as "General" | "Assignment" | "Exam" | "Emergency",
      date: new Date(a.createdAt).toISOString().split("T")[0],
      createdAt: a.createdAt,
    }));
  } catch (err) {
    console.error("Failed to fetch announcements:", err);
    return [];
  }
}

export async function createAnnouncementAction(data: CreateAnnouncementData) {
  try {
    // 1. Authorize: Only educators or administrators can publish official announcements
    const currentUser = await assertTeacherOrAdmin();

    if (!data.title || !data.content) {
      return { success: false, error: "Title and content are required." };
    }

    const authorId = currentUser.id;

    // 2. Insert announcement
    const [newAnnouncement] = await db
      .insert(announcements)
      .values({
        title: data.title.trim(),
        content: data.content.trim(),
        authorId,
        category: data.category || "General",
        audience: data.audience || "ALL",
      })
      .returning();

    // 3. Create notifications for all students so it immediately displays on their notification bell and dashboard
    try {
      const allStudents = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.role, "STUDENT"));

      if (allStudents.length > 0) {
        await db.insert(notifications).values(
          allStudents.map((s) => ({
            userId: s.id,
            title: `📢 ${data.title.trim()}`,
            message: data.content.trim().slice(0, 120),
            type: "ANNOUNCEMENT",
          }))
        );
      }
    } catch (notifErr) {
      console.warn("Could not broadcast notification entries:", notifErr);
    }

    try {
      revalidatePath("/teacher/announcements");
      revalidatePath("/student/announcements");
      revalidatePath("/student/dashboard");
      revalidatePath("/teacher/dashboard");
    } catch {}

    return { success: true, announcement: newAnnouncement };
  } catch (err: unknown) {
    console.error("Create announcement error:", err);
    return {
      success: false,
      error: formatErrorMessage(err, "Failed to broadcast announcement."),
    };
  }
}

export async function deleteAnnouncementAction(id: string) {
  try {
    await db.delete(announcements).where(eq(announcements.id, id));
    try {
      revalidatePath("/teacher/announcements");
      revalidatePath("/student/announcements");
      revalidatePath("/student/dashboard");
    } catch {}
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: formatErrorMessage(err, "Failed to delete announcement."),
    };
  }
}

export async function getStudentNotificationsAction(userId?: string) {
  try {
    // 1. Fetch user notifications if user ID provided
    let notifs: (typeof notifications.$inferSelect)[] = [];
    if (userId) {
      notifs = await db
        .select()
        .from(notifications)
        .where(eq(notifications.userId, userId))
        .orderBy(desc(notifications.createdAt))
        .limit(10);
    }

    if (notifs.length > 0) {
      return notifs.map((n) => ({
        id: n.id,
        title: n.title,
        message: n.message,
        type: n.type as "DEADLINE" | "ATTENDANCE" | "ACHIEVEMENT" | "ANNOUNCEMENT",
        timestamp: new Date(n.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        read: Boolean(n.readAt),
      }));
    }

    // 2. If no user-specific notifications, pull live announcements as notifications
    const liveAnnouncements = await getAnnouncementsAction();
    if (liveAnnouncements.length > 0) {
      return liveAnnouncements.slice(0, 5).map((a) => ({
        id: a.id,
        title: `📢 ${a.title}`,
        message: a.content,
        type: "ANNOUNCEMENT" as const,
        timestamp: a.date,
        read: false,
      }));
    }

    return [
      {
        id: "default-1",
        title: "Welcome to StudentOS",
        message: "Your centralized academic dashboard is active and synced.",
        type: "ACHIEVEMENT" as const,
        timestamp: "Just now",
        read: false,
      },
    ];
  } catch (err) {
    console.error("Failed to fetch student notifications:", err);
    return [];
  }
}

