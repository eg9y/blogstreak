import { useQuery } from "@tanstack/react-query";

import { BLOGS_QUERY_KEY } from "@/constants/query-keys";

import { User } from "@supabase/supabase-js";
import { createClient } from "../../supabase/client";

export function useGetBlogQuery(blogTitle?: number, loggedInUser?: User) {
  const supabase = createClient();

  const queryKey = [BLOGS_QUERY_KEY, loggedInUser?.id, blogTitle];

  const queryFn = async () => {
    const res = await supabase
      .from("blogs")
      .select("*")
      .eq("title", blogTitle!)
      .single()
      .throwOnError();

    return res;
  };

  return useQuery({
    queryKey,
    queryFn,
    enabled: Boolean(blogTitle),
    staleTime: 60 * 60 * 1000,
  });
}
