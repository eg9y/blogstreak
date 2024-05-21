import { useQuery } from "@tanstack/react-query";
import { User } from "@supabase/supabase-js";

import { createClient } from "../../supabase/client";

export function useGetPostQuery(user: User | null, journalId?: number) {
  const supabase = createClient();

  const queryKey = ["journal", journalId];

  const queryFn = async () => {
    if (!journalId) {
      return null;
    }
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
    staleTime: 60 * 60 * 1000,
  });
}
