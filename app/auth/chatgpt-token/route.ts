import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);

  const body = await request.json();

  console.log("REQUESTURL", requestUrl);
  console.log("BODY", body);

  const response = NextResponse.json({
    url: requestUrl.toString(),
  });

  response.headers.set("Content-Type", "application/json");

  return response;
}
