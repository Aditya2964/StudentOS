import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export type UserRole = "STUDENT" | "TEACHER" | "ADMIN";

export async function getServerSession() {
  const reqHeaders = await headers();
  return await auth.api.getSession({
    headers: reqHeaders,
  });
}

export async function requireAuth() {
  const session = await getServerSession();
  if (!session || !session.user) {
    redirect("/login");
  }
  return session;
}

export async function requireRole(allowedRoles: UserRole[]) {
  const session = await requireAuth();
  const userRole = (session.user as { role?: string }).role as UserRole;
  
  if (!userRole || !allowedRoles.includes(userRole)) {
    redirect("/login?error=unauthorized");
  }
  return session;
}

export async function requireStudent() {
  return await requireRole(["STUDENT", "ADMIN"]);
}

export async function requireTeacher() {
  return await requireRole(["TEACHER", "ADMIN"]);
}

export async function requireAdmin() {
  return await requireRole(["ADMIN"]);
}
