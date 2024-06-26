"use client";

import { usePathname, useSearchParams } from "next/navigation";

import { useUser } from "@/utils/getUser";
import { useJournalsInfiniteQuery } from "@/utils/hooks/query/journal/use-journals-infinite-query";

import { Button } from "../button";
import { useUsername } from "../subdomain-context";

import { Post } from "./post";

export function Posts() {
  const { loggedInUser } = useUser();
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const isMe = pathName.split("/")[1] === "me";
  const actualUsername = useUsername();

  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useJournalsInfiniteQuery(
      loggedInUser,
      searchParams,
      isMe ? "me" : actualUsername,
    );

  return (
    <div className="flex w-full flex-col gap-4">
      {(isMe || actualUsername) &&
        data?.pages?.map((page) =>
          page.data
            ?.filter((post) => post.post_text)
            .sort(
              (currentPost, nextPost) =>
                new Date(nextPost.post_created_at).getTime() -
                new Date(currentPost.post_created_at).getTime(),
            )
            .map((post) => (
              <Post
                post={post}
                isMine={isMe}
                username={actualUsername}
                key={post.post_id.toString()}
              ></Post>
            )),
        )}

      <div>
        <Button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
          color="dark"
          className="cursor-pointer"
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
