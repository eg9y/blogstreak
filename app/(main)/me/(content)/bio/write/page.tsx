import { CreateBioEditor } from "@/app/components/text-editor/create-bio";

export default function Home() {
  return (
    <div className="min-h-full">
      <main className="mx-auto flex min-w-[400px] flex-col gap-4 px-2">
        <h1 className="text-lg font-semibold dark:text-slate-100">My Bio</h1>
        <CreateBioEditor />
      </main>
    </div>
  );
}
