import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "../../supabase/client";
import { Database } from "@/schema";

export function useEditBlog() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  async function mutationFn({
    blogId,
    title,
    content,
    isPublished,
  }: {
    blogId: number;
    title: string;
    content: string;
    isPublished: boolean | null;
  }) {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      console.error(error);
      return;
    }

    const res = await supabase
      .from("blogs")
      .update({
        title: title,
        text: content,
        user_id: user?.id,
        is_published: isPublished,
      })
      .eq("id", blogId);
  }

  return useMutation({
    mutationFn,
    onSuccess: async () => {
      return Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["blogs"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["blog"],
        }),
      ]);
    },
  });
}
