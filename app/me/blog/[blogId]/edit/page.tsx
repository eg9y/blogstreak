import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { cookies } from "next/headers";

import { EditBlogTextEditorComponent } from "@/app/components/text-editor/editBlog";
import { createClient } from "@/utils/supabase/server";

export default async function EditBlogComponent({
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
      <div className="min-h-full">
        <main className="mx-auto flex min-w-[400px] flex-col gap-4 px-2 py-12">
          <EditBlogTextEditorComponent blogId={params.blogId} />
        </main>
      </div>
    </HydrationBoundary>
  );
}
