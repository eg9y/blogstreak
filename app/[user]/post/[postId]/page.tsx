import { ViewTextEditor } from "@/app/components/text-editor/view";
import { createClient } from "@/utils/supabase/server";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function PostDetail({
  params,
}: {
  params: { postId: number; user: string };
}) {
  const cookie = cookies();
  const supabase = createClient(cookie);

  const queryFn = async () => {
    return supabase
      .from("posts")
      .select("*")
      .eq("id", params.postId!)
      .single()
      .throwOnError();
  };

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["post", params.user, params.postId],
    queryFn: queryFn,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="mx-auto flex min-w-[400px] flex-col gap-4 p-4">
        <div className="flex flex-col gap-4">
          <div className="min-h-full">
            <main className="mx-auto flex min-w-[400px] flex-col gap-4 px-2 py-12">
              <ViewTextEditor postId={params.postId} />
            </main>
          </div>
        </div>
      </main>
    </HydrationBoundary>
  );
}
