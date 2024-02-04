import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "../../supabase/client";

export function useEditPost() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  async function mutationFn({
    postId,
    content,
  }: {
    postId: number;
    content: string;
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
