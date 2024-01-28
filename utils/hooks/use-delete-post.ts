import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "../supabase/client";

export function useDeletePost() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  async function mutationFn(postId: number) {
    const res = await supabase.from("posts").delete().eq("id", postId);
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
