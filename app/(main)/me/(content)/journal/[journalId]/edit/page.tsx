import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { cookies } from "next/headers";

import { EditTextEditor } from "@/app/components/text-editor/journal/edit";
import { createClient } from "@/utils/supabase/server";
import { JOURNALS_QUERY_KEY } from "@/constants/query-keys";

export default async function PostDetail({
  params,
}: {
  params: { journalId: string };
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
    queryKey: [JOURNALS_QUERY_KEY, params.journalId],
    queryFn,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="mx-auto flex min-h-screen w-full  flex-col gap-4">
        <EditTextEditor
          journalId={
            params.journalId ? parseInt(params.journalId, 10) : undefined
          }
        />
      </main>
    </HydrationBoundary>
  );
}
