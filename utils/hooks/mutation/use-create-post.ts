import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "../../supabase/client";

export function useCreatePost() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  async function mutationFn({
    content,
    tagIds,
  }: {
    content: string;
    tagIds: number[];
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
        user_id: user?.id,
      })
      .select()
      .single();

    if (!data) {
      return;
    }

    if (postInsertError) {
      return;
    }

    if (tagIds.length > 0) {
      const { data: tagData, error: tagInsertError } = await supabase
        .from("post_topics")
        .insert(
          tagIds.map((tag) => {
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
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    },
  });
}