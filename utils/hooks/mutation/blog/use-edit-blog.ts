import { useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "@supabase/supabase-js";

import { getMeilisearchClient } from "@/utils/meilisearch";
import { BLOGS_QUERY_KEY } from "@/constants/query-keys";

import { createClient } from "../../../supabase/client";

export function useEditBlog(loggedInUser: User | null) {
  const queryClient = useQueryClient();
  const supabase = createClient();
  const meilisearch = getMeilisearchClient();

  async function mutationFn({
    blogId,
    title,
    content,
    rawText,
    isPublic,
  }: {
    blogId: number;
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

    await supabase
      .from("blogs")
      .update({
        title,
        text: content,
        raw_text: rawText,
        user_id: user?.id,
        is_public: isPublic,
      })
      .eq("id", blogId);

    await meilisearch.index("journals").updateDocuments([
      {
        id: blogId,
        text: content,
        raw_text: rawText,
        user_id: user?.id,
        is_public: isPublic,
      },
    ]);
  }

  return useMutation({
    mutationFn,
    onSuccess: () => {
      return Promise.all([
        queryClient.invalidateQueries({
          queryKey: [BLOGS_QUERY_KEY, loggedInUser?.id],
        }),
      ]);
    },
  });
}
