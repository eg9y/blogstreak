import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { cookies } from "next/headers";

import { ViewBlogComponent } from "@/app/components/text-editor/blog/view";
import { createClient } from "@/utils/supabase/server";

export default async function BlogDetail({
  params,
}: {
  params: { blogId: number };
}) {
  const cookie = cookies();
  const supabase = createClient(cookie);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const queryFn = () => {
    return supabase
      .from("blogs")
      .select("*")
      .eq("user_id", user!.id)
      .eq("id", params.blogId!)
      .single()
      .throwOnError();
  };

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["blogs", user?.id, params.blogId],
    queryFn,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="mx-auto flex w-full grow flex-col gap-4 pb-16 md:pt-12">
        <ViewBlogComponent blogId={params.blogId} />
      </main>
    </HydrationBoundary>
  );
}
