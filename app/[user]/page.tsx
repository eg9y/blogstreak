import { Posts } from "@/app/components/feed/posts";

export default async function Home() {
  return (
    <div className="min-h-full">
      <main className="mx-auto flex min-w-[400px] flex-col gap-4 p-12">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold dark:text-slate-300">Posts</h1>
          <Posts />
        </div>
      </main>
    </div>
  );
}
