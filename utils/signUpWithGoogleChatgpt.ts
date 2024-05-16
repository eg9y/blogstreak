"use client";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { createClient } from "./supabase/server";

export const signUpWithGoogleChatgpt = async () => {
  "use server";

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `https://chatgpt.com/aip/g-3RXxeUIZQ-blogstreak-gpt/oauth/callback`,
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
