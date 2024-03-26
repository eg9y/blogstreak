"use client";

import CalHeatmap from "cal-heatmap";
import Tooltip from "cal-heatmap/plugins/Tooltip";
import "cal-heatmap/cal-heatmap.css";
import { useEffect, useRef, useState } from "react";
import { getUser } from "@/utils/getUser";
import { usePostsQuery } from "@/utils/hooks/query/use-posts-query";
import { usePathname, useSearchParams } from "next/navigation";
import { Database } from "@/schema";

let dayRowTemplate = (dateHelper: any, { domain }: any) => ({
  name: "day_row",
  allowedDomainType: ["month"],
  rowsCount() {
    return 1;
  },
  columnsCount(d: any) {
    return domain.dynamicDimension
      ? dateHelper.date(d).endOf("month").date()
      : 31;
  },
  mapping: (startDate: Date, endDate: Date, defaultValues: any) => {
    return dateHelper
      .intervals("day", startDate, dateHelper.date(endDate))
      .map((d: any, index: number) => ({
        t: d,
        x: index,
        y: 0,
        ...defaultValues,
      }));
  },

  format: {
    date: "Do",
    legend: "Do",
  },
  extractUnit(d: any) {
    return dateHelper.date(d).startOf("day").valueOf();
  },
});

export function Cal() {
  const heatmapRef = useRef(null);
  const containerRef = useRef(null); // New ref for the parent container
  const [daySize, setDaySize] = useState({ width: 28.5, height: 28.5 });

  const { currentUser } = getUser();
  const searchParams = useSearchParams();
  const username = usePathname().slice(1);
  const { data, isSuccess } = usePostsQuery(
    currentUser,
    searchParams,
    username,
  );

  useEffect(() => {
    if (
      isSuccess &&
      data.data.length &&
      !heatmapRef.current &&
      typeof window !== "undefined"
    ) {
      const cal = new CalHeatmap();

      cal.addTemplates(dayRowTemplate);

      const startOfMonth = new Date();
      startOfMonth.setHours(0, 0, 0, 0);

      const endOfMonth = new Date(
        startOfMonth.getFullYear(),
        startOfMonth.getMonth() + 1,
        0,
      );

      const finalData: (Database["public"]["Functions"]["get_posts_by_topics"]["Returns"][number] & {
        streaks: number | null;
      })[] = data.data.reduce(
        (acc, current) => {
          const lastTime =
            acc.length > 0
              ? new Date(acc[acc.length - 1].post_created_at)
              : new Date();
          lastTime.setHours(0, 0, 0, 0);
          const currentTime = new Date(current.post_created_at);
          currentTime.setHours(0, 0, 0, 0);
          if (acc.length === 0) {
            return [current];
          } else if (lastTime.getTime() !== currentTime.getTime()) {
            return [...acc, current];
          }

          return acc;
        },
        [] as (Database["public"]["Functions"]["get_posts_by_topics"]["Returns"][number] & {
          streaks: number | null;
        })[],
      );

      cal.paint(
        {
          itemSelector: "#stuff",
          theme: "light",
          data: {
            source: finalData,
            x: (
              data: Database["public"]["Functions"]["get_posts_by_topics"]["Returns"][number],
            ) => new Date(data.post_created_at).toISOString(),
            y: "streaks",
          },
          date: {
            start: startOfMonth,
            min: startOfMonth,
            max: endOfMonth,
          },
          range: 1,
          domain: {
            type: "month",
            gutter: 5,
            label: { textAlign: "middle", position: "left", text: "" },
          },
          subDomain: {
            type: "day_row",
            width: daySize.width,
            height: daySize.height,
            gutter: 2,
          },
          scale: {
            color: {
              // Define your range from light green to dark green
              range: [
                "#ccffcc", // Lightest green for a streak of 1
                "#99ff99", // Noticeably darker for a streak of 2
                "#66ff66", // Even more noticeable for a streak of 3
                "#33cc33", // Significantly darker for a streak of 4
                "#009900", // Darkest green for the longest expected streak
              ],
              domain: [1, 5], // Adjust the domain end value to match the longest streak you're accommodating
              type: "linear",
            },
          },
        },
        [[Tooltip]],
      );

      heatmapRef.current = cal;

      const foo = window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", (e) => {
          if (e.matches) {
            cal.paint({
              theme: "dark",
            });
          } else {
            cal.paint({
              theme: "light",
            });
          }
        });

      // Setup dark/light mode for the first time
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        cal.paint({
          theme: "dark",
        });
      } else {
        cal.paint({
          theme: "light",
        });
      }

      // Remove listener
      return () => {
        window
          .matchMedia("(prefers-color-scheme: dark)")
          .removeEventListener("change", () => {});
      };
    }
  }, [isSuccess, data, daySize.width, daySize.height]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between">
        <h1 className="text-xl font-bold dark:text-slate-300">
          March Activity
        </h1>
        <div className="flex items-center justify-end gap-2">
          <div className="flex h-[24.8333px] flex-shrink-0 items-center bg-slate-100 px-2 dark:bg-slate-600">
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">
              Top Streaks: <span>4</span>
            </p>
          </div>
          <div className="flex h-[24.8333px] flex-shrink-0 items-center bg-slate-100 px-2 dark:bg-slate-600">
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">
              Current Streaks: <span>1</span>
            </p>
          </div>
        </div>
      </div>
      <div id="stuff"></div>
    </div>
  );
}
