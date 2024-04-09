import { useQuery } from "@tanstack/react-query";
import { User } from "@supabase/supabase-js";

import { createClient } from "../../supabase/client";

export function useGetBlogQuery(user: User | null, blogId?: number) {
  const supabase = createClient();

  const queryKey = ["blog", undefined, blogId];

  const queryFn = async () => {
    return supabase
      .from("blogs")
      .select("*")
      .eq("id", blogId!)
      .single()
      .throwOnError();
  };

  return useQuery({
    queryKey,
    queryFn,
    enabled: !!user && !!blogId,
    staleTime: 60 * 1000,
  });
}
