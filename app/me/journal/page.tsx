"use client";

import { Pencil1Icon } from "@radix-ui/react-icons";
import { Scrollbar } from "react-scrollbars-custom";

import { Posts } from "@/app/components/feed/posts";
import { Button } from "@/app/components/button";
import { Cal } from "@/app/components/cal-heatmap";

import { Options } from "../options";

export default function Home() {
  return (
    <Scrollbar className="tw-flex tw-flex-col tw-gap-2 w-full">
      <main className="mx-auto flex flex-col gap-4 p-4 sm:min-w-[400px]">
        <Cal />

        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <h1 className="text-sm font-bold dark:text-slate-300">Posts</h1>
            <div className="flex items-center justify-between gap-2">
              <Options />
              <Button
                href="/me/write"
                className="hidden max-w-20 sm:inline-flex"
                color="dark"
              >
                <Pencil1Icon />
                Write
              </Button>
            </div>
          </div>
          <Posts />
        </div>
      </main>
    </Scrollbar>
  );
}
