import { useQuery } from "@tanstack/react-query";

import { createClient } from "../../supabase/client";
import { User } from "@supabase/supabase-js";

export function useGetUsernameQuery(user: User | null) {
  const supabase = createClient();

  const queryKey = ["post", user?.id];

  const queryFn = async () => {
    if (user) {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      return profile?.name;
    }
  };

  return useQuery({
    queryKey,
    queryFn,
    enabled: !!user,
    staleTime: 60 * 1000,
  });
}
