import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "../../supabase/client";
import { Database } from "@/schema";

export function useEditPost() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  async function mutationFn({
    postId,
    content,
    tags,
  }: {
    postId: number;
    content: string;
    tags: Database["public"]["Tables"]["topics"]["Row"][];
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
      .from("posts")
      .update({
        text: content,
        user_id: user?.id,
      })
      .eq("id", postId);

    console.log(res);

    if (tags.length > 0) {
      const resDelete = await supabase
        .from("post_topics")
        .delete()
        .eq("id", postId)
        .eq("user_id", user.id);
      const resAdd = await supabase.from("post_topics").insert(
        tags.map((tag) => ({
          topic_id: tag.id,
          post_id: postId,
          user_id: user?.id,
        })),
      );
    }
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
