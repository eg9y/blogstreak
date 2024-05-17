import { NextResponse } from "next/server";

export function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const searchParams = new URLSearchParams(requestUrl.search);

  const code = searchParams.get("code");
  const state = searchParams.get("state-x");
  const redirectUri = searchParams.get("redirect_uri") as string;

  console.log("requestUrl", requestUrl);

  if (code) {
    //   const responsePayload = {
    //     access_token: data.session.access_token,
    //     token_type: data.session.token_type,
    //     refresh_token: data.session.refresh_token,
    //     expires_in: data.session.expires_in,
    //   };

    // Redirect back to the ChatGPT platform with the tokens as query parameters
    const redirectUrl = new URL(redirectUri);

    redirectUrl.searchParams.append("code", code);

    if (state) {
      redirectUrl.searchParams.append("state", state);
    }

    console.log("KANGJAI", redirectUrl);

    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.redirect(`https://google.com`);
}
