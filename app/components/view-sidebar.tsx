"use client";

import { ReactNode, useEffect, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { createClient } from "@/utils/supabase/client";
import { getUser } from "@/utils/getUser";
import { cn } from "@/utils/cn";

import { ChangeUsernameDialog } from "./nav/change-username-dialog";

export default function ViewSidebar({ children }: { children: ReactNode }) {
  const [isOpenChangeUsername, setIsOpenChangeUsername] = useState(false);
  const { currentUser } = getUser();
  const [username, setUsername] = useState("");
  const [isMe, setIsMe] = useState(false);
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const supabase = createClient();

  const baseUrl =
    process.env.NODE_ENV === "production"
      ? "https://blogstreak.com"
      : "http://localhost:3000";

  useEffect(() => {
    (async () => {
      if (currentUser) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", currentUser.id)
          .single();

        if (profile?.name) {
          const correctIsMe = pathName.split("/")[1] === "me";
          setIsMe(correctIsMe);
          setUsername(profile.name);
        }
      } else {
        setUsername(pathName.split("/")[1]);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, pathName]);

  return (
    <div className="mx-auto h-full">
      <ChangeUsernameDialog
        isOpen={isOpenChangeUsername}
        setIsOpen={setIsOpenChangeUsername}
      />
      <div className="flex flex-col">
        <div className="flex h-[5vh] shrink-0 items-center gap-x-4 border-b border-slate-400 bg-transparent px-4 shadow-sm sm:gap-x-6 sm:px-6 md:px-6 dark:border-slate-600 dark:bg-slate-800">
          {/* Separator */}

          <div className="flex flex-1 justify-between gap-x-4 self-stretch md:gap-x-6">
            <div className="flex grow items-baseline  justify-start gap-x-8">
              {!isMe && (
                <div>
                  <p className="font-bold dark:text-slate-100">{username}</p>
                </div>
              )}
              <Link
                href={`${baseUrl}/${isMe ? "me" : username}`}
                className="flex items-center pb-2 text-lg font-bold tracking-tight dark:text-slate-50"
              >
                <button
                  className={cn(
                    pathName.split("/")[pathName.split("/").length - 1] ===
                      (isMe ? "me" : username)
                      ? "border-b-slate-400"
                      : "border-b-transparent",
                    "border-b-2 pb-1 text-sm font-medium sm:text-lg dark:text-slate-100",
                  )}
                >
                  Home
                </button>
              </Link>
              <Link
                href={`${baseUrl}/${isMe ? "me" : username}/blog`}
                className="flex h-full items-end"
              >
                <button
                  className={cn(
                    pathName.split("/")[2] === "blog"
                      ? "border-b-slate-400"
                      : "border-b-transparent",
                    "border-b-2 pb-1 text-sm font-medium sm:text-lg dark:text-slate-100",
                  )}
                >
                  Blog
                </button>
              </Link>
              <Link
                href={`${baseUrl}/${isMe ? "me" : username}/journal`}
                className="flex h-full items-end"
              >
                <button
                  className={cn(
                    pathName.split("/")[2] === "journal" &&
                      !searchParams.get("private")
                      ? "border-b-slate-400"
                      : "border-b-transparent",
                    "border-b-2 pb-1 text-sm font-medium sm:text-lg dark:text-slate-100",
                  )}
                >
                  Journal
                </button>
              </Link>
              {isMe && (
                <Link
                  href={`${baseUrl}/me/journal?private=true`}
                  className="flex h-full items-end"
                >
                  <button
                    className={cn(
                      pathName.split("/")[2] === "journal" &&
                        searchParams.get("private")
                        ? "border-b-slate-400"
                        : "border-b-transparent",
                      "border-b-2 pb-1 text-sm font-medium sm:text-lg dark:text-slate-100",
                    )}
                  >
                    Private Journal
                  </button>
                </Link>
              )}
              {/* <Link
                href={`/${isMe ? "me" : username}/blog`}
                className="flex h-full items-end"
              >
                <button
                  className={cn(
                    pathName.split("/")[2] === "blog"
                      ? "border-b-slate-400"
                      : "border-b-transparent",
                    "border-b-2 pb-1 text-sm font-medium sm:text-lg dark:text-slate-100",
                  )}
                >
                  Chat with GPT
                </button>
              </Link> */}
            </div>
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

        <div className=" overflow-y-hidden px-2">{children}</div>
      </div>
    </div>
  );
}
