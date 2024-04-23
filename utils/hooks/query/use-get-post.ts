import { useQuery } from "@tanstack/react-query";
import { User } from "@supabase/supabase-js";

import { createClient } from "../../supabase/client";

export function useGetPostQuery(user: User | null, postId?: number) {
  const supabase = createClient();

  const queryKey = ["post", undefined, postId];

  const queryFn = async () => {
    const res = await supabase
      .from("posts")
      .select("*")
      // .eq("user_id", user!.id)
      .eq("id", postId!)
      .single()
      .throwOnError();
    return res;
  };

  return useQuery({
    queryKey,
    queryFn,
    enabled: Boolean(user) && Boolean(postId),
    staleTime: 60 * 1000,
  });
}
