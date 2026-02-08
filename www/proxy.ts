import { type NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { guestRegex, isDevelopmentEnvironment } from "./lib/constants";

/*
 * next-auth v5 defaults to "authjs.session-token" but auth.ts overrides
 * the cookie name to "next-auth.session-token". We must tell getToken()
 * the exact name so it can find the cookie.
 */
const isProduction = process.env.NODE_ENV === "production";
const SESSION_COOKIE = isProduction
  ? "__Secure-next-auth.session-token"
  : "next-auth.session-token";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /*
   * Playwright starts the dev server and requires a 200 status to
   * begin the tests, so this ensures that the tests can start
   */
  if (pathname.startsWith("/ping")) {
    return new Response("pong", { status: 200 });
  }

  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    secureCookie: !isDevelopmentEnvironment,
    cookieName: SESSION_COOKIE,
    salt: SESSION_COOKIE,
  });

  if (!token) {
    // Break redirect loops: if the guest route already tried to set a
    // session cookie (_guest_attempt marker) but getToken still returns
    // null, stop redirecting and let the request through to avoid an
    // infinite 307 cycle.
    const alreadyAttempted = request.cookies.get("_guest_attempt");
    if (alreadyAttempted) {
      return NextResponse.next();
    }

    const redirectUrl = encodeURIComponent(request.url);

    return NextResponse.redirect(
      new URL(`/api/auth/guest?redirectUrl=${redirectUrl}`, request.url)
    );
  }

  const isGuest = guestRegex.test(token?.email ?? "");

  if (token && !isGuest && ["/login", "/register"].includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/chat/:id",
    "/api/:path*",
    "/login",
    "/register",

    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};