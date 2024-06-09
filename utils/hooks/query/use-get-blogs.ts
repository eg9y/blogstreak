import { useInfiniteQuery } from "@tanstack/react-query";
import { User } from "@supabase/supabase-js";
import { ReadonlyURLSearchParams } from "next/navigation";

import { INFINITE_BLOGS_QUERY_KEY } from "@/constants/query-keys";

import { createClient } from "../../supabase/client";

export function useGetBlogs(
  user: User | null,
  searchParams: ReadonlyURLSearchParams,
  username: string | null,
) {
  const supabase = createClient();

  const queryKey = [
    INFINITE_BLOGS_QUERY_KEY,
    user?.id || username,
    {
      isPublic: username === "me" ? searchParams.get("is_public") : "true",
    },
  ];
  let isPublicParam = searchParams.has("is_public")
    ? searchParams.get("is_public") === "true"
    : undefined;

  if (username !== "me") {
    isPublicParam = undefined;
  }

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

    if (!userId) {
      return { data: [], nextPage: null };
    }

    const { data, error } = await supabase.rpc("get_blogs", {
      earliest_blog_id_param: pageParam,
      is_public_param: isPublicParam,
      user_id_param: userId,
    });

    if (error) {
      console.error("Error fetching posts:", error.message);
      throw new Error("Error fetching posts");
    }

    // Ensure data is sorted by post_created_at in ascending order
    const sortedData = data.sort(
      (currentBlog, nextBlog) =>
        new Date(nextBlog.created_at).getTime() -
        new Date(currentBlog.created_at).getTime(),
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
    enabled: Boolean((username === "me" ? user : true) && searchParams),
    staleTime: 60 * 60 * 1000,
  });
}
