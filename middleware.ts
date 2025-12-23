import { NextRequest, NextResponse } from "next/server";

/* =========================================================
   RATE LIMIT CONFIG
========================================================= */
const RATE_LIMIT = 60; // requests
const RATE_WINDOW = 60_000; // 1 minute

const rateMap = new Map<
  string,
  { count: number; reset: number }
>();

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);

  if (!entry || now > entry.reset) {
    rateMap.set(ip, {
      count: 1,
      reset: now + RATE_WINDOW,
    });
    return true;
  }

  entry.count++;
  return entry.count <= RATE_LIMIT;
}

/* =========================================================
   MIDDLEWARE
========================================================= */
export default function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const method = req.method;

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ??
    "unknown";

  const PUBLIC_API = [
    "/api/auth/login",
    "/api/auth/register",
    "/api/health",
    "/api/title",
  ];

  if (pathname.startsWith("/api")) {
    const isPublic = PUBLIC_API.some((p) => pathname.startsWith(p));

    const session = req.cookies.get("session")?.value;

    if (!isPublic && !session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }
  }

  /* =========================================================
     CSRF PROTECTION
  ========================================================= */
  if (["POST", "PUT", "DELETE", "PATCH"].includes(method)) {
    const origin = req.headers.get("origin");
    const host = req.headers.get("host");

    if (origin && host && !origin.includes(host)) {
      return NextResponse.json(
        { error: "Invalid origin" },
        { status: 403 },
      );
    }
  }

  /* =========================================================
     BLOCK SENSITIVE PATHS
  ========================================================= */
  if (
    ["/.env", "/.git", "/config"].some((p) => pathname.startsWith(p))
  ) {
    return NextResponse.json(
      { error: "Not found" },
      { status: 404 },
    );
  }

  /* =========================================================
     AUTH PROTECTION
  ========================================================= */
  const session = req.cookies.get("session")?.value;

  if (
    (pathname.startsWith("/admin") ||
      pathname.startsWith("/dashboard")) &&
    !session
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (["/login", "/register"].includes(pathname) && session) {
    return NextResponse.redirect(
      new URL("/dashboard", req.url),
    );
  }

  /* =========================================================
     FINAL RESPONSE (SECURITY HEADERS)
  ========================================================= */
  const res = NextResponse.next();

  const csp = `
    default-src 'self';
    script-src 'self' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https:;
    object-src 'none';
    frame-ancestors 'none';
  `
    .replace(/\s{2,}/g, " ")
    .trim();

  res.headers.set("Content-Security-Policy", csp);
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set(
    "Referrer-Policy",
    "strict-origin-when-cross-origin",
  );

  if (process.env.NODE_ENV === "production") {
    res.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload",
    );
  }

  return res;
}

/* =========================================================
   MATCHER
========================================================= */
export const config = {
  matcher: [
    "/api/:path*",
    "/login",
    "/register",
    "/dashboard/:path*",
    "/admin/:path*",
  ],
};
