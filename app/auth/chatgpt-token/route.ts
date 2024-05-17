import { NextResponse } from "next/server";

// Not sure what I should do, since no payload given whatsover. but this works.
export async function POST(request: Request) {
  const formData = await request.formData();
  formData.forEach((value, key) => {
    console.log(`form entry::: ${key}: ${value}`);
  });

  const grantType = formData.get("grant_type") as string | undefined;
  // const clientId = formData.get("client_id") as string | undefined;
  // const redirectUri = formData.get("redirect_uri") as string | undefined;
  const code = formData.get("code") as string;

  if (grantType === "authorization_code") {
    const responsePayload = JSON.parse(code);
    const response = NextResponse.json(responsePayload);
    response.headers.set("Content-Type", "application/json");
    return response;
  } else if (grantType === "refresh_token") {
    return NextResponse.json({
      text: "hmm",
    });
  }

  return NextResponse.json({
    text: "hmm",
  });
}
