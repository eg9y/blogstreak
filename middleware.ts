import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_FILE = /\.(.*)$/; // Files
const NEXT_DATA_PATH = /^\/_next\//; // Next.js specific paths

export function middleware(request: NextRequest) {
  // Skip public files and Next.js specific paths
  if (
    PUBLIC_FILE.test(request.nextUrl.pathname) ||
    NEXT_DATA_PATH.test(request.nextUrl.pathname)
  ) {
    return;
  }

  const url = request.nextUrl.clone();
  const host = request.headers.get("host") ?? "";

  // Assuming 'blogstreak.com' is your main domain and excluding any www subdomain
  const mainDomain = "blogstreak.com";
  const isMainDomainOrWWW = host === mainDomain || host === `www.${mainDomain}`;

  // Extract subdomain if not accessing the main domain or www
  if (!isMainDomainOrWWW && host.endsWith(mainDomain)) {
    const subdomain = host.split(".")[0]; // Assuming subdomain is always the first part

    // Avoid rewriting if the subdomain is 'www' or empty
    if (subdomain && subdomain !== "www") {
      // Rewrite the path to include the subdomain
      url.pathname = `/${subdomain}${url.pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  // For the main domain or www, proceed without rewriting
  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
