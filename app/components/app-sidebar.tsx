"use client";

import { Fragment, ReactNode, useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { BellIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { HamburgerMenuIcon, Pencil1Icon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { cn } from "@/utils/cn";
import { createClient } from "@/utils/supabase/client";
import { getUser } from "@/utils/getUser";

import { Button } from "./button";
import { ChangeUsernameDialog } from "./nav/change-username-dialog";

export default function AppSidebar({ children }: { children: ReactNode }) {
  const [isOpenChangeUsername, setIsOpenChangeUsername] = useState(false);
  const { currentUser } = getUser();
  const router = useRouter();
  const [username, setUsername] = useState("");

  const supabase = createClient();

  useEffect(() => {
    (async () => {
      if (!currentUser) {
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", currentUser.id)
        .single();

      if (profile?.name) {
        setUsername(profile.name);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <div className="flex flex-col ">
        <div className="flex h-[7vh]   max-h-[52px] shrink-0 items-center gap-x-4  bg-transparent px-4 sm:gap-x-6 sm:px-6 md:px-8  dark:bg-slate-800">
          {/* Separator */}

          <div className="flex flex-1 justify-between gap-x-4 self-stretch md:gap-x-6">
            <div className="flex items-center gap-1">
              <Button plain className="block sm:hidden">
                <HamburgerMenuIcon />
              </Button>
              <Link
                href="/me"
                className="flex items-center text-base font-bold tracking-tight dark:text-slate-50"
              >
                <p className="text-sm">BlogStreak</p>
              </Link>
            </div>

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
                  <Image
                    className="h-6 w-6 rounded-full bg-slate-50 dark:bg-slate-800"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt=""
                    height={10}
                    width={10}
                  />
                  <span className="hidden md:flex md:items-center">
                    <span
                      className="ml-2 text-sm font-semibold leading-6 text-slate-900 dark:text-slate-300"
                      aria-hidden="true"
                    >
                      {username || currentUser?.email}
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
            <Button href="/me/write">
              <Pencil1Icon />
              Write Journal
            </Button>
            <Button href="/me/blog/write">
              <Pencil1Icon />
              Write Blog
            </Button>
          </div>
        </div>

        <main className="">
          <div className=" overflow-y-hidden px-2">{children}</div>
        </main>
      </div>
    </>
  );
}
