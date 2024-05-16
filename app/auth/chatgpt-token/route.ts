import { NextResponse } from "next/server";

export function POST(request: Request) {
  const requestUrl = new URL(request.url);

  console.log("REQUESTURL", requestUrl);

  const response = NextResponse.json({
    accessToken: requestUrl.toString(),
    access_token: requestUrl.toString(),
    type: "Bearer",
    expiresIn: 3600,
  });

  response.headers.set("Content-Type", "application/json");

  return response;
}
