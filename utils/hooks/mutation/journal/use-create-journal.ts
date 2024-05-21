import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createClient } from "../../../supabase/client";

export function useCreatePost() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  async function mutationFn({
    content,
    rawText,
    tags,
    isPublic,
  }: {
    content: string;
    rawText: string;
    tags: number[];
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

    const { data, error: postInsertError } = await supabase
      .from("posts")
      .insert({
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

    if (postInsertError) {
      return;
    }

    if (tags.length > 0) {
      await supabase.from("post_topics").insert(
        tags.map((tag) => {
          return {
            post_id: data.id,
            topic_id: tag,
            user_id: user.id,
          };
        }),
      );
    }

    console.log(data);
  }

  return useMutation({
    mutationFn,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["streaks"],
      });
      return queryClient.invalidateQueries({
        queryKey: ["journal"],
      });
    },
  });
}
