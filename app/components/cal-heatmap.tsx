"use client";

import { getUser } from "@/utils/getUser";
import { usePostsQuery } from "@/utils/hooks/query/use-posts-query";
import { usePathname, useSearchParams } from "next/navigation";
import { Database } from "@/schema";
import { useEffect, useState } from "react";
import { cn } from "@/utils/cn";

export function Cal() {
  const { currentUser } = getUser();
  const searchParams = useSearchParams();
  const username = usePathname().slice(1);
  const { data, isSuccess } = usePostsQuery(
    currentUser,
    searchParams,
    username,
  );
  const [finalData, setFinalData] = useState<
    (Database["public"]["Functions"]["get_posts_by_topics"]["Returns"][number] & {
      streaks: number | null;
    })[]
  >([]);
  const [topStreaks, setTopStreaks] = useState(0);
  const [currentStreaks, setCurrentStreaks] = useState(0);

  function getAllDatesInMonth(year: number, month: number) {
    const date = new Date(Date.UTC(year, month, 1));
    const dates = [];

    while (date.getUTCMonth() === month) {
      dates.push(
        new Date(
          Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate(),
          ),
        ),
      );
      date.setUTCDate(date.getUTCDate() + 1);
    }

    return dates;
  }

  function calculateStreaks(
    data: (Database["public"]["Functions"]["get_posts_by_topics"]["Returns"][number] & {
      streaks: number | null;
    })[],
  ) {
    let currentStreak = 0;
    let topStreak = 0;
    let tempStreak = 0;
    const today = new Date();

    for (let i = 0; i < data.length; i++) {
      // Check if it's a day with a post
      if (data[i].post_id !== -1) {
        tempStreak++;

        // Update top streak if current temp streak is longer
        if (tempStreak > topStreak) {
          topStreak = tempStreak;
        }

        // If the current day has a post, reset current streak
        if (isSameDay(new Date(data[i].post_created_at), today)) {
          currentStreak = tempStreak;
        }
      } else {
        // Reset temp streak if it's a day without a post
        tempStreak = 0;
      }
    }

    return { topStreak, currentStreak };
  }

  useEffect(() => {
    if (data && isSuccess) {
      const timestamps = data.data.map((d) =>
        new Date(d.post_created_at).getTime(),
      );
      const minTimestamp = Math.min(...timestamps);
      const maxTimestamp = Math.max(...timestamps);

      const minDate = new Date(minTimestamp);

      const allDates = getAllDatesInMonth(
        minDate.getFullYear(),
        minDate.getMonth(),
      );

      const filledData = allDates.map((date) => {
        const dateString = date.toISOString().split("T")[0];
        const existingPost = data.data.find((d) =>
          new Date(d.post_created_at).toISOString().startsWith(dateString),
        );
        if (existingPost) {
          return {
            ...existingPost,
            streaks: existingPost.streaks || null, // Ensure streaks is number | null
          };
        }

        // Adjusted to include all necessary fields with default or placeholder values
        return {
          post_created_at: dateString,
          post_id: -1, // Placeholder value since null is not accepted; consider a negative value to indicate a non-existing post
          post_text: "", // Empty string or suitable placeholder
          post_user_id: "", // Empty string or suitable placeholder
          post_topics: null, // Assuming this can be null; adjust as necessary
          streaks: null,
        };
      });

      filledData.sort(
        (a, b) =>
          new Date(a.post_created_at).getTime() -
          new Date(b.post_created_at).getTime(),
      );

      const { topStreak, currentStreak } = calculateStreaks(finalData);
      console.log({ topStreak, currentStreak });
      setTopStreaks(topStreak);
      setCurrentStreaks(currentStreak);

      setFinalData(filledData);
    }
  }, [isSuccess, data]);

  function isSameDay(d1: Date, d2: Date) {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between">
        <h1 className="text-xl font-bold dark:text-slate-300">
          March Activity
        </h1>
        <div className="flex items-center justify-end gap-2">
          <div className="flex h-[24.8333px] flex-shrink-0 items-center bg-slate-100 px-2 dark:bg-slate-600">
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">
              Top Streaks: <span>{topStreaks}</span>
            </p>
          </div>
          <div className="flex h-[24.8333px] flex-shrink-0 items-center bg-slate-100 px-2 dark:bg-slate-600">
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">
              Current Streaks: <span>{currentStreaks}</span>
            </p>
          </div>
        </div>
      </div>
      <div className="flex gap-1">
        {finalData.map((day) => {
          const dayNumber = new Date(day.post_created_at).getDate();

          return (
            <div
              key={`${day.post_id}-${day.post_created_at}`}
              className={cn("relative inline-block grow")}
            >
              <div className="mt-[100%]"></div>
              <div
                className={cn(
                  "absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center rounded-sm",
                  day.post_id === -1 && "bg-slate-100",
                  isSameDay(new Date(day.post_created_at), new Date()) &&
                    "ring-2 ring-green-500",
                  day.streaks !== null && "hover:ring-2 hover:ring-slate-500",
                  day.streaks === 1 && "bg-amber-200",
                  day.streaks === 2 && "bg-amber-300",
                  day.streaks === 3 && "bg-amber-400",
                  day.streaks === 4 && "bg-amber-500",
                  day.streaks !== null && day.streaks >= 5 && "bg-amber-600",
                )}
              >
                {/* Displaying the day number */}
                <span className="text-xs font-medium text-slate-600">
                  {dayNumber}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
