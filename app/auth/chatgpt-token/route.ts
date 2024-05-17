import { NextResponse } from "next/server";

// Not sure what I should do, since no payload given whatsover. but this works.
export async function POST(request: Request) {
  const formData = await request.formData();
  console.log("FORMDATER", formData.entries());
  const requestUrl = new URL(request.url);

  const response = NextResponse.json({
    accessToken: requestUrl.toString(),
    access_token: requestUrl.toString(),
    type: "Bearer",
    expiresIn: 3600,
  });

  response.headers.set("Content-Type", "application/json");

  return response;
}
