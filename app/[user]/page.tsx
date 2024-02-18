import { Posts } from "@/app/components/feed/posts";
import { Cal } from "../components/cal-heatmap";
import { Button } from "../components/button";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { Options } from "./options";

export default async function Home() {
  return (
    <div className="h-[93vh] min-h-full overflow-y-scroll">
      <main className="mx-auto flex min-w-[400px] flex-col gap-4 p-4">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between">
            <h1 className="text-3xl font-bold dark:text-slate-300">
              30 Day Activity
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-[24.8333px] flex-shrink-0 items-center bg-slate-100 px-2">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                Writing Streaks
              </p>
            </div>
            <Cal />
            <div className="flex h-[24.8333px] flex-shrink-0 items-start bg-slate-100 px-2">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                Current Streak
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold dark:text-slate-300">Posts</h1>
            <div className="flex items-center justify-between gap-2">
              <Options />
              <Button href="/app/write" className="max-w-20">
                <Pencil1Icon />
                Write
              </Button>
            </div>
          </div>
          <Posts />
        </div>
      </main>
    </div>
  );
}
