import { useQuery } from "@tanstack/react-query";
import { User } from "@supabase/supabase-js";

import { createClient } from "../../supabase/client";

export function useGetBlogQuery(user: User | null, blogId?: number) {
  const supabase = createClient();

  const queryKey = ["blog", undefined, blogId];

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
    enabled: Boolean(user) && Boolean(blogId),
    staleTime: 60 * 1000,
  });
}
