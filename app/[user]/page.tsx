import { Posts } from "@/app/components/feed/posts";
import { Cal } from "../components/cal-heatmap";

export default async function Home() {
  return (
    <div className="h-[93vh] min-h-full overflow-y-scroll">
      <main className="mx-auto flex min-w-[400px] flex-col gap-4 p-4">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between">
            <h1 className="text-3xl font-bold dark:text-slate-300">Activity</h1>
          </div>
          <div className="">
            <Cal />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex justify-between">
            <h1 className="text-3xl font-bold dark:text-slate-300">Posts</h1>
          </div>
          <Posts />
        </div>
      </main>
    </div>
  );
}
