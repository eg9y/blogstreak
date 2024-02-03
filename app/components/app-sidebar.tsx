"use client";

import { Fragment, useState } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  BellIcon,
  Cog6ToothIcon,
  HomeIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import { cn } from "@/utils/cn";
import { createClient } from "@/utils/supabase/client";
import { usePathname } from "next/navigation";
import { Pencil1Icon } from "@radix-ui/react-icons";
import Link from "next/link";
import { getUser } from "@/utils/getUser";

const tags = [
  { id: 1, name: "All", href: "#", initial: "A", current: true },
  { id: 2, name: "Workout", href: "#", initial: "W", current: false },
  { id: 3, name: "Thoughts", href: "#", initial: "T", current: false },
  { id: 4, name: "Full-time Job", href: "#", initial: "F", current: false },
];

export default function AppSidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { currentUser } = getUser();

  const supabase = createClient();

  const userNavigation = [
    { name: "Sign out", onClick: () => supabase.auth.signOut() },
  ];

  return (
    <div className="mx-auto w-[1000px]">
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-40 md:hidden"
          onClose={setSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-slate-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button
                      type="button"
                      className="-m-2.5 p-2.5"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>
                {/* Sidebar component, swap this element with another sidebar if you like */}
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-slate-700 px-6  pb-4">
                  <div className="flex h-16 shrink-0 items-center">
                    <p className="text-xl font-bold tracking-tight text-slate-700 dark:text-slate-300">
                      TypingBits
                    </p>
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                          <li>
                            <Link
                              href="/app/write"
                              className={cn(
                                pathname === "/app/write"
                                  ? "bg-slate-700 text-white"
                                  : "text-slate-200 hover:bg-slate-700 hover:text-white",
                                "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                              )}
                            >
                              <Pencil1Icon
                                className={cn(
                                  pathname === "/app/write"
                                    ? "text-white"
                                    : "text-slate-500 group-hover:text-slate-600 dark:text-slate-200 dark:group-hover:text-white",
                                  "h-6 w-6 shrink-0",
                                )}
                                aria-hidden="true"
                              />
                              Write
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/app"
                              className={cn(
                                pathname === "/app"
                                  ? "bg-slate-700 text-white"
                                  : "text-slate-500 group-hover:text-slate-600 dark:text-slate-200 dark:group-hover:text-white",
                                "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                              )}
                            >
                              <HomeIcon
                                className={cn(
                                  pathname === "/app"
                                    ? "text-white"
                                    : "text-slate-200 group-hover:text-white",
                                  "h-6 w-6 shrink-0",
                                )}
                                aria-hidden="true"
                              />
                              Home
                            </Link>
                          </li>
                        </ul>
                      </li>
                      <li>
                        <div className="text-xs font-semibold leading-6 text-slate-200">
                          Your tags
                        </div>
                        <ul role="list" className="-mx-2 mt-2 space-y-1">
                          {tags.map((tag) => (
                            <li key={tag.name}>
                              <a
                                href={tag.href}
                                className={cn(
                                  tag.current
                                    ? "bg-slate-700 text-white"
                                    : "text-slate-200 hover:bg-slate-700 hover:text-white",
                                  "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                                )}
                              >
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-slate-400 bg-slate-500 text-[0.625rem] font-medium text-white">
                                  {tag.initial}
                                </span>
                                <span className="truncate">{tag.name}</span>
                              </a>
                            </li>
                          ))}
                        </ul>
                      </li>
                      <li className="mt-auto">
                        <a
                          href="#"
                          className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-slate-200 hover:bg-slate-700 hover:text-white"
                        >
                          <Cog6ToothIcon
                            className="h-6 w-6 shrink-0 text-slate-200 group-hover:text-white"
                            aria-hidden="true"
                          />
                          Settings
                        </a>
                      </li>
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden md:fixed md:inset-y-0  md:flex md:w-72 md:flex-col">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-r-slate-400 bg-transparent px-6 pb-4 dark:border-r-slate-600 dark:bg-transparent">
          <div className="flex h-16 shrink-0 items-center">
            <p className="text-xl font-bold tracking-tight text-slate-700 dark:text-slate-300">
              TypingBits
            </p>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  <li>
                    <Link
                      href="/app/write"
                      className={cn(
                        pathname === "/app/write"
                          ? "bg-slate-700 text-white"
                          : "hover:bg-slate:100 text-slate-500 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-white",
                        "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                      )}
                    >
                      <Pencil1Icon
                        className={cn(
                          pathname === "/app/write"
                            ? "text-white"
                            : "text-slate-500 group-hover:text-slate-600 dark:text-slate-200 dark:group-hover:text-white",
                          "h-6 w-6 shrink-0",
                        )}
                        aria-hidden="true"
                      />
                      Write
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/app"
                      className={cn(
                        pathname === "/app"
                          ? "bg-slate-700 text-white"
                          : "hover:bg-slate:100 text-slate-500 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-white",
                        "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                      )}
                    >
                      <HomeIcon
                        className={cn(
                          pathname === "/app"
                            ? "text-white"
                            : "text-slate-500 group-hover:text-slate-600 dark:text-slate-200 dark:group-hover:text-white",
                          "h-6 w-6 shrink-0",
                        )}
                        aria-hidden="true"
                      />
                      Home
                    </Link>
                  </li>
                </ul>
              </li>
              <li>
                <div className="text-xs font-semibold leading-6 text-slate-500 dark:text-slate-200">
                  Your Posts
                </div>
                <ul role="list" className="-mx-2 mt-2 space-y-1">
                  {tags.map((tag) => (
                    <li key={tag.name}>
                      <a
                        href={tag.href}
                        className={cn(
                          tag.current
                            ? "bg-slate-700 text-white"
                            : "hover:bg-slate:100 text-slate-500 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-white",
                          "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                        )}
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-slate-400 bg-slate-500 text-[0.625rem] font-medium text-white">
                          {tag.initial}
                        </span>
                        <span className="truncate">{tag.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="mt-auto">
                <a
                  href="#"
                  className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-slate-200 hover:bg-slate-700 hover:text-white"
                >
                  <Cog6ToothIcon
                    className="h-6 w-6 shrink-0 text-slate-200 group-hover:text-white"
                    aria-hidden="true"
                  />
                  Settings
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="flex flex-col md:pl-72">
        <div className="flex h-[7vh] max-h-[52px] shrink-0 items-center gap-x-4 border-b border-slate-400 bg-transparent px-4 shadow-sm sm:gap-x-6 sm:px-6 md:px-8 dark:border-slate-600 dark:bg-slate-800">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-slate-700 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Separator */}
          <div
            className="h-6 w-px bg-slate-900/10 md:hidden"
            aria-hidden="true"
          />

          <div className="flex flex-1 gap-x-4 self-stretch md:gap-x-6">
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
        </div>

        <main className="h-[93vh]">
          <div className="overflow-y-hidden px-4 sm:px-6 md:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
