"use client";

import { usePostsQuery } from "@/utils/hooks/use-posts-query";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { Post } from "./post";
import { getUser } from "@/utils/getUser";

export function Posts() {
  const { currentUser } = getUser();

  const { data, isLoading, isFetching, isPending } = usePostsQuery(currentUser);

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

  const { data: posts, error } = data;

  return (
    <div className="flex flex-col gap-2">
      {posts
        ?.filter((post) => post.text)
        .map((post) => <Post post={post} key={post.id}></Post>)}
    </div>
  );
}
