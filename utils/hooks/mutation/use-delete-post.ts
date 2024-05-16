import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { createClient } from "../../supabase/client";

export function useDeletePost() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  async function mutationFn(postId: number) {
    await supabase.from("posts").delete().eq("id", postId);
  }

  return useMutation({
    mutationFn,
    onSuccess: async () => {
      toast.success("Your post has been deleted!", {
        position: "top-center",
      });
      await queryClient.invalidateQueries({
        queryKey: ["streaks"],
      });
      return queryClient.invalidateQueries({
        queryKey: ["journal"],
      });
    },
    onError: () => {
      toast.error("Error deleting post", {
        position: "top-center",
      });
    },
  });
}
