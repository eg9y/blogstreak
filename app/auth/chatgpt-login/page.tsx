"use client";

import { redirect, useSearchParams } from "next/navigation";

import { Button } from "@/app/components/button";
import { createClient } from "@/utils/supabase/client";

export default function ChatgptLogin() {
  const searchParams = useSearchParams();

  const signUpWithGoogleChatgpt = async () => {
    if (!searchParams) {
      return redirect("/?message=Could not authenticate user via Google");
    }

    const supabase = createClient();

    const redirectUrl = new URL(searchParams.get("redirect_uri") as string);
    redirectUrl.searchParams.append(
      "state-x",
      searchParams.get("state") as string,
    );

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectUrl.toString(),
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) {
      return redirect("/?message=Could not authenticate user via Google");
    }

    return redirect(data.url);
  };

  return (
    <div>
      <p>Sign in to ChatGPT Blogstreak plugin!</p>
      <Button onClick={signUpWithGoogleChatgpt} disabled={!searchParams}>
        Sign in
      </Button>
    </div>
  );
}
