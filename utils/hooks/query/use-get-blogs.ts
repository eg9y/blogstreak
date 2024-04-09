import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { User } from "@supabase/supabase-js";
import { createClient } from "../../supabase/client";
import { ReadonlyURLSearchParams } from "next/navigation";

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
    if (!user) return { data: [], nextPage: null }; // Early return if user is null

    const { data, error } = await supabase.rpc("get_blogs", {
      earliest_blog_id_param: pageParam, // Assuming this is correctly set to null or the appropriate ID
      is_published_param: isPublishedBlogs, // Updated to use is_private_param
      user_id_param: user?.id,
    });

    if (error) {
      console.error("Error fetching posts:", error.message);
      throw new Error("Error fetching posts");
    }

    // Ensure data is sorted by post_created_at in ascending order
    const sortedData = data.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

    return {
      data: sortedData,
      nextPage: data.length ? data[0].id : null, // Use the ID of the last post as the cursor for the next query
    };
  };

  return useInfiniteQuery({
    queryKey,
    queryFn,
    initialPageParam: -1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: (username === "me" ? user : true) && searchParams ? true : false, // Query enabled only if user is not null
    staleTime: 60 * 60 * 1000, // Data is considered fresh for 60 seconds
  });
}
