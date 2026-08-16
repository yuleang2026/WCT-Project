import "server-only";

import type { NextResponse } from "next/server";
import {
  AUTH_ROLE_COOKIE,
  AUTH_TOKEN_COOKIE,
  COOKIE_MAX_AGE,
} from "@/lib/config";
import type { Role } from "@/lib/types";

export function attachAuthCookies(
  response: NextResponse,
  token: string,
  role: Role,
) {
  const secure = process.env.NODE_ENV === "production";

  response.cookies.set(AUTH_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });

  response.cookies.set(AUTH_ROLE_COOKIE, role, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });

  return response;
}

export function clearAuthCookies(response: NextResponse) {
  response.cookies.delete(AUTH_TOKEN_COOKIE);
  response.cookies.delete(AUTH_ROLE_COOKIE);

  return response;
}
