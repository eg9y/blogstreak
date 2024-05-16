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
    console.log("error chatgpt", error);
    if (!error) {
      console.log("dater", data);
      console.log("redirect url:", `${chatgptUrl}`);
      return NextResponse.redirect(`${chatgptUrl}`);
    }
  }

  return NextResponse.redirect(`https://google.com`);
}
