"use client";
import Scrollbar from "react-scrollbars-custom";
import { Posts } from "@/app/components/feed/posts";
import { Cal } from "../components/cal-heatmap";
import { PostsPagination } from "../components/feed/posts-pagination";
import { usePathname } from "next/navigation";

export default function Home() {
  const pathName = usePathname();

  return (
    <div className="tw-flex tw-flex-col tw-gap-4">
      <Scrollbar style={{ width: "100%", height: "87vh" }}>
        <main className="mx-auto flex min-w-[400px] flex-col gap-4 p-4">
          <div className="flex flex-col gap-4">
            <div className="">
              <h1 className="text-3xl font-bold dark:text-slate-300">
                {pathName.slice(1)}'s Blog
              </h1>
            </div>
            <div className="flex justify-between">
              <h1 className="text-xl font-bold dark:text-slate-300">
                30 Day Activity
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-[24.8333px] flex-shrink-0 items-center bg-slate-100 px-2 dark:bg-slate-600">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                  Writing Streaks
                </p>
              </div>
              <Cal />
              <div className="flex h-[24.8333px] flex-shrink-0 items-start bg-slate-100 px-2 dark:bg-slate-600">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                  Current Streak
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-xl font-bold dark:text-slate-300">Posts</h1>
            </div>
            <Posts />
          </div>
        </main>
      </Scrollbar>
      <PostsPagination />
    </div>
  );
}
