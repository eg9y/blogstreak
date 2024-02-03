import { useQuery } from "@tanstack/react-query";
import { User } from "@supabase/supabase-js";

import { createClient } from "../supabase/client";

export function useGetPostQuery(user: User | null, postId?: number) {
  const supabase = createClient();

  const queryKey = ["post", user?.id, postId];

  const queryFn = async () => {
    return supabase
      .from("posts")
      .select("*")
      .eq("user_id", user!.id)
      .eq("id", postId!)
      .single()
      .throwOnError();
  };

  return useQuery({
    queryKey,
    queryFn,
    enabled: !!user && !!postId,
    staleTime: 60 * 1000,
  });
}
