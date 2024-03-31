"use client";
import Scrollbar from "react-scrollbars-custom";
import { Posts } from "@/app/components/feed/posts";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { Button } from "@/app/components/button";
import { Options } from "../options";
import { Cal } from "@/app/components/cal-heatmap";
import { PostsPagination } from "@/app/components/feed/posts-pagination";

export default function Home() {
  return (
    <div className="tw-flex tw-flex-col tw-gap-2">
      <Scrollbar style={{ width: "100%", height: "87vh" }}>
        <main className="mx-auto flex min-w-[400px] flex-col gap-4 p-4">
          <div className="flex justify-evenly">
            <p className="text-3xl font-bold underline dark:text-slate-300">
              Microblog
            </p>
          </div>
          <Cal />

          <div className="flex flex-col gap-1">
            <div className="flex flex-col">
              <h1 className="text-sm font-bold dark:text-slate-300">Posts</h1>
              <div className="flex items-center justify-between gap-2">
                <Options />
                <Button href="/me/write" className="max-w-20">
                  <Pencil1Icon />
                  Write
                </Button>
              </div>
            </div>
            <Posts />
          </div>
        </main>
      </Scrollbar>
      <PostsPagination />
    </div>
  );
}
