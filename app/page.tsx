import { Button } from "@/app/components/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col mx-auto gap-4 w-1/2 min-w-[400px] p-24">
      <div className="">
        <h1 className="text-xl font-bold">MiniMicroblog</h1>
        <ul className="list-disc list-inside">
          <li className="">
            Post short-form texts in your own personal website
          </li>
          <li className="">Create groups to group your posts by topic</li>
          <li className="">Manage privacy for posts and groups</li>
          <li className="">
            Have your readers follow your posts and groups via RSS and email
          </li>
        </ul>
      </div>
      <Link href="/login">
        <Button>Create my blog</Button>
      </Link>
    </main>
  );
}
