import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { cookies } from "next/headers";

import { ViewBlogComponent } from "@/app/components/text-editor/blog/view";
import { createClient } from "@/utils/supabase/server";
import { BLOGS_QUERY_KEY } from "@/constants/query-keys";

export default async function BlogDetail({
  params,
}: {
  params: { blogId: number; user: string };
}) {
  const cookie = cookies();
  const supabase = createClient(cookie);

  const queryFn = () => {
    return supabase
      .from("blogs")
      .select("*")
      .eq("id", params.blogId!)
      .single()
      .throwOnError();
  };

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [BLOGS_QUERY_KEY, params.user, params.blogId],
    queryFn,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="w-full">
        <main className="mx-auto flex w-full  flex-col gap-4 px-2 pb-16 pt-12">
          <ViewBlogComponent blogId={params.blogId} />
        </main>
      </div>
    </HydrationBoundary>
  );
}
