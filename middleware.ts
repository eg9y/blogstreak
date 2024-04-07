import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_FILE = /\.(.*)$/;
const NEXT_DATA_PATH = /^\/_next\//;

export function middleware(request: NextRequest) {
  if (
    PUBLIC_FILE.test(request.nextUrl.pathname) ||
    NEXT_DATA_PATH.test(request.nextUrl.pathname)
  ) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  const host = request.headers.get("host") ?? "";
  const mainDomain = "blogstreak.com";
  const alreadyRewritten = request.headers.get("x-rewritten");

  // Skip rewriting if the request has already been rewritten
  if (alreadyRewritten === "true") {
    return NextResponse.next();
  }

  const isMainDomainOrWWW = host === mainDomain || host.startsWith(`www.`);
  const subdomain = host.split(".")[0];

  if (
    !isMainDomainOrWWW &&
    subdomain !== "www" &&
    !url.pathname.startsWith(`/${subdomain}`)
  ) {
    url.pathname = `/${subdomain}${url.pathname}`;

    // Create a modified response with the custom header
    const response = NextResponse.rewrite(url);
    response.headers.set("x-rewritten", "true");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
