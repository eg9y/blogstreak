import { Button } from "@/app/components/button";
import Link from "next/link";
import { LandingNavbar } from "./components/landing-navbar";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const cookie = cookies();
  const supabase = createClient(cookie);

  console.log(await supabase.auth.getUser());

  return (
    <>
      <LandingNavbar />
      <main className="flex min-h-screen flex-col mx-auto gap-4 w-1/2 min-w-[400px] p-24">
        <div className="">
          <h1 className="text-xl font-bold">MiniMicroblog</h1>
          <ul className="list-disc list-inside">
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
