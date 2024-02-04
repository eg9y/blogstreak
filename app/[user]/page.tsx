import { Posts } from "@/app/components/feed/posts";
import { Button } from "../components/button";
import { Pencil1Icon } from "@radix-ui/react-icons";

export default async function Home() {
  return (
    <div className="min-h-full">
      <main className="mx-auto flex min-w-[400px] flex-col gap-4 p-12">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between">
            <h1 className="text-3xl font-bold dark:text-slate-300">Posts</h1>
            <Button href="/app/write">
              <Pencil1Icon />
              Write
            </Button>
          </div>
          <Posts />
        </div>
      </main>
    </div>
  );
}
