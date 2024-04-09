import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { User } from "@supabase/supabase-js";
import { createClient } from "../../supabase/client";
import { ReadonlyURLSearchParams } from "next/navigation";

export function usePostsInfiniteQuery(
  user: User | null,
  searchParams: ReadonlyURLSearchParams,
  username: string,
) {
  const month = parseInt(
    searchParams.get("month") || (new Date().getMonth() + 1).toString(),
  );

  const year = parseInt(
    searchParams.get("year") || new Date().getFullYear().toString(),
  );

  const supabase = createClient();

  const queryKey = [
    "infinite-posts",
    user?.id,
    {
      tags: searchParams.get("tags"),
      page: searchParams.get("page"),
      private: username === "me" ? searchParams.get("private") : "true",
    },
  ];
  const tagNames = searchParams.get("tags")?.split(",") || undefined;
  const isPrivateJournals =
    username === "me" ? searchParams.get("private") === "true" : false;
  const limit = 15; // Number of posts per page

  const queryFn = async ({ pageParam = -1 }) => {
    const { data, error } = await supabase.rpc("get_posts_by_topics", {
      earliest_post_id_param: pageParam, // Assuming this is correctly set to null or the appropriate ID
      month_param: month,
      is_private_param: isPrivateJournals, // Updated to use is_private_param
      topic_names_arr: tagNames,
      total_posts_param: limit,
      user_id_param: user?.id,
      username_param: decodeURIComponent(username),
      year_param: year,
    });

    if (error) {
      console.error("Error fetching posts:", error.message);
      throw new Error("Error fetching posts");
    }

    // Ensure data is sorted by post_created_at in ascending order
    const sortedData = data.sort(
      (a, b) =>
        new Date(a.post_created_at).getTime() -
        new Date(b.post_created_at).getTime(),
    );

    // Calculate streaks
    let currentStreak = 0;
    let previousDate: Date | null = null;

    const dataWithStreaks = sortedData.map((post) => {
      const postDate = new Date(post.post_created_at);

      if (!previousDate) {
        currentStreak = 1; // Start with a streak of 1 for the first post
      } else if (areConsecutiveDays(previousDate, postDate)) {
        currentStreak++; // Increment streak if dates are consecutive
      } else if (areSameDays(previousDate, postDate)) {
        currentStreak = currentStreak;
      } else {
        currentStreak = 1; // Reset streak if not consecutive
      }

      previousDate = postDate; // Update previousDate to current post's date for next iteration

      return {
        ...post,
        streaks: currentStreak, // Add streaks number to each post object
      };
    });

    return {
      data: dataWithStreaks,
      nextPage: data.length ? data[0].post_id : null, // Use the ID of the last post as the cursor for the next query
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

// Helper function to check if two dates are consecutive days
const areConsecutiveDays = (date1: Date, date2: Date) => {
  const difference = date2.getDate() - date1.getDate();
  const sameMonth = date2.getMonth() === date1.getMonth();
  const sameYear = date2.getFullYear() === date1.getFullYear();
  return difference === 1 && sameMonth && sameYear;
};

const areSameDays = (date1: Date, date2: Date) => {
  const difference = date2.getDate() - date1.getDate();
  const sameMonth = date2.getMonth() === date1.getMonth();
  const sameYear = date2.getFullYear() === date1.getFullYear();
  return difference === 0 && sameMonth && sameYear;
};
