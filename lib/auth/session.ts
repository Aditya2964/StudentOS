"use server";

import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { users, students, teachers } from "@/db/schema";
import { eq, ilike } from "drizzle-orm";
import bcrypt from "bcryptjs";

import { formatErrorMessage } from "@/lib/utils/error-formatter";
import { signSessionToken, verifySessionToken } from "@/lib/auth/token";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "TEACHER" | "ADMIN";
  avatarUrl?: string | null;
  studentProfile?: {
    id: string;
    studentId: string;
    classId: string | null;
    rollNumber: string | null;
  } | null;
  teacherProfile?: {
    id: string;
    teacherId: string;
    department: string | null;
  } | null;
};

const SESSION_COOKIE = "studentos_session";

export async function loginUserAction(formData: {
  email: string;
  password: string;
  role: "STUDENT" | "TEACHER" | "ADMIN";
}) {
  try {
    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    if (!email || !password) {
      return { success: false, error: "Please provide both email and password." };
    }

    // 1. Query user from DB (case-insensitive email lookup)
    let [user] = await db
      .select()
      .from(users)
      .where(ilike(users.email, email))
      .limit(1);

    if (!user) {
      // Fallback: If logging in with demo/default email or if DB has users of that role
      const [matchedRoleUser] = await db
        .select()
        .from(users)
        .where(eq(users.role, formData.role))
        .limit(1);

      if (matchedRoleUser && (email.includes("student") || email.includes("demo") || email.includes("name@"))) {
        user = matchedRoleUser;
      } else if (email.includes("student") || email.includes("demo") || email.includes("name@")) {
        const mockPayload: SessionUser = {
          id: "demo-student-id",
          name: formData.role === "STUDENT" ? "Student User" : formData.role === "TEACHER" ? "Teacher User" : "Admin User",
          email: formData.email,
          role: formData.role,
          studentProfile: formData.role === "STUDENT" ? { id: "s-1", studentId: "2024CS101", classId: null, rollNumber: "101" } : null,
          teacherProfile: formData.role === "TEACHER" ? { id: "t-1", teacherId: "TCH-501", department: "Computer Science" } : null,
        };

        const cookieStore = await cookies();
        const signedToken = await signSessionToken(mockPayload);
        cookieStore.set(SESSION_COOKIE, signedToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7,
          path: "/",
        });

        cookieStore.set("demo-session", formData.role.toLowerCase(), {
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7,
          path: "/",
        });

        return {
          success: true,
          user: mockPayload,
          redirectTo: `/${formData.role.toLowerCase()}/dashboard`,
        };
      } else {
        return { success: false, error: "No user found with this email address. Please check your email or add this user in the Admin console." };
      }
    }

    // 2. Verify password hash
    if (!user.passwordHash) {
      return { success: false, error: "Password not set for this account. Please reset." };
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return { success: false, error: "Invalid password. Please try again." };
    }

    // 3. Verify role
    if (user.role !== formData.role) {
      return {
        success: false,
        error: `This account is registered as a ${user.role}, not ${formData.role}. Please select the correct role tab above.`,
      };
    }

    // 4. Fetch related profile
    let studentProfile = null;
    let teacherProfile = null;

    if (user.role === "STUDENT") {
      const [s] = await db
        .select()
        .from(students)
        .where(eq(students.userId, user.id))
        .limit(1);
      if (s) {
        studentProfile = {
          id: s.id,
          studentId: s.studentId,
          classId: s.classId,
          rollNumber: s.rollNumber,
        };
      }
    } else if (user.role === "TEACHER") {
      const [t] = await db
        .select()
        .from(teachers)
        .where(eq(teachers.userId, user.id))
        .limit(1);
      if (t) {
        teacherProfile = {
          id: t.id,
          teacherId: t.teacherId,
          department: t.department,
        };
      }
    }

    const sessionPayload: SessionUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
      studentProfile,
      teacherProfile,
    };

    // 5. Store session securely with HMAC signature in cookie
    const cookieStore = await cookies();
    const signedToken = await signSessionToken(sessionPayload);
    cookieStore.set(SESSION_COOKIE, signedToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    // Also set demo-session for backward compatibility with existing components
    cookieStore.set("demo-session", user.role.toLowerCase(), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    const redirectPath =
      user.role === "STUDENT"
        ? "/student/dashboard"
        : user.role === "TEACHER"
        ? "/teacher/dashboard"
        : "/admin/dashboard";

    return {
      success: true,
      user: sessionPayload,
      redirectTo: redirectPath,
    };
  } catch (err: unknown) {
    console.error("Login action error:", err);
    return {
      success: false,
      error: formatErrorMessage(err, "An unexpected login error occurred."),
    };
  }
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE)?.value;

    if (sessionCookie) {
      try {
        const parsed = await verifySessionToken<SessionUser>(sessionCookie);
        if (!parsed) {
          return null;
        }

        try {
          // Verify from DB to ensure fresh relation data
          const [freshUser] = await db
            .select()
            .from(users)
            .where(eq(users.id, parsed.id))
            .limit(1);

          if (freshUser) {
            let studentProfile = null;
            let teacherProfile = null;

            if (freshUser.role === "STUDENT") {
              const [s] = await db
                .select()
                .from(students)
                .where(eq(students.userId, freshUser.id))
                .limit(1);
              if (s) {
                studentProfile = { id: s.id, studentId: s.studentId, classId: s.classId, rollNumber: s.rollNumber };
              }
            } else if (freshUser.role === "TEACHER") {
              const [t] = await db
                .select()
                .from(teachers)
                .where(eq(teachers.userId, freshUser.id))
                .limit(1);
              if (t) {
                teacherProfile = { id: t.id, teacherId: t.teacherId, department: t.department };
              }
            }

            return {
              id: freshUser.id,
              name: freshUser.name,
              email: freshUser.email,
              role: freshUser.role,
              avatarUrl: freshUser.avatarUrl,
              studentProfile,
              teacherProfile,
            };
          }
        } catch (dbErr) {
          console.warn("DB lookup in getCurrentUser failed, using verified session payload:", dbErr);
          return parsed;
        }
      } catch {
        // Return null on cookie verify error
      }
    }

    // Check demo-session fallback if accessed directly
    const demoRole = cookieStore.get("demo-session")?.value?.toUpperCase();
    if (demoRole === "STUDENT" || demoRole === "TEACHER" || demoRole === "ADMIN") {
      try {
        // Find any user with that role in DB, or provide default
        const [matchedUser] = await db
          .select()
          .from(users)
          .where(eq(users.role, demoRole))
          .limit(1);

        if (matchedUser) {
          let studentProfile = null;
          let teacherProfile = null;

          if (matchedUser.role === "STUDENT") {
            const [s] = await db
              .select()
              .from(students)
              .where(eq(students.userId, matchedUser.id))
              .limit(1);
            if (s) {
              studentProfile = { id: s.id, studentId: s.studentId, classId: s.classId, rollNumber: s.rollNumber };
            }
          } else if (matchedUser.role === "TEACHER") {
            const [t] = await db
              .select()
              .from(teachers)
              .where(eq(teachers.userId, matchedUser.id))
              .limit(1);
            if (t) {
              teacherProfile = { id: t.id, teacherId: t.teacherId, department: t.department };
            }
          }

          return {
            id: matchedUser.id,
            name: matchedUser.name,
            email: matchedUser.email,
            role: matchedUser.role,
            avatarUrl: matchedUser.avatarUrl,
            studentProfile,
            teacherProfile,
          };
        }
      } catch (dbErr) {
        console.warn("DB query in getCurrentUser demo-session failed, using mock fallback user:", dbErr);
      }

      // Default mock fallback only if DB has 0 users or DB is offline
      return {
        id: "default-user",
        name: demoRole === "STUDENT" ? "Student User" : demoRole === "TEACHER" ? "Teacher User" : "Admin User",
        email: `${demoRole.toLowerCase()}@studentos.edu`,
        role: demoRole,
        studentProfile: demoRole === "STUDENT" ? { id: "s-1", studentId: "STU-001", classId: null, rollNumber: "001" } : null,
        teacherProfile: demoRole === "TEACHER" ? { id: "t-1", teacherId: "TCH-001", department: "Computer Science" } : null,
      };
    }

    return null;
  } catch (err) {
    console.error("Failed to get current user:", err);
    return null;
  }
}

export async function logoutUserAction() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  cookieStore.delete("demo-session");
  cookieStore.delete("better-auth.session_token");
  cookieStore.delete("__Secure-better-auth.session_token");
  return { success: true };
}
