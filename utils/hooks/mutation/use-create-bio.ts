import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createClient } from "../../supabase/client";

export function useCreateBio() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  async function mutationFn({
    userId,
    content,
  }: {
    content: string;
    userId: string;
  }) {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      console.error(error);
      return;
    }

    await supabase
      .from("profiles")
      .update({
        bio: content,
      })
      .eq("user_id", userId)
      .select()
      .single();
  }

  return useMutation({
    mutationFn,
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ["bio"],
      });
    },
  });
}
