import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getCurrentUser, type SessionUser } from "./session";

export type UserRole = "STUDENT" | "TEACHER" | "ADMIN";

export interface UnifiedSession {
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatarUrl?: string | null;
    studentProfile?: SessionUser["studentProfile"];
    teacherProfile?: SessionUser["teacherProfile"];
  };
  session: {
    id: string;
    userId?: string;
  };
}

/**
 * Retrieves the active session using either the secure signed session token
 * or the Better-Auth API layer.
 */
export async function getServerSession(): Promise<UnifiedSession | null> {
  // 1. Check primary signed session cookie
  const currentUser = await getCurrentUser();
  if (currentUser) {
    return {
      user: {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role,
        avatarUrl: currentUser.avatarUrl,
        studentProfile: currentUser.studentProfile,
        teacherProfile: currentUser.teacherProfile,
      },
      session: {
        id: currentUser.id,
        userId: currentUser.id,
      },
    };
  }

  // 2. Fallback to Better-Auth API getSession
  try {
    const reqHeaders = await headers();
    const betterSession = await auth.api.getSession({
      headers: reqHeaders,
    });

    if (betterSession?.user) {
      return {
        user: {
          id: betterSession.user.id,
          name: betterSession.user.name,
          email: betterSession.user.email,
          role: (betterSession.user as { role?: string }).role as UserRole || "STUDENT",
          avatarUrl: betterSession.user.image,
        },
        session: {
          id: betterSession.session.id,
          userId: betterSession.session.userId,
        },
      };
    }
  } catch {
    // Better-Auth lookup error ignored
  }

  return null;
}

/**
 * Requires an authenticated user session in page/layout components; redirects to /login if absent.
 */
export async function requireAuth(): Promise<UnifiedSession> {
  const session = await getServerSession();
  if (!session || !session.user) {
    redirect("/login");
  }
  return session;
}

/**
 * Requires specific role(s) in page/layout components; redirects to /login if unauthorized.
 */
export async function requireRole(allowedRoles: UserRole[]): Promise<UnifiedSession> {
  const session = await requireAuth();
  const userRole = session.user.role;

  if (!userRole || !allowedRoles.includes(userRole)) {
    redirect("/login?error=unauthorized");
  }
  return session;
}

export async function requireStudent(): Promise<UnifiedSession> {
  return await requireRole(["STUDENT", "ADMIN"]);
}

export async function requireTeacher(): Promise<UnifiedSession> {
  return await requireRole(["TEACHER", "ADMIN"]);
}

export async function requireAdmin(): Promise<UnifiedSession> {
  return await requireRole(["ADMIN"]);
}

/**
 * Non-redirecting authorization assertions designed for Server Actions.
 * Throws clean error messages that Server Actions can catch and return to the client UI.
 */
export async function assertAdmin(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    throw new Error("Unauthorized: Administrator privilege required to perform this action.");
  }
  return user;
}

export async function assertTeacherOrAdmin(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user || (user.role !== "TEACHER" && user.role !== "ADMIN")) {
    throw new Error("Unauthorized: Teacher or Administrator privilege required to perform this action.");
  }
  return user;
}

export async function assertAuth(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized: Please sign in to perform this action.");
  }
  return user;
}
