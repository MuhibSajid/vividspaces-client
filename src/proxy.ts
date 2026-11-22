import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const PROTECTED_ROUTES = [
  "/dashboard",
  "/add-studio",
  "/my-listings",
  "/my-bookings",
  "/studios/edit",
];

const AUTH_ROUTES = ["/signin", "/signup"];

function matches(pathname: string, route: string) {
  return pathname === route || pathname.startsWith(`${route}/`);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Cookie presence only — an optimistic check. Real authorization still
  // belongs in the data layer (server components / route handlers).
  const hasSession = Boolean(getSessionCookie(request));

  if (!hasSession && PROTECTED_ROUTES.some((route) => matches(pathname, route))) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  if (hasSession && AUTH_ROUTES.some((route) => matches(pathname, route))) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/add-studio/:path*",
    "/my-listings/:path*",
    "/my-bookings/:path*",
    "/studios/edit/:path*",
    "/signin",
    "/signup",
  ],
};
