"use client";

import { Fragment, useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { BellIcon } from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import { createClient } from "@/utils/supabase/client";
import { getUser } from "@/utils/getUser";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeUsernameDialog } from "./nav/change-username-dialog";
import { Button } from "./button";

export default function ViewSidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpenChangeUsername, setIsOpenChangeUsername] = useState(false);
  const { currentUser } = getUser();
  const [username, setUsername] = useState("");
  const router = useRouter();

  const supabase = createClient();

  useEffect(() => {
    (async () => {
      if (currentUser) {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", currentUser.id)
          .single();

        if (profile?.name) {
          setUsername(profile.name);
        }
      }
    })();
  }, [currentUser]);

  const userNavigation = [
    {
      name: "Sign out",
      onClick: async () => {
        await supabase.auth.signOut();
        router.refresh();
      },
    },
    {
      name: "Change Username",
      onClick: async () => {
        setIsOpenChangeUsername(true);
      },
    },
  ];

  return (
    <div className="mx-auto w-[1000px]">
      <ChangeUsernameDialog
        isOpen={isOpenChangeUsername}
        setIsOpen={setIsOpenChangeUsername}
      />
      <div className="flex flex-col">
        <div className="flex h-[7vh] max-h-[52px] shrink-0 items-center gap-x-4 border-b border-slate-400 bg-transparent px-4 shadow-sm sm:gap-x-6 sm:px-6 md:px-8 dark:border-slate-600 dark:bg-slate-800">
          {/* Separator */}
          <div
            className="h-6 w-px bg-slate-900/10 md:hidden"
            aria-hidden="true"
          />

          <div className="flex flex-1 gap-x-4 self-stretch md:gap-x-6">
            <Link
              href="/me"
              className="flex items-center text-base font-bold tracking-tight dark:text-slate-50"
            >
              <p>BlogStreak</p>
            </Link>
            <Button plain>Blog</Button>
            <Button plain>Microblog</Button>
            <form
              className="relative flex flex-1 dark:bg-slate-600"
              action="#"
              method="GET"
            >
              <label htmlFor="search-field" className="sr-only">
                Search
              </label>
              <MagnifyingGlassIcon
                className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-slate-400"
                aria-hidden="true"
              />
              <input
                id="search-field"
                className="block h-full w-full border-0 bg-transparent py-0 pl-8 pr-0 text-slate-900 placeholder:text-slate-400 focus:ring-0  sm:text-sm dark:bg-slate-800 dark:text-slate-300"
                placeholder="Search..."
                autoComplete="off"
                autoCorrect="off"
                type="search"
                name="search"
              />
            </form>
          </div>
        </div>

        <main className="">
          <div className="overflow-y-hidden px-2">{children}</div>
        </main>
      </div>
    </div>
  );
}
