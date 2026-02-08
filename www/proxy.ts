import { type NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { guestRegex, isDevelopmentEnvironment } from "./lib/constants";

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

  // Don't redirect API calls — let route handlers return 401 so the client
  // can handle auth failures without redirect-chain edge-cases.
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Public routes: no session required. Stops redirect loops on / and auth pages.
  const isPublicRoute =
    pathname === "/" || pathname === "/login" || pathname === "/register";
  if (isPublicRoute) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    secureCookie: !isDevelopmentEnvironment,
  });

  if (!token) {
    // If we already sent the user to guest but the session cookie didn't stick
    // (e.g. redirect timing, cookie config), pass through to avoid infinite redirect.
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