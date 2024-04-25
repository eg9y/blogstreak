import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { cookies } from "next/headers";

import { createClient } from "@/utils/supabase/server";
import { ViewTextEditor } from "@/app/components/text-editor/view";

export default async function PostDetail({
  params,
}: {
  params: { journalId: number; user: string };
}) {
  const cookie = cookies();
  const supabase = createClient(cookie);

  const queryFn = () => {
    return supabase
      .from("posts")
      .select("*")
      .eq("id", params.journalId!)
      .single()
      .throwOnError();
  };

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["blog", params.journalId],
    queryFn,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="mx-auto flex flex-col gap-4 p-4 sm:min-w-[400px]">
        <div className="flex flex-col gap-4">
          <div className="min-h-full">
            <main className="mx-auto flex min-w-[400px] flex-col gap-4 px-2 py-12">
              <ViewTextEditor journalId={params.journalId} />
            </main>
          </div>
        </div>
      </main>
    </HydrationBoundary>
  );
}
