import Link from "next/link";
import { cookies } from "next/headers";

import { Button } from "@/app/components/button";
import { createClient } from "@/utils/supabase/server";

import { LandingNavbar } from "./components/landing-navbar";

export default async function Home() {
  const cookie = cookies();
  const supabase = createClient(cookie);

  return (
    <>
      <LandingNavbar />
      <main className="mx-auto flex min-h-screen w-1/2 min-w-[400px] flex-col gap-4 p-24">
        <div className="">
          <h1 className="text-xl font-bold">MiniMicroblog</h1>
          <ul className="list-inside list-disc">
            <li className="">
              Post short-form texts in your own personal website
            </li>
            <li className="">Create groups to organize your posts by topic</li>
            <li className="">Manage privacy for posts and groups</li>
            <li className="">
              Have your readers follow your posts and groups via email
            </li>
          </ul>
        </div>
        <Button color="orange" href="/signup" className="w-40">
          Create my blog
        </Button>
      </main>
    </>
  );
}
