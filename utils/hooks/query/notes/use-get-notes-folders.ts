import { useQuery } from "@tanstack/react-query";
import { User } from "@supabase/supabase-js";

import { createClient } from "@/utils/supabase/client";
import { useNotesStore } from "@/store/notes";

export function useGetNotesFolders(user: User | null, username: string | null) {
  const { openedFolderIds } = useNotesStore();
  const supabase = createClient();

  const queryKey = [
    "notes-folders",
    username,
    {
      openedFolderIds,
    },
  ];

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
      return { data: [] };
    }

    const { data, error } = await supabase
      .from("notes_folders")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", {
        ascending: false,
      });

    if (error) {
      console.error("Error fetching folders:", error.message);
      throw new Error("Error fetching folders");
    }

    console.log("data", data);
    const { data: notes, error: notesError } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", userId)
      .in("notes_folders_id", openedFolderIds)
      .order("updated_at", {
        ascending: false,
      });

    if (notesError) {
      console.error("Error fetching notes:", notesError.message);
      throw new Error("Error fetching notes");
    }

    const foldersAndFiles = data.map((folder) => {
      const correspondingFiles = notes.filter((note) => {
        return note.notes_folders_id === folder.id;
      });

      return { ...folder, files: correspondingFiles };
    });

    return {
      foldersAndFiles,
    };
  };

  return useQuery({
    queryKey,
    queryFn,
    enabled: Boolean(username && (username === "me" ? user : true)),
    staleTime: 60 * 60 * 1000,
  });
}
