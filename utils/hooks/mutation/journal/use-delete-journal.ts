import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";

import {
  INFINITE_JOURNALS_QUERY_KEY,
  STREAKS_QUERY_KEY,
} from "@/constants/query-keys";

import { createClient } from "../../../supabase/client";

export function useDeleteJournal(loggedInUser: User | null) {
  const queryClient = useQueryClient();
  const supabase = createClient();
  const date = new Date();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  async function mutationFn(postId: number) {
    await supabase.from("posts").delete().eq("id", postId);
    await supabase.functions.invoke("meilisearch", {
      body: {
        op: "delete",
        data: {
          index: "journals",
          id: postId,
        },
      },
    });
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
        queryKey: [INFINITE_JOURNALS_QUERY_KEY, loggedInUser?.id, year, month],
      });
    },
    onError: () => {
      toast.error("Error deleting post", {
        position: "top-center",
      });
    },
  });
}
