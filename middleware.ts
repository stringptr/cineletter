import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // =========================================================
  // CSRF protection
  // =========================================================
  if (["POST", "PUT", "DELETE", "PATCH"].includes(req.method)) {
    const origin = req.headers.get("origin");
    const host = req.headers.get("host");

    if (origin && host && !origin.includes(host)) {
      return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
    }
  }

  // =========================================================
  // Block sensitive paths
  // =========================================================
  if (
    ["/.env", "/.git", "/config"].some((p) => pathname.startsWith(p))
  ) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // =========================================================
  // Auth protection
  // =========================================================
  const session = req.cookies.get("session")?.value;

  if (
    (pathname.startsWith("/admin") || pathname.startsWith("/dashboard")) &&
    !session
  ) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (["/login", "/register"].includes(pathname) && session) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // =========================================================
  // FINAL RESPONSE (single instance)
  // =========================================================
  const res = NextResponse.next();

  const csp = `
    default-src 'self';
    script-src 'self' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https:;
    object-src 'none';
    frame-ancestors 'none';
  `.replace(/\s{2,}/g, " ").trim();

  res.headers.set("Content-Security-Policy", csp);
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  if (process.env.NODE_ENV === "production") {
    res.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload",
    );
  }

  return res;
}
