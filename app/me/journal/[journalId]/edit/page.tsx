import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { cookies } from "next/headers";

import { EditTextEditor } from "@/app/components/text-editor/edit";
import { createClient } from "@/utils/supabase/server";

export default async function PostDetail({
  params,
}: {
  params: { journalId: number };
}) {
  const cookie = cookies();
  const supabase = createClient(cookie);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const queryFn = () => {
    return supabase
      .from("posts")
      .select("*")
      .eq("user_id", user!.id)
      .eq("id", params.journalId!)
      .single()
      .throwOnError();
  };

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["journal", params.journalId],
    queryFn,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="min-h-full">
        <main className="mx-auto flex min-w-[400px] flex-col gap-4 px-2 py-12">
          <EditTextEditor journalId={params.journalId} />
        </main>
      </div>
    </HydrationBoundary>
  );
}
