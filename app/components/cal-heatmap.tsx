"use client";

import CalHeatmap from "cal-heatmap";
import Tooltip from "cal-heatmap/plugins/Tooltip";
import "cal-heatmap/cal-heatmap.css";
import { useEffect, useRef } from "react";
import { getUser } from "@/utils/getUser";
import { usePostsQuery } from "@/utils/hooks/query/use-posts-query";
import { useSearchParams } from "next/navigation";
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

  const { currentUser } = getUser();

  const searchParams = useSearchParams();

  const { data, isLoading, isFetching, isPending, isSuccess } = usePostsQuery(
    currentUser,
    searchParams,
  );

  useEffect(() => {
    if (
      isSuccess &&
      data.length &&
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

      console.log("data", data);

      const finalData: Database["public"]["Functions"]["get_posts_by_topics"]["Returns"] =
        data.reduce(
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
          [] as Database["public"]["Functions"]["get_posts_by_topics"]["Returns"],
        );

      console.log("finalData", finalData);

      cal.paint(
        {
          itemSelector: "#stuff",
          theme: "dark",
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
          domain: { type: "month", gutter: 5, label: { textAlign: "start" } },
          subDomain: {
            type: "day_row",
            width: 14,
            height: 14,
            gutter: 4,
          },
          scale: {
            color: {
              // Define your range from light green to dark green
              // range: ["#f0fdf4", "#052e16"],
              domain: [1, 40], // Use the actual min and max streak lengths
            },
          },
        },
        [[Tooltip]],
      );

      heatmapRef.current = cal;
    }
  }, [isSuccess, data]); // Ensure 'data' is included if it affects rendering

  return <div id="stuff"></div>;
}
