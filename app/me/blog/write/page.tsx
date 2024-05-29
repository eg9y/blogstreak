import { CreateBlogTextEditorComponent } from "@/app/components/text-editor/blog/create";

export default function Home() {
  return (
    <main className="mx-auto flex w-full grow flex-col  gap-4 px-2 sm:min-w-[400px]">
      <div>
        <p className="text-2xl font-bold dark:text-slate-100">New Blogpost</p>
      </div>
      <CreateBlogTextEditorComponent />
    </main>
  );
}
