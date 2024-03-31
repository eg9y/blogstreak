"use client";

import { usePostsQuery } from "@/utils/hooks/query/use-posts-query";
import { Post } from "./post";
import { getUser } from "@/utils/getUser";
import { usePathname, useSearchParams } from "next/navigation";

export function Posts() {
  const { currentUser } = getUser();

  const searchParams = useSearchParams();
  const pathName = usePathname();
  const username = pathName.split("/")[1];

  const { data, isLoading, isFetching, isPending } = usePostsQuery(
    currentUser,
    searchParams,
    username,
  );

  if (isLoading || isFetching || isPending) {
    return (
      <div className="flex flex-col gap-2">
        <p className="dark:text-slate-100">Loading Posts...</p>
      </div>
    );
  } else if (!data) {
    return (
      <div className="flex flex-col gap-2">
        <p className="dark:text-slate-100">No Posts</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {data.data
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
        ))}
    </div>
  );
}
