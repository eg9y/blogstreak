"use client";

import { Fragment, ReactNode, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { BellIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { LockClosedIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { cn } from "@/utils/utils";
import { createClient } from "@/utils/supabase/client";
import { useUser } from "@/utils/getUser";
import { useBaseUrl } from "@/utils/hooks/query/use-get-baseurl";

import { Button } from "./button";
import { ChangeUsernameDialog } from "./nav/change-username-dialog";
import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
} from "./dropdown";
import { useUsername } from "./subdomain-context";
import HamburgerSidebar from "./hamburger-sidebar";
import { DarkmodeToggle } from "./darkmode-toggle";
import { SearchDialog } from "./nav/search-dialog";

export default function MeNavbar({ children }: { children: ReactNode }) {
  const [isOpenChangeUsername, setIsOpenChangeUsername] = useState(false);
  const [isOpenSearch, setIsOpenSearch] = useState(false);

  const pathName = usePathname();
  const searchParams = useSearchParams();

  const baseUrl = useBaseUrl();

  const { loggedInUser } = useUser();
  const router = useRouter();

  const username = useUsername();
  const supabase = createClient();

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
      onClick: () => {
        setIsOpenChangeUsername(true);
      },
    },
  ];

  return (
    <>
      <ChangeUsernameDialog
        isOpen={isOpenChangeUsername}
        setIsOpen={setIsOpenChangeUsername}
      />
      <SearchDialog isOpen={isOpenSearch} setIsOpen={setIsOpenSearch} />
      <div className="flex h-[7vh] max-h-[52px] shrink-0 items-center gap-x-4 bg-transparent px-4 sm:gap-x-6 md:px-6">
        {/* Separator */}

        <div className="flex flex-1 justify-between gap-x-4 self-stretch md:gap-x-6">
          <div className="flex items-center gap-1">
            <HamburgerSidebar />
            <Link
              href="/me"
              className="flex items-center text-base font-bold tracking-tight dark:text-slate-50"
            >
              <p className="text-sm">TypeMemo</p>
            </Link>
          </div>

          <div className="flex items-center gap-x-1 md:gap-x-2">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-slate-400 hover:text-slate-500"
            >
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Profile dropdown */}
            <Menu as="div" className="relative">
              <Menu.Button className="-m-1.5 flex items-center p-1.5">
                <span className="sr-only">Open user menu</span>

                <span className="hidden md:flex md:items-center">
                  <span
                    className="ml-2 text-sm font-semibold leading-6 text-slate-900 dark:text-slate-300"
                    aria-hidden="true"
                  >
                    {username || loggedInUser?.email}
                  </span>
                  <ChevronDownIcon
                    className="ml-1 h-5 w-5 text-slate-400 dark:text-slate-300"
                    aria-hidden="true"
                  />
                </span>
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2.5 w-48 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-slate-900/5 focus:outline-none">
                  {userNavigation.map((item) => (
                    <Menu.Item key={item.name}>
                      {({ active }) => (
                        <a
                          className={cn(
                            active ? "bg-slate-50" : "",
                            "block cursor-pointer px-3 py-1 text-sm leading-6 text-slate-900 hover:bg-slate-100",
                          )}
                          onClick={item.onClick}
                        >
                          {item.name}
                        </a>
                      )}
                    </Menu.Item>
                  ))}
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Dropdown>
            <DropdownButton outline>
              Write
              <ChevronDownIcon />
            </DropdownButton>
            <DropdownMenu>
              <DropdownItem href="/me/write">Journal</DropdownItem>
              <DropdownItem href="/me/blog/write">Blog</DropdownItem>
              <DropdownItem href="/me/notes/write">Note</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <DarkmodeToggle />
        </div>
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

      <div className="mx-auto flex w-full grow flex-col">
        <ChangeUsernameDialog
          isOpen={isOpenChangeUsername}
          setIsOpen={setIsOpenChangeUsername}
        />
        <div className="flex grow flex-col gap-4 ">
          <div className="hidden h-[37.84px] shrink-0 items-center gap-x-4 border-b border-slate-400 bg-transparent px-4 shadow-sm dark:border-slate-600 sm:gap-x-6 sm:px-6 md:flex md:px-6">
            <div
              className={cn(
                "flex flex-1 justify-between gap-x-4 self-stretch md:gap-x-6",
              )}
            >
              <div className="flex grow items-baseline justify-start gap-x-8">
                <Link
                  href={`${baseUrl}/me`}
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
                  href={`${baseUrl}/me/blog`}
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
                  href={`${baseUrl}/me/journal`}
                  className="flex h-full items-end"
                >
                  <button
                    className={cn(
                      pathName.split("/")[pathName.split("/").length - 1] ===
                        "journal"
                        ? "border-b-slate-400"
                        : "border-b-transparent",
                      "border-b-2 pb-1 text-sm font-medium dark:text-slate-100 sm:text-lg",
                    )}
                  >
                    Journal
                  </button>
                </Link>
                <Link
                  href={`${baseUrl}/me/notes`}
                  className="flex h-full items-end"
                >
                  <button
                    className={cn(
                      pathName.split("/")[pathName.split("/").length - 1] ===
                        "notes"
                        ? "border-b-slate-400"
                        : "border-b-transparent",
                      "flex items-baseline gap-1 border-b-2 pb-1 text-sm font-medium dark:text-slate-100 sm:text-lg",
                    )}
                  >
                    <span>
                      <LockClosedIcon />
                    </span>{" "}
                    Notes
                  </button>
                </Link>

                {/* <Link
                      href={`${baseUrl}/me/chat`}
                      className="flex h-full items-end"
                    >
                      <button
                        className={cn(
                          pathName.split("/")[
                            pathName.split("/").length - 1
                          ] === "chat"
                            ? "border-b-slate-400"
                            : "border-b-transparent",
                          "border-b-2 pb-1 text-sm font-medium dark:text-slate-100 sm:text-lg",
                        )}
                      >
                        Chat
                      </button>
                    </Link> */}
              </div>
              <Button
                className="mb-2 flex w-40 cursor-pointer items-center !justify-start gap-x-0 bg-zinc-300/20 text-start dark:bg-zinc-900/20 md:w-72"
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
            </div>
          </div>

          {pathName.split("/")[pathName.split("/").length - 1] ===
            "journal" && (
            <div className="mx-6 flex gap-4 border-b border-slate-300">
              <Link
                href={`${baseUrl}/me/journal`}
                className="flex h-full items-end"
              >
                <button
                  className={cn(
                    pathName.split("/")[pathName.split("/").length - 1] ===
                      "journal" && !searchParams.get("private")
                      ? "border-b-slate-400"
                      : "border-b-transparent",
                    "border-b-2 pb-1 text-xs font-medium dark:text-slate-100 sm:text-sm",
                  )}
                >
                  Public
                </button>
              </Link>
              <Link
                href={`${baseUrl}/me/journal?private=true`}
                className="flex h-full items-end"
              >
                <button
                  className={cn(
                    pathName.split("/")[pathName.split("/").length - 1] ===
                      "journal" && searchParams.get("private")
                      ? "border-b-slate-400"
                      : "border-b-transparent",
                    "flex items-center border-b-2 pb-1 text-xs font-medium dark:text-slate-100 sm:text-sm",
                  )}
                >
                  <span>
                    <LockClosedIcon />
                  </span>{" "}
                  Private
                </button>
              </Link>
            </div>
          )}

          {children}
        </div>
      </div>
    </>
  );
}
