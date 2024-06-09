import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getMeilisearchClient } from "@/utils/meilisearch";
import { BLOGS_QUERY_KEY } from "@/constants/query-keys";

import { createClient } from "../../../supabase/client";

export function useCreateBlog() {
  const queryClient = useQueryClient();
  const supabase = createClient();
  const meilisearch = getMeilisearchClient();

  async function mutationFn({
    title,
    content,
    rawText,
    isPublic,
  }: {
    title: string;
    content: string;
    rawText: string;
    isPublic: boolean;
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
        is_public: isPublic,
      })
      .select()
      .single();

    if (!data) {
      return;
    }

    if (blogInsertError) {
      console.error("blogInsertError", blogInsertError);
    }

    await meilisearch.index("blogs").addDocuments([
      {
        id: data.id,
        created_at: new Date(),
        raw_text: rawText,
        user_id: user?.id,
        is_public: isPublic,
      },
    ]);
  }

  return useMutation({
    mutationFn,
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: [BLOGS_QUERY_KEY],
      });
    },
  });
}
