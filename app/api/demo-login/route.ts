import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const role = searchParams.get("role") || "student";
  const to = searchParams.get("to") || `/${role}/dashboard`;

  const response = NextResponse.redirect(new URL(to, request.url));

  // Set the demo-session cookie server-side so the middleware sees it immediately
  response.cookies.set("demo-session", role, {
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
    sameSite: "lax",
    httpOnly: false,
  });

  return response;
}
