"use client";
import Scrollbar from "react-scrollbars-custom";

export default function Home() {
  return (
    <div className="tw-flex tw-flex-col tw-gap-2">
      <Scrollbar style={{ width: "100%", height: "87vh" }}>
        <main className="mx-auto flex min-w-[400px] flex-col gap-4 p-4">
          <div className="flex justify-evenly">
            <p className="text-3xl font-bold underline dark:text-slate-300">
              Me
            </p>
          </div>
        </main>
      </Scrollbar>
    </div>
  );
}
