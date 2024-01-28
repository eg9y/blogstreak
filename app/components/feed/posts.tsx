"use client";

import { usePostsQuery } from "@/utils/hooks/use-posts-query";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { Post } from "./post";

export function Posts() {
  const supabase = createClient();
  const [currentUser, setCurrentUser] = useState(null as null | User);

  useEffect(() => {
    async function fetchUser() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        console.log("error", error);
        return;
      }
      setCurrentUser(user);
    }
    fetchUser();
  }, []);

  const { data, isLoading } = usePostsQuery(currentUser);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        <p>Loading Posts...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col gap-2">
        <p>No Posts</p>
      </div>
    );
  }

  const { data: posts, error } = data;

  return (
    <div className="flex flex-col gap-2">
      {posts
        ?.filter((post) => post.text)
        .map((post) => <Post text={post.text!}></Post>)}
    </div>
  );
}
