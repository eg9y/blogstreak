import { useMemo } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { Pagination, PaginationNext, PaginationPrevious } from "../pagination";
import { getUser } from "@/utils/getUser";
import { usePostsQuery } from "@/utils/hooks/query/use-posts-query";

export function PostsPagination() {
  const { currentUser } = getUser();
  const searchParams = useSearchParams();
  const pathName = usePathname();

  const username = pathName.split("/")[1];
  const itemsPerPage = 10;

  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const { data, isLoading } = usePostsQuery(
    currentUser,
    searchParams,
    username,
  );

  const {
    startItemIndex,
    endItemIndex,
    totalPages,
    previousPageHref,
    nextPageHref,
  } = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = data ? Math.min(start + itemsPerPage - 1, data.count || 0) : 0;
    const total = data ? Math.ceil((data?.count || 0) / itemsPerPage) : 0;

    const getHref = (newPage: number) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set("page", newPage.toString());
      return `${pathName}?${newSearchParams}`;
    };

    const previousPageHref = currentPage > 1 ? getHref(currentPage - 1) : null;
    const nextPageHref = currentPage < total ? getHref(currentPage + 1) : null;

    return {
      startItemIndex: start,
      endItemIndex: end,
      totalPages: total,
      previousPageHref,
      nextPageHref,
    };
  }, [currentPage, data, itemsPerPage, pathName, searchParams]);

  return (
    <Pagination className="flex items-baseline">
      <PaginationPrevious href={previousPageHref} />
      {!isLoading && data ? (
        <div className="text-sm dark:text-slate-200">
          {data?.count ? (
            <p>
              Showing {startItemIndex}-{endItemIndex} of {data.count}
            </p>
          ) : (
            "No data found."
          )}
        </div>
      ) : (
        "Loading..."
      )}
      <PaginationNext href={nextPageHref} />
    </Pagination>
  );
}
