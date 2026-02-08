import { NextResponse } from "next/server";
import { encode, getToken } from "next-auth/jwt";
import { isDevelopmentEnvironment } from "@/lib/constants";
import { createGuestUser } from "@/lib/db/queries";
import { rateLimit } from "@/lib/rate-limit";

const guestLimiter = rateLimit({ windowMs: 60_000, max: 10 });

const isProduction = process.env.NODE_ENV === "production";
const SESSION_COOKIE_NAME = isProduction
  ? "__Secure-next-auth.session-token"
  : "next-auth.session-token";
const SESSION_MAX_AGE = 7 * 24 * 60 * 60; // 7 days — must match auth.config.ts

function getSafeRedirectUrl(
  redirectUrl: string | null,
  requestUrl: string
): string {
  if (!redirectUrl || redirectUrl === "/") {
    return "/chat";
  }
  try {
    const url = new URL(redirectUrl, requestUrl);
    const origin = new URL(requestUrl).origin;
    if (url.origin !== origin) {
      return "/chat";
    }
    const dest = url.pathname + url.search;
    // Avoid redirecting back to "/" which re-triggers the middleware and
    // can cause a redirect loop before the session cookie is read.
    return dest === "/" ? "/chat" : dest;
  } catch {
    return "/chat";
  }
}

export async function GET(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",").at(0)?.trim() ??
    "unknown";

  if (!guestLimiter.check(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  const { searchParams } = new URL(request.url);
  const redirectUrl = getSafeRedirectUrl(
    searchParams.get("redirectUrl"),
    request.url
  );

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    secureCookie: !isDevelopmentEnvironment,
    cookieName: SESSION_COOKIE_NAME,
    salt: SESSION_COOKIE_NAME,
  });

  if (token) {
    return NextResponse.redirect(new URL("/chat", request.url));
  }

  // Create guest user and issue the session cookie directly on the
  // redirect response.  Using NextAuth's `signIn()` helper relies on
  // `cookies().set()` + `redirect()` from next/navigation which, in
  // Next.js 16 route handlers, does not reliably attach the Set-Cookie
  // header to the redirect response — causing an infinite redirect loop.
  const [guestUser] = await createGuestUser();

  const sessionToken = await encode({
    token: {
      sub: guestUser.id,
      email: guestUser.email,
      name: guestUser.email,
      id: guestUser.id,
      type: "guest" as const,
    },
    secret: process.env.AUTH_SECRET!,
    salt: SESSION_COOKIE_NAME,
    maxAge: SESSION_MAX_AGE,
  });

  const response = NextResponse.redirect(new URL(redirectUrl, request.url));
  response.cookies.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: isProduction,
    maxAge: SESSION_MAX_AGE,
  });

  // Short-lived marker so middleware can detect when the session cookie was
  // set but didn't survive the redirect (prevents infinite redirect loops).
  response.cookies.set("_guest_attempt", "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: isProduction,
    maxAge: 60,
  });

  return response;
}
