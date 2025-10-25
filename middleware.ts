import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
  const session = getSessionCookie(request);
  const { pathname } = request.nextUrl;
  const isAuthPage = pathname.startsWith("/auth");

  if (!session) {
    if (isAuthPage) return NextResponse.next();
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  if (isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/settings/:path*", "/auth/:path*"],
};
