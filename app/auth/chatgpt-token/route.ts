import { NextResponse } from "next/server";

export function GET(request: Request) {
  const requestUrl = new URL(request.url);

  console.log("HMMM", requestUrl);

  return NextResponse.json({
    url: requestUrl.toString(),
  });
}
