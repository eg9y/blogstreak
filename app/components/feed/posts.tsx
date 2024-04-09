"use client";

import { Post } from "./post";
import { getUser } from "@/utils/getUser";
import { usePostsInfiniteQuery } from "@/utils/hooks/query/use-posts-infinite-query";
import { usePathname, useSearchParams } from "next/navigation";
import { Button } from "../button";

export function Posts() {
  const { currentUser } = getUser();
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const username = pathName.split("/")[1];

  const {
    data,
    isLoading,
    isFetching,
    isPending,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = usePostsInfiniteQuery(currentUser, searchParams, username);

  return (
    <div className="flex w-full flex-col gap-4">
      {data?.pages?.map((page) =>
        page.data
          ?.filter((post) => post.post_text)
          .sort(
            (a, b) =>
              new Date(b.post_created_at).getTime() -
              new Date(a.post_created_at).getTime(),
          )
          .map((post) => (
            <Post
              post={post}
              isMine={username === "me"}
              username={username}
              key={post.post_id.toString()}
            ></Post>
          )),
      )}

      <div>
        <Button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage
            ? "Loading more..."
            : hasNextPage
              ? "Load More"
              : "Nothing more to load"}
        </Button>
      </div>
    </div>
  );
}
