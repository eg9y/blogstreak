import { NextResponse } from "next/server";

export function GET(request: Request) {
  const requestUrl = new URL(request.url);

  console.log("HMMM", requestUrl);

  const response = NextResponse.json({
    url: requestUrl.toString(),
  });

  response.headers.set("Content-Type", "application/json");

  return response;
}
