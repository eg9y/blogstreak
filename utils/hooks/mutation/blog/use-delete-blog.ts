import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getMeilisearchClient } from "@/utils/meilisearch";
import { BLOGS_QUERY_KEY, STREAKS_QUERY_KEY } from "@/constants/query-keys";

import { createClient } from "../../../supabase/client";

export function useDeleteBlog() {
  const queryClient = useQueryClient();
  const supabase = createClient();
  const meilisearch = getMeilisearchClient();

  async function mutationFn(blogId: number) {
    await supabase.from("blogs").delete().eq("id", blogId);
    await meilisearch.index("blogs").deleteDocument(blogId);
  }

  return useMutation({
    mutationFn,
    onSuccess: async () => {
      toast.success("Your blog has been deleted!", {
        position: "top-center",
      });
      await queryClient.invalidateQueries({
        queryKey: [STREAKS_QUERY_KEY],
      });
      return queryClient.invalidateQueries({
        queryKey: [BLOGS_QUERY_KEY],
      });
    },
    onError: () => {
      toast.error("Error deleting blog", {
        position: "top-center",
      });
    },
  });
}
