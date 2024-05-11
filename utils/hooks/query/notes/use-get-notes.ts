import { useInfiniteQuery } from "@tanstack/react-query";
import { User } from "@supabase/supabase-js";

import { createClient } from "../../../supabase/client";

export function useGetNotes(
  user: User | null,
  username: string | null,
  notesFolderId: number | null,
) {
  const supabase = createClient();

  const queryKey = ["notes", user?.id || username, notesFolderId];

  const queryFn = async ({ pageParam = -1 }) => {
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

    if (!userId || !notesFolderId) {
      return { data: [], nextPage: null };
    }

    const { data, error } = await supabase.rpc("get_notes", {
      earliest_note_id_param: pageParam,
      user_id_param: userId,
      notes_folder_id_param: notesFolderId,
    });

    if (error) {
      console.error("Error fetching notes:", error.message);
      throw new Error("Error fetching notes");
    }

    // Ensure data is sorted by post_created_at in ascending order
    const sortedData = data.sort(
      (currentNote, nextNote) =>
        new Date(nextNote.created_at).getTime() -
        new Date(currentNote.created_at).getTime(),
    );

    return {
      data: sortedData,
      nextPage: data.length ? data[0].id : null,
    };
  };

  return useInfiniteQuery({
    queryKey,
    queryFn,
    initialPageParam: -1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: Boolean((username === "me" ? user : true) && notesFolderId),
    staleTime: 60 * 60 * 1000,
  });
}
