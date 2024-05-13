import { useQuery } from "@tanstack/react-query";
import { User } from "@supabase/supabase-js";

import { Database } from "@/schema";

import { createClient } from "../../supabase/client";

export function useGetTopicsQuery(user: User | null, postId?: number) {
  const supabase = createClient();

  const queryKey = ["topics", user?.id];

  const queryFn = async () => {
    let associatedTagsData: Database["public"]["Tables"]["post_topics"]["Row"][] =
      [];

    if (postId) {
      const { data, error: associatedTagsError } = await supabase
        .from("post_topics")
        .select("*")
        .eq("user_id", user!.id)
        .eq("post_id", postId)
        .order("created_at", {
          ascending: false,
        })
        .throwOnError();

      if (associatedTagsError) {
        return [];
      }

      associatedTagsData = data || [];
    }

    const { data: topicsData, error: topicsError } = await supabase
      .from("topics")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", {
        ascending: false,
      })
      .throwOnError();

    if (topicsError) {
      return [];
    }

    const response = topicsData?.map((topic) => {
      return {
        ...topic,
        isSelected: Boolean(
          associatedTagsData.find((associated) => {
            return associated.topic_id === topic.id;
          }),
        ),
      };
    });

    return response;
  };

  return useQuery({
    queryKey,
    queryFn,
    enabled: Boolean(user),
    staleTime: 60 * 60 * 1000,
  });
}
