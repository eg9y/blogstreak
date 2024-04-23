import { useInfiniteQuery } from "@tanstack/react-query";
import { User } from "@supabase/supabase-js";
import { ReadonlyURLSearchParams } from "next/navigation";

import { createClient } from "../../supabase/client";

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

export function usePostsInfiniteQuery(
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
  const limit = 15;

  const queryFn = async ({ pageParam = -1 }) => {
    const { data, error } = await supabase.rpc("get_posts_by_topics", {
      earliest_post_id_param: pageParam,
      month_param: month,
      is_private_param: isPrivateJournals,
      topic_names_arr: tagNames,
      total_posts_param: limit,
      user_id_param: user?.id,
      username_param: username ? decodeURIComponent(username) : "",
      year_param: year,
    });

    if (error) {
      console.error("Error fetching posts:", error.message);
      throw new Error("Error fetching posts");
    }

    const sortedData = data.sort(
      (currentJournal, nextJournal) =>
        new Date(nextJournal.post_created_at).getTime() -
        new Date(currentJournal.post_created_at).getTime(),
    );

    let currentStreak = 0;
    let previousDate: Date | null = null;

    const dataWithStreaks = sortedData.map((post) => {
      const postDate = new Date(post.post_created_at);

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

    return {
      data: dataWithStreaks,
      nextPage: data.length ? data[0].post_id : null,
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
