import { cookies, headers } from "next/headers";
import { createClient } from "./supabase/server";
import { redirect } from "next/navigation";

export const signUpWithGoogle = async () => {
  "use server";

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${headers().get("origin")}/auth/callback?next=/app`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  console.log("error", error);
  console.log("data", data);

  if (error) {
    return redirect("/signup?message=Could not authenticate user via Google");
  }

  return redirect(data.url);
};
