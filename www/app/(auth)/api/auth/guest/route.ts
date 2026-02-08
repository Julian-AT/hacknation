import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { signIn } from "@/app/(auth)/auth";
import { isDevelopmentEnvironment } from "@/lib/constants";
import { rateLimit } from "@/lib/rate-limit";

const guestLimiter = rateLimit({ windowMs: 60_000, max: 10 });

function getSafeRedirectUrl(
  redirectUrl: string | null,
  requestUrl: string
): string {
  if (!redirectUrl || redirectUrl === "/") {
    return "/";
  }
  try {
    const url = new URL(redirectUrl, requestUrl);
    const origin = new URL(requestUrl).origin;
    if (url.origin !== origin) {
      return "/";
    }
    return url.pathname + url.search;
  } catch {
    return "/";
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
  });

  if (token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return signIn("guest", { redirect: true, redirectTo: redirectUrl });
}
