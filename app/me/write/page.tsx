import { CreateTextEditor } from "@/app/components/text-editor/journal/create";

export default function Home() {
  return (
    <main className="mx-auto flex min-w-[400px] grow flex-col gap-4 px-2">
      <CreateTextEditor />
    </main>
  );
}
