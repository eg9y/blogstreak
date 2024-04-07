import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_FILE = /\.(.*)$/;
const NEXT_DATA_PATH = /^\/\_next\//;

export function middleware(request: NextRequest) {
  // Bypass for public files and Next.js-specific paths
  if (
    /\.(.*)$/.test(request.nextUrl.pathname) ||
    request.nextUrl.pathname.startsWith("/_next/")
  ) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  const host = request.headers.get("host") ?? "";
  const mainDomain = "blogstreak.com";

  // Check if we're on the main domain or its www subdomain
  const isMainDomainOrWWW = host === mainDomain || host.startsWith("www.");
  const subdomain = host.split(".")[0];

  if (!isMainDomainOrWWW && subdomain !== "www") {
    // Rewrite both the domain and the path
    url.pathname = `/${subdomain}${url.pathname !== "/" ? url.pathname : ""}`;
    url.hostname = "blogstreak.com";

    const response = NextResponse.rewrite(url);

    return response;
  }

  // Continue without modification for main domain access or if conditions for rewriting are not met
  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
