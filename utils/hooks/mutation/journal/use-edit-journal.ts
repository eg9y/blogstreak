import { useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "@supabase/supabase-js";

import { INFINITE_JOURNALS_QUERY_KEY } from "@/constants/query-keys";

import { createClient } from "../../../supabase/client";

export function useEditPost(loggedInUser: User | null) {
  const queryClient = useQueryClient();
  const supabase = createClient();
  const date = new Date();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  async function mutationFn({
    journalId,
    content,
    rawText,
    tags,
    isPublic,
  }: {
    journalId: number;
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

    await supabase
      .from("posts")
      .update({
        text: content,
        raw_text: rawText,
        user_id: user?.id,
        is_public: isPublic,
      })
      .eq("id", journalId);

    await supabase.functions.invoke("meilisearch", {
      body: {
        op: "edit",
        data: {
          index: "journals",
          doc: {
            id: journalId,
            text: content,
            raw_text: rawText,
            user_id: user?.id,
            is_public: isPublic,
            topics: tags.map((tag) => tag.name),
          },
        },
      },
    });

    if (tags.length > 0) {
      await supabase
        .from("post_topics")
        .delete()
        .eq("post_id", journalId)
        .eq("user_id", user.id);
      await supabase.from("post_topics").insert(
        tags.map((tag) => ({
          topic_id: tag.id,
          post_id: journalId,
          user_id: user?.id,
        })),
      );
    }
  }

  return useMutation({
    mutationFn,
    onSuccess: () => {
      return Promise.all([
        queryClient.invalidateQueries({
          queryKey: [
            INFINITE_JOURNALS_QUERY_KEY,
            loggedInUser?.id,
            year,
            month,
          ],
        }),
        queryClient.invalidateQueries({
          queryKey: ["topics"],
        }),
      ]);
    },
  });
}
