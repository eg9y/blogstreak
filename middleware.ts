import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_FILE = /\.(.*)$/; // Files

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Clone the URL
  const url = request.nextUrl.clone();

  // Skip public files
  if (PUBLIC_FILE.test(url.pathname) || url.pathname.includes("_next")) return;

  const host = request.headers.get("host");
  const subdomain = getValidSubdomain(host);
  if (subdomain) {
    // Subdomain available, rewriting
    console.log(
      `>>> Rewriting: ${url.pathname} to /${subdomain}${url.pathname}`,
    );
    url.pathname = `/${subdomain}${url.pathname}`;
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};

export const getValidSubdomain = (host?: string | null) => {
  let subdomain: string | null = null;
  if (!host && typeof window !== "undefined") {
    // On client side, get the host from window
    host = window.location.host;
  }
  if (host && host.includes(".")) {
    const candidate = host.split(".")[0];
    if (candidate && !candidate.includes("localhost")) {
      // Valid candidate
      subdomain = candidate;
    }
  }
  return subdomain;
};
