import { useQuery } from "@tanstack/react-query";
import { createClient } from "../supabase/client";
import { User } from "@supabase/supabase-js";

export function usePostsQuery(user: User | null) {
  const supabase = createClient();

  const queryKey = ["posts", user?.id];

  const queryFn = async () => {
    return supabase
      .from("posts")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", {
        ascending: false,
      })
      .throwOnError();
  };

  return useQuery({ queryKey, queryFn, enabled: !!user, staleTime: 60 * 1000 });
}
