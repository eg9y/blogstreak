"use client";

import { getUser } from "@/utils/getUser";
import { useStreaksQuery } from "@/utils/hooks/query/use-streaks-query";
import { usePathname, useSearchParams } from "next/navigation";
import { Database } from "@/schema";
import { useEffect, useState } from "react";
import { cn } from "@/utils/cn";
import { Button } from "./button";
import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";

export function Cal() {
  const { currentUser } = getUser();
  const searchParams = useSearchParams();
  const username = usePathname().split("/")[1];
  const { data, isSuccess } = useStreaksQuery(
    currentUser,
    searchParams,
    username,
  );
  const [finalData, setFinalData] = useState<
    (Database["public"]["Functions"]["get_posts_dates"]["Returns"][number] & {
      streaks: number | null;
    })[]
  >([]);
  const [topStreaks, setTopStreaks] = useState(0);
  const [currentStreaks, setCurrentStreaks] = useState(0);

  const currentYear = parseInt(
    searchParams.get("year") || new Date().getFullYear().toString(),
  );
  const currentMonth =
    parseInt(
      searchParams.get("month") || (new Date().getMonth() + 1).toString(),
    ) - 1;

  const previousDate = new Date(currentYear, currentMonth - 1);
  const previousMonth = previousDate.getMonth() + 1;
  const previousYear = previousDate.getFullYear();

  const nextDate = new Date(currentYear, currentMonth + 1);
  const nextMonth = nextDate.getMonth() + 1;
  const nextYear = nextDate.getFullYear();

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
    data: (Database["public"]["Functions"]["get_posts_dates"]["Returns"][number] & {
      streaks: number | null;
    })[],
  ) {
    let currentStreak = 0;
    let topStreak = 0;
    let tempStreak = 0;
    const today = new Date();

    for (let i = 0; i < data.length; i++) {
      if (data[i].post_id !== -1) {
        tempStreak++;

        if (tempStreak > topStreak) {
          topStreak = tempStreak;
        }

        if (isSameDay(new Date(data[i].post_date), today)) {
          currentStreak = tempStreak;
        }
      } else {
        tempStreak = 0;
      }
    }

    return { topStreak, currentStreak };
  }

  useEffect(() => {
    if (data && isSuccess && finalData.length === 0) {
      const timestamps = data.data.map((d) => new Date(d.post_date).getTime());
      const minTimestamp = Math.min(...timestamps);

      const minDate = new Date(minTimestamp);

      const allDates = getAllDatesInMonth(
        minDate.getFullYear(),
        minDate.getMonth(),
      );

      const filledData = allDates.map((date) => {
        const dateString = date.toISOString().split("T")[0];
        const existingPost = data.data.find((d) =>
          new Date(d.post_date).toISOString().startsWith(dateString),
        );
        if (existingPost) {
          return {
            ...existingPost,
            streaks: existingPost.streaks || null, // Ensure streaks is number | null
          };
        }

        // Adjusted to include all necessary fields with default or placeholder values
        return {
          post_date: dateString,
          post_id: -1, // Placeholder value since null is not accepted; consider a negative value to indicate a non-existing post
          post_text: "", // Empty string or suitable placeholder
          post_user_id: "", // Empty string or suitable placeholder
          post_topics: null, // Assuming this can be null; adjust as necessary
          streaks: null,
        };
      });

      filledData.sort(
        (a, b) =>
          new Date(a.post_date).getTime() - new Date(b.post_date).getTime(),
      );

      const { topStreak, currentStreak } = calculateStreaks(filledData);
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

  function createUpdatedSearchQuery(year: number, month: number) {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("year", year.toString());
    newSearchParams.set("month", month.toString());
    return `?${newSearchParams.toString()}`;
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex flex-col items-start justify-between sm:flex-row sm:items-start">
        <h1 className="text-sm font-bold dark:text-slate-300">
          {new Date(currentYear, currentMonth).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}{" "}
          Activity
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
      <div className="flex sm:gap-1">
        <div>
          <Button
            href={createUpdatedSearchQuery(previousYear, previousMonth)}
            className={cn(
              "group flex items-center gap-x-1 rounded-md !pb-1 !pt-1 text-sm font-semibold leading-6",
            )}
            plain
          >
            <ArrowLeftIcon />
          </Button>
        </div>
        {finalData.map((day) => {
          const dayNumber = new Date(day.post_date).getDate();

          return (
            <div
              key={`${day.post_id}-${day.post_date}`}
              className={cn("relative inline-block grow")}
            >
              <div className="mt-[100%]"></div>
              <div
                className={cn(
                  "absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center sm:rounded-sm",
                  day.post_id === -1 && "bg-slate-100",
                  isSameDay(new Date(day.post_date), new Date()) &&
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
                <span className="invisible text-xs font-medium text-slate-600 sm:visible">
                  {dayNumber}
                </span>
              </div>
            </div>
          );
        })}
        <div>
          <Button
            href={createUpdatedSearchQuery(nextYear, nextMonth)}
            className={cn(
              "group flex items-center gap-x-1 rounded-md !pb-1 !pt-1 text-sm font-semibold leading-6",
            )}
            plain
          >
            <ArrowRightIcon />
          </Button>
        </div>
      </div>
    </div>
  );
}
