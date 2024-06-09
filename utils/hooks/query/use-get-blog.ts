import { useQuery } from "@tanstack/react-query";

import { BLOGS_QUERY_KEY } from "@/constants/query-keys";

import { createClient } from "../../supabase/client";

export function useGetBlogQuery(blogId?: number) {
  const supabase = createClient();

  const queryKey = [BLOGS_QUERY_KEY, blogId];

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
