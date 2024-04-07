import { useQuery } from "@tanstack/react-query";
import { User } from "@supabase/supabase-js";
import { createClient } from "../../supabase/client";
import { ReadonlyURLSearchParams } from "next/navigation";

export function useStreaksQuery(
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
    "streaks",
    user?.id,
    {
      month,
      year,
    },
  ];

  const queryFn = async () => {
    if (!user) return { data: [], count: 0 }; // Early return if user is null

    const { data, error } = await supabase.rpc("get_posts_dates", {
      user_id_param: user?.id,
      username_param: decodeURIComponent(username),
      month_param: month,
      year_param: year,
    });

    const { count, error: totalPostsError } = await supabase
      .from("posts")
      .select("*", {
        count: "exact",
        head: true,
      });

    if (error) {
      console.error("Error fetching posts:", error.message);
      throw new Error("Error fetching posts");
    }

    if (totalPostsError) {
      console.error("Error fetching total posts:", totalPostsError.message);
      throw new Error("Error fetching total posts");
    }

    // Ensure data is sorted by post_date in ascending order
    const sortedData = data.sort(
      (a, b) =>
        new Date(a.post_date).getTime() - new Date(b.post_date).getTime(),
    );

    // Calculate streaks
    let currentStreak = 0;
    let previousDate: Date | null = null;

    const dataWithStreaks = sortedData.map((post) => {
      const postDate = new Date(post.post_date);

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

    return { data: dataWithStreaks, count };
  };

  return useQuery({
    queryKey,
    queryFn,
    enabled: user && searchParams ? true : false, // Query enabled only if user is not null
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
