"use client";
import Scrollbar from "react-scrollbars-custom";
import { Posts } from "@/app/components/feed/posts";
import { Cal } from "../components/cal-heatmap";
import { PostsPagination } from "../components/feed/posts-pagination";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const pathName = usePathname();

  return (
    <div className="tw-flex tw-flex-col tw-gap-4">
      <Scrollbar style={{ width: "100%", height: "87vh" }}>
        <main className="mx-auto flex min-w-[400px] flex-col gap-4 p-4">
          <div className="flex flex-col gap-4">
            <div className="">
              <h1 className="text-3xl font-bold dark:text-slate-300">
                <Link href={`/${pathName.slice(1)}`}>
                  {decodeURIComponent(pathName.slice(1))}'s Blog
                </Link>
              </h1>
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
