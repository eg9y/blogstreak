import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { createClient } from "@/utils/supabase/client";

export function useDeleteNotesFolder() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  async function mutationFn(notesFolderId: number) {
    await supabase.from("notes_folders").delete().eq("id", notesFolderId);
  }

  return useMutation({
    mutationFn,
    onSuccess: () => {
      toast.success("Your folder has been deleted!", {
        position: "top-center",
      });
      return queryClient.invalidateQueries({
        queryKey: ["notes-folders"],
      });
    },
    onError: () => {
      toast.error("Error deleting folder", {
        position: "top-center",
      });
    },
  });
}
