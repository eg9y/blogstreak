import { useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "@supabase/supabase-js";

import { createClient } from "@/utils/supabase/client";

export function useEditNotes(user: User | null, notesId: number | null) {
  const queryClient = useQueryClient();
  const supabase = createClient();

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
        queryKey: ["notes", user?.id, notesId],
      });
    },
  });
}
