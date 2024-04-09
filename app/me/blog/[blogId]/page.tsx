import { ViewBlogComponent } from "@/app/components/text-editor/viewBlog";
import { createClient } from "@/utils/supabase/server";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { cookies } from "next/headers";

export default async function BlogDetail({
  params,
}: {
  params: { blogId: number };
}) {
  const cookie = cookies();
  const supabase = createClient(cookie);
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  const queryFn = async () => {
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
    queryFn: queryFn,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="min-h-full">
        <main className="mx-auto flex min-w-[400px] flex-col gap-4 px-2 py-12">
          <ViewBlogComponent blogId={params.blogId} />
        </main>
      </div>
    </HydrationBoundary>
  );
}
