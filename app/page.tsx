import { Fieldset } from "@headlessui/react";

import { Button } from "@/app/components/button";
import { signUpWithGoogle } from "@/utils/signUpWithGoogle";

import { LandingNavbar } from "./components/landing-navbar";

export default function Home() {
  return (
    <>
      <LandingNavbar />
      <main className="mx-auto flex min-h-screen w-1/2 min-w-[400px] flex-col gap-4 p-24">
        <div className="flex flex-col gap-2 dark:text-slate-50">
          <h1 className="text-xl font-bold">BlogStreak</h1>
          <p>
            Blogging and Journaling personal website with built-in
            habit-tracking features
          </p>
          <ul className="list-inside list-disc">
            <li className="">Publish blogposts</li>
            <li className="">Publish your journals</li>
            <li className="">Create tags to organize your posts</li>
            <li>Writing Streaks</li>
            <li>No Trackers</li>
            <li>Looks great on any device</li>
          </ul>
        </div>
        <div className="flex-shrink-0">
          <form className="" action={signUpWithGoogle}>
            <Fieldset className="flex w-full flex-col gap-2 ">
              <Button color="red" type="submit" className="grow cursor-pointer">
                Sign In with Google
              </Button>
            </Fieldset>
          </form>
        </div>
      </main>
    </>
  );
}
