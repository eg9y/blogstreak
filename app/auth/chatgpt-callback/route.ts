import { NextResponse } from "next/server";
import { CookieOptions, createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const searchParams = new URLSearchParams(requestUrl.search);

  const chatgptUrl = new URL(
    "https://chatgpt.com/aip/g-3RXxeUIZQ-blogstreak-gpt/oauth/callback",
  );

  chatgptUrl.search = searchParams.toString();

  const code = searchParams.get("code");

  if (code) {
    const cookieStore = cookies();
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

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const responsePayload = {
        access_token: data.session.access_token,
        token_type: data.session.token_type,
        refresh_token: data.session.refresh_token,
        expires_in: data.session.expires_in,
      };

      // Append tokens to the chatgptUrl
      chatgptUrl.searchParams.append(
        "access_token",
        responsePayload.access_token,
      );
      chatgptUrl.searchParams.append("token_type", responsePayload.token_type);
      chatgptUrl.searchParams.append(
        "refresh_token",
        responsePayload.refresh_token,
      );
      chatgptUrl.searchParams.append(
        "expires_in",
        responsePayload.expires_in.toString(),
      );

      return NextResponse.redirect(chatgptUrl.toString());
    }
  }

  return NextResponse.redirect(`https://google.com`);
}
