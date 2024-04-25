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
    onSuccess: () => {
      toast.success("Your post has been deleted!", {
        position: "top-center",
      });
      return queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    },
    onError: () => {
      toast.error("Error deleting post", {
        position: "top-center",
      });
    },
  });
}
