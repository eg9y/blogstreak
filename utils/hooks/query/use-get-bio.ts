import { useQuery } from "@tanstack/react-query";

import { createClient } from "../../supabase/client";

export function useGetBioQuery(userName?: string | null) {
  const supabase = createClient();

  const queryKey = ["bio", userName];

  const queryFn = async () => {
    const response = await supabase
      .from("profiles")
      .select("bio")
      .eq("name", userName!)
      .single()
      .throwOnError();
    return response;
  };

  return useQuery({
    queryKey,
    queryFn,
    enabled: Boolean(userName),
    staleTime: 60 * 1000,
  });
}
