import { Button } from "@/app/components/button";
import AppNavbar from "../components/app-navbar";
import { Field } from "../components/fieldset";
import { Textarea } from "../components/textarea";
import { Badge } from "../components/badge";

export default function Home() {
  return (
    <div className="min-h-screen">
      <AppNavbar />
      <main className="flex min-h-full flex-col mx-auto gap-4 w-1/2 min-w-[400px] p-12">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p></p>
        </div>
        <div className="flex flex-col gap-2">
          <Field>
            <Textarea name="post" placeholder="What is happening?!" rows={4} />
          </Field>
          <Button color="orange" className="w-40 self-end">
            Create my blog
          </Button>
        </div>
        <div className="flex flex-col gap-2">
          <Post></Post>
          <Post></Post>
        </div>
      </main>
    </div>
  );
}

function Post() {
  return (
    <div className="w-full min-h-50 rounded-md p-2 ring-1 ring-slate-300 bg-slate-100 flex flex-col gap-8 shadow-md">
      <p className="">Hello World</p>
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
