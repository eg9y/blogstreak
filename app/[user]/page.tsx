"use client";
import Scrollbar from "react-scrollbars-custom";
import { Posts } from "@/app/components/feed/posts";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const pathName = usePathname();

  return (
    <div className="tw-flex tw-flex-col tw-gap-4">
      <Scrollbar style={{ width: "100%", height: "87vh" }}>
        <main className="mx-auto flex min-w-[400px] flex-col gap-4 p-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="self-center text-xl font-bold dark:text-slate-300">
                Egan
              </h1>
            </div>
          </div>
        </main>
      </Scrollbar>
    </div>
  );
}
