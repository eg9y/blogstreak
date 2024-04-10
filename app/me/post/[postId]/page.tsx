import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { cookies } from "next/headers";

import { ViewTextEditor } from "@/app/components/text-editor/view";
import { createClient } from "@/utils/supabase/server";

export default async function PostDetail({
  params,
}: {
  params: { postId: number };
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
      .eq("id", params.postId!)
      .single()
      .throwOnError();
  };

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["post", user?.id, params.postId],
    queryFn,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="min-h-full">
        <main className="mx-auto flex min-w-[400px] flex-col gap-4 px-2 py-12">
          <ViewTextEditor postId={params.postId} />
        </main>
      </div>
    </HydrationBoundary>
  );
}
