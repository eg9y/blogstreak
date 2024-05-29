import { CreateTextEditor } from "@/app/components/text-editor/journal/create";

export default function Home() {
  return (
    <main className="mx-auto flex w-full grow flex-col px-2 sm:min-w-[400px] md:gap-4">
      <CreateTextEditor />
    </main>
  );
}
