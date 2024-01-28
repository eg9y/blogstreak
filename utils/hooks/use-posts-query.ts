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
      .throwOnError();
  };

  return useQuery({ queryKey, queryFn, enabled: !!user });
}
