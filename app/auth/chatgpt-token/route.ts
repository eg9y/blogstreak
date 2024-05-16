import { NextResponse } from "next/server";

export function POST(request: Request) {
  const requestUrl = new URL(request.url);

  console.log("REQUESTURL", requestUrl);

  const response = NextResponse.json({
    url: requestUrl.toString(),
  });

  response.headers.set("Content-Type", "application/json");

  return response;
}
