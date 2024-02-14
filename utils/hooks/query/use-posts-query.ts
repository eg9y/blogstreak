import { useQuery } from "@tanstack/react-query";
import { User } from "@supabase/supabase-js";
import { createClient } from "../../supabase/client";
import { ReadonlyURLSearchParams } from "next/navigation";

export function usePostsQuery(
  user: User | null,
  searchParams: ReadonlyURLSearchParams,
) {
  const supabase = createClient();

  const queryKey = [
    "posts",
    user?.id,
    searchParams.get("tags"),
    searchParams.get("page"),
  ];
  const tagNames = searchParams.get("tags")?.split(",") || undefined; // Null if no tags
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = 10; // Number of posts per page
  // Assuming you keep track of the last post ID for keyset pagination
  const lastPostId = parseInt(searchParams.get("lastPostId") || "0", 10);

  const queryFn = async () => {
    if (!user) return []; // Early return if user is null

    const { data, error } = await supabase.rpc("get_posts_by_topics", {
      topic_names_arr: tagNames,
      user_id_param: user?.id,
      last_post_id_param: lastPostId ? lastPostId : undefined,
      total_posts_param: limit,
    });

    if (error) {
      console.error("Error fetching posts:", error.message);
      throw new Error("Error fetching posts");
    }

    const finalData = data.map((post) => ({
      ...post,
    }));

    return finalData;
  };

  return useQuery({
    queryKey,
    queryFn,
    enabled: Boolean(user), // Query enabled only if user is not null
    staleTime: 60 * 1000, // Data is considered fresh for 60 seconds
  });
}
