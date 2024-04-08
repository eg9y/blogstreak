"use client";
import Scrollbar from "react-scrollbars-custom";
import { Posts } from "@/app/components/feed/posts";
import { Cal } from "../../components/cal-heatmap";

export default function Home() {
  return (
    <div className="tw-flex tw-flex-col tw-gap-4">
      <Scrollbar style={{ width: "100%", height: "80vh" }}>
        <main className="mx-auto flex min-w-[400px] flex-col gap-4 p-4">
          <div className="flex flex-col gap-4">
            <Cal />
            <Posts />
          </div>
        </main>
      </Scrollbar>
    </div>
  );
}
