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

    // Ensure data is sorted by post_created_at in ascending order
    const sortedData = data.sort(
      (a, b) =>
        new Date(a.post_created_at).getTime() -
        new Date(b.post_created_at).getTime(),
    );

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

    return dataWithStreaks;
  };

  return useQuery({
    queryKey,
    queryFn,
    enabled: user && searchParams ? true : false, // Query enabled only if user is not null
    staleTime: 60 * 60 * 1000, // Data is considered fresh for 60 seconds
  });
}
