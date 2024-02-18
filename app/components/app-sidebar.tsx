"use client";

import { Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon } from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import { cn } from "@/utils/cn";
import { createClient } from "@/utils/supabase/client";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { getUser } from "@/utils/getUser";
import { Button } from "./button";
import Link from "next/link";

export default function AppSidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser } = getUser();

  const supabase = createClient();

  const userNavigation = [
    { name: "Sign out", onClick: () => supabase.auth.signOut() },
  ];

  return (
    <div className="mx-auto w-[1000px]">
      <div className="flex flex-col">
        <div className="flex h-[7vh] max-h-[52px] shrink-0 items-center gap-x-4 border-b border-slate-400 bg-transparent px-4 shadow-sm sm:gap-x-6 sm:px-6 md:px-8 dark:border-slate-600 dark:bg-slate-800">
          {/* Separator */}
          <div
            className="h-6 w-px bg-slate-900/10 md:hidden"
            aria-hidden="true"
          />

          <div className="flex flex-1 gap-x-4 self-stretch md:gap-x-6">
            <Link
              href="/app"
              className="flex items-center text-base font-bold tracking-tight dark:text-slate-50"
            >
              <p>BlogStreak</p>
            </Link>
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
            <div className="flex items-center gap-x-4 md:gap-x-6">
              <button
                type="button"
                className="-m-2.5 p-2.5 text-slate-400 hover:text-slate-500"
              >
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-6 w-6" aria-hidden="true" />
              </button>

              {/* Separator */}
              <div
                className="hidden md:block md:h-6 md:w-px md:bg-slate-900/10"
                aria-hidden="true"
              />

              {/* Profile dropdown */}
              <Menu as="div" className="relative">
                <Menu.Button className="-m-1.5 flex items-center p-1.5">
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="h-8 w-8 rounded-full bg-slate-50 dark:bg-slate-800"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt=""
                  />
                  <span className="hidden md:flex md:items-center">
                    <span
                      className="ml-4 text-sm font-semibold leading-6 text-slate-900 dark:text-slate-300"
                      aria-hidden="true"
                    >
                      {currentUser?.email}
                    </span>
                    <ChevronDownIcon
                      className="ml-2 h-5 w-5 text-slate-400 dark:text-slate-300"
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
                  <Menu.Items className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-slate-900/5 focus:outline-none">
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
          <Button href="/app/write">
            <Pencil1Icon />
            Write
          </Button>
        </div>

        <main className="">
          <div className="overflow-y-hidden px-2">{children}</div>
        </main>
      </div>
    </div>
  );
}
