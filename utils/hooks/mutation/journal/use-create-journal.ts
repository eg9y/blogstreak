import { useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "@supabase/supabase-js";

import { getMeilisearchClient } from "@/utils/meilisearch";
import {
  INFINITE_JOURNALS_QUERY_KEY,
  STREAKS_QUERY_KEY,
} from "@/constants/query-keys";

import { createClient } from "../../../supabase/client";

export function useCreateJournal(loggedInUser: User | null) {
  const queryClient = useQueryClient();
  const supabase = createClient();
  const meilisearch = getMeilisearchClient();
  const date = new Date();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  async function mutationFn({
    content,
    rawText,
    tags,
    isPublic,
  }: {
    content: string;
    rawText: string;
    tags: {
      id: number;
      name: string;
    }[];
    isPublic: boolean;
  }) {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      console.error(error);
      return;
    }

    const { data, error: postInsertError } = await supabase
      .from("posts")
      .insert({
        text: content,
        raw_text: rawText,
        user_id: user?.id,
        is_public: isPublic,
      })
      .select()
      .single();

    if (!data) {
      return;
    }

    if (postInsertError) {
      return;
    }

    await meilisearch.index("journals").addDocuments([
      {
        id: data.id,
        created_at: new Date(),
        raw_text: rawText,
        user_id: user?.id,
        is_public: isPublic,
        topics: tags.map((tag) => tag.name),
      },
    ]);

    if (tags.length > 0) {
      await supabase.from("post_topics").insert(
        tags.map((tag) => {
          return {
            post_id: data.id,
            topic_id: tag.id,
            user_id: user.id,
          };
        }),
      );
    }

    console.log(data);
  }

  return useMutation({
    mutationFn,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [STREAKS_QUERY_KEY],
      });
      return queryClient.invalidateQueries({
        queryKey: [INFINITE_JOURNALS_QUERY_KEY, loggedInUser?.id, year, month],
      });
    },
  });
}
