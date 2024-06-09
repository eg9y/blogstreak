import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getMeilisearchClient } from "@/utils/meilisearch";
import { JOURNALS_QUERY_KEY, STREAKS_QUERY_KEY } from "@/constants/query-keys";

import { createClient } from "../../../supabase/client";

export function useDeleteJournal() {
  const queryClient = useQueryClient();
  const supabase = createClient();
  const meilisearch = getMeilisearchClient();

  async function mutationFn(postId: number) {
    await supabase.from("posts").delete().eq("id", postId);
    await meilisearch.index("journals").deleteDocument(postId);
  }

  return useMutation({
    mutationFn,
    onSuccess: async () => {
      toast.success("Your post has been deleted!", {
        position: "top-center",
      });
      await queryClient.invalidateQueries({
        queryKey: [STREAKS_QUERY_KEY],
      });
      return queryClient.invalidateQueries({
        queryKey: [JOURNALS_QUERY_KEY],
      });
    },
    onError: () => {
      toast.error("Error deleting post", {
        position: "top-center",
      });
    },
  });
}
