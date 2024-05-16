import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createClient } from "../../supabase/client";

export function useCreateBlog() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  async function mutationFn({
    title,
    content,
    rawText,
    isPublished,
  }: {
    title: string;
    content: string;
    rawText: string;
    isPublished: boolean;
  }) {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      console.error(error);
      return;
    }

    const { data, error: blogInsertError } = await supabase
      .from("blogs")
      .insert({
        title,
        text: content,
        raw_text: rawText,
        user_id: user?.id,
        is_published: isPublished,
      })
      .select()
      .single();

    if (!data) {
      return;
    }

    if (blogInsertError) {
      console.error("blogInsertError", blogInsertError);
    }
  }

  return useMutation({
    mutationFn,
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ["blogs"],
      });
    },
  });
}
