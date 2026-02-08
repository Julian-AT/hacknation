import { type NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { guestRegex, isDevelopmentEnvironment } from "./lib/constants";

/**
 * Auth middleware — every matched route passes through here.
 *
 * Page navigations without a valid session token are redirected to the guest
 * session endpoint so every visitor gets an automatic guest session.
 *
 * API routes are left alone; route handlers return proper 401 responses and
 * the client can react accordingly (this avoids redirect-chain issues with
 * fetch() which can silently drop Set-Cookie headers during 3xx hops).
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/ping")) {
    return new Response("pong", { status: 200 });
  }

  // Always let NextAuth's own routes through.
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Don't redirect API calls — let route handlers return 401 so the client
  // can handle auth failures without hitting redirect-chain edge-cases.
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    secureCookie: !isDevelopmentEnvironment,
  });

  if (!token) {
    // A short-lived marker cookie is set by /api/auth/guest after it creates
    // a session.  If we see it here it means the session cookie didn't
    // survive the redirect (browser quirk, cookie config mismatch, etc.).
    // Fall through instead of looping forever.
    if (request.cookies.has("_guest_attempt")) {
      const response = NextResponse.next();
      response.cookies.delete("_guest_attempt");
      return response;
    }

    const redirectUrl = encodeURIComponent(request.url);
    return NextResponse.redirect(
      new URL(`/api/auth/guest?redirectUrl=${redirectUrl}`, request.url),
    );
  }

  // Clean up the marker cookie once we have a valid session.
  const hasMarker = request.cookies.has("_guest_attempt");

  const isGuest = guestRegex.test(token?.email ?? "");

  if (!isGuest && ["/login", "/register"].includes(pathname)) {
    const response = NextResponse.redirect(new URL("/", request.url));
    if (hasMarker) response.cookies.delete("_guest_attempt");
    return response;
  }

  const response = NextResponse.next();
  if (hasMarker) response.cookies.delete("_guest_attempt");
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
