import { useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "@supabase/supabase-js";

import { createClient } from "@/utils/supabase/client";
import { NOTES_QUERY_KEY } from "@/constants/query-keys";

export function useEditNotes(user: User | null, notesId: number | null) {
  const supabase = createClient();
  const queryClient = useQueryClient();

  async function mutationFn({
    title,
    content,
  }: {
    title?: string;
    content?: string;
  }) {
    if (!user) {
      return;
    }

    if (!notesId) {
      return;
    }

    const editPayload = {
      ...(title && { title }),
      ...(content && { content }),
    };

    const { data, error: notesUpdateError } = await supabase
      .from("notes")
      .update(editPayload)
      .eq("user_id", user.id)
      .eq("id", notesId)
      .select()
      .single();

    if (!data) {
      return;
    }

    if (notesUpdateError) {
      console.error("error", notesUpdateError);
    }
  }

  return useMutation({
    mutationFn,
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: [
          NOTES_QUERY_KEY,
          {
            id: notesId,
          },
        ],
      });
    },
  });
}
