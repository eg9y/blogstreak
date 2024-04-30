"use client";

import { ReactNode, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import Sticky from "react-sticky-el";

import { cn } from "@/utils/utils";
import { useBaseUrl } from "@/utils/hooks/query/use-get-baseurl";

import { ChangeUsernameDialog } from "./nav/change-username-dialog";
import { useUsername } from "./subdomain-context";
import { DarkmodeToggle } from "./darkmode-toggle";

export default function ViewerNavbar({ children }: { children: ReactNode }) {
  const [isOpenChangeUsername, setIsOpenChangeUsername] = useState(false);
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const baseUrl = useBaseUrl();
  const username = useUsername();

  return (
    <>
      <ChangeUsernameDialog
        isOpen={isOpenChangeUsername}
        setIsOpen={setIsOpenChangeUsername}
      />
      <div className="flex h-full flex-col">
        <Sticky stickyClassName="z-[1000] bg-[hsl(0_0%_100%)] dark:bg-[hsl(240_10%_3.9%)] ">
          <div className="flex h-[37.84px] shrink-0 items-center gap-x-4 border-b border-slate-400 bg-transparent px-4 shadow-sm dark:border-slate-600 sm:gap-x-6 sm:px-6 md:px-6">
            <div
              className={cn(
                "flex flex-1 justify-between gap-x-4 self-stretch md:gap-x-6",
              )}
            >
              <div className="flex grow items-baseline  justify-start gap-x-8">
                <div>
                  <p className="font-bold dark:text-slate-100">{username}</p>
                </div>
                <Link
                  href={`${baseUrl}`}
                  className="flex items-center pb-2 text-lg font-bold tracking-tight dark:text-slate-50"
                >
                  <button
                    className={cn(
                      pathName === "/" || pathName === "/me"
                        ? "border-b-slate-400"
                        : "border-b-transparent",
                      "border-b-2 pb-1 text-sm font-medium dark:text-slate-100 sm:text-lg",
                    )}
                  >
                    Home
                  </button>
                </Link>
                <Link
                  href={`${baseUrl}/blog`}
                  className="flex h-full items-end"
                >
                  <button
                    className={cn(
                      pathName.split("/")[pathName.split("/").length - 1] ===
                        "blog"
                        ? "border-b-slate-400"
                        : "border-b-transparent",
                      "border-b-2 pb-1 text-sm font-medium dark:text-slate-100 sm:text-lg",
                    )}
                  >
                    Blog
                  </button>
                </Link>
                <Link
                  href={`${baseUrl}/journal`}
                  className="flex h-full items-end"
                >
                  <button
                    className={cn(
                      pathName.split("/")[pathName.split("/").length - 1] ===
                        "journal" && !searchParams.get("private")
                        ? "border-b-slate-400"
                        : "border-b-transparent",
                      "border-b-2 pb-1 text-sm font-medium dark:text-slate-100 sm:text-lg",
                    )}
                  >
                    Journal
                  </button>
                </Link>
                {/* <Link
                href={`/${isMe && "me/"}blog`}
                className="flex h-full items-end"
              >
                <button
                  className={cn(
                    pathName.split("/")[pathName.split("/").length -1] === "blog"
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
                className="relative hidden flex-1  bg-[hsl(0_0%_100%)] dark:bg-[hsl(240_10%_3.9%)] md:flex"
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
                  className="block h-full w-full border-0 bg-[hsl(0_0%_100%)] bg-transparent py-0 pl-8 pr-0 text-slate-900 placeholder:text-slate-400   focus:ring-0 dark:bg-[hsl(240_10%_3.9%)] dark:text-slate-300 sm:text-sm"
                  placeholder="Search..."
                  autoComplete="off"
                  autoCorrect="off"
                  type="search"
                  name="search"
                />
              </form>
              <DarkmodeToggle />
            </div>
          </div>
        </Sticky>

        <div className="grow px-2">{children}</div>
      </div>
    </>
  );
}
