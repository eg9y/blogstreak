"use client";

import { Button } from "@/app/components/button";
import { signUpWithGoogleChatgpt } from "@/utils/signUpWithGoogleChatgpt";

export default function ChatgptLogin() {
  return (
    <div>
      <p>Sign in to ChatGPT Blogstreak plugin!</p>
      <Button onClick={signUpWithGoogleChatgpt}>Sign in</Button>
    </div>
  );
}
