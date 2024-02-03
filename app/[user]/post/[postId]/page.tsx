import { EditTextEditor } from "@/app/components/text-editor/edit";
import { createClient } from "@/utils/supabase/server";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { cookies } from "next/headers";

export default async function PostDetail({
  params,
}: {
  params: { postId: number };
}) {
  const cookie = cookies();
  const supabase = createClient(cookie);
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  const queryFn = async () => {
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
    queryFn: queryFn,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="min-h-full">
        <main className="mx-auto flex min-w-[400px] flex-col gap-4 px-2 py-12">
          <EditTextEditor postId={params.postId} />
        </main>
      </div>
    </HydrationBoundary>
  );
}
