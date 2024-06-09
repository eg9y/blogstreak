import { useQuery } from "@tanstack/react-query";
import { User } from "@supabase/supabase-js";

import { createClient } from "@/utils/supabase/client";
import { NOTES_QUERY_KEY } from "@/constants/query-keys";

export function useGetNoteQuery(user?: User | null, noteId?: number) {
  const supabase = createClient();

  const queryKey = [NOTES_QUERY_KEY, user?.id, noteId];

  const queryFn = async () => {
    const res = await supabase
      .from("notes")
      .select("*")
      .eq("id", noteId!)
      .eq("user_id", user?.id!)
      .single()
      .throwOnError();

    return res;
  };

  return useQuery({
    queryKey,
    queryFn,
    enabled: Boolean(noteId && user?.id),
    staleTime: 60 * 60 * 1000,
  });
}
