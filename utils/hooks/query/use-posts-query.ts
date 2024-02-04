import { useQuery } from "@tanstack/react-query";
import { User } from "@supabase/supabase-js";

import { createClient } from "../../supabase/client";

export function usePostsQuery(user: User | null) {
  const supabase = createClient();

  const queryKey = ["posts", user?.id];

  const queryFn = async() => {
    return await supabase
      .from("posts")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", {
        ascending: false,
      })
      .throwOnError();
  };

  return useQuery({
    queryKey,
    queryFn,
    enabled: Boolean(user),
    staleTime: 60 * 1000,
  });
}
