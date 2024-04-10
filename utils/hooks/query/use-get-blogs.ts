import { useInfiniteQuery } from "@tanstack/react-query";
import { User } from "@supabase/supabase-js";
import { ReadonlyURLSearchParams } from "next/navigation";

import { createClient } from "../../supabase/client";

export function useGetBlogs(
  user: User | null,
  searchParams: ReadonlyURLSearchParams,
  username: string,
) {
  const supabase = createClient();

  const queryKey = [
    "infinite-blogs",
    user?.id,
    {
      isPublished:
        username === "me" ? searchParams.get("is_published") : "true",
    },
  ];
  const isPublishedBlogs =
    username === "me"
      ? searchParams.has("is_published")
        ? searchParams.get("is_published") === "true"
        : undefined
      : undefined;

  const queryFn = async ({ pageParam = -1 }) => {
    if (!user) return { data: [], nextPage: null };

    const { data, error } = await supabase.rpc("get_blogs", {
      earliest_blog_id_param: pageParam,
      is_published_param: isPublishedBlogs,
      user_id_param: user?.id,
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
