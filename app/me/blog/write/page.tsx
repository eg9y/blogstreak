import { CreateBlogEditor } from "@/app/components/text-editor/createBlog";

export default function Home() {
  return (
    <div className="min-h-full">
      <main className="mx-auto flex min-w-[400px] flex-col gap-4 px-2 pt-12">
        <div>
          <p className="text-2xl font-bold dark:text-slate-100">New Blogpost</p>
        </div>
        <CreateBlogEditor />
      </main>
    </div>
  );
}
