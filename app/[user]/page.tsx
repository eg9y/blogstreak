import { cookies } from "next/headers";
import { Badge } from "../components/badge";
import { TextEditor } from "../components/text-editor";
import { createClient } from "@/utils/supabase/server";
import { Post } from "../components/feed/post";

export default async function Home() {
  const cookie = cookies();
  const supabase = createClient(cookie);

  const { data: posts, error } = await supabase.from("posts").select("*");

  console.log("posts", posts);

  return (
    <div className="min-h-full">
      <main className="mx-auto flex min-w-[400px] flex-col gap-4 p-12">
        <TextEditor />
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold dark:text-slate-300">Posts</h1>
          <div className="flex gap-1">
            <div
              className="cursor-pointer rounded-md px-2 py-1 font-light ring-1 ring-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              color="red"
            >
              <p className="text-xs text-slate-700 dark:text-slate-200">
                Workout
              </p>
            </div>
            <div
              className="cursor-pointer rounded-md px-2 py-1 font-light ring-1 ring-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              color="red"
            >
              <p className="text-xs text-slate-700 dark:text-slate-200">
                Thoughts
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {posts
            ?.filter((post) => post.text)
            .map((post) => <Post text={post.text!}></Post>)}
        </div>
      </main>
    </div>
  );
}
