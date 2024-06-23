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
import { SearchDialog } from "./nav/search-dialog";
import { Button } from "./button";

export default function ViewerNavbar({ children }: { children: ReactNode }) {
  const [isOpenChangeUsername, setIsOpenChangeUsername] = useState(false);
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const [isOpenSearch, setIsOpenSearch] = useState(false);

  const baseUrl = useBaseUrl();
  const username = useUsername();

  return (
    <>
      <ChangeUsernameDialog
        isOpen={isOpenChangeUsername}
        setIsOpen={setIsOpenChangeUsername}
      />
      <SearchDialog
        isOpen={isOpenSearch}
        setIsOpen={setIsOpenSearch}
        isPublic={true}
      />
      <div className="flex h-full flex-col pt-8">
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
              <div className="flex items-center gap-1">
                <DarkmodeToggle />
                <Button
                  className="hidden !w-40 cursor-pointer items-center !justify-start gap-x-0 bg-zinc-300/20 !py-0 text-start dark:bg-zinc-900/20 md:flex md:w-72"
                  outline
                  onClick={() => setIsOpenSearch(true)}
                >
                  <MagnifyingGlassIcon
                    className="pointer-events-none  h-full w-4 dark:text-slate-300"
                    aria-hidden="true"
                  />
                  <p className="text-xs font-light text-slate-600 dark:text-slate-300">
                    Search...
                  </p>
                  <div className="flex grow justify-end">
                    <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                      <span className="text-xs">⌘</span>K
                    </kbd>
                  </div>
                </Button>
                <Button
                  className="flex cursor-pointer items-center !justify-start gap-x-0 bg-zinc-300/20 text-start dark:bg-zinc-900/20 md:hidden"
                  onClick={() => setIsOpenSearch(true)}
                >
                  <MagnifyingGlassIcon
                    className="pointer-events-none h-full  w-4 dark:text-slate-300"
                    aria-hidden="true"
                  />
                </Button>
              </div>
            </div>
          </div>
        </Sticky>

        <div className="grow px-2">{children}</div>
      </div>
    </>
  );
}
