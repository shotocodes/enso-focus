import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";

  if (host.includes("ensolife.app")) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("https://ensolife.app/focus"), 301);
}

export const config = {
  matcher: ["/focus", "/focus/:path*"],
};
