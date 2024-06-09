import { useQuery } from "@tanstack/react-query";
import { User } from "@supabase/supabase-js";

import { JOURNALS_QUERY_KEY } from "@/constants/query-keys";

import { createClient } from "../../../supabase/client";

export function useGetJournalQuery(user: User | null, journalId?: number) {
  const supabase = createClient();

  const queryKey = [
    JOURNALS_QUERY_KEY,
    {
      id: journalId,
    },
  ];

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
