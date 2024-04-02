import { useQuery } from "@tanstack/react-query";

import { createClient } from "../../supabase/client";

export function useGetBioQuery(userName?: string) {
  const supabase = createClient();

  const queryKey = ["bio", userName];

  const queryFn = async () => {
    return supabase
      .from("profiles")
      .select("bio")
      .eq("name", userName!)
      .single()
      .throwOnError();
  };

  return useQuery({
    queryKey,
    queryFn,
    enabled: !!userName,
    staleTime: 60 * 1000,
  });
}
