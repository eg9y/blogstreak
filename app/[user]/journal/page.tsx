"use client";

import { Posts } from "@/app/components/feed/posts";

import { Cal } from "../../components/cal-heatmap";

export default function Home() {
  return (
    <div className="tw-flex tw-flex-col tw-gap-4 h-full">
      <main className="mx-auto flex flex-col gap-4 p-4 sm:min-w-[400px]">
        <div className="flex flex-col gap-4">
          <Cal />
          <Posts />
        </div>
      </main>
    </div>
  );
}
