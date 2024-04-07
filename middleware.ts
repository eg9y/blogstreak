import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Regular expressions for public files and Next.js paths
const PUBLIC_FILE = /\.(.*)$/;
const NEXT_DATA_PATH = /^\/_next\//;

export function middleware(request: NextRequest) {
  // Bypass for public files and Next.js-specific paths
  if (
    PUBLIC_FILE.test(request.nextUrl.pathname) ||
    NEXT_DATA_PATH.test(request.nextUrl.pathname)
  ) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  const host = request.headers.get("host") ?? "";
  const mainDomain = "blogstreak.com";

  // Check if we're on the main domain or its www subdomain
  const isMainDomainOrWWW = host === mainDomain || host === `www.${mainDomain}`;

  // Extract subdomain
  const subdomain = host.split(".")[0];

  // Proceed only if on a subdomain other than 'www', and if the pathname does not already start with the subdomain
  console.log("url.pathname", url.pathname);
  if (
    !isMainDomainOrWWW &&
    subdomain !== "www" &&
    !url.pathname.startsWith(`/${subdomain}`)
  ) {
    // Rewrite the URL's pathname to include the subdomain
    url.pathname = `/${subdomain}${url.pathname}`;
    console.log("Rewriting to:", url.pathname);
    return NextResponse.rewrite(url);
  }

  // Continue without modification for main domain access or if conditions for rewriting are not met
  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
