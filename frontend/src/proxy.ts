import { NextResponse, type NextRequest } from "next/server";
import { AUTH_ROLE_COOKIE, AUTH_TOKEN_COOKIE } from "@/lib/config";
import type { Role } from "@/lib/types";

const ADMIN_ROLES: Role[] = ["admin", "superadmin"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_TOKEN_COOKIE)?.value;
  const role = request.cookies.get(AUTH_ROLE_COOKIE)?.value as Role | undefined;

  const isAuthed = Boolean(token);

  if (pathname.startsWith("/superadmin")) {
    if (!isAuthed) return redirectToLogin(request);
    if (role !== "superadmin") return redirectToDashboard(request, role);
  } else if (pathname.startsWith("/admin")) {
    if (!isAuthed) return redirectToLogin(request);
    if (!role || !ADMIN_ROLES.includes(role)) return redirectToDashboard(request, role);
  } else if (pathname.startsWith("/dashboard")) {
    if (!isAuthed) return redirectToLogin(request);
  } else if (pathname === "/login" || pathname === "/register") {
    if (isAuthed) return redirectHome(request, role);
  }

  return NextResponse.next();
}

function redirectToLogin(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = "/login";
  url.search = `?redirect=${encodeURIComponent(request.nextUrl.pathname)}`;
  return NextResponse.redirect(url);
}

function redirectToDashboard(request: NextRequest, role: Role | undefined) {
  const url = request.nextUrl.clone();
  url.pathname = role ? "/dashboard" : "/login";
  url.search = "";
  return NextResponse.redirect(url);
}

function redirectHome(request: NextRequest, role: Role | undefined) {
  const url = request.nextUrl.clone();
  url.pathname = role === "admin" || role === "superadmin" ? "/admin" : "/dashboard";
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/superadmin/:path*", "/login", "/register"],
};
