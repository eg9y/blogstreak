import { useQuery } from "@tanstack/react-query";
import { User } from "@supabase/supabase-js";
import { ReadonlyURLSearchParams } from "next/navigation";

import { createClient } from "../../supabase/client";

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

export function useStreaksQuery(
  user: User | null,
  searchParams: ReadonlyURLSearchParams,
  username: string | null,
) {
  const month = parseInt(
    searchParams.get("month") || (new Date().getMonth() + 1).toString(),
    10,
  );

  const year = parseInt(
    searchParams.get("year") || new Date().getFullYear().toString(),
    10,
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
    if (!username) {
      return { data: [], count: 0 };
    }

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
      (currentPost, nextPost) =>
        new Date(currentPost.post_date).getTime() -
        new Date(nextPost.post_date).getTime(),
    );

    // Calculate streaks
    let currentStreak = 0;
    let previousDate: Date | null = null;

    const dataWithStreaks = sortedData.map((post) => {
      const postDate = new Date(post.post_date);

      if (!previousDate) {
        currentStreak = 1;
      } else if (areConsecutiveDays(previousDate, postDate)) {
        currentStreak++;
      } else if (!areSameDays(previousDate, postDate)) {
        currentStreak = 1;
      }

      previousDate = postDate;

      return {
        ...post,
        streaks: currentStreak,
      };
    });

    return { data: dataWithStreaks, count };
  };

  return useQuery({
    queryKey,
    queryFn,
    enabled: Boolean((username === "me" ? user : true) && searchParams),
    staleTime: 60 * 60 * 1000,
  });
}
