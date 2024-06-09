import { useQuery } from "@tanstack/react-query";

import { createClient } from "@/utils/supabase/client";
import { NOTES_FOLDERS_QUERY_KEY } from "@/constants/query-keys";

export function useGetNotesInFolder(folderId: number | null) {
  const supabase = createClient();

  const queryKey = [
    NOTES_FOLDERS_QUERY_KEY,
    {
      folderId,
    },
  ];

  const queryFn = async () => {
    if (!folderId) return { notes: [] };

    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("notes_folders_id", folderId)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error fetching notes:", error.message);
      throw new Error("Error fetching notes");
    }

    return { notes: data };
  };

  return useQuery({
    queryKey,
    queryFn,
    enabled: Boolean(folderId),
    staleTime: 10 * 60 * 1000,
  });
}
