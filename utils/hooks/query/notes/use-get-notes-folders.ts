import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { User } from "@supabase/supabase-js";

import { createClient } from "@/utils/supabase/client";
import { NOTES_FOLDERS_QUERY_KEY } from "@/constants/query-keys";

export function useGetNotesFolders(user: User | null, username: string | null) {
  const supabase = createClient();

  const queryKey = [NOTES_FOLDERS_QUERY_KEY, username];

  const queryFn = async () => {
    let userId = user?.id;

    if (!userId && username) {
      const response = await supabase
        .from("profiles")
        .select("user_id")
        .eq("name", username)
        .single()
        .throwOnError();

      if (response.data) {
        userId = response.data.user_id;
      }
    }

    if (!userId) {
      return { folders: [] };
    }

    const { data, error } = await supabase
      .from("notes_folders")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error fetching folders:", error.message);
      throw new Error("Error fetching folders");
    }

    return { folders: data };
  };

  return useQuery({
    queryKey,
    queryFn,
    enabled: Boolean(username && (username === "me" ? user : true)),
    staleTime: 10 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}
