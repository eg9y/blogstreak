"use client";

import { getUser } from "@/utils/getUser";
import { usePostsQuery } from "@/utils/hooks/query/use-posts-query";
import { useSearchParams } from "next/navigation";
import { Pagination, PaginationNext, PaginationPrevious } from "../pagination";

export function PostsPagination() {
  const { currentUser } = getUser();
  const searchParams = useSearchParams();

  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const itemsPerPage = 10; // Assuming this is defined and matches your pagination logic.

  const { data, isLoading } = usePostsQuery(currentUser, searchParams);

  // Calculate the starting and ending indices for the currently displayed items.
  const startItemIndex = (currentPage - 1) * itemsPerPage + 1;
  const endItemIndex = data
    ? Math.min(startItemIndex + itemsPerPage - 1, data.count || 0)
    : 0;

  return (
    <Pagination>
      <PaginationPrevious
        href={
          data?.count && startItemIndex > 1
            ? `?page=${currentPage - 1}`
            : undefined
        }
      />
      {!isLoading && data ? (
        <div>
          {/* Check if data exists and has a count to handle initial null case */}
          {data.count ? (
            <p>
              Showing {startItemIndex}-{endItemIndex} of {data.count}
            </p>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      ) : (
        ""
      )}

      <PaginationNext
        href={
          data?.count && endItemIndex < data.count
            ? `?page=${currentPage + 1}`
            : undefined
        }
      />
    </Pagination>
  );
}
