import { CookieOptions, createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Not sure what I should do, since no payload given whatsover. but this works.
export async function POST(request: Request) {
  const cookieStore = cookies();

  const formData = await request.formData();
  formData.forEach((value, key) => {
    console.log(`form entry::: ${key}: ${value}`);
  });

  const grantType = formData.get("grant_type") as string | undefined;
  // const clientId = formData.get("client_id") as string | undefined;
  // const redirectUri = formData.get("redirect_uri") as string | undefined;
  const code = formData.get("code") as string;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.delete({ name, ...options });
        },
      },
    },
  );

  if (grantType === "authorization_code") {
    console.log("CODE:", code);
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      console.log("error exchanging code: ", error);
      const response = NextResponse.json({
        access_token: data.session.access_token,
        // refresh_token: data.session.refresh_token,
        token_type: "bearer",
        expires_in: 30 * 60 - 2,
      });

      response.headers.set("Content-Type", "application/json");

      return response;
    }
  } else if (grantType === "refresh_token") {
    return NextResponse.json({
      text: "hmm",
    });
  }

  return NextResponse.json({
    text: "hmm",
  });
}
