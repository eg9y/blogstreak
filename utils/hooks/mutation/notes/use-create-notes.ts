import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createClient } from "@/utils/supabase/client";

export function useCreateNotes(notesFolderId: number | null) {
  const queryClient = useQueryClient();
  const supabase = createClient();

  async function mutationFn({
    title,
    content = "",
  }: {
    title: string;
    content?: string;
  }) {
    if (!notesFolderId) {
      return;
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      console.error(error);
      return;
    }

    const { data, error: notesInsertError } = await supabase
      .from("notes")
      .insert({
        title,
        content,
        notes_folders_id: notesFolderId,
        user_id: user?.id,
      })
      .select()
      .single();

    if (!data) {
      return;
    }

    if (notesInsertError) {
      console.error("error", notesInsertError);
    }
  }

  return useMutation({
    mutationFn,
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ["notes", notesFolderId],
      });
    },
  });
}
