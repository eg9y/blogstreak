import { useQuery } from "@tanstack/react-query";
import { User } from "@supabase/supabase-js";

import { createClient } from "../../supabase/client";

export function useGetUsernameQuery(user: User | null) {
  const supabase = createClient();

  const queryKey = ["username", user?.id];

  const queryFn = async () => {
    if (!user) {
      return null;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    return profile?.name;
  };

  return useQuery({
    queryKey,
    queryFn,
    enabled: Boolean(user),
    staleTime: 60 * 1000,
  });
}
