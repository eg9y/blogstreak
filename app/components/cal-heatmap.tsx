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

      const minStreak = 0; // Example minimum streak length
      const maxStreak = 3;

      cal.paint(
        {
          itemSelector: "#stuff",
          theme: "dark",
          data: {
            source: data,
            x: (
              data: Database["public"]["Functions"]["get_posts_by_topics"]["Returns"][number],
            ) => new Date(data.post_created_at).toISOString(),
            y: "streaks",
            groupY: (data: Record<string, number>[]) => {
              return data.reduce((a) => a + 1, 0);
            },
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

              // type: "linear",
              range: ["#bbf7d0", "#065f46"],
              domain: [minStreak, maxStreak], // Use the actual min and max streak lengths
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
