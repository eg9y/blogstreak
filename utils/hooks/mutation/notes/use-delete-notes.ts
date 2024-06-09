import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { createClient } from "@/utils/supabase/client";
import { NOTES_QUERY_KEY } from "@/constants/query-keys";

export function useDeleteNotes() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  async function mutationFn(postId: number) {
    await supabase.from("notes").delete().eq("id", postId);
  }

  return useMutation({
    mutationFn,
    onSuccess: () => {
      toast.success("Your note has been deleted!", {
        position: "top-center",
      });
      return queryClient.invalidateQueries({
        queryKey: [NOTES_QUERY_KEY],
      });
    },
    onError: () => {
      toast.error("Error deleting note", {
        position: "top-center",
      });
    },
  });
}
