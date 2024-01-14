import { Button } from "@/app/components/button";

import { Field } from "../components/fieldset";
import { Textarea } from "../components/textarea";
import { Badge } from "../components/badge";

export default function Home() {
  return (
    <div className="min-h-full">
      <main className="mx-auto flex min-w-[400px] flex-col gap-4 p-12">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>
        <div className="flex flex-col gap-2">
          <Field>
            <Textarea name="post" placeholder="What is happening?!" rows={4} />
          </Field>
          <Button color="orange" className="w-40 self-end">
            Post
          </Button>
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">Posts</h1>
          <div className="flex gap-1">
            <div
              className="cursor-pointer rounded-md px-2 py-1 font-light text-slate-700  ring-1 ring-slate-400 hover:bg-slate-200"
              color="red"
            >
              <p className="">Workout</p>
            </div>
            <div
              className="cursor-pointer rounded-md px-2 py-1 font-light text-slate-700  ring-1 ring-slate-400 hover:bg-slate-200"
              color="red"
            >
              <p className="">Thoughts</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Post text="Hello World"></Post>
          <Post text="Bench Presses: 10x10"></Post>
        </div>
      </main>
    </div>
  );
}

function Post({ text }: { text: string }) {
  return (
    <div className="min-h-50 flex w-full flex-col gap-8 rounded-md bg-slate-100 p-2 ring-1 ring-slate-300 drop-shadow-sm dark:bg-slate-500 dark:ring-slate-400">
      <p className="">{text}</p>
      <div className="flex w-full justify-between">
        <div className="">
          <p className="text-sm text-slate-400 dark:text-slate-100">
            {new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="">
          <Badge color="red">Workout</Badge>
        </div>
      </div>
    </div>
  );
}
