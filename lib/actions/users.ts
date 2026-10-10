"use server";

import { db } from "@/lib/db";
import { users, students, teachers, classes } from "@/db/schema";
import { eq, ilike } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { formatErrorMessage } from "@/lib/utils/error-formatter";
import { assertAdmin } from "@/lib/auth/rbac";

export type UserRole = "STUDENT" | "TEACHER" | "ADMIN";

export interface AddUserData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  // Student-specific
  studentId?: string;
  classId?: string;
  rollNumber?: string;
  // Teacher-specific
  teacherId?: string;
  department?: string;
}

export async function addUserAction(data: AddUserData) {
  try {
    // 1. Authorize: only administrators can create users
    await assertAdmin();

    const email = (data.email || "").trim().toLowerCase();
    const name = (data.name || "").trim();

    if (!name || !email || !data.password) {
      return { success: false, error: "Name, email, and password are required." };
    }

    if (data.password.length < 6) {
      return { success: false, error: "Password must be at least 6 characters long." };
    }

    // Check if user with this email already exists
    const [existing] = await db
      .select({ id: users.id })
      .from(users)
      .where(ilike(users.email, email))
      .limit(1);

    if (existing) {
      return { success: false, error: "A user with this email address already exists." };
    }

    // Securely hash the password with bcrypt (12 rounds)
    const passwordHash = await bcrypt.hash(data.password, 12);

    // Atomically execute user creation in a transaction
    const newUserId = await db.transaction(async (tx) => {
      const [newUser] = await tx
        .insert(users)
        .values({
          name,
          email,
          passwordHash,
          role: data.role,
        })
        .returning({ id: users.id });

      if (!newUser) throw new Error("Failed to create user record.");

      if (data.role === "STUDENT") {
        await tx.insert(students).values({
          userId: newUser.id,
          studentId: data.studentId || `STU-${Date.now()}`,
          classId: data.classId || null,
          rollNumber: data.rollNumber || null,
        });
      } else if (data.role === "TEACHER") {
        await tx.insert(teachers).values({
          userId: newUser.id,
          teacherId: data.teacherId || `TCH-${Date.now()}`,
          department: data.department || null,
        });
      }

      return newUser.id;
    });

    try {
      revalidatePath("/admin/users");
      revalidatePath("/admin/dashboard");
    } catch {
      // Ignored outside Next.js request context
    }
    return { success: true, userId: newUserId };
  } catch (err: unknown) {
    return { success: false, error: formatErrorMessage(err, "Failed to create user account.") };
  }
}

export async function deleteUserAction(userId: string) {
  try {
    const admin = await assertAdmin();

    if (admin.id === userId) {
      return { success: false, error: "You cannot delete your own administrative account." };
    }

    // Cascade deletes student/teacher profile automatically via FK constraints
    await db.delete(users).where(eq(users.id, userId));
    try {
      revalidatePath("/admin/users");
      revalidatePath("/admin/dashboard");
    } catch {
      // Ignored outside Next.js request context
    }
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: formatErrorMessage(err, "Failed to delete user account.") };
  }
}

export async function getAllUsers() {
  try {
    const allUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(users.createdAt);

    // Fetch classes for name resolution
    const allClasses = await db.select({ id: classes.id, name: classes.name }).from(classes);
    const classMap = new Map(allClasses.map((c) => [c.id, c.name]));

    // Fetch student IDs & class IDs
    const allStudents = await db
      .select({
        userId: students.userId,
        studentId: students.studentId,
        classId: students.classId,
        rollNumber: students.rollNumber,
      })
      .from(students);

    // Fetch teacher IDs
    const allTeachers = await db
      .select({ userId: teachers.userId, teacherId: teachers.teacherId, department: teachers.department })
      .from(teachers);

    const studentMap = new Map(
      allStudents.map((s) => [
        s.userId,
        {
          userId: s.userId,
          studentId: s.studentId,
          classId: s.classId,
          className: s.classId ? classMap.get(s.classId) || null : null,
          rollNumber: s.rollNumber,
        },
      ])
    );
    const teacherMap = new Map(allTeachers.map((t) => [t.userId, t]));

    return allUsers.map((u) => ({
      ...u,
      studentProfile: studentMap.get(u.id) || null,
      teacherProfile: teacherMap.get(u.id) || null,
    }));
  } catch {
    // Return mock data when DB is not connected
    return [
      {
        id: "demo-1",
        name: "Alex Johnson",
        email: "student@studentos.edu",
        role: "STUDENT" as UserRole,
        createdAt: new Date(),
        studentProfile: { userId: "demo-1", studentId: "2024CS101", rollNumber: "101" },
        teacherProfile: null,
      },
      {
        id: "demo-2",
        name: "Prof. Sarah Smith",
        email: "teacher@studentos.edu",
        role: "TEACHER" as UserRole,
        createdAt: new Date(),
        studentProfile: null,
        teacherProfile: { userId: "demo-2", teacherId: "TCH-501", department: "Computer Science" },
      },
      {
        id: "demo-3",
        name: "System Admin",
        email: "admin@studentos.edu",
        role: "ADMIN" as UserRole,
        createdAt: new Date(),
        studentProfile: null,
        teacherProfile: null,
      },
    ];
  }
}

export async function getAdminDashboardStats() {
  try {
    const allUsers = await db.select({ role: users.role }).from(users);
    const studentCount = allUsers.filter((u) => u.role === "STUDENT").length;
    const teacherCount = allUsers.filter((u) => u.role === "TEACHER").length;
    const adminCount = allUsers.filter((u) => u.role === "ADMIN").length;

    const allClasses = await db.select({ id: classes.id }).from(classes);

    return {
      studentCount,
      teacherCount,
      adminCount,
      classCount: allClasses.length,
      totalUsers: allUsers.length,
      isLive: true,
    };
  } catch {
    return {
      studentCount: 3,
      teacherCount: 2,
      adminCount: 1,
      classCount: 4,
      totalUsers: 6,
      isLive: false,
    };
  }
}
