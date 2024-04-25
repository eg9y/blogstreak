import { useQuery } from "@tanstack/react-query";
import { User } from "@supabase/supabase-js";

import { createClient } from "../../supabase/client";

export function useGetPostQuery(user: User | null, journalId?: number) {
  const supabase = createClient();

  const queryKey = ["journal", journalId];

  const queryFn = async () => {
    const res = await supabase
      .from("posts")
      .select("*")
      .eq("id", journalId!)
      .single()
      .throwOnError();
    return res;
  };

  return useQuery({
    queryKey,
    queryFn,
    enabled: Boolean(journalId),
    staleTime: 60 * 1000,
  });
}
