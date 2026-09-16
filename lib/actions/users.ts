"use server";

import { db } from "@/lib/db";
import { users, students, teachers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export type UserRole = "STUDENT" | "TEACHER" | "ADMIN";

export interface AddUserData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  // Student-specific
  studentId?: string;
  rollNumber?: string;
  // Teacher-specific
  teacherId?: string;
  department?: string;
}

export async function addUserAction(data: AddUserData) {
  try {
    // Securely hash the password with bcrypt (12 rounds)
    const passwordHash = await bcrypt.hash(data.password, 12);

    // Insert user row
    const [newUser] = await db
      .insert(users)
      .values({
        name: data.name,
        email: data.email,
        passwordHash,
        role: data.role,
      })
      .returning({ id: users.id });

    if (!newUser) throw new Error("Failed to create user record.");

    // Insert role-specific profile
    if (data.role === "STUDENT") {
      await db.insert(students).values({
        userId: newUser.id,
        studentId: data.studentId || `STU-${Date.now()}`,
        rollNumber: data.rollNumber || null,
      });
    } else if (data.role === "TEACHER") {
      await db.insert(teachers).values({
        userId: newUser.id,
        teacherId: data.teacherId || `TCH-${Date.now()}`,
        department: data.department || null,
      });
    }

    try {
      revalidatePath("/admin/users");
    } catch {
      // Ignored outside Next.js request context
    }
    return { success: true, userId: newUser.id };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: message };
  }
}

export async function deleteUserAction(userId: string) {
  try {
    // Cascade deletes student/teacher profile automatically via FK constraints
    await db.delete(users).where(eq(users.id, userId));
    try {
      revalidatePath("/admin/users");
    } catch {
      // Ignored outside Next.js request context
    }
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: message };
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

    // Fetch student IDs
    const allStudents = await db
      .select({ userId: students.userId, studentId: students.studentId, rollNumber: students.rollNumber })
      .from(students);

    // Fetch teacher IDs
    const allTeachers = await db
      .select({ userId: teachers.userId, teacherId: teachers.teacherId, department: teachers.department })
      .from(teachers);

    const studentMap = new Map(allStudents.map((s) => [s.userId, s]));
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
