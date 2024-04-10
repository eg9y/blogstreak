import { Fieldset } from "@headlessui/react";

import { Button } from "@/app/components/button";
import { signUpWithGoogle } from "@/utils/signUpWithGoogle";

import { LandingNavbar } from "./components/landing-navbar";

export default function Home() {
  return (
    <>
      <LandingNavbar />
      <main className="mx-auto flex min-h-screen w-1/2 min-w-[400px] flex-col gap-4 p-24">
        <div className="dark:text-slate-50">
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
