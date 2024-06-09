import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createClient } from "@/utils/supabase/client";
import { NOTES_FOLDERS_QUERY_KEY } from "@/constants/query-keys";

export function useCreateNotesFolder() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  async function mutationFn({ name }: { name: string }) {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      console.error(error);
      return;
    }

    const { data, error: notesFolderInsertError } = await supabase
      .from("notes_folders")
      .insert({
        name,
        user_id: user?.id,
      })
      .select()
      .single();

    if (!data) {
      return;
    }

    if (notesFolderInsertError) {
      console.error("error", notesFolderInsertError);
    }
  }

  return useMutation({
    mutationFn,
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: [NOTES_FOLDERS_QUERY_KEY],
      });
    },
  });
}
