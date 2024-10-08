import { User } from "@supabase/supabase-js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  INFINITE_BLOGS_QUERY_KEY,
  STREAKS_QUERY_KEY,
} from "@/constants/query-keys";

import { createClient } from "../../../supabase/client";

export function useDeleteBlog(loggedInUser: User | null) {
  const queryClient = useQueryClient();
  const supabase = createClient();

  async function mutationFn(blogTitle: string) {
    await supabase.from("blogs").delete().eq("title", blogTitle);

    await supabase.functions.invoke("meilisearch", {
      body: {
        op: "delete",
        data: {
          index: "blogs",
          title: blogTitle,
        },
      },
    });
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
        queryKey: [INFINITE_BLOGS_QUERY_KEY, loggedInUser?.id],
      });
    },
    onError: () => {
      toast.error("Error deleting blog", {
        position: "top-center",
      });
    },
  });
}
