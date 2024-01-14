import { Button } from "@/app/components/button";
import { Field } from "../components/fieldset";
import { Textarea } from "../components/textarea";
import { Badge } from "../components/badge";

export default function Home() {
  return (
    <div className="min-h-screen">
      <main className="flex min-h-full flex-col mx-auto gap-4 min-w-[400px] p-12">
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
              className="cursor-pointer ring-1 ring-slate-400 text-slate-700 font-light hover:bg-slate-200  py-1 px-2 rounded-md"
              color="red"
            >
              <p className="">Workout</p>
            </div>
            <div
              className="cursor-pointer ring-1 ring-slate-400 text-slate-700 font-light hover:bg-slate-200  py-1 px-2 rounded-md"
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
    <div className="w-full min-h-50 rounded-md p-2 ring-1 ring-slate-300 bg-slate-100 flex flex-col gap-8 drop-shadow-sm">
      <p className="">{text}</p>
      <div className="flex justify-between w-full">
        <div className="">
          <p className="text-sm text-slate-400">
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
