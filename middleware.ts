import { NextResponse, type NextRequest } from "next/server";
import { verifySessionToken } from "@/lib/auth/token";
import type { SessionUser } from "@/lib/auth/session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public assets, favicon, login, and webhook routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/demo-login") ||
    pathname.startsWith("/api/inngest") ||
    pathname.startsWith("/login") ||
    pathname === "/" ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // 1. Session token lookup
  const sessionToken =
    request.cookies.get("studentos_session")?.value ||
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("__Secure-better-auth.session_token")?.value;

  if (!sessionToken) {
    let targetLoginPath = "/login";
    if (pathname.startsWith("/admin")) {
      targetLoginPath = "/login/admin";
    } else if (pathname.startsWith("/teacher")) {
      targetLoginPath = "/login/teacher";
    } else if (pathname.startsWith("/student")) {
      targetLoginPath = "/login/student";
    }

    const loginUrl = new URL(targetLoginPath, request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Cryptographic signature and role boundary verification
  const session = await verifySessionToken<SessionUser>(sessionToken);

  if (!session && !request.cookies.get("better-auth.session_token")?.value) {
    // Unverified or tampered cookie detected
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    loginUrl.searchParams.set("error", "session_expired");
    return NextResponse.redirect(loginUrl);
  }

  // 3. Enforce Role-Based Access Control (RBAC) on route groups
  if (session) {
    if (pathname.startsWith("/admin") && session.role !== "ADMIN") {
      const redirectUrl = new URL(
        session.role === "TEACHER" ? "/teacher/dashboard" : "/student/dashboard",
        request.url
      );
      return NextResponse.redirect(redirectUrl);
    }

    if (pathname.startsWith("/teacher") && session.role !== "TEACHER" && session.role !== "ADMIN") {
      const redirectUrl = new URL("/student/dashboard", request.url);
      return NextResponse.redirect(redirectUrl);
    }

    if (pathname.startsWith("/student") && session.role !== "STUDENT" && session.role !== "ADMIN") {
      const redirectUrl = new URL("/teacher/dashboard", request.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
