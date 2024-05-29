import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { cookies } from "next/headers";

import { EditBlogTextEditorComponent } from "@/app/components/text-editor/blog/edit";
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
    queryKey: ["blogs", params.blogId],
    queryFn,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="mx-auto flex  w-full grow  flex-col gap-4 px-2 sm:min-w-[400px]">
        <EditBlogTextEditorComponent blogId={params.blogId} />
      </main>
    </HydrationBoundary>
  );
}
