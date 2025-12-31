import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const session = getSessionCookie(request);
  const { pathname } = request.nextUrl;

  const locale = routing.locales.find((loc) => pathname.startsWith(`/${loc}`));
  const pathWithoutLocale = locale
    ? pathname.slice(locale.length + 1)
    : pathname;

  const isAuthPage = pathWithoutLocale.startsWith("/auth");
  const isPublicRoute = process.env.PUBLICROUTES!.includes(pathWithoutLocale);

  if (isPublicRoute) {
    return intlMiddleware(request);
  }

  if (!session) {
    if (isAuthPage) return intlMiddleware(request);
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  if (isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
