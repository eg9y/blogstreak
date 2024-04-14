import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { type CookieOptions, createServerClient } from "@supabase/ssr";

export async function GET(request: Request) {
  // Extract the original search parameters and origin from the request
  const requestUrl = new URL(request.url);
  const searchParams = new URLSearchParams(requestUrl.search);

  // Determine the base URL based on the environment
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? "https://blogstreak.com"
      : "http://localhost:3000";

  // Create a new URL with the base URL and retain the original search parameters
  const url = new URL(baseUrl);
  url.search = searchParams.toString();

  const code = searchParams.get("code");
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get("next") ?? "/";

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
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Use the original origin and next parameters for redirection
      return NextResponse.redirect(`${url.origin}${next}`);
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${url.origin}/auth/auth-code-error`);
}
