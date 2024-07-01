import { useQuery } from "@tanstack/react-query";

import { BLOGS_QUERY_KEY } from "@/constants/query-keys";

import { createClient } from "../../supabase/client";
import { User } from "@supabase/supabase-js";

export function useGetBlogQuery(blogId?: number, loggedInUser?: User) {
  const supabase = createClient();

  const queryKey = [BLOGS_QUERY_KEY, loggedInUser?.id, blogId];

  const queryFn = async () => {
    const res = await supabase
      .from("blogs")
      .select("*")
      .eq("id", blogId!)
      .single()
      .throwOnError();

    return res;
  };

  return useQuery({
    queryKey,
    queryFn,
    enabled: Boolean(blogId),
    staleTime: 60 * 60 * 1000,
  });
}
